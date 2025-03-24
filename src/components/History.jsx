import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const History = () => {
  const navigate = useNavigate();
  const [gameHistory, setGameHistory] = useState([]);
  const [expandedGame, setExpandedGame] = useState(null);

  useEffect(() => {
    // Load game history from localStorage
    const savedHistory = JSON.parse(localStorage.getItem('tictactoeHistory') || '[]');
    setGameHistory(savedHistory.reverse()); // Show newest games first
  }, []);

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all game history?')) {
      localStorage.removeItem('tictactoeHistory');
      setGameHistory([]);
      toast.success(
        <div className="toast-content">
          <span className="toast-icon">🗑️</span>
          <span>Game history cleared!</span>
        </div>
      );
    }
  };

  const toggleExpandGame = (gameId) => {
    if (expandedGame === gameId) {
      setExpandedGame(null);
    } else {
      setExpandedGame(gameId);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const renderBoardPreview = (moves) => {
    // Get the final board state from the last move
    const finalBoard = moves[moves.length - 1];
    
    return (
      <div className="history-board-preview">
        {[0, 1, 2].map(row => (
          <div key={row} className="history-board-row">
            {[0, 1, 2].map(col => {
              const index = row * 3 + col;
              const value = finalBoard[index];
              return (
                <div 
                  key={index} 
                  className={`history-board-cell ${value ? value.toLowerCase() : ''}`}
                >
                  {value}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="history-container">
      <div className="history-header">
        <h2 className="history-title">Game History</h2>
        <div className="history-actions">
          <button className="history-action-btn" onClick={() => navigate('/game')}>
            <span>🎮</span> Play Game
          </button>
          {gameHistory.length > 0 && (
            <button className="history-action-btn clear" onClick={clearHistory}>
              <span>🗑️</span> Clear History
            </button>
          )}
        </div>
      </div>

      {gameHistory.length === 0 ? (
        <div className="no-history">
          <div className="no-history-icon">📜</div>
          <div className="no-history-text">No game history yet</div>
          <button className="play-now-btn" onClick={() => navigate('/game')}>
            <span className="play-now-icon">🎮</span> Play Now
          </button>
        </div>
      ) : (
        <div className="history-list">
          {gameHistory.map((game) => (
            <div 
              key={game.id} 
              className="history-item" 
              onClick={() => toggleExpandGame(game.id)}
            >
              <div className="history-item-header">
                <div className="history-date">{formatDate(game.date)}</div>
                <div className={`history-result ${game.result === 'X' ? 'x-win' : game.result === 'O' ? 'o-win' : 'draw'}`}>
                  {game.result === 'X' ? 'Player X Won' : 
                   game.result === 'O' ? (game.playingWithAI ? 'AI Won' : 'Player O Won') : 
                   'Draw'}
                </div>
              </div>
              <div className="history-details">
                <div className="history-mode">
                  <span className="history-mode-icon">
                    {game.playingWithAI ? '🤖' : '👥'}
                  </span>
                  {game.playingWithAI ? `AI (${game.difficulty})` : '2 Players'}
                </div>
                <div className="history-moves">
                  {game.moves.length - 1} moves
                </div>
              </div>
              
              {expandedGame === game.id && renderBoardPreview(game.moves)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;