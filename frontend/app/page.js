"use client";

import { useState } from "react";
import axios from "axios";
import styles from "./page.module.css";
import { FaMicrophone } from "react-icons/fa";
import Chatbot from "./components/Chatbot";
import { Personalities } from "./components";

export default function Home() {
  const [personality, setPersonality] = useState("");
  return (
    <main className={styles.container}>
      <nav className={styles.logo}>
        <h1 className={styles.title}>
          Budgie
        </h1>
      </nav>
      <p className={styles.description}>
        Your friendly mental health coach, here to support and guide you through your emotional journey. 
      </p>
      <Personalities setPersonality={setPersonality} />
    </main>
  );
}
