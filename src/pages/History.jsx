import React, { useEffect, useState } from 'react';
import { Clock, Trash2 } from 'lucide-react';
import Header from '../components/Header';
import HistoryItem from '../components/HistoryItem';
import { getHistory, clearHistory } from '../utils/storage';

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getHistory();
      setHistory(data || []);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear your restoration history?')) {
      try {
        await clearHistory();
        await loadHistory();
      } catch (err) {
        console.error('Failed to clear history:', err);
      }
    }
  };

  return (
    <div className="history-page">
      <Header title="History" />
      
      <div className="history-content">
        {history.length > 0 ? (
          <>
            <div className="history-actions" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-danger" onClick={handleClearHistory} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Trash2 size={16} />
                Clear History
              </button>
            </div>
            <div className="history-list">
              {history.map((item, index) => (
                <HistoryItem key={index} item={item} onClick={() => {}} />
              ))}
            </div>
          </>
        ) : (
          <div className="history-empty">
            <Clock className="history-empty-icon" size={48} />
            <h2>No restoration history</h2>
            <p>Your restored photos will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
