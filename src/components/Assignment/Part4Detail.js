import React, { useState, useEffect, useRef } from 'react';
import { 
  FaArrowLeft, FaClock, FaCog, FaListUl, 
  FaPlay, FaPause, FaUndo, FaRedo, FaStepBackward, FaStepForward, 
  FaHeart, FaPen, FaExclamationTriangle, FaChevronDown, FaCheck, FaTimes 
} from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom'; 
import './Part4Detail.scss'; 

// --- DỮ LIỆU MOCK (10 Bài nói, mỗi bài 3 câu -> 30 câu: 71-100) ---
const generatePart4Data = () => {
  const data = [];
  let currentQ = 71; 
  
  for (let i = 0; i < 10; i++) {
    // Giả lập: 2 bài cuối (index 8, 9) sẽ có hình ảnh minh họa (Graphic)
    const hasGraphic = i >= 8; 
    
    const group = {
      id: i,
      hasGraphic: hasGraphic, 
      // Ảnh biểu đồ/bảng biểu mẫu
      graphicImg: hasGraphic ? "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80" : null,
      questions: []
    };

    for (let j = 0; j < 3; j++) {
      group.questions.push({
        qId: currentQ,
        text: `Question ${currentQ}: What does the speaker imply about the schedule change?`,
        correctAnswer: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)],
        options: [
          { key: "A", text: "The event will start later." },
          { key: "B", text: "The location has been moved." },
          { key: "C", text: "More staff is needed." },
          { key: "D", text: "Tickets are sold out." }
        ]
      });
      currentQ++;
    }
    data.push(group);
  }
  return data;
};

const MOCK_DATA_PART4 = generatePart4Data();
const SAMPLE_AUDIO_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

const Part4Detail = () => {
  const { id } = useParams();
  
  // State quản lý
  const [currentGroupIdx, setCurrentGroupIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); 
  const [showSidebar, setShowSidebar] = useState(false);

  // State Audio
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  // --- 1. SETUP AUDIO ---
  useEffect(() => {
    audioRef.current = new Audio(SAMPLE_AUDIO_URL);
    const audio = audioRef.current;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  // --- 2. AUDIO HANDLERS ---
  const formatTime = (time) => {
    if (!time || isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handlePlayPause = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(e => console.error(e));
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const val = Number(e.target.value);
    audioRef.current.currentTime = val;
    setCurrentTime(val);
  };

  const skipTime = (val) => {
    audioRef.current.currentTime += val;
  };

  // --- 3. LOGIC CÂU HỎI ---
  const currentTalk = MOCK_DATA_PART4[currentGroupIdx];
  const firstQ = currentTalk.questions[0].qId;
  const lastQ = currentTalk.questions[2].qId;

  const handleSelect = (qId, key) => {
    setUserAnswers(prev => ({ ...prev, [qId]: key }));
  };

  const handleNext = () => {
    if (currentGroupIdx < MOCK_DATA_PART4.length - 1) {
        setCurrentGroupIdx(prev => prev + 1);
        document.querySelector('.quiz-body')?.scrollTo({top: 0, behavior: 'smooth'});
    }
  };
  
  const handlePrev = () => {
    if (currentGroupIdx > 0) {
        setCurrentGroupIdx(prev => prev - 1);
        document.querySelector('.quiz-body')?.scrollTo({top: 0, behavior: 'smooth'});
    }
  };

  return (
    <div className="part4-detail-page">
      {/* HEADER */}
      <header className="quiz-header">
        <div className="header-left">
          <Link to="/toeic/part4" className="back-icon"><FaArrowLeft /></Link>
          <span className="question-title">
             Short Talks {String(id).padStart(2,'0')} : Q{firstQ}-{lastQ}
          </span>
        </div>
        <div className="header-right">
          <div className="timer"><FaClock /> <span>45:00</span></div>
          <FaCog className="icon-btn" />
          <FaListUl className="icon-btn" />
          <span className="sidebar-toggle" onClick={() => setShowSidebar(!showSidebar)}>
             {showSidebar ? "Ẩn Sidebar" : "Hiện Sidebar"}
          </span>
        </div>
      </header>

      {/* BODY */}
      <div className="quiz-body">
        
        {/* VÙNG CHỨA NỘI DUNG (Layout Flex) 
            - Nếu có Graphic: Chia đôi (layout-split)
            - Nếu không: Căn giữa (layout-center)
            - Nếu bật sidebar: Co lại một chút
        */}
        <div className={`content-wrapper ${currentTalk.hasGraphic ? 'layout-split' : 'layout-center'} ${showSidebar ? 'sidebar-active' : ''}`}>
            
            {/* 1. KHUNG ẢNH (Bên Trái) - Chỉ hiện nếu hasGraphic = true */}
            {currentTalk.hasGraphic && (
                <div className="static-panel-graphic">
                    <div className="panel-header green-header">
                        <span>Refer to this graphic</span>
                        <FaChevronDown />
                    </div>
                    <div className="graphic-image-container">
                        <img src={currentTalk.graphicImg} alt="Graphic Reference" />
                    </div>
                </div>
            )}

            {/* 2. KHUNG CÂU HỎI (Bên Phải hoặc Giữa) */}
            <div className="scrollable-question-card">
                <div className="questions-inner">
                    {currentTalk.questions.map((q) => {
                        const userChoice = userAnswers[q.qId];
                        return (
                        <div key={q.qId} className="question-block">
                            <div className="panel-header blue-header">
                                <span>{q.qId}. {q.text}</span>
                            </div>
                            <div className="options-list">
                                {q.options.map((opt) => {
                                    const isSelected = userChoice === opt.key;
                                    const isCorrect = opt.key === q.correctAnswer;
                                    
                                    // CSS Classes logic
                                    let itemClass = "option-item";
                                    if (isSelected) {
                                        itemClass += isCorrect ? " selected-correct" : " selected-wrong";
                                    } else if (userChoice && isCorrect) {
                                        itemClass += " show-correct-hint";
                                    }

                                    return (
                                        <div key={opt.key} className={itemClass} onClick={() => handleSelect(q.qId, opt.key)}>
                                            <div className="radio-circle">
                                                {isSelected && <div className="dot"></div>}
                                            </div>
                                            <div className="opt-content">
                                                <span className="opt-key">{opt.key}.</span>
                                                <span className="opt-text">{opt.text}</span>
                                            </div>
                                            {isSelected && !isCorrect && <FaTimes className="status-icon wrong" />}
                                            {(isSelected && isCorrect) && <FaCheck className="status-icon correct" />}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )})}
                </div>
            </div>

        </div>

        {/* Sidebar */}
        {showSidebar && (
            <div className="column-sidebar" style={{width: '320px', flexShrink: 0}}>
               <div className="sidebar-title" style={{padding:'15px', borderBottom:'1px solid #eee', fontWeight:'bold'}}>
                   Questions Palette (71-100)
               </div>
               <div className="sidebar-grid" style={{padding:'15px', display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:'8px'}}>
                   {/* Hiển thị toàn bộ câu từ 71 -> 100 */}
                   {Array.from({length: 30}, (_, i) => i + 71).map(num => {
                       const isAnswered = !!userAnswers[num];
                       const isCurrentView = num >= firstQ && num <= lastQ;
                       
                       return (
                           <div key={num} style={{
                               height:'35px', display:'flex', alignItems:'center', justifyContent:'center',
                               borderRadius:'6px', fontSize:'0.85rem', cursor:'pointer',
                               border: isCurrentView ? '2px solid #4f46e5' : '1px solid #e5e7eb',
                               background: isAnswered ? '#eff6ff' : 'white',
                               color: isAnswered ? '#1d4ed8' : '#374151',
                               fontWeight: isAnswered || isCurrentView ? 'bold' : 'normal'
                           }}>
                               {num}
                           </div>
                       )
                   })}
               </div>
            </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="quiz-footer">
        <div className="audio-row-top">
            <div className="audio-controls">
               <FaUndo className="control-small" onClick={() => skipTime(-5)} title="-5s" style={{cursor:'pointer'}}/>
               
               <button className="btn-play" onClick={handlePlayPause}>
                  {isPlaying ? <FaPause /> : <FaPlay style={{marginLeft:'2px'}} />}
               </button>
               
               <FaRedo className="control-small" onClick={() => skipTime(5)} title="+5s" style={{cursor:'pointer'}}/>
            </div>
            <div className="audio-progress">
               <input 
                 type="range" 
                 min="0" 
                 max={duration || 100} 
                 value={currentTime} 
                 onChange={handleSeek}
                 style={{cursor:'pointer'}}
               />
               <span className="time-tag">{formatTime(currentTime)} / {formatTime(duration)}</span>
            </div>
            <div className="speed-text">1x</div>
         </div>
         
         <div className="audio-row-bottom">
            <button className="nav-arrow" onClick={handlePrev} disabled={currentGroupIdx === 0} style={{opacity: currentGroupIdx===0 ? 0.5 : 1}}>
                <FaStepBackward />
            </button>
            <div className="center-icons">
                <FaHeart /> <FaPen /> <FaExclamationTriangle />
            </div>
            <button className="nav-arrow" onClick={handleNext} disabled={currentGroupIdx === MOCK_DATA_PART4.length - 1} style={{opacity: currentGroupIdx===MOCK_DATA_PART4.length-1 ? 0.5 : 1}}>
                <FaStepForward />
            </button>
         </div>
      </footer>
    </div>
  );
};

export default Part4Detail;