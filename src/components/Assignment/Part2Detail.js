import React, { useState, useEffect, useRef } from 'react';
import { 
  FaArrowLeft, FaClock, FaCog, FaListUl, 
  FaPlay, FaPause, FaUndo, FaRedo, FaStepBackward, FaStepForward, 
  FaHeart, FaPen, FaExclamationTriangle, FaChevronDown, FaCheck, FaTimes 
} from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom'; 
import './Part2Detail.scss'; // Style riêng cho Part 2

// DỮ LIỆU GIẢ LẬP PART 2 (Question & Response)
const MOCK_DATA_PART2 = [
  {
    id: 1, 
    questionNum: 7,
    correctAnswer: "A",
    options: [
      { key: "A", text: "He's in the meeting room." },
      { key: "B", text: "It starts at 9 AM." },
      { key: "C", text: "Yes, I did." }
    ]
  },
  {
    id: 2,
    questionNum: 8,
    correctAnswer: "C",
    options: [
      { key: "A", text: "By bus, I think." },
      { key: "B", text: "It's on the second floor." },
      { key: "C", text: "Mr. Smith is managing it." }
    ]
  },
  {
    id: 3,
    questionNum: 9,
    correctAnswer: "B",
    options: [
      { key: "A", text: "No, thanks." },
      { key: "B", text: "It's near the park." },
      { key: "C", text: "Tomorrow morning." }
    ]
  }
];

// Link Audio mẫu (Dùng chung hoặc đổi link khác tùy ý)
const SAMPLE_AUDIO_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

const Part2Detail = () => {
  const { id } = useParams();
  
  // State quản lý câu hỏi & đáp án
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); 
  const [showSidebar, setShowSidebar] = useState(false);

  // --- AUDIO STATE ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Ref chứa đối tượng Audio
  const audioRef = useRef(null);

  // --- 1. KHỞI TẠO AUDIO ---
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

  // --- 2. CÁC HÀM XỬ LÝ AUDIO ---
  const formatTime = (time) => {
    if (!time || isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(err => console.error("Audio Error:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const newTime = Number(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skipTime = (seconds) => {
    if (audioRef.current) {
        audioRef.current.currentTime += seconds;
    }
  };

  // --- 3. LOGIC CÂU HỎI ---
  const currentQuestion = MOCK_DATA_PART2[currentQIdx];
  const currentSelected = userAnswers[currentQIdx];

  const handleSelect = (key) => {
    setUserAnswers(prev => ({ ...prev, [currentQIdx]: key }));
  };

  const handleNext = () => {
    if (currentQIdx < MOCK_DATA_PART2.length - 1) setCurrentQIdx(prev => prev + 1);
  };
  
  const handlePrev = () => {
    if (currentQIdx > 0) setCurrentQIdx(prev => prev - 1);
  };

  return (
    <div className="part2-detail-page">
      {/* HEADER */}
      <header className="quiz-header">
        <div className="header-left">
          <Link to="/toeic/part2" className="back-icon"><FaArrowLeft /></Link>
          <span className="question-title">
             Question & Response {String(id).padStart(2,'0')} - Question {currentQuestion.questionNum}
          </span>
        </div>
        <div className="header-right">
          <div className="timer">
            <FaClock /> <span>24:52</span>
          </div>
          <FaCog className="icon-btn" />
          <FaListUl className="icon-btn" />
          <span 
            className="sidebar-toggle" 
            onClick={() => setShowSidebar(!showSidebar)}
            style={{cursor: 'pointer', fontSize:'0.9rem', marginLeft:'10px'}}
          >
            {showSidebar ? "Ẩn Sidebar" : "Hiện Sidebar"}
          </span>
        </div>
      </header>

      {/* BODY */}
      <div className="quiz-body">
        {/* Cột Câu hỏi: Chiếm full nếu ẩn sidebar, co lại nếu hiện sidebar */}
        <div className={`column-question-full ${showSidebar ? 'shrink' : ''}`}>
          <div className="panel-header blue-header">
            <span>{currentQuestion.questionNum}.</span>
            <FaChevronDown />
          </div>
          
          <div className="answers-list">
            {currentQuestion.options.map((opt) => {
               const isSelected = currentSelected === opt.key;
               const isCorrect = opt.key === currentQuestion.correctAnswer;
               
               // Logic class CSS
               let itemClass = "answer-item";
               if (isSelected) {
                   if (isCorrect) itemClass += " selected-correct";
                   else itemClass += " selected-wrong";
               } else if (currentSelected && isCorrect) {
                   itemClass += " show-correct-hint";
               }

               return (
                <div key={opt.key} className={itemClass} onClick={() => handleSelect(opt.key)}>
                  <div className="radio-circle">
                      {isSelected && <div className="dot"></div>}
                  </div>
                  <div className="answer-content">
                    <span className="opt-key">{opt.key}</span>
                    {/* Part 2 thường ẩn text, nếu muốn hiện thì bỏ comment dòng dưới */}
                    {/* <span className="opt-text" style={{marginLeft:'10px', color:'#555'}}>{opt.text}</span> */}
                  </div>

                  {isSelected && !isCorrect && <FaTimes className="status-icon wrong" />}
                  {(isSelected && isCorrect) && <FaCheck className="status-icon correct" />}
                </div>
               );
            })}
          </div>
        </div>

        {/* Sidebar */}
        {showSidebar && (
            <div className="column-sidebar" style={{width: '300px', marginLeft: '20px'}}>
            <div className="sidebar-buttons">
                <button className="btn-outline">Cài đặt</button>
                <button className="btn-fill">Bảng câu hỏi</button>
            </div>
            <div className="comment-box">
                <div className="panel-header purple-header">
                    <span>Bình luận chung</span>
                    <FaChevronDown />
                </div>
                <div className="comment-content" style={{padding:'15px', color:'#666'}}>
                    Chưa có bình luận nào cho câu hỏi này.
                </div>
            </div>
            </div>
        )}
      </div>

      {/* FOOTER PLAYER (Đã cập nhật logic Audio) */}
      <footer className="quiz-footer">
        <div className="audio-row-top">
            <div className="audio-controls">
               <FaUndo className="control-small" onClick={() => skipTime(-5)} title="-5s" style={{cursor:'pointer'}}/>
               
               <button className="btn-play" onClick={handlePlayPause}>
                  {isPlaying ? <FaPause /> : <FaPlay style={{marginLeft:'2px'}}/>}
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
                  style={{cursor: 'pointer'}}
               />
               <span className="time-tag">{formatTime(currentTime)} / {formatTime(duration)}</span>
            </div>
            <div className="speed-text">1x</div>
         </div>

         <div className="audio-row-bottom">
            <button className="nav-arrow" onClick={handlePrev} disabled={currentQIdx===0} style={{opacity: currentQIdx===0 ? 0.5 : 1}}>
                <FaStepBackward />
            </button>
            <div className="center-icons">
               <FaHeart /> <FaPen /> <FaExclamationTriangle />
            </div>
            <button className="nav-arrow" onClick={handleNext} disabled={currentQIdx===MOCK_DATA_PART2.length-1} style={{opacity: currentQIdx===MOCK_DATA_PART2.length-1 ? 0.5 : 1}}>
                <FaStepForward />
            </button>
         </div>
      </footer>
    </div>
  );
};

export default Part2Detail;