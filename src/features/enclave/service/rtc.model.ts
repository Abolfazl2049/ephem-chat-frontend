import { io } from "socket.io-client";
import { EnclaveParticipant } from "./particpant.model";
import { API_BASE_URL } from "@/features/shared";
import { Dispatch, Enclave, EnclaveLog } from "./model";

class EnclaveRtcConnectionHandler {
  socket: ReturnType<typeof io>;
  participants: EnclaveParticipant[] = [];
  enclaveId: string;
  userId: string;
  addLog: (log: EnclaveLog) => void;
  myUserId: string;
  onDispatchReceive: (dispatch: Dispatch) => void;
  constructor({
    enclaveId,
    userId,
    addLog,
    myUserId,
    onDispatchReceive,
  }: {
    enclaveId: string;
    userId: string;
    addLog: (log: EnclaveLog) => void;
    myUserId: string;
    onDispatchReceive: (dispatch: Dispatch) => void;
  }) {
    this.enclaveId = enclaveId;
    this.userId = userId;
    this.myUserId = myUserId;
    this.onDispatchReceive = onDispatchReceive;
    this.socket = io(`${API_BASE_URL}/signaling`, {
      auth: {
        userId,
        enclaveId,
      },
    });

    this.addLog = addLog;

    this.socket.on("connect", () => {
      // console.log("Socket connected");
    });
    this.socket.on("setup", () => {
      this.socket.emit("join", {});
    });
    this.socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });
    this.socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
    this.socket.on("join", (data) => this.onJoin(data));
    this.socket.on("offer", (data) => this.onOffer(data));
    this.socket.on("answer", (data) => this.onAnswer(data));
    this.socket.on("candidate", (data) => this.onCandidate(data));
    this.socket.on("left", (data) => this.onLeft(data));
    this.socket.onAny((ev, data) => {
      console.info("received", ev, "data:", data);
    });
    this.socket.onAnyOutgoing((ev, data) => {
      console.info("sending", ev, "data", data);
    });
  }

  initParticipantDataChannel(participant: EnclaveParticipant) {
    if (!participant.dataChannel) {
      console.warn("no data channel to init");
      return;
    }
    participant.dataChannel.onopen = () => console.log(`Data channel open for ${participant.userId}`);
    participant.dataChannel.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      if (parsed.type === "dispatch") this.onDispatchReceive(parsed.data);
    };
    participant.dataChannel.onclose = () => console.log(`Data channel closed for ${participant.userId}`);
  }

  initParticipant = ({ userId, userName }: { userId: string; userName?: string }) => {
    // initialize peer connection
    this.participants.push(new EnclaveParticipant({ userId }));
    const participant = this.participants.at(-1) as EnclaveParticipant;
    // Create data channel before negotiation
    participant.dataChannel = participant.rtc.createDataChannel("chat");
    this.initParticipantDataChannel(participant);

    participant.rtc.onicecandidate = (e) => {
      if (e.candidate)
        this.socket?.emit("candidate", {
          candidate: {
            candidate: e.candidate.candidate,
            sdpMid: e.candidate.sdpMid,
            sdpMLineIndex: e.candidate.sdpMLineIndex,
          },
          targetUserId: userId,
        });
    };
    // Listen for connection state changes
    participant.rtc.oniceconnectionstatechange = () => {
      if (participant.rtc.iceConnectionState === "connected" || participant.rtc.iceConnectionState === "completed") {
        // Connection established
        this.addLogToEnclave(`${userName} has connected to enclave`);
      }
    };
    // Also handle incoming data channels (if the other peer creates one)
    participant.rtc.ondatachannel = (event) => {
      participant.dataChannel = event.channel;
      // Set up listeners as above
      this.initParticipantDataChannel(participant);
    };
    // participant.rtc.ontrack = (e) => (participant.stream = new MediaStream(e.streams[0]));
    // localStream.value.getTracks().forEach((track: any) => participant.pc?.addTrack(track, localStream.value));
  };

  async onJoin(data: any) {
    if (data.userId === this.userId) {
      console.warn("received self join emit");
      return;
    }

    const duplicateParticipant = this.findParticipantByUserId(data.userId);
    if (duplicateParticipant) {
      console.warn("duplicate participant join received");
      return;
    }
    // sent an offer to the joined-user
    this.addLogToEnclave(`${data.userName} is connecting to enclave`);

    this.initParticipant({ userId: data.userId, userName: data.userName });
    const participant = this.findParticipantByUserId(data.userId);
    const offer = await participant?.rtc?.createOffer();
    this.socket?.emit("offer", { sdp: offer?.sdp, targetUserId: data.userId });
    await participant?.rtc?.setLocalDescription(offer);
  }

  async onOffer(data: any) {
    // initialize a peer connection with the target user that sent offer
    const duplicateParticipant = this.findParticipantByUserId(data.userId);
    if (duplicateParticipant) {
      console.warn("duplicate participant offer received");
      return;
    }
    this.initParticipant({ userId: data.userId, userName: data.userName });
    const participant = this.findParticipantByUserId(data.userId);
    await participant?.rtc?.setRemoteDescription({ type: "offer", sdp: data.sdp });
    const answer = await participant?.rtc?.createAnswer();
    this.socket?.emit("answer", { sdp: answer?.sdp, targetUserId: data.userId });
    await participant?.rtc?.setLocalDescription(answer);
  }

  async onAnswer(data: any) {
    // set answer as remote description to the target peerConnection
    const participant = this.findParticipantByUserId(data.userId);
    await participant?.rtc?.setRemoteDescription({ type: "answer", sdp: data.sdp });
  }

  async onCandidate(data: any) {
    // add candidate to the target peer connection

    const participant = this.findParticipantByUserId(data.userId);
    await participant?.rtc?.addIceCandidate(data.candidate);
  }

  onLeft(data: any) {
    // close peer connection with the target-user and remove it from participants
    this.addLogToEnclave(`${data.userName} has disconnected from enclave`);
    console.log("before remove", this.participants);

    const participant = this.findParticipantByUserId(data.userId);
    const participantIndx = this.findParticipantIndxByUserId(data.userId);
    if (participant) {
      participant.rtc?.close();
      participant.dataChannel?.close();
      this.participants.splice(participantIndx, 1);
      console.log("after remove", this.participants);
    }
  }

  findParticipantByUserId(id: EnclaveParticipant["userId"]) {
    return this.participants.find((el) => el.userId === id);
  }

  findParticipantIndxByUserId(id: EnclaveParticipant["userId"]) {
    return this.participants.findIndex((el) => el.userId === id);
  }

  addLogToEnclave(description: string) {
    this.addLog(new EnclaveLog({ description, createdAt: new Date().toISOString() }));
  }

  sendDispatch(dispatch: Dispatch) {
    for (const participant of this.participants) {
      participant.dataChannel?.send(JSON.stringify({ type: "dispatch", data: dispatch }));
    }
  }

  clear() {
    // Close all RTC peer connections
    for (const participant of this.participants) {
      participant.rtc?.close();
      participant.dataChannel?.close();
    }
    // Clear participants array
    this.participants = [];
    // Disconnect socket
    this.socket?.disconnect();
  }
}
export { EnclaveRtcConnectionHandler };
