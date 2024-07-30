import React, { useState } from "react";
import styles from "../page.module.css";

const personalities = [
  {
    name: "Default",
    desc: "empathetic person and a great listener with expert knowledge in emotional intelligence, CBT, psychology, therapy, and counselling",
  },
  {
    name: "motivator",
    desc: "great motivator and encourager who excels at using positive reinforcement and motivational techniques",
  },
  {
    name: "calm advisor",
    desc: "calm and patient advisor who provides guidance and support in a non-judgmental way",
  },
  {
    name: "comedian",
    desc: "great sense of humour and love to make people smile and laugh",
  },
  {
    name: "captain",
    desc: "strong leader who takes charge of situations and provides direction and guidance",
  },
];

export default function Personalities({ setPersonality }) {
  const [div, setDiv] = useState();

  const handleDiv = (e) => {
    setDiv(e.currentTarget.getAttribute("name"));
  };
  const handleBtn = () => {
    setPersonality(div);
  };

  return (
    <div className={styles.cardsOutline}>
      <div className={styles.cards}>
        {personalities.map((person, index) => (
          <div
            key={index}
            onClick={handleDiv}
            name={person.name}
            className={styles.card}
          >
            <h2>{person.name}</h2>
            <p>{person.desc}</p>
          </div>
        ))}
      </div>
      <div className={styles.btnOutline}>
        <button onClick={handleBtn} className={styles.continueBtn}>
          Continue
        </button>
      </div>
    </div>
  );
}
