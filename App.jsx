import { languages } from "./language";
import { useState } from "react";
import clsx from "clsx";
import { getFarewellText } from "./utils";
import { getRandomWord } from "./utils";
import Confetti from "react-confetti";

export default function AssemblyEngame() {
  // State values
  const [currentWord, setCurrentWord] = useState(() => getRandomWord());
  const [guessedLetter, setGuessedLetter] = useState([]);

  // Derived values.
  const wrongGuessCount = guessedLetter.filter(
    (letter) => !currentWord.includes(letter),
  ).length;
  const isGameWon = currentWord
    .split("")
    .every((letter) => guessedLetter.includes(letter));
  const numGuessLeft = languages.length - 1;
  const isGameLost = wrongGuessCount >= numGuessLeft;
  const isGameOver = isGameWon || isGameLost;

  const lastGuessedLetter = guessedLetter.at(-1);
  const isLastGuessedIncorrect =
    lastGuessedLetter && !currentWord.includes(lastGuessedLetter);

  // Adds letter to the guess state.
  function getLetterFromKeys(letter) {
    setGuessedLetter((prevLetter) =>
      prevLetter.includes(letter) ? prevLetter : [...prevLetter, letter],
    );
  }

  // Displays the current word on the screen.
  const letterElement = currentWord.split("").map((letter, idx) => {
    const shouldRevealLetter = isGameLost || guessedLetter.includes(letter);
    const letterClassname =
      isGameLost && !guessedLetter.includes(letter) && "missed-class";

    return (
      <span key={idx} className={`letter ${letterClassname}`}>
        {shouldRevealLetter ? letter.toUpperCase() : " "}
      </span>
    );
  });

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
          disabled={isGameOver}
          className={className}
          aria-disabled={guessedLetter.includes(letter)}
          aria-label={`Letter ${letter}`}
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

  function newGame() {
    setCurrentWord(getRandomWord());
    setGuessedLetter([]);
  }

  return (
    <main>
      {isGameOver && isGameWon && <Confetti />}
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word in under 8 attemps to keep the programming world safe
          from Assembly!
        </p>
      </header>

      <section aria-live="polite" role="status" className={gameStatus}>
        {renderGameStatus()}
      </section>

      <div className="language-chips">{languageElements}</div>

      {/* Combines visually-hidden aria-live region for status updates.  */}
      <section role="status" aria-live="polite" className="sr-only">
        <p role="status" aria-live="polite" className="sr-only">
          {currentWord.includes(lastGuessedLetter)
            ? `Correct! The letter ${lastGuessedLetter} is in the word.`
            : `Sorry, the letter ${lastGuessedLetter} is not in the word`}
          You have {numGuessLeft} of Guesses left.
        </p>
        <p>
          Current word:{" "}
          {currentWord
            .split("")
            .map((letter) =>
              guessedLetter.includes(letter) ? letter + "." : "blank",
            )
            .join(" ")}
        </p>
      </section>

      <section className="word-container">{letterElement}</section>
      <section className="keyboard">{alphabetKeyboard()}</section>
      <section className="new-game">
        {isGameOver && <button onClick={newGame}>New Game</button>}
      </section>
    </main>
  );
}
