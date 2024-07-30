"use client";

import { useState } from "react";
import axios from "axios";
import styles from "./page.module.css";
import { FaMicrophone } from "react-icons/fa";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  console.log(messages);
  const handleMessage = async () => {
    if (input.trim() == "") return;

    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const response = await axios.post("/api/chatbot", { message: input });
      const botMessage = { text: response.data.reply, sender: "bot" };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error("Error Sending Message", error);
      const errorMessage = {
        text: "Sorry, I couldn't send process your request.",
        sender: "bot",
      };
      setMessages([...messages, userMessage, errorMessage]);
    }
  };
  return (
    <main className={styles.container}>
      <nav className={styles.logo}>
        <h1>Anixety Bot</h1>
      </nav>
      <div className={styles.chatbox}>
        <div className={styles.messages}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`${styles.message} ${
                msg.sender == "bot" ? styles.bot : styles.user
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className={styles.inputContainer}>
          <textarea
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleMessage()}
            className={styles.input}
          />
          <div className={styles.btn}>
            <FaMicrophone size={24} />
          </div>
        </div>
      </div>
    </main>
  );
}
