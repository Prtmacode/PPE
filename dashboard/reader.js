// reader.js
class MediaMTXWebRTCReader {
  constructor(config) {
    this.url = config.url;
    this.onTrack = config.onTrack;
    this.onError = config.onError;
    this.pc = null;
    this.init();
  }

  async init() {
    try {
      this.pc = new RTCPeerConnection();
      this.pc.addTransceiver("video", { direction: "recvonly" });

      this.pc.ontrack = (event) => {
        this.onTrack(event);
      };

      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);

      const res = await fetch(this.url, {
        method: "POST",
        headers: { "Content-Type": "application/sdp" },
        body: offer.sdp,
      });

      const answerSDP = await res.text();
      await this.pc.setRemoteDescription({ type: "answer", sdp: answerSDP });
    } catch (err) {
      if (this.onError) this.onError(err);
    }
  }
}
