"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { Pathway_Service } from "./Service/pathway_service";

export default function Home() {
  const [inputValue, setInputValue] = useState({
    skill: "",
    num: "",
    duration: "",
  });
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const [parsedAnswer, setParsedAnswer] = useState();
  console.log("JSON", parsedAnswer);
  const parseLLM = (input) => {
    const lines = input.trim().split("\n");
    const result = {};
    let currentMonth = "";
    let currentWeek = "";
    let currentProject = "";
    lines.forEach((line) => {
      line = line.trim();
      line = line.replace(/[^\w\s]/g, "");
      if (line.startsWith("Month")) {
        currentMonth = line.replace(/\*\*/g, "").trim();
        result[currentMonth] = { weeks: {}, project: "" };
      } else if (line.startsWith("Week")) {
        currentWeek = line.replace(/\*/g, "").trim();
        result[currentMonth].weeks[currentWeek] = [];
      } else if (line.startsWith("Project:")) {
        currentProject = line.replace(/\*\*/g, "").trim();
        result[currentMonth].project = currentProject;
      } else if (line.startsWith("")) {
        result[currentMonth]?.weeks[currentWeek]?.push(line.trim());
      }
    });
    console.log(result);
    return JSON.stringify(result, null, 2);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await Pathway_Service(inputValue);
      setAnswer(res.answer);
      setImage(res.image);
    } catch (error) {
      console.log("Error Fetching Data", error);
    } finally {
      setLoading(false);
      setParsedAnswer(parseLLM(answer));
    }
  };

  const handleInput = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setInputValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <main className={styles.main}>
      <div>
        <label>Write Skill</label>
        <input
          name="skill"
          value={inputValue.skill}
          onChange={handleInput}
          type="text"
        />
        <label>Write total duration in numbers</label>
        <input
          name="num"
          value={inputValue.num}
          onChange={handleInput}
          type="text"
        />
        <label>Write time format: day, month, year</label>
        <input
          name="duration"
          value={inputValue.duration}
          onChange={handleInput}
          type="text"
        />
        <button onClick={handleClick}>Enter</button>
      </div>

      {loading ? (
        <div>
          <p>Loading....</p>
        </div>
      ) : (
        <>
          {/* {image && (
            <Image width="350px" src={image} alt="AI Generated Image" />
          )} */}
          <pre>{answer}</pre>
          <pre>{parsedAnswer}</pre>
        </>
      )}
    </main>
  );
}
