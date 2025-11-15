import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Game from './square';
import GuessGame from './numberGuess';
import MineSweeper from './mineSweeper';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/guessGame" element={<GuessGame />} />
        <Route path="/mineSweeper" element={<MineSweeper />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;