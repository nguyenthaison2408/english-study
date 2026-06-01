import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner, Alert, Card } from 'react-bootstrap';
import { FaClock, FaArrowLeft, FaCheckCircle, FaQuestionCircle } from 'react-icons/fa';
import { getQuizById, postSubmitQuiz } from '../../services/quizService';
import './TakeExamPart5.scss'; 

const TakeExamPart5 = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [quizData, setQuizData] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [timeLeft, setTimeLeft] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await getQuizById(id);
                let data = response?.data || response;
                if (data?.DT) data = data.DT;
                setQuizData(data);
                // Part 5 thường là 75 phút cho cả bài đọc, nhưng nếu tách lẻ thì tùy config
                setTimeLeft((data.timeLimit || 75) * 60);
                
                const rawQuestions = data.questions || [];
                const processedQuestions = rawQuestions.map((q, idx) => ({
                    _id: q._id,
                    questionNum: idx + 1,
                    // Xử lý text câu hỏi
                    questionText: Array.isArray(q.questionText) ? q.questionText.join(" ") : (q.questionText || ""),
                    options: q.options || []
                }));

                setQuestions(processedQuestions);
            } catch (err) { 
                setError(err.message || "Lỗi tải đề thi"); 
            } finally { 
                setLoading(false); 
            }
        };
        fetchQuiz();
    }, [id]);

    const handleSubmit = useCallback(async () => {
        const answeredCount = Object.keys(userAnswers).length;
        if (timeLeft > 0 && answeredCount < questions.length) {
            if (!window.confirm(`Bạn mới trả lời ${answeredCount}/${questions.length} câu. Nộp bài luôn?`)) return;
        }

        setSubmitting(true);
        try {
            const answers = Object.entries(userAnswers).map(([k, v]) => ({ questionId: k, selectedOption: v }));
            const totalTime = (quizData?.timeLimit || 75) * 60;
            const timeSpent = totalTime - timeLeft;

            const res = await postSubmitQuiz({ 
                quizId: id, 
                answers, 
                timeSpent: timeSpent > 0 ? timeSpent : totalTime 
            });

            if (res && (res.EC === 0 || res.status === 200 || res.data)) {
                const resultId = res.DT?._id || res.data?._id || res.data?.id;
                navigate(`/quiz-result/${resultId}`);
            } else {
                alert("Nộp bài thất bại: " + (res.EM || "Lỗi lạ"));
            }
        } catch (err) { 
            alert("Lỗi: " + err.message); 
        } finally { 
            setSubmitting(false); 
        }
    }, [questions, userAnswers, id, quizData, timeLeft, navigate]);

    useEffect(() => {
        if (!timeLeft || timeLeft <= 0) return;
        const t = setInterval(() => {
            setTimeLeft(p => {
                if (p <= 1) { clearInterval(t); handleSubmit(); return 0; }
                return p - 1;
            });
        }, 1000);
        return () => clearInterval(t);
    }, [timeLeft, handleSubmit]);

    const handleSelectAnswer = (qId, opt) => setUserAnswers(p => ({ ...p, [qId]: opt }));
    
    const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2,'0')}:${(s % 60).toString().padStart(2,'0')}`;

    if (loading) return <div className="text-center pt-5"><Spinner animation="border" variant="primary"/></div>;
    if (error) return <Container className="pt-5"><Alert variant="danger">{error}</Alert></Container>;

    return (
        <div className="take-exam-part5">
            {/* Header giống hệt Part 3/4 */}
            <div className="exam-header sticky-top bg-white shadow-sm">
                <Container fluid="lg">
                    <div className="d-flex justify-content-between align-items-center py-2">
                        <div className="d-flex align-items-center gap-3">
                            <Button variant="light" className="btn-icon-text border" onClick={() => navigate(-1)}>
                                <FaArrowLeft/> <span className="d-none d-sm-inline">Thoát</span>
                            </Button>
                            <h5 className="m-0 fw-bold text-dark d-none d-md-block">
                                {quizData?.title || "Part 5: Incomplete Sentences"}
                            </h5>
                        </div>

                        <div className="d-flex align-items-center gap-3">
                            <div className={`timer-box ${timeLeft < 300 ? 'danger' : ''}`}>
                                <FaClock className="me-2"/> {formatTime(timeLeft)}
                            </div>
                            <Button variant="success" className="btn-submit fw-bold px-4" onClick={() => handleSubmit()} disabled={submitting}>
                                {submitting ? <Spinner size="sm"/> : 'NỘP BÀI'}
                            </Button>
                        </div>
                    </div>
                </Container>
            </div>
            
            <Container className="py-4 main-container">
                <Row>
                    {questions.map((q) => {
                        const isAnswered = !!userAnswers[q._id];
                        return (
                            <Col md={12} key={q._id} className="mb-3">
                                <Card className={`question-card border-0 shadow-sm ${isAnswered ? 'answered-card' : ''}`}>
                                    <Card.Body className="p-4">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div className="d-flex gap-3">
                                                <div className="question-badge">
                                                    <span>{q.questionNum}</span>
                                                </div>
                                                <h6 className="question-text m-0 pt-1">
                                                    {q.questionText}
                                                </h6>
                                            </div>
                                            {isAnswered && <FaCheckCircle className="text-success fs-5 flex-shrink-0 ms-2 animate-check" />}
                                        </div>

                                        <div className="options-grid ms-md-5 mt-3">
                                            <Row>
                                                {q.options.map((opt, i) => {
                                                    const label = ['A','B','C','D'][i];
                                                    const isSelected = userAnswers[q._id] === label;
                                                    
                                                    return (
                                                        <Col md={6} key={i} className="mb-2">
                                                            <div 
                                                                className={`option-item d-flex align-items-center p-2 rounded ${isSelected ? 'selected' : ''}`}
                                                                onClick={() => handleSelectAnswer(q._id, label)}
                                                            >
                                                                <div className={`option-radio me-3 ${isSelected ? 'checked' : ''}`}>
                                                                    {label}
                                                                </div>
                                                                <div className="option-text">
                                                                    {opt.text}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    )
                                                })}
                                            </Row>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                    })}
                </Row>
            </Container>
        </div>
    );
};
export default TakeExamPart5;