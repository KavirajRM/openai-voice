import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import Speech from "../../assets/Speech.png";

const WebRTCComponent = forwardRef(
  ({ onMessageReceive, messageToSend, onConnectionChange }, ref) => {
    const [status, setStatus] = useState("Not Connected");
    const audioRef = useRef(null);
    const pc = useRef(null);
    const dataChannel = useRef(null);
    const mediaRecorder = useRef(null);

    useImperativeHandle(ref, () => ({
      sendMessage: (message) => {
        if (dataChannel.current?.readyState === "open") {
          const formattedMessage = JSON.stringify({
            type: "conversation.item.create",
            item: {
              type: "message",
              role: "user",
              content: [
                {
                  type: "input_text",
                  text: message,
                },
              ],
            },
          });
          dataChannel.current.send(formattedMessage);
          return true;
        }
        return false;
      },
    }));

    useEffect(() => {
      if (messageToSend && dataChannel.current?.readyState === "open") {
        const message = JSON.stringify({
          type: "conversation.item.create",
          item: {
            type: "message",
            role: "user",
            content: [
              {
                type: "input_text",
                text: messageToSend,
              },
            ],
          },
        });

        try {
          dataChannel.current.send(message);
          console.log("Sent message:", messageToSend);
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }
    }, [messageToSend]);

    const startCall = async () => {
      if (dataChannel.current?.readyState === "open") {
        console.log("Connection already established");
        return;
      }

      setStatus("Connecting...");
      onConnectionChange(false);

      try {
        const EPHEMERAL_KEY = "ek_67af0389db248190abd31e33623e89e6";

        pc.current = new RTCPeerConnection();

        pc.current.ontrack = (event) => {
          if (audioRef.current) {
            audioRef.current.srcObject = event.streams[0];
          }
        };

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        pc.current.addTrack(stream.getTracks()[0]);

        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            console.log("Audio Data Available");
          }
        };
        mediaRecorder.current.start(1000);

        dataChannel.current = pc.current.createDataChannel("oai-events");

        dataChannel.current.addEventListener("open", () => {
          console.log("Data channel open!");
          setStatus("Connected!");
          onConnectionChange(true);

          const initMessage = JSON.stringify({
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

          dataChannel.current.send(initMessage);
        });

        dataChannel.current.addEventListener("close", () => {
          console.log("Data channel closed");
          setStatus("Disconnected");
          onConnectionChange(false);
        });

        dataChannel.current.addEventListener("message", (e) => {
          try {
            console.log("Received data:", e.data);
            const data = JSON.parse(e.data);
            if (
              data.type === "response.output_item.done" &&
              data.item?.content
            ) {
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
      } catch (error) {
        console.error("Error initializing WebRTC:", error);
        setStatus("Connection Failed");
        onConnectionChange(false);
      }
    };

    return (
      <div style={{ textAlign: "center" }}>
        <button
          onClick={startCall}
          className={status === "Connected!" ? "opacity-50" : ""}
          disabled={status === "Connected!"}
        >
          <img src={Speech} className="w-8 h-8" alt="Start Call" />
        </button>
        <audio ref={audioRef} autoPlay></audio>
      </div>
    );
  }
);

export default WebRTCComponent;
