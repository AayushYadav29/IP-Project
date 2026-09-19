import React from 'react';
import { CheckCircle } from 'lucide-react';

/**
 * Component to display a single history item of a processed image.
 */
const HistoryItem = ({ item, onClick }) => {
  const formattedDate = new Date(item.date).toLocaleDateString();
  const formattedTime = new Date(item.date).toLocaleTimeString();

  return (
    <div className="history-item" onClick={onClick} role="button" tabIndex={0}>
      <div className="history-thumbnail">
        <img src={item.thumbnail} alt={item.name} />
      </div>
      <div className="history-info">
        <div className="history-name">{item.name}</div>
        <div className="history-meta">{`${formattedDate} at ${formattedTime}`}</div>
        <div className="history-status">
          <CheckCircle size={12} /> {item.status}
        </div>
      </div>
    </div>
  );
};

export default HistoryItem;
