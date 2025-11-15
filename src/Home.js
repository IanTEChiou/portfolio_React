import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div>
            <h1>Welcome to the Home Page</h1>
            <p>Go to <Link to="/game">Tic Tac Toe</Link></p>
            <p>Go to <Link to="/guessGame">guess game</Link></p>
            <p>Go to <Link to="/mineSweeper">Mine Sweeper</Link></p>
        </div>
    );
}


export default Home;