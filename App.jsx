import { languages } from "./language";
import { useState } from "react";

export default function AssemblyEngame() {
  const [currentWord, setCurrentWord] = useState("react");
  const [guess, setGuess] = useState([]);

  function getLetterFromKeys(letter) {
    setGuess((prevLetter) =>
      prevLetter.includes(letter) ? prevLetter : [...prevLetter, letter],
    );
  }
  console.log(guess);

  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  const wordStr = () =>
    currentWord.split("").map((letter, idx) => (
      <span key={idx} className="letter">
        {letter.toUpperCase()}
      </span>
    ));

  const alphabetKeyboard = () =>
    alphabet.split("").map((letter) => (
      <button onClick={() => getLetterFromKeys(letter)} key={letter}>
        {letter.toUpperCase()}
      </button>
    ));

  return (
    <main>
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word in under 8 attemps to keep the programming world safe
          from Assembly!
        </p>
      </header>

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

      <section className="word-container">{wordStr()}</section>
      <section className="keyboard">{alphabetKeyboard()}</section>
      <section className="new-game">
        <button>New Game</button>
      </section>
    </main>
  );
}
