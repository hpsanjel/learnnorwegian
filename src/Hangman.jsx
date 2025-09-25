import { useEffect, useState } from "react";
import { norwegianWords } from "./norwegianWords";
import "./Hangman.css";

function HangmanDrawing({ step }) {
	return (
		<svg width="120" height="180" viewBox="0 0 120 180" className="hangman-svg">
			{/* Gallows */}
			<line x1="20" y1="170" x2="100" y2="170" stroke="#444" strokeWidth="4" />
			<line x1="60" y1="30" x2="60" y2="170" stroke="#444" strokeWidth="4" />
			<line x1="60" y1="30" x2="100" y2="30" stroke="#444" strokeWidth="4" />
			<line x1="100" y1="30" x2="100" y2="50" stroke="#444" strokeWidth="4" />
			{/* Head */}
			{step > 0 && <circle cx="100" cy="60" r="15" stroke="#222" strokeWidth="3" fill="#fff" />}
			{/* Body */}
			{step > 1 && <line x1="100" y1="75" x2="100" y2="115" stroke="#222" strokeWidth="3" />}
			{/* Left Arm */}
			{step > 2 && <line x1="100" y1="90" x2="85" y2="105" stroke="#222" strokeWidth="3" />}
			{/* Right Arm */}
			{step > 3 && <line x1="100" y1="90" x2="115" y2="105" stroke="#222" strokeWidth="3" />}
			{/* Left Leg */}
			{step > 4 && <line x1="100" y1="115" x2="90" y2="145" stroke="#222" strokeWidth="3" />}
			{/* Right Leg */}
			{step > 5 && <line x1="100" y1="115" x2="110" y2="145" stroke="#222" strokeWidth="3" />}
			{/* Face (dead) */}
			{step > 6 && (
				<g>
					<line x1="93" y1="55" x2="97" y2="59" stroke="#d00" strokeWidth="2" />
					<line x1="97" y1="55" x2="93" y2="59" stroke="#d00" strokeWidth="2" />
					<line x1="103" y1="55" x2="107" y2="59" stroke="#d00" strokeWidth="2" />
					<line x1="107" y1="55" x2="103" y2="59" stroke="#d00" strokeWidth="2" />
					<ellipse cx="100" cy="67" rx="5" ry="2" fill="none" stroke="#d00" strokeWidth="2" />
				</g>
			)}
		</svg>
	);
}

const MAX_ATTEMPTS = 7;

// function getLevel(word) {
// 	if (norwegianWords.easy.some((w) => w.word === word.word)) return 1;
// 	if (norwegianWords.medium.some((w) => w.word === word.word)) return 2;
// 	if (norwegianWords.hard.some((w) => w.word === word.word)) return 3;
// 	return 1;
// }

function getRandomWordObj(level) {
	let pool = [];
	if (level === 1) pool = norwegianWords.easy;
	else if (level === 2) pool = norwegianWords.medium;
	else if (level === 3) pool = norwegianWords.hard;
	if (pool.length === 0) return { word: "", hint: "" };
	const idx = Math.floor(Math.random() * pool.length);
	return pool[idx];
}

function Hangman() {
	const [level, setLevel] = useState(null);
	const [wordObj, setWordObj] = useState({ word: "", hint: "" });
	const word = wordObj.word.toLowerCase();
	const [guessedLetters, setGuessedLetters] = useState([]);
	const [wrongGuesses, setWrongGuesses] = useState([]);
	const [gameStatus, setGameStatus] = useState("playing");

	useEffect(() => {
		if (level) resetGame(level);
	}, [level]);

	function resetGame(lvl = level) {
		const newWordObj = getRandomWordObj(lvl);
		setWordObj(newWordObj);
		setGuessedLetters([]);
		setWrongGuesses([]);
		setGameStatus("playing");
	}

	function handleGuess(letter) {
		if (gameStatus !== "playing") return;
		letter = letter.toLowerCase();
		if (guessedLetters.includes(letter) || wrongGuesses.includes(letter)) return;
		if (word.includes(letter)) {
			const newGuessed = [...guessedLetters, letter];
			setGuessedLetters(newGuessed);
			if (word.split("").every((l) => newGuessed.includes(l) || l === "-")) {
				setGameStatus("won");
			}
		} else {
			const newWrong = [...wrongGuesses, letter];
			setWrongGuesses(newWrong);
			if (newWrong.length >= MAX_ATTEMPTS) {
				setGameStatus("lost");
			}
		}
	}

	function renderWord() {
		return word.split("").map((letter, idx) =>
			letter === "-" ? (
				<span key={idx} className="dash">
					-
				</span>
			) : guessedLetters.includes(letter) ? (
				<span key={idx} className="letter">
					{letter}
				</span>
			) : (
				<span key={idx} className="blank">
					_
				</span>
			)
		);
	}

	function renderKeyboard() {
		const alphabet = "abcdefghijklmnopqrstuvwxyzæøå".split("");
		return (
			<div className="keyboard">
				{alphabet.map((letter) => (
					<button key={letter} onClick={() => handleGuess(letter)} disabled={guessedLetters.includes(letter) || wrongGuesses.includes(letter) || gameStatus !== "playing"}>
						{letter}
					</button>
				))}
			</div>
		);
	}

	if (!level) {
		return (
			<div className="hangman-container">
				<h2>Norwegian Hangman</h2>
				<div className="level-select">
					<p>Velg nivå for å starte:</p>
					<button onClick={() => setLevel(1)} className="level-btn level-1">
						Level 1 (lett)
					</button>
					<button onClick={() => setLevel(2)} className="level-btn level-2">
						Level 2 (middels)
					</button>
					<button onClick={() => setLevel(3)} className="level-btn level-3">
						Level 3 (vanskelig)
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="hangman-container">
			<h2>Norwegian Hangman</h2>
			<div style={{ marginBottom: "1rem" }}>
				<span className="level-indicator">Nivå: {level}</span>
				<button className="level-btn change-level" onClick={() => setLevel(null)} style={{ marginLeft: 12, fontSize: "0.95rem" }}>
					Bytt nivå
				</button>
			</div>
			<HangmanDrawing step={wrongGuesses.length} />
			<p className="hint">
				<b>Hint:</b> {wordObj.hint}
			</p>
			<div className="word">{renderWord()}</div>
			<div className="status">
				<span>Wrong guesses: {wrongGuesses.join(", ")}</span>
				<span>Attempts left: {MAX_ATTEMPTS - wrongGuesses.length}</span>
			</div>
			{renderKeyboard()}
			{gameStatus !== "playing" && (
				<div className="result">
					{gameStatus === "won" ? (
						<span className="won">Congratulations! You guessed the word!</span>
					) : (
						<span className="lost">
							Game over! The word was: <b>{word}</b>
						</span>
					)}
					<button onClick={() => resetGame()}>Play Again</button>
				</div>
			)}
		</div>
	);
}

export default Hangman;
