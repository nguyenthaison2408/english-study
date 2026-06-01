import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner, Card, Badge, ProgressBar } from 'react-bootstrap';
import { FaClock, FaArrowLeft, FaCheckCircle, FaListUl, FaNewspaper, FaHeadphones, FaImage } from 'react-icons/fa';
import { getQuizById, postSubmitQuiz } from '../../services/quizService';
import './TakeExamFullTest.scss'; 

// Cấu trúc chuẩn TOEIC 200 câu
const TOEIC_STRUCTURE = [
    { part: 1, label: "Part 1: Photographs", start: 0, end: 6, type: "listening" },
    { part: 2, label: "Part 2: Question-Response", start: 6, end: 31, type: "listening" },
    { part: 3, label: "Part 3: Conversations", start: 31, end: 70, type: "listening" },
    { part: 4, label: "Part 4: Short Talks", start: 70, end: 100, type: "listening" },
    { part: 5, label: "Part 5: Incomplete Sentences", start: 100, end: 130, type: "reading" },
    { part: 6, label: "Part 6: Text Completion", start: 130, end: 146, type: "reading" },
    { part: 7, label: "Part 7: Reading Comprehension", start: 146, end: 200, type: "reading" }
];

const TakeExamFullTest = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [quizData, setQuizData] = useState(null);
    const [allQuestions, setAllQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [activePart, setActivePart] = useState(1);
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // === 1. FETCH & PROCESS DATA ===
    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await getQuizById(id);
                // Xử lý wrap data linh hoạt
                let data = response?.data || response;
                if (data?.DT) data = data.DT;

                setQuizData(data);
                // Nếu API trả về timeLimit thì dùng, không thì default 120p
                setTimeLeft((data.timeLimit || 120) * 60); 

                const processed = (data.questions || []).map((q, i) => {
                    // Xử lý tách đoạn văn (cho Part 6, 7)
                    let passageContent = "";
                    let questionContent = "";
                    const qTextArr = Array.isArray(q.questionText) ? q.questionText : [q.questionText || ""];
                    
                    if (qTextArr.length > 1) {
                        passageContent = qTextArr.slice(0, -1).join("\n\n");
                        questionContent = qTextArr[qTextArr.length - 1];
                    } else {
                        questionContent = qTextArr[0];
                    }

                    return {
                        _id: q._id,
                        globalIndex: i + 1,
                        text: questionContent,
                        passageText: passageContent,
                        image: q.questionImage || "",
                        audio: q.questionAudio || "",
                        options: q.options || [],
                    };
                });
                setAllQuestions(processed);
            } catch (err) {
                alert("Lỗi tải đề: " + err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [id]);

    // === 2. GOM NHÓM DỮ LIỆU ===
    const currentPartData = useMemo(() => {
        const struct = TOEIC_STRUCTURE.find(s => s.part === activePart);
        if (!struct || !allQuestions.length) return [];
        return allQuestions.slice(struct.start, struct.end);
    }, [allQuestions, activePart]);

    // === 3. SUBMIT LOGIC (ĐÃ SỬA ĐỂ BẮT ĐÚNG ID) ===
   // === 3. SUBMIT LOGIC (ĐÃ SỬA ĐỂ BẮT ĐÚNG ID VÀ ROUTE) ===
const handleSubmit = useCallback(async () => {
    const answeredCount = Object.keys(userAnswers).length;
    if (timeLeft > 0 && answeredCount < allQuestions.length) {
        if (!window.confirm(`Bạn mới làm ${answeredCount}/${allQuestions.length} câu. Bạn có chắc muốn nộp bài?`)) return;
    }

    setSubmitting(true);
    try {
        // Format answers với dấu ngoặc đơn như Part1
        const formattedAnswers = Object.entries(userAnswers).map(([qId, val]) => ({
            questionId: qId,
            selectedOption: val.includes('') ? val : `${val}` // Thêm dấu ngoặc nếu chưa có
        }));

        const payload = {
            quizId: id,
            answers: formattedAnswers,
            timeSpent: ((quizData?.timeLimit || 120) * 60) - timeLeft
        };

        console.log(">>> Payload gửi đi:", payload);
        
        const res = await postSubmitQuiz(payload);
        console.log(">>> Response nhận về:", res);

        // Xử lý response linh hoạt
        let responseData = res?.data || res;
        
        // Kiểm tra nếu có wrap trong DT
        let resultData = responseData?.DT || responseData;
        
        console.log(">>> Result data:", resultData);

        // Lấy ID từ nhiều khả năng
        const resultId = resultData?._id || resultData?.id || responseData?._id || responseData?.id;

        if (resultId) {
            console.log(">>> Chuyển hướng tới kết quả ID:", resultId);
            // SỬA ROUTE CHO ĐÚNG - phải khớp với route trong index.js
            navigate(`/quiz-result/${resultId}`);
        } else {
            console.error(">>> Không tìm thấy ID trong response:", { res, responseData, resultData });
            alert("Nộp bài thành công! Nhưng không tìm thấy ID kết quả. Vui lòng kiểm tra Console (F12) để debug.");
            // Fallback về trang danh sách
            navigate('/exams');
        }
    } catch (err) {
        console.error(">>> Lỗi khi nộp bài:", err);
        console.error(">>> Chi tiết lỗi:", err.response?.data || err.message);
        alert("Lỗi nộp bài: " + (err.response?.data?.message || err.message));
    } finally {
        setSubmitting(false);
    }
}, [allQuestions, userAnswers, id, quizData, timeLeft, navigate]);

    // === 4. TIMER ===
    useEffect(() => {
        if (!timeLeft) return;
        const t = setInterval(() => setTimeLeft(p => (p <= 1 ? (handleSubmit(), 0) : p - 1)), 1000);
        return () => clearInterval(t);
    }, [timeLeft, handleSubmit]);

    const handleAnswer = (qId, val) => setUserAnswers(prev => ({ ...prev, [qId]: val }));
    
    const formatTime = (s) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        return `${h}:${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
    };

    if (loading) return <div className="d-flex justify-content-center align-items-center vh-100"><Spinner animation="border" variant="primary"/></div>;

    return (
        <div className="take-exam-wrapper">
            {/* 1. HEADER */}
            <div className="exam-header d-flex align-items-center justify-content-between px-4">
                <div className="d-flex align-items-center gap-3">
                    <Button variant="outline-secondary" size="sm" onClick={() => navigate(-1)}><FaArrowLeft/> Exit</Button>
                    <div>
                        <h6 className="m-0 fw-bold text-primary d-none d-md-block">{quizData?.title || "TOEIC Full Test"}</h6>
                        <small className="text-muted">Part {activePart}: {TOEIC_STRUCTURE.find(s=>s.part===activePart)?.label}</small>
                    </div>
                </div>
                
                <div className="d-flex align-items-center gap-3">
                    <div className={`timer-box ${timeLeft < 300 ? 'danger' : ''}`}>
                        <FaClock className="me-2"/>{formatTime(timeLeft)}
                    </div>
                    <Button variant="success" className="px-4 fw-bold shadow-sm" onClick={handleSubmit} disabled={submitting}>
                        {submitting ? <Spinner size="sm"/> : 'NỘP BÀI'}
                    </Button>
                </div>
            </div>

            {/* 2. BODY */}
            <div className="exam-body">
                {/* SIDEBAR */}
                <div className="sidebar-nav d-none d-md-flex">
                    <div className="p-3 border-bottom bg-light">
                        <strong className="text-secondary"><FaListUl/> PROGRESS</strong>
                    </div>
                    <div className="nav-list">
                        {TOEIC_STRUCTURE.map(struct => {
                            const partQuestions = allQuestions.slice(struct.start, struct.end);
                            const answered = partQuestions.filter(q => userAnswers[q._id]).length;
                            const total = partQuestions.length;
                            const percent = total > 0 ? Math.round((answered/total)*100) : 0;
                            const isActive = activePart === struct.part;

                            return (
                                <div 
                                    key={struct.part}
                                    className={`nav-part-item p-2 mb-2 rounded cursor-pointer ${isActive ? 'active' : ''}`}
                                    onClick={() => setActivePart(struct.part)}
                                    style={{cursor: 'pointer'}}
                                >
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <span className="fw-bold">Part {struct.part}</span>
                                        <Badge bg={percent === 100 ? "light" : "secondary"} text={percent === 100 ? "dark" : "light"} pill>{percent}%</Badge>
                                    </div>
                                    <div className="small opacity-75 text-truncate">{struct.label}</div>
                                    <ProgressBar now={percent} variant={isActive ? "warning" : "success"} style={{height:'3px'}} className="mt-2"/>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="content-area">
                    <Container fluid className="px-0 px-md-3">
                        {activePart === 1 && <RenderPart1 questions={currentPartData} answers={userAnswers} onAnswer={handleAnswer} />}
                        {activePart === 2 && <RenderPart2 questions={currentPartData} answers={userAnswers} onAnswer={handleAnswer} />}
                        {(activePart === 3 || activePart === 4) && <RenderPart34 questions={currentPartData} answers={userAnswers} onAnswer={handleAnswer} />}
                        {activePart === 5 && <RenderPart5 questions={currentPartData} answers={userAnswers} onAnswer={handleAnswer} />}
                        {(activePart === 6 || activePart === 7) && <RenderPart67 questions={currentPartData} answers={userAnswers} onAnswer={handleAnswer} />}
                    </Container>
                </div>
            </div>
        </div>
    );
};

// ====================================================================
// SUB-COMPONENTS
// ====================================================================

// --- PART 1: PHOTOGRAPHS (Sticky Audio) ---
const RenderPart1 = ({ questions, answers, onAnswer }) => {
    // Lấy audio từ câu đầu tiên
    const partAudio = questions.length > 0 ? questions[0].audio : "";

    return (
        <div>
            {partAudio && (
                <div className="sticky-audio-player p-3 mb-4 rounded d-flex align-items-center justify-content-between flex-wrap gap-3">
                    <div className="d-flex align-items-center text-primary">
                        <FaHeadphones className="fs-4 me-2"/>
                        <span className="fw-bold">Part 1 Audio Track</span>
                    </div>
                    <audio controls src={partAudio} className="flex-grow-1" controlsList="nodownload" style={{maxWidth: '600px'}}/>
                </div>
            )}

            <Row className="g-4">
                {questions.map((q) => (
                    <Col md={6} xl={4} key={q._id}>
                        <Card className={`h-100 shadow-sm border-0 ${answers[q._id] ? 'ring-2 ring-success' : ''}`}>
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="fw-bold text-secondary">Question {q.globalIndex}</h6>
                                    {answers[q._id] && <FaCheckCircle className="text-success"/>}
                                </div>
                                <div className="text-center mb-3 bg-light rounded overflow-hidden border">
                                    {q.image ? (
                                        <img src={q.image} alt="Q" className="img-fluid" style={{maxHeight:'220px', objectFit: 'contain'}}/>
                                    ) : <div className="py-5 text-muted"><FaImage className="mb-2"/> No Image</div>}
                                </div>
                                <div className="d-grid gap-2">
                                    {q.options.map((opt, i) => {
                                        const label = ['A','B','C','D'][i];
                                        const isSelected = answers[q._id] === label;
                                        return (
                                            <Button 
                                                key={i} 
                                                variant={isSelected ? 'primary' : 'outline-secondary'} 
                                                className="text-start d-flex" 
                                                onClick={()=>onAnswer(q._id, label)}
                                            >
                                                <span className="fw-bold me-2" style={{minWidth:'20px'}}>({label})</span> 
                                                <span>{opt.text}</span>
                                            </Button>
                                        )
                                    })}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

// --- PART 2: QUESTION-RESPONSE (Sticky Audio) ---
const RenderPart2 = ({ questions, answers, onAnswer }) => {
    const partAudio = questions.length > 0 ? questions[0].audio : "";

    return (
        <Container style={{maxWidth: '800px'}}>
            {partAudio && (
                <div className="sticky-audio-player p-3 mb-4 rounded d-flex align-items-center justify-content-between flex-wrap gap-3">
                    <div className="d-flex align-items-center text-primary">
                        <FaHeadphones className="fs-4 me-2"/>
                        <span className="fw-bold">Part 2 Audio Track</span>
                    </div>
                    <audio controls src={partAudio} className="flex-grow-1" controlsList="nodownload" style={{maxWidth: '600px'}}/>
                </div>
            )}

            {questions.map((q) => (
                <Card key={q._id} className="mb-3 shadow-sm border-0">
                    <Card.Body className="d-flex align-items-center justify-content-between p-3 p-md-4">
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-light text-primary fw-bold rounded-circle d-flex align-items-center justify-content-center border" 
                                 style={{width:'50px', height:'50px', fontSize:'1.1rem'}}>
                                {q.globalIndex}
                            </div>
                            <span className="text-muted d-none d-sm-block">Select response:</span>
                        </div>
                        
                        <div className="d-flex gap-3">
                            {['A','B','C'].map((label) => (
                                <button 
                                    key={label}
                                    className={`part2-option-btn btn ${answers[q._id] === label ? 'selected' : 'btn-outline-secondary'}`}
                                    onClick={() => onAnswer(q._id, label)}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </Card.Body>
                </Card>
            ))}
        </Container>
    );
};

// --- PART 3 & 4: CONVERSATIONS / SHORT TALKS (Cluster) ---
const RenderPart34 = ({ questions, answers, onAnswer }) => {
    const groups = useMemo(() => {
        const res = [];
        let currGroup = null;
        questions.forEach(q => {
            const identifier = q.audio || q.image || "unknown";
            if (!currGroup || currGroup.id !== identifier) {
                currGroup = { id: identifier, audio: q.audio, image: q.image, qs: [] };
                res.push(currGroup);
            }
            currGroup.qs.push(q);
        });
        return res;
    }, [questions]);

    return (
        <Container style={{maxWidth: '900px'}}>
            {groups.map((g, idx) => (
                <Card key={idx} className="mb-4 shadow-sm border-0">
                    <Card.Header className="bg-white border-bottom py-3">
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <FaHeadphones className="text-primary"/>
                            <span className="fw-bold text-uppercase text-secondary">
                                Questions {g.qs[0].globalIndex} - {g.qs[g.qs.length-1].globalIndex}
                            </span>
                        </div>
                        {g.audio && <audio controls src={g.audio} className="w-100 bg-light rounded"/>}
                    </Card.Header>
                    <Card.Body>
                        {g.image && (
                            <div className="text-center mb-4">
                                <img src={g.image} alt="Hint" className="img-fluid rounded border shadow-sm" style={{maxHeight:'300px'}}/>
                            </div>
                        )}
                        {g.qs.map((q, i) => (
                            <div key={q._id} className={`mb-4 ${i !== g.qs.length -1 ? 'border-bottom pb-3' : ''}`}>
                                <h6 className="fw-bold mb-3 text-dark">{q.globalIndex}. {q.text}</h6>
                                <div className="ms-2">
                                    {q.options.map((opt, i) => {
                                        const label = ['A','B','C','D'][i];
                                        return (
                                            <div key={i} 
                                                className={`form-check mb-2 p-2 rounded ps-5 position-relative cursor-pointer transition-bg ${answers[q._id]===label ? 'bg-primary-subtle' : 'hover-bg-light'}`}
                                                onClick={() => onAnswer(q._id, label)} 
                                                style={{cursor:'pointer'}}
                                            >
                                                <input 
                                                    className="form-check-input position-absolute" 
                                                    type="radio" 
                                                    style={{left: '15px', top: '12px'}}
                                                    checked={answers[q._id]===label} 
                                                    readOnly
                                                />
                                                <label className="form-check-label w-100 cursor-pointer">
                                                    <span className="fw-bold me-1">({label})</span> {opt.text}
                                                </label>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </Card.Body>
                </Card>
            ))}
        </Container>
    )
};

// --- PART 5: INCOMPLETE SENTENCES ---
const RenderPart5 = ({ questions, answers, onAnswer }) => (
    <Row>
        {questions.map((q) => (
            <Col md={6} key={q._id} className="mb-3">
                <Card className={`h-100 shadow-sm border-0 ${answers[q._id] ? 'border-start border-5 border-success' : ''}`}>
                    <Card.Body>
                        <div className="d-flex justify-content-between mb-2">
                            <Badge bg="secondary" className="px-2 py-1">Q{q.globalIndex}</Badge>
                            {answers[q._id] && <FaCheckCircle className="text-success"/>}
                        </div>
                        <p className="fw-semibold mb-3 fs-6">{q.text}</p>
                        <div className="d-grid gap-2">
                            {q.options.map((opt, i) => {
                                const label = ['A','B','C','D'][i];
                                return (
                                    <Button key={i} variant={answers[q._id]===label ? "primary" : "outline-secondary"} 
                                            size="sm" className="text-start" onClick={() => onAnswer(q._id, label)}>
                                        <span className="fw-bold me-2">({label})</span> {opt.text}
                                    </Button>
                                )
                            })}
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        ))}
    </Row>
);

// --- PART 6 & 7: READING (Split View) ---
const RenderPart67 = ({ questions, answers, onAnswer }) => {
    const groups = useMemo(() => {
        const res = [];
        let currGroup = null;
        questions.forEach(q => {
            const identifier = q.image || q.passageText || "unknown";
            if (!currGroup || currGroup.id !== identifier) {
                currGroup = { id: identifier, image: q.image, passageText: q.passageText, qs: [] };
                res.push(currGroup);
            }
            currGroup.qs.push(q);
        });
        return res;
    }, [questions]);

    return (
        <div>
            {groups.map((group, idx) => (
                <Card key={idx} className="split-view-card mb-5 shadow-sm">
                    <Card.Header className="py-3 px-4">
                        <div className="d-flex align-items-center gap-2">
                            <FaNewspaper className="text-primary"/>
                            <h6 className="m-0 fw-bold text-primary text-uppercase">
                                Reading Passage ({group.qs[0].globalIndex} - {group.qs[group.qs.length-1].globalIndex})
                            </h6>
                        </div>
                    </Card.Header>
                    <Card.Body className="p-0">
                        <Row className="g-0">
                            {/* CỘT TRÁI: BÀI ĐỌC */}
                            <Col lg={6} className="passage-col">
                                <div className="sticky-content">
                                    {group.image ? (
                                        <img src={group.image} alt="Passage" className="img-fluid border shadow-sm w-100 rounded" />
                                    ) : (
                                        <div className="passage-text-content">
                                            {group.passageText || "(No passage content)"}
                                        </div>
                                    )}
                                </div>
                            </Col>

                            {/* CỘT PHẢI: CÂU HỎI */}
                            <Col lg={6} className="questions-col">
                                {group.qs.map(q => (
                                    <div key={q._id} className="mb-4">
                                        <div className="d-flex gap-2 mb-2">
                                            <span className="badge bg-dark rounded-pill align-self-start mt-1">{q.globalIndex}</span>
                                            <span className="fw-bold text-dark">{q.text}</span>
                                        </div>
                                        <div className="ms-4">
                                            {q.options.map((opt, i) => {
                                                const label = ['A','B','C','D'][i];
                                                const isSelected = answers[q._id] === label;
                                                return (
                                                    <div key={i} className={`option-item d-flex align-items-center py-2 px-3 rounded mb-2 ${isSelected ? 'selected' : ''}`}
                                                            onClick={() => onAnswer(q._id, label)}>
                                                        <div className={`option-radio me-3 ${isSelected ? 'checked' : ''}`}>{label}</div>
                                                        <div className="option-text">{opt.text}</div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <hr className="text-muted opacity-25"/>
                                    </div>
                                ))}
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
};

export default TakeExamFullTest;