import { useState, useEffect  } from 'react';
import { Link } from 'react-router-dom';
import './mineSweeper.css';


function Cells( { row, col, cell, onClick, onRightClick} ) {
    // This is react component for each cell in the Minesweeper board
    // Anything calls this component will return a button representing a cell

    let display = "";
    let numberClass = "";

    if (cell.revealed) {
        if (cell.hasMine) {
            display = "💣";
        } else if (cell.adjacentMines > 0) {
            display = cell.adjacentMines;
            numberClass = `number-${cell.adjacentMines}`;
        } else {
            display = "";
        }
    } else if (cell.flagged) {
        display = "🚩";
    }

    const cellClass = `
        cell 
        ${cell.revealed ? "cell-revealed" : "cell-hidden"} 
        ${numberClass}
    `.trim();

    const handleLeftClick = () => {
        onClick(row, col);
    };

    const handleRightClick = (e) => {
        e.preventDefault(); // prevent context menu
        if (onRightClick) {
            onRightClick(row, col);
        }
    };


    return (
        <button
            className={cellClass}
            onClick={handleLeftClick} // left click
            onContextMenu={handleRightClick} // onContextMenu is default right click event in React
        >
            {display}
        </button>
    );
}


function createBoard(rows, cols, mines) {
    // make a 2D array with every element being an object
    // Each object represents a cell with properties: revealed, hasMine, adjacentMines
    const board = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({
            revealed: false,
            hasMine: false,
            flagged: false,
            adjacentMines: 0,
        }))
    );


    let placed = 0;
    while (placed < mines) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);

        if (!board[r][c].hasMine) {
            board[r][c].hasMine = true;
            placed++;
        }
    }

    const dirs = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1], [1, 0],   [1, 1],
    ];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {

            if (board[r][c].hasMine) continue;

            let count = 0;
            for (let [dr, dc] of dirs) {
                const nr = r + dr, nc = c + dc;

                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    if (board[nr][nc].hasMine) count++;
                }
            }

            board[r][c].adjacentMines = count;
        }
    }

    return board;
}


function Board({ rows, cols, mines }) {
    // Initialize board state
    const [board, setBoard] = useState(() => createBoard(rows, cols, mines));
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const flaggedCount = board.reduce(
        (sum, row) => sum + row.filter(cell => cell.flagged).length,
        0
    );
    const remainingMines = mines - flaggedCount;

    // useEffect is used to trigger "setBoard" when these params change
    useEffect(() => {
        setBoard(createBoard(rows, cols, mines));
        setGameOver(false); // make sure to reset gameOver when board is recreated
    }, [rows, cols, mines]);


    function revealZeros(board, startR, startC) {
        // This function is to reveal all connected zero-adjacent-mine cells

        const rows = board.length;
        const cols = board[0].length;

        const nearbyCells = [
            [-1, -1], [-1, 0], [-1, 1],
            [ 0, -1],          [ 0, 1],
            [ 1, -1], [ 1, 0], [ 1, 1]
        ];

        const queue = [[startR, startC]]; // start from the clicked cell

        while (queue.length > 0) {
            const [r, c] = queue.shift(); // get the front cell to process, first in first out
            const cell = board[r][c];

            if (cell.revealed) continue; // ignore the cell already revealed
            if (cell.hasMine) continue; // ignore mines

            cell.revealed = true; // reveal this cell

            if (cell.adjacentMines > 0) continue; // if this cell has adjacent mines, stop here

            for (const [dr, dc] of nearbyCells) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue; // out of bounds

                const neighbor = board[nr][nc];

                if (!neighbor.revealed && !neighbor.hasMine) {
                    queue.push([nr, nc]); // add to queue for further processing
                }
            }
        }
    }


    function checkWin(board) {
        for (let r = 0; r < board.length; r++) {
            for (let c = 0; c < board[0].length; c++) {
                const cell = board[r][c];
                if (!cell.hasMine && !cell.revealed) {
                    return false; // found a non-mine cell that is not revealed
                }
            }
        }
        return true; // all non-mine cells are revealed
    }


    function chordReveal(board, r, c) {
        const rows = board.length;
        const cols = board[0].length;
        // const cell = board[r][c];

        const nearbyCells = [
            [-1, -1], [-1, 0], [-1, 1],
            [ 0, -1],          [ 0, 1],
            [ 1, -1], [ 1, 0], [ 1, 1]
        ];

        for (const [dr, dc] of nearbyCells) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue; // out of bounds

            const neighbor = board[nr][nc];

            if (neighbor.revealed || neighbor.flagged) continue; // skip revealed or flagged cells

            if (neighbor.hasMine) {
                // revealed all mines
                for (let i = 0; i < board.length; i++) {
                    for (let j = 0; j < board[i].length; j++) {
                        if (board[i][j].hasMine) {
                            board[i][j].revealed = true;
                        }
                    }
                }
                setGameOver(true);
                return;
            }

            if (neighbor.adjacentMines === 0) {
                revealZeros(board, nr, nc);
            } else {
                neighbor.revealed = true;
            }
        }
    }


    function handleCellClick(r, c) {
        if (gameWon || gameOver) return; // if game is over, ignore clicks

        // setBoard will automatically bring "board" into its callback function
        // so prevBoard here is the latest board state
        setBoard((prevBoard) => {
            // copy the previous board state for later modification
            const newBoard = prevBoard.map(row =>
                row.map(cell => ({ ...cell }))
            );

            const cell = newBoard[r][c]; // get the clicked cell

            // if (cell.revealed) return prevBoard; // if already revealed, ignore click
            if (cell.revealed) {
                chordReveal(newBoard, r, c);

                if(!gameOver && checkWin(newBoard)) {
                    setGameWon(true);
                }

                return newBoard;
            }

            if (cell.hasMine) {
                // revealed all mines
                for (let i = 0; i < newBoard.length; i++) {
                    for (let j = 0; j < newBoard[i].length; j++) {
                        if (newBoard[i][j].hasMine) {
                            newBoard[i][j].revealed = true;
                        }
                    }
                }
                // game over
                setGameOver(true);
            } else {
                if (cell.adjacentMines === 0) {
                    // reveal all connected zero-adjacent-mine cells
                    revealZeros(newBoard, r, c);
                } else {
                    // normal cell clicked
                    cell.revealed = true;
                }
            }

            // check if player has won
            if (checkWin(newBoard)) {
                setGameWon(true);
            }

            // return the new board to update the state
            // because setBoard has been triggered, so the component will re-render with the new board state
            return newBoard;
        });
    }


    function handleRightClick(r, c) {
        if (gameWon || gameOver) return;
        setBoard((prevBoard) => {
            // copy the previous board state for later modification
            const newBoard = prevBoard.map(row =>
                row.map(cell => ({ ...cell }))
            );

            const cell = newBoard[r][c];

            if (cell.revealed) return prevBoard; // cannot flag revealed cells

            cell.flagged = !cell.flagged; // toggle flag

            return newBoard;
        });

    }


    return (
        <div className="ms-board-wrapper">
            <div className="ms-status-bar">
                <div className="mins-counter">
                    Remining Mines: {remainingMines}
                </div>
            </div>
            <div className="ms-board">
                {board.map((row, rIdx) => (
                    <div className="ms-row" key={rIdx}>
                        {row.map((cell, cIdx) => ( // cell here means each object "Cells" in this 2D array
                            <Cells
                                key={cIdx}
                                row={rIdx}
                                col={cIdx}
                                cell={cell}
                                onClick={handleCellClick}
                                onRightClick={handleRightClick}
                            />
                        ))}
                    </div>
                ))}
            </div>
            {gameOver && (
                <div className="game-over-overlay">
                    <div className="game-over-dialog">
                        <p>💣 Boom! You lost.</p>
                        <button onClick={() => {
                            setBoard(createBoard(rows, cols, mines));
                            setGameOver(false);
                        }}>
                            Restart
                        </button>
                    </div>
                </div>
            )}
            {gameWon && (
                <div className="game-won-overlay">
                    <div className="game-won-dialog">
                        <p>🎉 Congratulations! You won!</p>
                        <button onClick={() => {
                            setBoard(createBoard(rows, cols, mines));
                            setGameWon(false);
                        }}>
                            Restart
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}


function MineSweeper() {
    const LEVELS = {
        EASY: { rows: 8, cols: 8, mines: 10 },
        MEDIUM: { rows: 16, cols: 16, mines: 40 },
        HARD: { rows: 16, cols: 30, mines: 99 },
    };
    const [Level, setLevel] = useState(LEVELS.EASY); // Default level set to EASY
    const [gameKey, setGameKey] = useState(0); // Key to force remount Board component

    const [customLevel, setCustomLevel] = useState({
        rows: 20,
        cols: 28,
        mines: 100
    });

    function customLevelCheck() {
        const { rows, cols, mines } = customLevel;
        if (rows < 0 || cols < 0 || mines <= 0) {
            alert("Rows, Columns, and Mines must be non-negative numbers.");
            return;
        }

        const totalCells = rows * cols;
        if (totalCells <= 1) {
            alert("The board must have at least 2 cells.");
            return;
        }

        const mineRatio = mines / totalCells;
        if (mineRatio >= 0.8) {
            alert("Too many mines! Please reduce the number of mines.");
            return;
        }

        setLevel(customLevel);
    }

    return (
        <>
            <div className="game-wrapper">
                <Link to="/" className="back-button">Back to Home</Link>
                <div className="difficulty-selection">
                    <button onClick={() => setLevel(LEVELS.EASY)}>Easy</button>
                    <button onClick={() => setLevel(LEVELS.MEDIUM)}>Medium</button>
                    <button onClick={() => setLevel(LEVELS.HARD)}>Hard</button>
                </div>
                <div className="custom-level-inputs">
                    <label>
                        Rows: 
                        <input
                            type="number"
                            value={customLevel.rows}
                            onChange={(e) =>
                                setCustomLevel(prev => ({
                                    ...prev,
                                    rows: Number(e.target.value)
                                }))
                            }
                        />
                    </label>
                    <label>
                        Columns: 
                        <input
                            type="number"
                            value={customLevel.cols}
                            onChange={(e) =>
                                setCustomLevel(prev => ({
                                    ...prev,
                                    cols: Number(e.target.value)
                                }))
                            }
                        />
                    </label>
                    <label>
                        Mines:
                        <input
                            type="number"
                            value={customLevel.mines}
                            onChange={(e) => // onChange event will be triggered when the input value changes, e means the event object
                                setCustomLevel(prev => ({ // when value changes, the function after => will be called with prev being the previous state
                                    ...prev, // ...prev means to copy all previous properties of the state object
                                    mines: Number(e.target.value) // overwrite the mines property with the new value from input, converted to number
                                }))
                            }
                        />
                    </label>
                    <button onClick={customLevelCheck}>Update</button>
                </div>
                <div className="reset-button-container">
                    <button onClick={() => setGameKey(gameKey + 1)}>Restart</button> 
                </div>
                <div className="game-board">
                    <Board
                        key={gameKey}
                        rows={Level.rows} 
                        cols={Level.cols} 
                        mines={Level.mines} 
                    />
                </div>
            </div>
        </>
    );
}


export default MineSweeper;