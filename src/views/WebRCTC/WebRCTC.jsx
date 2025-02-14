import React, { useState, useRef, useEffect } from "react";
import Speech from "../../assets/Speech.png";

const WebRTCComponent = ({ onMessageReceive, messageToSend }) => {
  const [status, setStatus] = useState("Not Connected");
  const audioRef = useRef(null);
  let pc = useRef(null);
  let dataChannel = useRef(null);
  let mediaRecorder = useRef(null);

  useEffect(() => {
    console.log(messageToSend);
  }, [messageToSend]);

  const startCall = async () => {
    setStatus("Connecting...");

    try {
      const EPHEMERAL_KEY = "ek_67aedce234808190b4f9b5800cc5446c";

      pc.current = new RTCPeerConnection();

      pc.current.ontrack = (event) => {
        if (audioRef.current) {
          audioRef.current.srcObject = event.streams[0];
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      pc.current.addTrack(stream.getTracks()[0]);

      // 🎤 Start Recording Audio Data
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log("Audio Data Sent to Backend:", event.data);
        }
      };
      mediaRecorder.current.start(1000); // Capture audio every second

      dataChannel.current = pc.current.createDataChannel("oai-events");

      dataChannel.current.addEventListener("open", () => {
        console.log("Data channel open!");
        const message = JSON.stringify({
          type: "conversation.item.create",
          item: {
            type: "message",
            role: "user",
            content: [
              {
                type: "input_text",
                text: "Talk to the user in English only unless he starts talking in his language...",
              },
            ],
          },
        });

        dataChannel.current.send(message);
        console.log("Sent JSON message:", message);
      });

      dataChannel.current.addEventListener("message", (e) => {
        try {
          console.log(e.data);
          const data = JSON.parse(e.data);
          if (data.type === "response.output_item.done" && data.item?.content) {
            const transcriptObj = data.item.content.find(
              (c) => c.type === "audio"
            );
            if (transcriptObj && transcriptObj.transcript) {
              onMessageReceive(transcriptObj.transcript);
            }
          }
        } catch (error) {
          console.error("Error parsing received message:", error);
        }
      });

      const offer = await pc.current.createOffer();
      await pc.current.setLocalDescription(offer);

      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-realtime-preview-2024-12-17";
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp",
        },
      });

      const answer = { type: "answer", sdp: await sdpResponse.text() };
      await pc.current.setRemoteDescription(answer);

      setStatus("Connected!");
    } catch (error) {
      console.error("Error initializing WebRTC:", error);
      setStatus("Connection Failed");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <button onClick={startCall}>
        <img src={Speech} className="w-8 h-8" alt="Start Call" />
      </button>
      <audio ref={audioRef} autoPlay></audio>
    </div>
  );
};

export default WebRTCComponent;
