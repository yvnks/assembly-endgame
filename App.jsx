import { languages } from "./language";
import { useState } from "react";
import clsx from "clsx";
import { getFarewellText } from "./utils";

/**
 * Backlog:
 *
 * - Farewell messages in status section
 * - Fix a11y issues
 * - Make the new game button work
 * - Choose a random word from a list of words
 * - Confetti drop when the user wins
 */

export default function AssemblyEngame() {
  // State values
  const [currentWord, setCurrentWord] = useState("react");
  const [guessedLetter, setGuessedLetter] = useState([]);

  // Derived values.
  const wrongGuessCount = guessedLetter.filter(
    (letter) => !currentWord.includes(letter),
  ).length;
  const isGameWon = currentWord
    .split("")
    .every((letter) => guessedLetter.includes(letter));
  const isGameLost = wrongGuessCount >= languages.length - 1;
  const isGameOver = isGameWon || isGameLost;

  const lastGuessedLetter = guessedLetter.at(-1);
  const isLastGuessedIncorrect =
    lastGuessedLetter && !currentWord.includes(lastGuessedLetter);
  console.log(isLastGuessedIncorrect);

  // Adds letter to the guess state.
  function getLetterFromKeys(letter) {
    setGuessedLetter((prevLetter) =>
      prevLetter.includes(letter) ? prevLetter : [...prevLetter, letter],
    );
  }

  // Displays the current word on the screen.
  const wordStr = () =>
    currentWord.split("").map((letter, idx) => (
      <span key={idx} className="letter">
        {guessedLetter.includes(letter) ? letter.toUpperCase() : " "}
      </span>
    ));

  // Make the on screen keyboard.
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const alphabetKeyboard = () =>
    alphabet.split("").map((letter) => {
      const isGuessed = guessedLetter.includes(letter);
      const isCorrect = isGuessed && currentWord.includes(letter);
      const isWrong = isGuessed && !currentWord.includes(letter);

      const className = clsx({ correct: isCorrect, wrong: isWrong });

      return (
        <button
          className={className}
          onClick={() => getLetterFromKeys(letter)}
          key={letter}
        >
          {letter.toUpperCase()}
        </button>
      );
    });

  const languageElements = languages.map((lang, idx) => {
    const isLanguageLost = idx < wrongGuessCount;

    const className = clsx("chip", isLanguageLost && "lost");

    return (
      <span
        className={className}
        key={lang.name}
        style={{
          backgroundColor: lang.backgroundColor,
          color: lang.color,
        }}
      >
        {lang.name}
      </span>
    );
  });

  function renderGameStatus() {
    if (!isGameOver && isLastGuessedIncorrect) {
      return (
        <p className="farewell-message">
          {getFarewellText(languages[wrongGuessCount - 1].name)}
        </p>
      );
    }

    if (isGameWon) {
      return (
        <>
          <h2>You win!</h2>
          <p>Well done! 🎉</p>
        </>
      );
    }
    if (isGameLost) {
      return (
        <>
          <h2>Game over!</h2>
          <p>You lose! Better start learning Assembly 😭</p>
        </>
      );
    } else {
      return null;
    }
  }

  const gameStatus = clsx("game-status", {
    won: isGameWon,
    loss: isGameLost,
    farewell: !isGameOver && isLastGuessedIncorrect,
  });

  return (
    <main>
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word in under 8 attemps to keep the programming world safe
          from Assembly!
        </p>
      </header>

      <section className={gameStatus}>{renderGameStatus()}</section>

      <div className="language-chips">{languageElements}</div>

      <section className="word-container">{wordStr()}</section>
      <section className="keyboard">{alphabetKeyboard()}</section>
      <section className="new-game">
        {isGameOver && <button>New Game</button>}
      </section>
    </main>
  );
}
