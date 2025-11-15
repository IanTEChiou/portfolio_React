import React, { useState } from "react";
import { Link } from 'react-router-dom';


function GuessGame() {
    const [upperLimit, setUpperLimit] = useState(""); // this is default value on screen, later it will be tie to the input box in line 31
    const [target, sestTarget] = useState(null);
    const [guess, setGuess] = useState("");
    const [gameMessage, setGameMessage] = useState("");

    function handleRandomNumber() {
        const x = parseInt(upperLimit, 10);
        const randomNumber = Math.floor(Math.random() * x) + 1;
        sestTarget(randomNumber);
    }


    function handleGuess() {
        const userGuess = parseInt(guess, 10);
        if (guess === "" || target === null || isNaN(userGuess)) {
            setGameMessage("Please enter a valid guess or set an upper limit first.");
            return;
        }

        if (userGuess < target) {
            setGameMessage("Too low! Try again.");
        } else if (userGuess > target) {
            setGameMessage("Too high! Try again.");
        } else {
            setGameMessage("Congratulations! You've guessed the number!");
        }
    }


    return (
        <div className="guessGame-wrapper">
            <Link to="/" className="back-button">Back to Home</Link>
            <div>
                <label>
                    Enter an upper limit for the number guessing game: 
                    <input
                        type="number"
                        value={upperLimit}
                        onChange={(e) => setUpperLimit(e.target.value)}
                    />
                </label>
                <button onClick={handleRandomNumber}>
                    Start Game
                </button>
            </div>
            <div>
                <label>
                    Enter the number you guess: 
                    <input
                        type="number"
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                    />
                </label>
                <button onClick={handleGuess}>
                    Guess
                </button>
            </div>
            <div className="game-info">
                {/* <p>{target}</p> */}
                <p>{gameMessage}</p>
            </div>
            <div className="game-record">
                <ol></ol>
            </div>
        </div>
    );
}


export default GuessGame;