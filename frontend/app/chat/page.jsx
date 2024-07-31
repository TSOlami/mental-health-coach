"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../page.module.css";
import { LeopardWorker } from "@picovoice/leopard-web";
import { FaMicrophone, FaStop, FaPlay } from "react-icons/fa";

export default function Chatbot({ personality }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioURL, setAudioURL] = useState("");
  const [leopard, setLeopard] = useState(null);


  useEffect(() => {
    const initLeopard = async () => {
      const leopardInstance = await LeopardWorker.create(
        process.env.NEXT_PUBLIC_LEOPARD_ACCESS_KEY,
        {
          publicPath: "/Budgie-leopard-v2.0.0-24-07-31--12-16-02.pv"
        }
      );
      setLeopard(leopardInstance);
    };

    // Initialize Leopard voice assistant
    initLeopard();

    // Retrieve message history from local storage
    const storedMessages = localStorage.getItem('messageHistory');

    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }

    // Cleanup on unmount
    return () => {
      if (leopard) {
        leopard.release();
      }
    };
  }, []);

  const handleMessage = async () => {
    if (input.trim() == "") return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    localStorage.setItem('messageHistory', JSON.stringify(updatedMessages));
    setInput("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/chat/message/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message_history: updatedMessages, message: input }),
      });

      if (response.ok) {
        const data = await response.json();

        // Add AI response to the message history
        setMessages([...updatedMessages, { role: "assistant", content: data.response }]);
        localStorage.setItem('messageHistory', JSON.stringify([...updatedMessages, { role: "assistant", content: data.response }]));
        setInput(""); // Clear input field
      } else {
        console.error("Failed to get response");
      }
    } catch (error) {
      console.error("Error Sending Message", error);
    }
  };

  const handleClearChat = () => {
    // Retrieve and preserve the initial system message
    const systemMessage = [messages[0], messages[1]];


    // Clear all messages except the initial system messages
    setMessages(systemMessage);
    localStorage.setItem('messageHistory', JSON.stringify(systemMessage));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.start();
      setMediaRecorder(mediaRecorder);

      setIsRecording(true);
      console.log("Recording started.");
    } catch (error) {
      console.error("Error recording audio:", error);
    };
  };
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
    setIsRecording(false);
    console.log("Recording stopped.");
  };

  const handleDataAvailable = async (event) => {
    const audioBlob = event.data;
    const audioArrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await new AudioContext().decodeAudioData(audioArrayBuffer);
    const audioData = new Int16Array(audioBuffer.getChannelData(0).length);
  
    // Convert audio buffer to Int16Array
    for (let i = 0; i < audioBuffer.getChannelData(0).length; i++) {
      audioData[i] = audioBuffer.getChannelData(0)[i] * 32767;
    }
  
    if (leopard) {
      try {
        const { transcript, words } = await leopard.process(audioData);
        console.log("Leopard recognized text:", transcript);
        console.log("Words: ");
        setInput(transcript);
        handleMessage();
      } catch (error) {
        console.error("Error processing audio with Leopard:", error);
      }
    }
  };
  console.log("Input:", input.trim());
  console.log("Is Recording:", isRecording);

  
  return (
    <div className={styles.chatbox}>
      <div className={styles.messages}>

        {messages.slice(2).map((msg, index) => (
            console.log(msg),
          <div
            key={index}
            className={`${styles.message} ${
              msg.role == "assistant" ? styles.bot : styles.user
            }`}
          >
            {msg.content}
          </div>
        ))}

      </div>

      <div className={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleMessage()}
          className={styles.input}
          placeholder="Type your message..."
          disabled={isRecording}
        />

        {input.trim() === "" ? (
            <>
              {isRecording ? (
                <div className={styles.clearButton}>
                  <FaStop size={24} onClick={stopRecording} />
                </div>
              ) : (
                <div className={styles.btn}>
                  <FaMicrophone size={24} onClick={startRecording} />
                </div>
              )}
            </>
          ) : (
            <button onClick={handleMessage} className={styles.sendButton}>
              Send
            </button>
          )}

        <button onClick={handleClearChat} className={styles.clearButton}>
            Clear Chat
        </button>
      </div>
    </div>
  );
}
