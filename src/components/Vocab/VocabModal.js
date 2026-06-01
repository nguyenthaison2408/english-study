import React, { useRef } from 'react';
import logo from '../../assets/logo5.png';

const VocabModal = ({ word, onClose }) => {
  const audioRef = useRef(null);
  if (!word) return null;

  const term = word.word;
  const image = word.image;
  const meanings = word.meanings || [];


  const usText =
    word.phonetic?.us ||
    word.phonetic ||
    word.phonetics?.[0]?.text;

  const ukText = word.phonetic?.uk || usText;

  
 const getAudioUrl = (accent) => {
 
  const audioKey = accent === 'us' ? 'audio-us' : 'audio-uk';
  const audioFromDb = word.phonetic?.[audioKey];

  if (audioFromDb && audioFromDb.startsWith('http')) {
    return audioFromDb;
  }

 
  if (Array.isArray(word.phonetics)) {
    const found = word.phonetics.find(p =>
      p.audio?.includes(`-${accent}`)
    );
    if (found?.audio) return found.audio;
  }


  return `https://api.dictionaryapi.dev/media/pronunciations/en/${word.word}-${accent}.mp3`;
};


  const playAudio = (accent) => {
    const url = getAudioUrl(accent);
    if (!url) return;

    if (audioRef.current) audioRef.current.pause();
    audioRef.current = new Audio(url);
    audioRef.current.play().catch(() => {
      console.log('Audio not available:', url);
    });
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content rounded-4">

          {/* HEADER */}
          <div className="modal-header bg-primary text-white">
            <h3 className="modal-title fw-bold">{term}</h3>
            <button className="btn-close btn-close-white" onClick={onClose} />
          </div>

          {/* BODY */}
          <div className="modal-body p-4">

            {/* PRONUNCIATION */}
            <div className="d-flex gap-3 mb-4">
              {usText && (
                <span
                  className="badge bg-success fs-6 px-3 py-2"
                  style={{ cursor: 'pointer' }}
                  onClick={() => playAudio('us')}
                >
                  🔊 US {usText}
                </span>
              )}
              {ukText && (
                <span
                  className="badge bg-info fs-6 px-3 py-2"
                  style={{ cursor: 'pointer' }}
                  onClick={() => playAudio('uk')}
                >
                  🔊 UK {ukText}
                </span>
              )}
            </div>

            {/* IMAGE */}
            {image && (
              <div className="text-center mb-4">
                <img
                  src={image === 'logo' ? logo : image}
                  alt={term}
                  className="img-fluid rounded"
                  style={{ maxHeight: 200 }}
                />
              </div>
            )}

            {/* MEANINGS */}
            {meanings.map((m, i) => (
              <div key={i} className="mb-4">
                <h5 className="text-primary">{m.partOfSpeech}</h5>
                <p><strong>{m.meaning_vi}</strong></p>
                <p className="fst-italic text-muted">{m.definition_en}</p>

                {m.examples?.map((ex, j) => (
                  <div key={j} className="ms-3">
                    • <strong>{ex.en}</strong>
                    <div className="text-muted fst-italic">{ex.vi}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={onClose}>
              Đóng
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VocabModal;
