import React, { useState, useEffect, useRef } from 'react';
import { 
  FaArrowLeft, FaClock, FaListUl, 
  FaStepBackward, FaStepForward, FaPlay, FaPause 
} from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom'; 
import { motion, AnimatePresence } from "framer-motion"; 
import './FullTestDetail.scss'; 

// MP3 MẪU CHO FULL TEST
const TEST_AUDIO_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

// --- HÀM SINH DỮ LIỆU MOCK 200 CÂU ---
const generateFullTest = () => {
  const slides = [];
  
  // PART 1 (Q1-Q6)
  for (let i = 1; i <= 6; i++) {
    slides.push({
      type: 'part1', partName: 'Part 1: Photographs',
      qId: i,
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800",
      questions: [{ qId: i, text: "Select the best description.", options: ["A", "B", "C", "D"] }]
    });
  }
  // PART 2 (Q7-Q31)
  for (let i = 7; i <= 31; i++) {
    slides.push({
      type: 'part2', partName: 'Part 2: Q & R',
      qId: i,
      questions: [{ qId: i, text: "Listen and choose the best response.", options: ["A", "B", "C"] }]
    });
  }
  // PART 3 (Q32-Q70)
  for (let i = 32; i <= 70; i += 3) {
    slides.push({
      type: 'part3', partName: 'Part 3: Conversations',
      questions: [0, 1, 2].map(offset => ({
        qId: i + offset, text: `Question ${i+offset}: What does the man imply?`, options: ["A", "B", "C", "D"]
      }))
    });
  }
  // PART 4 (Q71-Q100)
  for (let i = 71; i <= 100; i += 3) {
    const hasGraphic = i >= 95;
    slides.push({
      type: 'part4', partName: 'Part 4: Short Talks',
      graphic: hasGraphic ? "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600" : null,
      questions: [0, 1, 2].map(offset => ({
        qId: i + offset, text: `Question ${i+offset}: What is the speaker discussing?`, options: ["A", "B", "C", "D"]
      }))
    });
  }
  // PART 5 (Q101-Q130)
  for (let i = 101; i <= 130; i++) {
    slides.push({
      type: 'part5', partName: 'Part 5: Incomplete Sentences',
      qId: i,
      questions: [{ qId: i, text: `Question ${i}: The manager ______ the report yesterday.`, options: ["submitted", "submit", "submission", "submitting"] }]
    });
  }
  // PART 6 (Q131-Q146)
  for (let i = 131; i <= 146; i += 4) {
    slides.push({
      type: 'part6', partName: 'Part 6: Text Completion',
      passageTitle: "Memorandum / Email",
      passageContent: `<p><strong>To:</strong> All Staff<br/>This is a mock passage for questions ${i}-${i+3}.</p>`,
      questions: [0, 1, 2, 3].map(offset => ({ qId: i + offset, text: `Question ${i+offset}: Select best answer.`, options: ["A", "B", "C", "D"] }))
    });
  }
  // PART 7 (Q147-Q200) - Rút gọn cho ngắn code demo
  for (let i = 147; i <= 200; i++) {
     slides.push({
        type: 'part7', partName: 'Part 7: Reading Comprehension',
        passageTitle: "Reading Passage",
        passageContent: `<p>Reading text for Question ${i}...</p>`,
        questions: [{ qId: i, text: `Question ${i}: What is indicated?`, options: ["A","B","C","D"] }]
     });
  }

  return slides;
};

const TEST_DATA = generateFullTest();

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? 500 : -500, opacity: 0 }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (direction) => ({ zIndex: 0, x: direction < 0 ? 500 : -500, opacity: 0 })
};

const FullTestDetail = () => {
  const { id } = useParams();
  const [[currentSlideIdx, direction], setPage] = useState([0, 0]); 
  const [userAnswers, setUserAnswers] = useState({}); 
  const [showSidebar, setShowSidebar] = useState(false);
  
  // --- AUDIO LOGIC ---
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Khởi tạo audio
    audioRef.current = new Audio(TEST_AUDIO_URL);
    audioRef.current.onended = () => setIsPlaying(false);
    
    // Cleanup
    return () => {
        if(audioRef.current) audioRef.current.pause();
    }
  }, []);

  const toggleAudio = () => {
    if(!audioRef.current) return;
    if (isPlaying) {
        audioRef.current.pause();
    } else {
        audioRef.current.play().catch(e => console.error(e));
    }
    setIsPlaying(!isPlaying);
  };

  const currentSlide = TEST_DATA[currentSlideIdx];

  if (!currentSlide) return <div style={{padding: 50, textAlign:'center'}}>Loading Test Data...</div>;

  const paginate = (newDirection) => {
    const nextIndex = currentSlideIdx + newDirection;
    if (nextIndex >= 0 && nextIndex < TEST_DATA.length) {
      setPage([nextIndex, newDirection]);
    }
  };

  const handleSelect = (qId, key) => {
    setUserAnswers(prev => ({ ...prev, [qId]: key }));
  };

  // Render Component Helpers
  const renderSingleQuestionCard = (q) => (
    <div className="question-card-single">
        <div className="panel-header blue-header"><span>{q.qId}. {q.text}</span></div>
        <div className="options-list">
            {q.options.map(opt => {
                const isSelected = userAnswers[q.qId] === opt;
                return (
                    <div key={opt} className={`option-item ${isSelected?'selected':''}`} onClick={() => handleSelect(q.qId, opt)}>
                        <div className="radio-circle">{isSelected && <div className="dot"></div>}</div>
                        <span className="opt-text">{opt}</span>
                    </div>
                )
            })}
        </div>
    </div>
  );

  const renderGroupQuestions = (questions) => (
    <div className="group-card">
        <div className="card-header blue-header">Questions {questions[0].qId}-{questions[questions.length-1].qId}</div>
        <div className="card-scroll-content">
            {questions.map((q, index) => (
                <div key={q.qId} className="question-item-block">
                    <div className="q-title"><span className="q-num">{q.qId}.</span> {q.text}</div>
                    <div className="options-list">
                        {q.options.map(opt => (
                            <div key={opt} className={`option-item ${userAnswers[q.qId]===opt?'selected':''}`} onClick={() => handleSelect(q.qId, opt)}>
                                <div className="radio-circle">{userAnswers[q.qId]===opt && <div className="dot"></div>}</div>
                                <span className="opt-text">{opt}</span>
                            </div>
                        ))}
                    </div>
                    {index < questions.length - 1 && <div className="divider"></div>}
                </div>
            ))}
        </div>
    </div>
  );

  const renderSlideContent = () => {
    const { type, questions, image, graphic, passageContent, passageTitle } = currentSlide;
    if (type === 'part1') return (
        <div className="layout-part1">
            <div className="image-box"><div className="panel-header green-header"><span>Photograph</span></div><img src={image} alt="Part 1" /></div>
            <div className="question-box">{renderSingleQuestionCard(questions[0])}</div>
        </div>
    );
    if (type === 'part2' || type === 'part5') return (<div className="layout-single-center">{renderSingleQuestionCard(questions[0])}</div>);
    if (type === 'part3' || type === 'part4') return (
        <div className={`layout-split ${graphic ? 'has-graphic' : ''}`}>
            {graphic && (<div className="left-panel"><div className="panel-header green-header"><span>Graphic</span></div><img src={graphic} alt="Graphic" className="graphic-img"/></div>)}
            <div className="right-panel-group">{renderGroupQuestions(questions)}</div>
        </div>
    );
    if (type === 'part6' || type === 'part7') return (
        <div className="layout-split">
            <div className="left-panel">
                <div className="panel-header green-header"><span>{passageTitle}</span></div>
                <div className="passage-content" dangerouslySetInnerHTML={{__html: passageContent}}></div>
            </div>
            <div className="right-panel-group">{renderGroupQuestions(questions)}</div>
        </div>
    );
  };

  return (
    <div className="full-test-page">
      <header className="test-header">
        <div className="header-left">
          <Link to="/test-full" className="back-btn"><FaArrowLeft /></Link>
          <span className="test-title">L&R Test {String(id).padStart(2,'0')} - {currentSlide.partName}</span>
        </div>
        <div className="header-right">
          <div className="timer"><FaClock /> <span>01:59:45</span></div>
          <FaListUl className="icon-btn" onClick={() => setShowSidebar(!showSidebar)} />
        </div>
      </header>

      <div className="test-body">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div 
                key={currentSlideIdx} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit"
                transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                className="slide-container"
            >
                {renderSlideContent()}
            </motion.div>
        </AnimatePresence>

        {showSidebar && (
            <div className="question-palette">
                <div className="palette-grid">
                    {Array.from({length: 200}, (_,i) => i+1).map(num => (
                        <div key={num} className={`p-item ${userAnswers[num] ? 'filled' : ''}`}>{num}</div>
                    ))}
                </div>
            </div>
        )}
      </div>

      <footer className="test-footer">
         <div className="nav-row">
            <button className="nav-btn" onClick={() => paginate(-1)} disabled={currentSlideIdx === 0}><FaStepBackward /> Prev</button>
            
            {/* AUDIO CONTROL (Chỉ hiện Part 1-4) */}
            <div className="audio-control-center" style={{flex: 1, display: 'flex', justifyContent: 'center'}}>
                {['part1','part2','part3','part4'].includes(currentSlide.type) ? (
                    <button 
                        className={`audio-play-btn ${isPlaying ? 'playing' : ''}`} 
                        onClick={toggleAudio}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '10px', 
                            padding: '8px 20px', borderRadius: '20px', 
                            border: 'none', background: isPlaying ? '#e0e7ff' : '#f3f4f6',
                            color: isPlaying ? '#4f46e5' : '#374151', cursor: 'pointer', fontWeight: 'bold',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                        }}
                    >
                        {isPlaying ? <FaPause /> : <FaPlay />}
                        <span>{isPlaying ? "Pause Audio" : "Play Audio"}</span>
                    </button>
                ) : (
                    <span style={{color:'#999', fontSize:'0.9rem', fontStyle:'italic'}}>Reading Section</span>
                )}
            </div>

            <button className="nav-btn" onClick={() => paginate(1)} disabled={currentSlideIdx === TEST_DATA.length - 1}>Next <FaStepForward /></button>
         </div>
      </footer>
    </div>
  );
};

export default FullTestDetail;