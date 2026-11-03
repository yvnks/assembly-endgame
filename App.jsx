import { languages } from "./language";
import { useState } from "react";

export default function Hangman() {
  const [currentWord, setCurrentWord] = useState("react");

  const wordStr = () =>
    currentWord
      .split("")
      .map((letter) => <span className="letter">{letter.toUpperCase()}</span>);

  return (
    <main>
      <header>
        <h1 className="title">Assembly: Endgame</h1>
        <p className="info">
          Guess the word in under 8 attemps to keep the programming world safe
          from Assembly!
        </p>

        <section className="game-status">
          <h2>You win!</h2>
          <p>Well done! 🎉</p>
        </section>

        <div className="chips">
          {languages.map((lang) => (
            <span
              className="chips-lang"
              key={lang.name}
              style={{
                backgroundColor: lang.backgroundColor,
                color: lang.color,
              }}
            >
              {lang.name}
            </span>
          ))}
        </div>
      </header>

      <section className="word-container">{wordStr()}</section>
    </main>
  );
}
