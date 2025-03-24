import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Confetti from 'react-confetti';

// Square component
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// Board component
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (squares.every(square => square)) {
    status = 'Draw!';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board">
        {[0, 1, 2].map(row => (
          <div key={row} className="board-row">
            {[0, 1, 2].map(col => {
              const index = row * 3 + col;
              return (
                <Square 
                  key={index} 
                  value={squares[index]} 
                  onSquareClick={() => handleClick(index)} 
                />
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}

// Helper function to calculate winner
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

const GamePage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [difficulty, setDifficulty] = useState('medium');
  const [playingWithAI, setPlayingWithAI] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  
  const toastOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    className: 'toast-message',
    bodyClassName: "toast-body",
    progressClassName: 'toast-progress'
  };

  // Save game to localStorage when it ends
  useEffect(() => {
    const winner = calculateWinner(currentSquares);
    if (winner) {
      toast.success(
        <div className="toast-content">
          <span className="toast-icon">🏆</span>
          <span>{winner} wins the game!</span>
        </div>, 
        toastOptions
      );
      
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      
      // Save completed game to history
      saveGameToHistory(winner);
    } else if (currentSquares.every(square => square) && currentMove > 0) {
      toast.info(
        <div className="toast-content">
          <span className="toast-icon">🤝</span>
          <span>It's a draw!</span>
        </div>, 
        toastOptions
      );
      
      // Save draw game to history
      saveGameToHistory('Draw');
    }
  }, [currentSquares, currentMove]);
  
  // Save game to history
  function saveGameToHistory(result) {
    const gameHistory = JSON.parse(localStorage.getItem('tictactoeHistory') || '[]');
    const gameData = {
      id: Date.now(),
      date: new Date().toISOString(),
      result: result,
      moves: history,
      difficulty: difficulty,
      playingWithAI: playingWithAI
    };
    
    gameHistory.push(gameData);
    localStorage.setItem('tictactoeHistory', JSON.stringify(gameHistory));
  }
  
  useEffect(() => {
    if (playingWithAI && !xIsNext && !calculateWinner(currentSquares) && 
        !currentSquares.every(square => square)) {
      const timer = setTimeout(() => {
        toast.info(
          <div className="toast-content">
            <span className="toast-icon">🤖</span>
            <span>AI is making a move...</span>
          </div>, 
          { ...toastOptions, autoClose: 1000 }
        );
        makeAIMove();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [currentSquares, xIsNext, playingWithAI]);

  useEffect(() => {
    if (difficulty === 'easy') {
      toast.info(
        <div className="toast-content">
          <span className="toast-icon">😊</span>
          <span>Easy mode selected</span>
        </div>, 
        toastOptions
      );
    } else if (difficulty === 'medium') {
      toast.info(
        <div className="toast-content">
          <span className="toast-icon">😐</span>
          <span>Medium mode selected</span>
        </div>, 
        toastOptions
      );
    } else if (difficulty === 'hard') {
      toast.warning(
        <div className="toast-content">
          <span className="toast-icon">😈</span>
          <span>Hard mode selected - Good luck!</span>
        </div>, 
        toastOptions
      );
    }
  }, [difficulty]);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function makeAIMove() {
    const nextSquares = currentSquares.slice();
    let moveIndex;
    
    switch (difficulty) {
      case 'easy':
        moveIndex = makeRandomMove(nextSquares);
        break;
      case 'hard':
        moveIndex = makeBestMove(nextSquares);
        break;
      case 'medium':
      default:
        moveIndex = Math.random() > 0.5 ? makeBestMove(nextSquares) : makeRandomMove(nextSquares);
        break;
    }
    
    if (moveIndex !== null) {
      nextSquares[moveIndex] = 'O';
      handlePlay(nextSquares);
    }
  }
  
  function makeRandomMove(squares) {
    const emptySquares = squares
      .map((square, index) => square === null ? index : null)
      .filter(index => index !== null);
      
    if (emptySquares.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * emptySquares.length);
    return emptySquares[randomIndex];
  }
  
  function makeBestMove(squares) {
    function minimax(board, depth, isMaximizing) {
      const winner = calculateWinner(board);
      
      if (winner === 'X') return -10 + depth;
      if (winner === 'O') return 10 - depth;
      if (board.every(square => square)) return 0;
      
      if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
          if (!board[i]) {
            board[i] = 'O';
            const score = minimax(board, depth + 1, false);
            board[i] = null;
            bestScore = Math.max(score, bestScore);
          }
        }
        return bestScore;
      } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
          if (!board[i]) {
            board[i] = 'X';
            const score = minimax(board, depth + 1, true);
            board[i] = null;
            bestScore = Math.min(score, bestScore);
          }
        }
        return bestScore;
      }
    }
    
    let bestScore = -Infinity;
    let bestMove = null;
    
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        squares[i] = 'O';
        const score = minimax(squares, 0, false);
        squares[i] = null;
        
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    
    return bestMove;
  }

  function handleDifficultyChange(level) {
    setDifficulty(level);
    resetGame();
  }
  
  function toggleAIMode() {
    setPlayingWithAI(!playingWithAI);
    resetGame();
    
    toast.info(
      <div className="toast-content">
        <span className="toast-icon">{playingWithAI ? '👥' : '🤖'}</span>
        <span>Switched to {playingWithAI ? '2 Players' : 'Play vs AI'} mode</span>
      </div>, 
      toastOptions
    );
  }
  
  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    
    toast.success(
      <div className="toast-content">
        <span className="toast-icon">🔄</span>
        <span>New game started!</span>
      </div>, 
      toastOptions
    );
  }

  return (
    <div className="game-page">
      <div className="game">
        <h1 className="game-title">Tic Tac Toe</h1>
        
        <div className="game-nav">
          <button className="nav-button" onClick={() => navigate('/')}>
            <span className="nav-icon">🏠</span> Home
          </button>
          <button className="nav-button" onClick={() => navigate('/history')}>
            <span className="nav-icon">📜</span> History
          </button>
        </div>
        
        <div className="game-mode">
          <button 
            className={playingWithAI ? 'active' : ''} 
            onClick={() => setPlayingWithAI(true)}
          >
            Play vs AI
          </button>
          <button 
            className={!playingWithAI ? 'active' : ''} 
            onClick={() => setPlayingWithAI(false)}
          >
            2 Players
          </button>
        </div>
        
        {playingWithAI && (
          <div className="level-selection">
            <button 
              className={difficulty === 'easy' ? 'active' : ''} 
              onClick={() => handleDifficultyChange('easy')}
            >
              Easy
            </button>
            <button 
              className={difficulty === 'medium' ? 'active' : ''} 
              onClick={() => handleDifficultyChange('medium')}
            >
              Medium
            </button>
            <button 
              className={difficulty === 'hard' ? 'active' : ''} 
              onClick={() => handleDifficultyChange('hard')}
            >
              Hard
            </button>
          </div>
        )}
        
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        
        <div className="game-info">
          <button className="reset-button" onClick={resetGame}>New Game</button>
        </div>
      </div>
      
      <ToastContainer />
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
    </div>
  );
};

export default GamePage;
