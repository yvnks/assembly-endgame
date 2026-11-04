import { languages } from "./language";
import { useState } from "react";
import clsx from "clsx";

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

  const gameStatus = clsx("game-status", {
    won: isGameWon,
    loss: isGameLost,
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

      <section className={gameStatus}>
        {isGameOver ? (
          isGameWon ? (
            <>
              <h1>You win</h1>
              <p>Well done! 🎉</p>
            </>
          ) : (
            <>
              <h1>Game over!</h1>
              <p>You lose! Better start learning Assembly 😭</p>
            </>
          )
        ) : null}
      </section>

      <div className="language-chips">{languageElements}</div>

      <section className="word-container">{wordStr()}</section>
      <section className="keyboard">{alphabetKeyboard()}</section>
      <section className="new-game">
        {isGameOver && <button>New Game</button>}
      </section>
    </main>
  );
}
