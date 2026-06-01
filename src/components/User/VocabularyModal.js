import React from "react";
import "./VocabularyPage.scss"; 

const VocabularyModal = ({ word, onClose }) => {
  if (!word) return null;

  // Lấy dữ liệu từ word object
  const getPhonetics = () => {
    if (!word.phonetic || !Array.isArray(word.phonetic)) return null;
    
    const usPhonetic = word.phonetic.find(p => p.us)?.us;
    const ukPhonetic = word.phonetic.find(p => p.uk)?.uk;
    
    return { usPhonetic, ukPhonetic };
  };

  const getFirstMeaning = () => {
    if (!word.meanings || !Array.isArray(word.meanings) || word.meanings.length === 0) {
      return {
        partOfSpeech: '',
        meaning_vi: '',
        definition_en: '',
        examples: []
      };
    }
    
    return word.meanings[0];
  };

  const getAudioUrls = () => {
    if (!word.phonetic || !Array.isArray(word.phonetic)) return {};
    
    const usAudio = word.phonetic.find(p => p.audio_us)?.audio_us;
    const ukAudio = word.phonetic.find(p => p.audio_uk)?.audio_uk;
    const mainAudio = word.voice;
    
    return { usAudio, ukAudio, mainAudio };
  };

  const playAudio = (audioUrl) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(e => console.log("Audio play failed:", e));
    }
  };

  const phonetics = getPhonetics();
  const firstMeaning = getFirstMeaning();
  const { usAudio, ukAudio, mainAudio } = getAudioUrls();
  const hasAudio = usAudio || ukAudio || mainAudio;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header Modal */}
        <div className="modal-top-bar">
          <div className="modal-title-group">
            <div className="big-icon-circle">
              {word.image ? (
                <img 
                  src={word.image} 
                  alt={word.word}
                  className="modal-word-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.textContent = word.word?.charAt(0)?.toUpperCase() || '📚';
                  }}
                />
              ) : (
                word.word?.charAt(0)?.toUpperCase() || '📚'
              )}
            </div>
            <div>
              <h3 className="modal-word">{word.word}</h3>
              {word.level && (
                <span className="word-level-badge">{word.level}</span>
              )}
            </div>
          </div>
          <div className="modal-controls">
            <button className="icon-btn save" title="Lưu từ">
              💾
            </button>
            <button className="icon-btn close" onClick={onClose} title="Đóng">
              ✖
            </button>
          </div>
        </div>

        {/* Phát âm và audio */}
        {(phonetics || hasAudio) && (
          <div className="pronunciation-section">
            {phonetics?.usPhonetic && (
              <div className="pron-item" onClick={() => playAudio(usAudio || mainAudio)}>
                🔊 US /{phonetics.usPhonetic}/
              </div>
            )}
            
            {phonetics?.ukPhonetic && (
              <div className="pron-item" onClick={() => playAudio(ukAudio || mainAudio)}>
                🔊 UK /{phonetics.ukPhonetic}/
              </div>
            )}
            
            {!phonetics?.usPhonetic && !phonetics?.ukPhonetic && mainAudio && (
              <div className="pron-item" onClick={() => playAudio(mainAudio)}>
                🔊 Phát âm
              </div>
            )}
          </div>
        )}

        <div className="modal-scroll-content">
          {/* Action buttons */}
        

          {/* Ảnh minh họa - chỉ hiển thị nếu có ảnh hợp lệ */}
          {word.image && word.image !== 'https://example.com/images/beautiful.jpg' && (
            <div className="image-wrapper">
              <img 
                src={word.image} 
                alt={word.word} 
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Nội dung chi tiết */}
          <div className="definition-block">
            {/* Hiển thị từng meaning */}
            {word.meanings && word.meanings.map((meaning, index) => (
              <div key={meaning._id || index}>
                {meaning.partOfSpeech && (
                  <div className="pos-label">{meaning.partOfSpeech}</div>
                )}
                
                {meaning.meaning_vi && (
                  <p className="vn-mean">{meaning.meaning_vi}</p>
                )}
                
                {meaning.definition_en && (
                  <div className="eng-def-row">
                    <span className="number">{index + 1}.</span>
                    <span className="eng-text">{meaning.definition_en}</span>
                  </div>
                )}

                {/* Hiển thị examples */}
                {meaning.examples && meaning.examples.length > 0 && (
                  meaning.examples.map((example, exIndex) => (
                    <div key={exIndex} className="example-box">
                      <div className="ex-label">Ví dụ:</div>
                      <p className="ex-en">
                        {example.en
                        }
                      </p>
                      {example.vi && (
                        <p className="ex-vn">{example.vi}</p>
                      )}
                    </div>
                  ))
                )}

                {/* Hiển thị synonyms */}
                {meaning.synonyms && meaning.synonyms.length > 0 && (
                  <div className="synonyms-section">
                    <div className="ex-label">Từ đồng nghĩa:</div>
                    <div className="synonyms-tags">
                      {meaning.synonyms.map((synonym, synIndex) => (
                        <span key={synIndex} className="synonym-tag">
                          {synonym}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chỉ thêm divider nếu không phải là meaning cuối cùng */}
                {index < word.meanings.length - 1 && (
                  <div className="divider"></div>
                )}
              </div>
            ))}

            {/* Fallback nếu không có meanings */}
            {(!word.meanings || word.meanings.length === 0) && (
              <div className="no-content">
                <p>Không có thông tin chi tiết cho từ này.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocabularyModal;