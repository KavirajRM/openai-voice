import React, { useState, useRef } from "react";
import { CopyBlock, dracula } from "react-code-blocks";
import Lady from "../../assets/Lady.gif";
import WebRTCComponent from "../WebRCTC/WebRCTC";
import Send from "../../assets/Send.png";
import AnimatedText from "../../components/AnimatedText";

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [userMessageToSend, setUserMessageToSend] = useState(null);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [topics, setTopics] = useState([
    {
      title: "PYTHON",
      subtopics: ["Datatypes", "Class", "Functions"],
    },
  ]);

  const webRTCRef = useRef(null);

  const sendMessage = () => {
    if (input.trim() !== "") {
      setMessages([...messages, { text: input, sender: "user" }]);
      setUserMessageToSend(input.trim());
      setInput("");
    }
  };

  const handleReceivedMessage = (message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: message, sender: "ai" },
    ]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const handleConnectionChange = (connected) => {
    setIsConnected(connected);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/8 p-6 text-white flex flex-col space-y-6 shadow-2xl rounded-r-3xl">
        <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-4">
          {topics.map((topic, index) => (
            <div key={index} className="mb-4">
              <h2 className="text-sm font-semibold flex text-gray-dark">
                {topic.title}
              </h2>
              <div className="mt-1 space-y-1">
                {topic.subtopics.map((subtopic, subIndex) => (
                  <div
                    key={subIndex}
                    className="cursor-pointer flex text-gray-800 text-sm"
                    onClick={() => setInput(subtopic)}
                  >
                    {subtopic}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="h-1/3 flex items-center justify-center">
          <img src={Lady} className="w-48 h-48 rounded-full" alt="Character" />
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col bg-white shadow-md w-7/8">
        <div className="bg-gray-white text-gray-dark shadow-md p-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold">Chat Window</h3>
          <span
            className={`text-sm ${
              isConnected ? "text-green-500" : "text-red-500"
            }`}
          >
            {isConnected ? "Connected" : "Not Connected"}
          </span>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl text-gray-dark break-words ${
                msg.sender === "user"
                  ? "text-right self-end ml-auto"
                  : "text-left text-gray-900"
              }`}
            >
              {msg.text.startsWith("```") ? (
                <div className="w-full overflow-x-auto">
                  <CopyBlock
                    text={msg.text.replace(/```/g, "")}
                    language="javascript"
                    showLineNumbers={true}
                    theme={dracula}
                    wrapLongLines={true}
                  />
                </div>
              ) : msg.sender === "ai" ? (
                <AnimatedText text={msg.text} />
              ) : (
                msg.text
              )}
            </div>
          ))}
        </div>

        <div className="p-4 bg-gray-200 shadow-inner flex items-center">
          <input
            type="text"
            placeholder="Type a message... (Use ``` for code)"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <div className="flex items-center space-x-2">
            {input.length > 0 && (
              <button onClick={sendMessage}>
                <img src={Send} className="w-8 h-8" alt="Send" />
              </button>
            )}
            <WebRTCComponent
              ref={webRTCRef}
              onMessageReceive={handleReceivedMessage}
              messageToSend={userMessageToSend}
              onConnectionChange={handleConnectionChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
