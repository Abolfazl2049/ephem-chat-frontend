import { io } from "socket.io-client";
import { EnclaveParticipant } from "./particpant.model";
import { API_BASE_URL } from "@/features/shared";

class EnclaveRtcConnectionHandler {
  socket: ReturnType<typeof io>;
  participants: EnclaveParticipant[] = [];
  enclaveId: string;
  userId: string;

  constructor({ enclaveId, userId }: { enclaveId: string; userId: string }) {
    this.enclaveId = enclaveId;
    this.userId = userId;
    this.socket = io(`${API_BASE_URL}/signaling`, {
      auth: {
        userId,
        enclaveId,
      },
    });

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
      console.log("received", ev, "data:", data);
    });
    this.socket.onAnyOutgoing((ev, data) => {
      console.log("sending", ev, "data", data);
    });
  }

  initParticipantRtc = (userId: string) => {
    // initialize peer connection
    this.participants.push(new EnclaveParticipant({ userId }));
    const participant = this.participants.at(-1) as EnclaveParticipant;
    // Create data channel before negotiation
    participant.dataChannel = participant.rtc.createDataChannel("chat");
    participant.dataChannel.onopen = () => console.log(`Data channel open for ${userId}`);
    participant.dataChannel.onmessage = (event) => console.log(`Message from ${userId}:`, event.data);
    participant.dataChannel.onclose = () => console.log(`Data channel closed for ${userId}`);
    console.log("registering ices", participant);
    participant.rtc.onicecandidate = (e) => {
      console.log(`ICE candidate for ${userId}:`, e.candidate);
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
    participant.rtc.onicegatheringstatechange = () => {
      console.log(`ICE gathering state for ${userId}: ${participant.rtc.iceGatheringState}`);
    };
    // Listen for connection state changes
    participant.rtc.oniceconnectionstatechange = () => {
      console.log(`ICE connection state for ${userId}: ${participant.rtc.iceConnectionState}`);
      if (participant.rtc.iceConnectionState === "connected" || participant.rtc.iceConnectionState === "completed") {
        // Connection established
        console.log(`RTC connection established for ${userId}`);
      }
    };
    // Also handle incoming data channels (if the other peer creates one)
    participant.rtc.ondatachannel = (event) => {
      participant.dataChannel = event.channel;
      // Set up listeners as above
      participant.dataChannel.onopen = () => console.log(`Incoming data channel open for ${userId}`);
      participant.dataChannel.onmessage = (event) => {
        console.log(`Incoming message from ${userId}:`, event.data);
      };
      participant.dataChannel.onclose = () => {
        console.log(`Incoming data channel closed for ${userId}`);
      };
    };

    participant.rtc.onconnectionstatechange = (ev) => {
      console.log(ev);
    };
    participant.rtc.oniceconnectionstatechange = (ev) => {
      console.log(ev);
    };
    // participant.rtc.ontrack = (e) => (participant.stream = new MediaStream(e.streams[0]));
    // localStream.value.getTracks().forEach((track: any) => participant.pc?.addTrack(track, localStream.value));
  };

  async onJoin(data: any) {
    // sent an offer to the joined-user

    this.initParticipantRtc(data.userId);
    const participant = this.findParticipantByUserId(data.userId);
    const offer = await participant?.rtc?.createOffer();
    this.socket?.emit("offer", { sdp: offer?.sdp, targetUserId: data.userId });
    await participant?.rtc?.setLocalDescription(offer);
  }

  async onOffer(data: any) {
    // initialize a peer connection with the target user that sent offer

    this.initParticipantRtc(data.userId);
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
    console.log(participant?.rtc);
  }

  async onCandidate(data: any) {
    // add candidate to the target peer connection

    const participant = this.findParticipantByUserId(data.userId);
    await participant?.rtc?.addIceCandidate(data.candidate);
  }

  onLeft(data: any) {
    // close peer connection with the target-user and remove it from participants

    const participant = this.findParticipantByUserId(data.target);
    const participantIndx = this.findParticipantIndxByUserId(data.target);
    if (participant) {
      participant.rtc?.close();
      this.participants.splice(participantIndx, 1);
    }
  }

  findParticipantByUserId(id: EnclaveParticipant["userId"]) {
    return this.participants.find((el) => el.userId === id);
  }

  findParticipantIndxByUserId(id: EnclaveParticipant["userId"]) {
    return this.participants.findIndex((el) => el.userId === id);
  }
}
export { EnclaveRtcConnectionHandler };
