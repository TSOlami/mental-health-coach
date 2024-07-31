"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../page.module.css";
// import { LeopardWorker } from "@picovoice/leopard-web";
import { useCheetah } from "@picovoice/cheetah-react";
import { FaMicrophone, FaStop, FaPlay } from "react-icons/fa";

export default function Chatbot({ personality }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");

  const AccessKey = process.env.NEXT_PUBLIC_CHEETAH_ACCESS_KEY;
  const ModelFilePath = "/models/cheetah_params.pv";

  const {
    result,
    isLoaded,
    isListening,
    error,
    init,
    start,
    stop,
    release,
  } = useCheetah();

  useEffect(() => {
    // Initialize Cheetah with the access key and model path
    const initializeCheetah = async () => {
      try {
        await init(AccessKey, { publicPath: ModelFilePath });
        console.log("Cheetah initialized.");
      } catch (error) {
        console.error("Error initializing Cheetah:", error);
      }
    };
  
    initializeCheetah();
    // Retrieve message history from local storage
    const storedMessages = localStorage.getItem('messageHistory');

    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }

    // Cleanup on unmount
    return () => {
      release();
    };
  }, []);

  useEffect(() => {
    if(isLoaded){
      console.log("Cheetah is loaded.")
    }

    if (result !== null && isRecording) {
      console.log("Transcript result: ", result);
      // setInput(result.transcript);
      // handleMessage();
      setCurrentTranscript(result.transcript);
    }

    // Check for errors
    if(error){
      console.log("Error: ", error)
    }

    if(isListening){
      console.log("Cheetah is listening.")
    }
  }, [result, isRecording]);

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
        setInput("");
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
      if (!isLoaded) {
        console.error("Cheetah is not loaded.");
        return;
      }
      await start();
      setIsRecording(true);
      setCurrentTranscript("");
      console.log("Recording started.");

    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };
  const stopRecording = async () => {
    try {
      await stop();
      setIsRecording(false);
      // Set the input with the current transcript
      setInput(currentTranscript);
      console.log("Recording stopped.");

      // Send the transcribed text to the API
      if (currentTranscript.trim() !== "") {
        await handleMessage();
      }
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };

  console.log("Is Recording:", isRecording);

  
  return (
    <div className={styles.chatbox}>
      <div className={styles.messages}>

        {messages.slice(2).map((msg, index) => (
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

        {input?.trim() === "" ? (
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
