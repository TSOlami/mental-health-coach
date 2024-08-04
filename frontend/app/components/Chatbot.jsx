"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../page.module.css";
import { FaMicrophone } from "react-icons/fa";

export default function Chatbot({ personality }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  console.log(messages);

  useEffect(() => {
    // Retrieve message history from local storage
    const storedMessages = localStorage.getItem('messageHistory');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  const handleMessage = async () => {
    if (input.trim() == "") return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages([...messages, userMessage]);
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
  return (
    <div className={styles.chatbox}>
      <div className={styles.messages}>
        {messages.map((msg, index) => (
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
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleMessage()}
          className={styles.input}
          rows="4"
        />
        <div className={styles.btn}>
          <FaMicrophone size={24} />
        </div>
      </div>
    </div>
  );
}
