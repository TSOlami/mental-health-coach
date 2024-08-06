"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "../page.module.css";
import "../globals.css";
import { useCheetah } from "@picovoice/cheetah-react";
import { FaMicrophone, FaStop, FaPlay } from "react-icons/fa";
import Dropdown from "../components/Dropdown";

export default function Chatbot({ personality }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const messageEndRef = useRef(null);

  useEffect(() => {
    // Retrieve message history from local storage
    const storedMessages = localStorage.getItem("messageHistory");

    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMessage = async (input) => {
    if (input.trim() == "") return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    localStorage.setItem("messageHistory", JSON.stringify(updatedMessages));
    setInput("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/message/`, 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message_history: updatedMessages,
          message: input,
        }),
      });
      console.log("Falcon Response: ", response);

      if (response.ok) {
        const data = await response.json();

        // Add AI response to the message history
        setMessages([
          ...updatedMessages,
          { role: "assistant", content: data.response },
        ]);
        localStorage.setItem(
          "messageHistory",
          JSON.stringify([
            ...updatedMessages,
            { role: "assistant", content: data.response },
          ])
        );

        if (selectedVoice) {
          console.log("Calling OPENAI TTS API...");
          // Call the server-side API route for text-to-speech
          const ttsResponse = await fetch(
            "https://api.openai.com/v1/audio/speech",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
              },
              body: JSON.stringify({
                model: "tts-1-hd",
                voice: selectedVoice.toLowerCase(),
                input: data.response,
              }),
            }
          );

          if (ttsResponse.ok) {
            // Get the blob response and convert it to mp3
            const audioBlob = await ttsResponse.blob();
            console.log("Blob: ", audioBlob);
            const newAudioUrl = URL.createObjectURL(audioBlob);
            console.log("Audio available at: ", newAudioUrl);
            setAudioUrl(newAudioUrl);
          } else {
            console.error("Failed to generate speech");
          }
        }

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
    localStorage.setItem("messageHistory", JSON.stringify(systemMessage));
  };

  const startRecording = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const recorder = new MediaRecorder(stream);

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setAudioBlob(event.data);
          }
        };

        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
        console.log("Recording Started");
      } else {
        console.error("Media devices are not supported on this browser.");
      }
    } catch (error) {
      if (error.name === "NotAllowedError") {
        console.error("Microphone access denied.");
      } else {
        console.error("Error starting recording:", error);
      }
    }
  };

  const stopRecording = async () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      console.log("Recording stopped.");

      // Wait for the 'dataavailable' event to be handled
      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          const formData = new FormData();
          formData.append("file", event.data, "speech.mp3");
          formData.append("model", "whisper-1");
          formData.append("response_format", "text");

          try {
            const response = await fetch(
              "https://api.openai.com/v1/audio/transcriptions",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
                },
                body: formData,
              }
            );

            if (response.ok) {
              const text = await response.text();
                setCurrentTranscript(text);
                setInput(text);
                handleMessage(text);
            } else {
              const errorText = await response.text();
              console.error("Failed to transcribe audio. Error:", errorText);
            }
          } catch (error) {
            console.error("Error transcribing audio:", error);
          }
        }
      };
    }
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behaviour: "smooth" });
  };

  return (
    <main className={styles.container}>
      <div className={styles.chatbox}>
        <div className={styles.chatboxHeader}>
          <Dropdown setSelectedVoice={setSelectedVoice} />
          <button onClick={handleClearChat} className={styles.clearButton}>
            Clear
          </button>
        </div>
        {audioUrl && <audio id="audioSource" src={audioUrl} autoPlay />}

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
          <div ref={messageEndRef}></div>
        </div>

        <div className={styles.inputContainer}>
          <textarea
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && handleMessage(input)
            }
            className={styles.input}
            placeholder="Write till your heart's content"
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
            <button onClick={() => handleMessage(input)} className={styles.sendButton}>
              Send
            </button>
          )}

          
        </div>
      </div>
    </main>
  );
}
