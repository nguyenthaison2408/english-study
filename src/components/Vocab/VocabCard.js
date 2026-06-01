import React from 'react';
import './Vocab.scss';

const VocabCard = ({ word, onClick }) => {
  const { word: term, meanings } = word;
  const shortMeaning = meanings[0]?.meaning_vi?.split(', ')[0] || '—';

  return (
    <div 
      className="vocab-card-custom" 
      onClick={() => onClick(word)}
    >
      <div className="card-img-wrapper">
        {word.image && word.image !== "logo" ? (
          <img src={word.image} alt={term} />
        ) : (
          <span style={{ fontSize: '12px', color: '#e64a19' }}>IMG</span>
        )}
      </div>

      <h3 className="card-word">{term}</h3>

      <div className="card-meaning">
        <span>{shortMeaning}</span>
      </div>
    </div>
  );
};

export default VocabCard;