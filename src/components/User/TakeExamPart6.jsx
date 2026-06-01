import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner, Alert, Card } from 'react-bootstrap';
import { FaClock, FaArrowLeft, FaCheckCircle, FaBookOpen } from 'react-icons/fa';
import { getQuizById, postSubmitQuiz } from '../../services/quizService';
import './TakeExamPart6.scss';

const TakeExamPart6 = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [quizData, setQuizData] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [groupedQuestions, setGroupedQuestions] = useState([]); // Gom nhóm 4 câu
    const [userAnswers, setUserAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [timeLeft, setTimeLeft] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    // Hàm chia nhóm (Part 6 luôn có 4 câu hỏi cho 1 đoạn văn)
    const chunkArray = (array, size) => {
        const result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    };

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await getQuizById(id);
                let data = response?.data || response;
                if (data?.DT) data = data.DT;
                setQuizData(data);
                // Part 6 thường khoảng 10-15 phút nếu làm riêng, hoặc nằm trong tổng thời gian
                setTimeLeft((data.timeLimit || 45) * 60);

                const rawQuestions = data.questions || [];
                const processedQuestions = rawQuestions.map((q, idx) => ({
                    _id: q._id,
                    questionNum: idx + 1,
                    // Xử lý text: Nếu là mảng thì join, nếu null thì rỗng
                    questionText: Array.isArray(q.questionText) ? q.questionText.join("\n") : (q.questionText || ""),
                    options: q.options || [],
                    questionImage: q.questionImage || "" // Ảnh đoạn văn (nếu có)
                }));

                setQuestions(processedQuestions);
                // Gom nhóm 4 câu
                setGroupedQuestions(chunkArray(processedQuestions, 4));

            } catch (err) {
                setError(err.message || "Lỗi tải dữ liệu");
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [id]);

    const handleSubmit = useCallback(async () => {
        const answeredCount = Object.keys(userAnswers).length;
        if (timeLeft > 0 && answeredCount < questions.length) {
            if (!window.confirm(`Bạn mới làm ${answeredCount}/${questions.length} câu. Nộp bài luôn?`)) return;
        }

        setSubmitting(true);
        try {
            const answers = Object.entries(userAnswers).map(([k, v]) => ({ questionId: k, selectedOption: v }));
            const totalTime = (quizData?.timeLimit || 45) * 60;
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
                alert("Nộp thất bại: " + (res.EM || "Lỗi server"));
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
        <div className="take-exam-part6">
            <div className="exam-header sticky-top bg-white shadow-sm">
                <Container fluid="lg">
                    <div className="d-flex justify-content-between align-items-center py-2">
                        <div className="d-flex align-items-center gap-3">
                            <Button variant="light" className="btn-icon-text border" onClick={() => navigate(-1)}>
                                <FaArrowLeft/> <span className="d-none d-sm-inline">Thoát</span>
                            </Button>
                            <h5 className="m-0 fw-bold text-dark d-none d-md-block">
                                {quizData?.title || "Part 6: Text Completion"}
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
                {groupedQuestions.map((group, groupIndex) => {
                    // Logic hiển thị Passage: 
                    // 1. Nếu có ảnh (questionImage) ở câu đầu tiên, ưu tiên hiển thị ảnh.
                    // 2. Nếu không, lấy text câu hỏi làm đoạn văn (tùy cấu trúc DB của bạn).
                    const passageImage = group.find(q => q.questionImage)?.questionImage;
                    // Lấy text của câu đầu tiên làm đoạn văn mẫu (nếu DB lưu đoạn văn trong questionText)
                    const passageText = group[0]?.questionText; 

                    return (
                        <Card key={groupIndex} className="passage-group mb-5 shadow-sm border-0">
                            <Card.Header className="bg-white border-bottom py-3">
                                <div className="d-flex align-items-center gap-2">
                                    <FaBookOpen className="text-primary"/>
                                    <h6 className="m-0 fw-bold text-primary text-uppercase">
                                        Reading Passage {groupIndex + 1}
                                        <span className="text-muted ms-2 normal-case">
                                            (Questions {group[0].questionNum} - {group[group.length-1].questionNum})
                                        </span>
                                    </h6>
                                </div>
                            </Card.Header>
                            <Card.Body className="p-0">
                                <Row className="g-0">
                                    {/* CỘT TRÁI: ĐOẠN VĂN (PASSAGE) */}
                                    <Col lg={6} className="passage-col border-end bg-light">
                                        <div className="p-4 sticky-top-passage">
                                            {passageImage ? (
                                                <div className="text-center">
                                                    <img src={passageImage} alt="Passage" className="img-fluid rounded border shadow-sm" />
                                                </div>
                                            ) : (
                                                <div className="passage-text-content">
                                                    {/* Giả sử text đoạn văn nằm ở câu đầu, nếu DB bạn tách riêng trường passage thì sửa ở đây */}
                                                    {passageText && passageText.split('\n').map((line, i) => (
                                                        <p key={i} className="mb-2">{line}</p>
                                                    ))}
                                                    {!passageText && !passageImage && <p className="text-muted fst-italic">Refer to the text provided in the question data.</p>}
                                                </div>
                                            )}
                                        </div>
                                    </Col>

                                    {/* CỘT PHẢI: DANH SÁCH CÂU HỎI */}
                                    <Col lg={6} className="questions-col bg-white">
                                        <div className="p-4">
                                            {group.map((q) => {
                                                 const isAnswered = !!userAnswers[q._id];
                                                 return (
                                                    <div key={q._id} className={`individual-question mb-4 ${isAnswered ? 'is-answered' : ''}`}>
                                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                                            <div className="fw-bold text-dark d-flex gap-2 align-items-center">
                                                                <span className="question-number-badge">{q.questionNum}.</span>
                                                                {/* Part 6 câu hỏi thường nằm trong bài đọc, nên ở đây có thể chỉ hiện text ngắn hoặc để trống */}
                                                                <span className="small text-muted fst-italic">Select the best answer to complete the text.</span>
                                                            </div>
                                                            {isAnswered && <FaCheckCircle className="text-success flex-shrink-0 ms-2" />}
                                                        </div>

                                                        <div className="options-grid ms-md-4">
                                                            {q.options.map((opt, idx) => {
                                                                const label = ['A', 'B', 'C', 'D'][idx];
                                                                const isSelected = userAnswers[q._id] === label;
                                                                return (
                                                                    <div 
                                                                        key={idx} 
                                                                        className={`option-item d-flex align-items-center py-2 px-3 rounded mb-2 ${isSelected ? 'selected' : ''}`}
                                                                        onClick={() => handleSelectAnswer(q._id, label)}
                                                                    >
                                                                        <div className={`option-radio me-3 ${isSelected ? 'checked' : ''}`}>
                                                                            {label}
                                                                        </div>
                                                                        <div className="option-text">
                                                                            {opt.text}
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                        <hr className="divider-dashed"/>
                                                    </div>
                                                 )
                                            })}
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    )
                })}
            </Container>
        </div>
    );
};
export default TakeExamPart6;