import React, { useState, useEffect, useRef } from 'react';
import { 
  FaArrowLeft, FaClock, FaCog, FaListUl, 
  FaPlay, FaPause, FaUndo, FaRedo, FaStepBackward, FaStepForward, 
  FaHeart, FaPen, FaExclamationTriangle, FaChevronDown, FaCheck, FaTimes 
} from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom'; 
import './Part3Detail.scss'; 

// --- DỮ LIỆU MOCK (13 Đoạn hội thoại, mỗi đoạn 3 câu) ---
const generateMockData = () => {
  const data = [];
  let currentQuestionId = 32; 

  for (let i = 0; i < 13; i++) {
    const questions = [];
    for (let j = 0; j < 3; j++) {
      questions.push({
        qId: currentQuestionId,
        text: `What does the speaker imply about the project timeline?`, 
        correctAnswer: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)],
        options: [
          { key: "A", text: "It will be delayed." },
          { key: "B", text: "It is ahead of schedule." },
          { key: "C", text: "It needs more funding." },
          { key: "D", text: "It is completed." }
        ]
      });
      currentQuestionId++;
    }
    data.push({
      id: i, // Index của đoạn hội thoại
      questions: questions
    });
  }
  return data;
};

const MOCK_DATA_PART3 = generateMockData();
const SAMPLE_AUDIO_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

const Part3Detail = () => {
  const { id } = useParams();
  
  // State quản lý
  const [currentGroupIdx, setCurrentGroupIdx] = useState(0); // Index đoạn hội thoại hiện tại
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
  }, []); // Chỉ chạy 1 lần khi mount (hoặc thêm dependency nếu đổi file audio theo conversation)

  // --- 2. AUDIO HANDLERS ---
  const formatTime = (time) => {
    if (!time || isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handlePlayPause = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(err => console.error(err));
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const skipTime = (val) => {
    audioRef.current.currentTime += val;
  };

  // --- 3. LOGIC CÂU HỎI ---
  const currentConversation = MOCK_DATA_PART3[currentGroupIdx];
  const firstQ = currentConversation.questions[0].qId;
  const lastQ = currentConversation.questions[2].qId;

  const handleSelect = (qId, key) => {
    setUserAnswers(prev => ({ ...prev, [qId]: key }));
  };

  const handleNext = () => {
    if (currentGroupIdx < MOCK_DATA_PART3.length - 1) {
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
    <div className="part3-detail-page">
      {/* HEADER */}
      <header className="quiz-header">
        <div className="header-left">
          <Link to="/toeic/part3" className="back-icon"><FaArrowLeft /></Link>
          <span className="question-title">
             Short Conversations {String(id).padStart(2,'0')} : Questions {firstQ}-{lastQ}
          </span>
        </div>
        <div className="header-right">
          <div className="timer"><FaClock /> <span>38:47</span></div>
          <FaCog className="icon-btn" />
          <FaListUl className="icon-btn" />
          <span className="sidebar-toggle" onClick={() => setShowSidebar(!showSidebar)}>
            {showSidebar ? "Ẩn Sidebar" : "Hiện Sidebar"}
          </span>
        </div>
      </header>

      {/* BODY CONTENT */}
      <div className="quiz-body">
        
        {/* DANH SÁCH 3 CÂU HỎI */}
        <div className={`questions-container ${showSidebar ? 'shrink' : ''}`}>
           {currentConversation.questions.map((q) => {
             const userChoice = userAnswers[q.qId];
             
             return (
             <div key={q.qId} className="question-block">
                <div className="question-header">
                   <span>{q.qId}. {q.text}</span>
                   <FaChevronDown />
                </div>
                
                <div className="options-list">
                   {q.options.map((opt) => {
                       const isSelected = userChoice === opt.key;
                       const isCorrect = opt.key === q.correctAnswer;
                       
                       // Logic Class CSS
                       let itemClass = "option-item";
                       if (isSelected) {
                           itemClass += isCorrect ? " selected-correct" : " selected-wrong";
                       } else if (userChoice && isCorrect) {
                           // Nếu đã chọn (sai) thì hiện gợi ý đáp án đúng
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

        {/* SIDEBAR */}
        {showSidebar && (
            <div className="column-sidebar" style={{width: '320px', flexShrink: 0}}>
               <div className="sidebar-title" style={{padding:'15px', borderBottom:'1px solid #eee', fontWeight:'bold'}}>
                   Questions Palette
               </div>
               <div className="sidebar-grid" style={{padding:'15px', display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:'8px'}}>
                   {/* Hiển thị toàn bộ câu từ 32 -> 70 */}
                   {Array.from({length: 39}, (_, i) => i + 32).map(num => {
                       const isAnswered = !!userAnswers[num];
                       // Highlight các câu đang hiển thị trên màn hình
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

      {/* FOOTER AUDIO PLAYER */}
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
            
            <button className="nav-arrow" onClick={handleNext} disabled={currentGroupIdx === MOCK_DATA_PART3.length - 1} style={{opacity: currentGroupIdx===MOCK_DATA_PART3.length-1 ? 0.5 : 1}}>
                <FaStepForward />
            </button>
         </div>
      </footer>
    </div>
  );
};

export default Part3Detail;