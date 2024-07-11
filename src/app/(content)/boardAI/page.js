"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import styles from "@/app/styles/boardAI.module.css";
import Header from "@/app/components/header";

export default function BoardAI() {
    const [inputValue, setInputValue] = useState("3");
    const [boardSize, setBoardSize] = useState(3);
    const [board, setBoard] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const [history, setHistory] = useState([]);
    const [stepNumber, setStepNumber] = useState(0);
    const [scoreHistory, setScoreHistory] = useState([]);
    const [showReplay, setShowReplay] = useState(false);
    const [isAIMoving, setIsAIMoving] = useState(false);

    useEffect(() => {
        const newSize = parseInt(inputValue, 10);
        if (!isNaN(newSize) && newSize >= 2) {
            setBoardSize(newSize);
            setBoard(Array(newSize * newSize).fill(null));
            setXIsNext(true);
            setHistory([]);
            setStepNumber(0);
        }
    }, [inputValue]);

    useEffect(() => {
        if (!xIsNext && !isAIMoving && !calculateWinner(board, boardSize)) {
            makeAIMove(board, history.length);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [xIsNext, isAIMoving, board, boardSize, history.length]);

    const handleClick = (index) => {
        if (!xIsNext || isAIMoving) return;

        const newBoard = [...board];
        if (calculateWinner(board, boardSize) || newBoard[index]) {
            return;
        }
        newBoard[index] = "X";
        setBoard(newBoard);
        setXIsNext(false);
        const newHistory = history.slice(0, stepNumber + 1);
        setHistory([...newHistory, newBoard]);
        setStepNumber(newHistory.length);
    };

    const makeAIMove = (currentBoard, step) => {
        setIsAIMoving(true);
        setTimeout(() => {
            if (calculateWinner(currentBoard, boardSize)) {
                setIsAIMoving(false);
                return;
            }

            const emptySquares = currentBoard.reduce((acc, val, idx) => {
                if (val === null) acc.push(idx);
                return acc;
            }, []);

            if (emptySquares.length > 0) {
                const randomMove = emptySquares[Math.floor(Math.random() * emptySquares.length)];
                const newBoard = [...currentBoard];
                newBoard[randomMove] = "O";
                setBoard(newBoard);
                setXIsNext(true);
                setHistory([...history.slice(0, step), newBoard]);
                setStepNumber(step + 1);
            }
            setIsAIMoving(false);
        }, 1000); // หน่วงเวลา 1 วินาที
    };

    const renderSquare = (index) => {
        return (
            <button key={index} className={styles.square} onClick={() => handleClick(index)}>
                {board[index]}
            </button>
        );
    };

    const handleInputChange = (event) => {
        const value = event.target.value;
        if (/^\d*$/.test(value)) {
            setInputValue(value);
        }
    };

    const handleReset = () => {
        const winner = calculateWinner(board, boardSize);
        if (winner) {
            setScoreHistory([...scoreHistory, winner]);
        }
        setInputValue("3");
        setBoardSize(3);
        setBoard(Array(9).fill(null));
        setXIsNext(true);
        setHistory([]);
        setStepNumber(0);
    };

    const jumpTo = (step) => {
        setStepNumber(step);
        setBoard(history[step]);
        setXIsNext(step % 2 === 0);
    };

    const winner = calculateWinner(board, boardSize);
    let status;
    let statusClass;
    if (winner) {
        status = "Winner: " + winner;
        statusClass = styles.winnerStatus;
    } else if (board.every(square => square !== null)) {
        status = "It's a draw";
        statusClass = styles.drawStatus;
    } else {
        status = "Next player : " + (xIsNext ? "X" : "O");
        statusClass = styles.nextPlayerStatus;
    }

    const router = useRouter();

    const handleButtonClick = () => {
        router.push('/');
    };

    return (
        <>
            <Header />
            <div className={styles.inputContainer}>
                <label htmlFor="boardSize">Board Size: </label>
                <input
                    id="boardSize"
                    type="text"
                    value={inputValue}
                    inputMode="numeric"
                    pattern="\d*"
                    onInput={handleInputChange}
                />
            </div>
            <div className={`${styles.status} ${statusClass}`}>
                {status}
            </div>
            <div className={styles.board}>
                {[...Array(boardSize)].map((_, row) => (
                    <div key={row} className={styles.boardRow}>
                        {[...Array(boardSize)].map((_, col) => renderSquare(row * boardSize + col))}
                    </div>
                ))}
            </div>
            <div className={styles.containerResetButton}>
                <button className={styles.backButton} onClick={handleButtonClick}>Back</button>
                <button className={styles.resetButton} onClick={handleReset}>Reset</button>
            </div>

            <div className={styles.containerReplayButton}>
                <button className={styles.replayButton} onClick={() => setShowReplay(true)}>View Replay</button>
            </div>

            {showReplay && (
                <div className={styles.replayModal}>
                    <div className={styles.replayContent}>
                        <h2>Replay</h2>
                        {history.map((step, move) => (
                            <button key={move} onClick={() => jumpTo(move)}>
                                {move ? 'Go to move #' + move : 'Go to game start'}
                            </button>
                        ))}
                        <button onClick={() => setShowReplay(false)}>Close</button>
                    </div>
                </div>
            )}
            <div className={styles.scoreHistory}>
                <h2>Score History</h2>
                {scoreHistory.length === 0 ? (
                    <p>No games played yet</p>
                ) : (
                    <ul>
                        {scoreHistory.map((winner, index) => (
                            <li key={index}>Game {index + 1} : Winner - {winner}</li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}

function calculateWinner(board, size) {
    const lines = [];
    const winLength = size >= 4 ? 4 : size;

    // Rows
    for (let i = 0; i < size; i++) {
        for (let j = 0; j <= size - winLength; j++) {
            const row = [];
            for (let k = 0; k < winLength; k++) {
                row.push(i * size + j + k);
            }
            lines.push(row);
        }
    }

    // Columns
    for (let i = 0; i < size; i++) {
        for (let j = 0; j <= size - winLength; j++) {
            const col = [];
            for (let k = 0; k < winLength; k++) {
                col.push((j + k) * size + i);
            }
            lines.push(col);
        }
    }

    // Diagonals
    for (let i = 0; i <= size - winLength; i++) {
        for (let j = 0; j <= size - winLength; j++) {
            const diag1 = [];
            const diag2 = [];
            for (let k = 0; k < winLength; k++) {
                diag1.push((i + k) * size + j + k);
                diag2.push((i + k) * size + j + (winLength - k - 1));
            }
            lines.push(diag1);
            lines.push(diag2);
        }
    }

    for (let i = 0; i < lines.length; i++) {
        const [a, ...rest] = lines[i];
        if (board[a] && rest.every(index => board[index] === board[a])) {
            return board[a];
        }
    }
    return null;
}
