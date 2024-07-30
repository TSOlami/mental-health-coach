"use client";

import { useState } from "react";
import axios from "axios";
import styles from "./page.module.css";
import { FaMicrophone } from "react-icons/fa";
import Chatbot from "./components/Chatbot";

export default function Home() {
  return (
    <main className={styles.container}>
      <nav className={styles.logo}>
        <h1>Anixety Bot</h1>
      </nav>
      <Chatbot />
    </main>
  );
}
