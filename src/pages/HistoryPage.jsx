import React from 'react';
import { useNavigate } from 'react-router-dom';
import History from '../components/History';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HistoryPage = () => {
  const navigate = useNavigate();

  return (
    <div className="history-page">
      <div className="history-page-nav">
        <button className="nav-button" onClick={() => navigate('/')}>
          <span className="nav-icon">🏠</span> Home
        </button>
        <button className="nav-button" onClick={() => navigate('/game')}>
          <span className="nav-icon">🎮</span> Play Game
        </button>
      </div>
      
      <History />
      <ToastContainer />
    </div>
  );
};

export default HistoryPage;
