import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-content">
        <h1 className="home-title">Tic Tac Toe</h1>
        <div className="home-subtitle">The Classic Game of X's and O's</div>
        
        <div className="home-board-preview">
          <div className="preview-row">
            <div className="preview-square x">X</div>
            <div className="preview-square"></div>
            <div className="preview-square o">O</div>
          </div>
          <div className="preview-row">
            <div className="preview-square"></div>
            <div className="preview-square x">X</div>
            <div className="preview-square"></div>
          </div>
          <div className="preview-row">
            <div className="preview-square o">O</div>
            <div className="preview-square"></div>
            <div className="preview-square x">X</div>
          </div>
        </div>
        
        <div className="home-buttons">
          <button className="home-button play-button" onClick={() => navigate('/game')}>
            <span className="button-icon">🎮</span>
            Play Game
          </button>
          <button className="home-button history-button" onClick={() => navigate('/history')}>
            <span className="button-icon">📜</span>
            Game History
          </button>
        </div>
        
        <div className="home-features">
          <div className="feature">
            <div className="feature-icon">🤖</div>
            <div className="feature-title">Play vs AI</div>
            <div className="feature-desc">Challenge our AI with multiple difficulty levels</div>
          </div>
          <div className="feature">
            <div className="feature-icon">👥</div>
            <div className="feature-title">2 Player Mode</div>
            <div className="feature-desc">Play against a friend on the same device</div>
          </div>
          <div className="feature">
            <div className="feature-icon">🏆</div>
            <div className="feature-title">Game History</div>
            <div className="feature-desc">Review your past games and results</div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default HomePage;
