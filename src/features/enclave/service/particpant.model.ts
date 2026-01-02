class EnclaveParticipant {
  userId: string;
  rtc: RTCPeerConnection;
  dataChannel: RTCDataChannel | null = null;
  constructor({ userId }: { userId: string }) {
    this.userId = userId;
    this.rtc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        // { urls: "stun:stun.cloudflare.com:3478" },
        // { urls: "turn:turn.cloudflare.com:3478" },
        // Add TURN servers if needed for production
      ],
    });
  }
}
export { EnclaveParticipant };
