import { useEffect, useState } from "react";
import styles from "./dropdown.module.css";

export default function Dropdown({ setSelectedVoice }) {
  const [selected, setSelected] = useState("Select Voice");
  const [isOpen, setIsOpen] = useState(false);
  const options = ["Mute", "Alloy", "Echo", "Fable", "Onyx", "Nova", "Shimmer"];

  const handleOptionClick = (option) => {
    setSelected(option);
    setIsOpen(false);
  };
  useEffect(() => {
    if (selected != "Select Voice") setSelectedVoice(selected);
  }, [selected]);

  return (
    <div className={styles.dropdownContainer}>
      <div onClick={() => setIsOpen(true)} className={styles.selected}>
        {selected}
      </div>
      {isOpen && (
        <div className={styles.options}>
          <ul>
            {options.map((option, index) => (
              <li
                key={index}
                value={option}
                className={styles.option}
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
