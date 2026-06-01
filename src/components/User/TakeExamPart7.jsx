import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner, Alert, Card } from 'react-bootstrap';
import { FaClock, FaArrowLeft, FaCheckCircle, FaNewspaper } from 'react-icons/fa';
import { getQuizById, postSubmitQuiz } from '../../services/quizService';
import './TakeExamPart7.scss';

const TakeExamPart7 = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [quizData, setQuizData] = useState(null);
    const [questions, setQuestions] = useState([]); // Mảng phẳng
    const [groupedQuestions, setGroupedQuestions] = useState([]); // Mảng đã gom nhóm theo bài đọc
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
                // Part 7 (54 câu) thường làm trong khoảng 55-60 phút
                setTimeLeft((data.timeLimit || 60) * 60);

                const rawQuestions = data.questions || [];
                
                // 1. Xử lý dữ liệu thô
                const processedQuestions = rawQuestions.map((q, idx) => {
                    // Xử lý tách đoạn văn nếu backend gộp chung vào questionText (như logic cũ của bạn)
                    let passageContent = "";
                    let questionContent = "";
                    const qTextArr = Array.isArray(q.questionText) ? q.questionText : [q.questionText || ""];
                    
                    if (qTextArr.length > 1) {
                        passageContent = qTextArr.slice(0, -1).join("\n\n");
                        questionContent = qTextArr[qTextArr.length - 1];
                    } else {
                        // Nếu không có mảng, có thể đoạn văn nằm ở questionImage hoặc tách riêng
                        questionContent = qTextArr[0];
                    }

                    return {
                        _id: q._id,
                        questionNum: idx + 1,
                        text: questionContent,
                        passageText: passageContent,
                        image: q.questionImage || "", // Ảnh bài đọc (quan trọng cho Part 7)
                        options: q.options || []
                    };
                });

                setQuestions(processedQuestions);

                // 2. Gom nhóm câu hỏi (Grouping Logic)
                // Part 7 số câu hỏi mỗi bài đọc không cố định (2-5 câu).
                // Ta gom nhóm dựa trên việc: Câu hiện tại có chung Image hoặc PassageText với câu trước không?
                const groups = [];
                let currentGroup = null;

                processedQuestions.forEach((q) => {
                    // Định danh bài đọc: Ưu tiên Ảnh -> Sau đó đến Text đoạn văn
                    const passageIdentifier = q.image || q.passageText || "unknown"; 

                    // Nếu chưa có nhóm, hoặc định danh bài đọc khác với nhóm hiện tại -> Tạo nhóm mới
                    if (!currentGroup || currentGroup.id !== passageIdentifier) {
                        currentGroup = {
                            id: passageIdentifier,
                            image: q.image,
                            passageText: q.passageText,
                            questions: []
                        };
                        groups.push(currentGroup);
                    }
                    // Đẩy câu hỏi vào nhóm hiện tại
                    currentGroup.questions.push(q);
                });

                setGroupedQuestions(groups);

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
            if (!window.confirm(`Bạn mới làm ${answeredCount}/${questions.length} câu. Nộp bài luôn?`)) return;
        }

        setSubmitting(true);
        try {
            const answers = Object.entries(userAnswers).map(([k, v]) => ({ questionId: k, selectedOption: v }));
            const totalTime = (quizData?.timeLimit || 60) * 60;
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
                alert("Nộp bài thất bại: " + (res.EM || "Lỗi hệ thống"));
            }
        } catch (err) { 
            alert("Lỗi kết nối: " + err.message); 
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
        <div className="take-exam-part7">
            <div className="exam-header sticky-top bg-white shadow-sm">
                <Container fluid="lg">
                    <div className="d-flex justify-content-between align-items-center py-2">
                        <div className="d-flex align-items-center gap-3">
                            <Button variant="light" className="btn-icon-text border" onClick={() => navigate(-1)}>
                                <FaArrowLeft/> <span className="d-none d-sm-inline">Thoát</span>
                            </Button>
                            <h5 className="m-0 fw-bold text-dark d-none d-md-block">
                                {quizData?.title || "Part 7: Reading Comprehension"}
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
                    const startNum = group.questions[0].questionNum;
                    const endNum = group.questions[group.questions.length - 1].questionNum;

                    return (
                        <Card key={groupIndex} className="passage-group mb-5 shadow-sm border-0">
                            <Card.Header className="bg-white border-bottom py-3">
                                <div className="d-flex align-items-center gap-2">
                                    <FaNewspaper className="text-primary"/>
                                    <h6 className="m-0 fw-bold text-primary text-uppercase">
                                        Reading Passage {groupIndex + 1}
                                        <span className="text-muted ms-2 normal-case">
                                            (Questions {startNum} - {endNum})
                                        </span>
                                    </h6>
                                </div>
                            </Card.Header>
                            <Card.Body className="p-0">
                                <Row className="g-0">
                                    {/* CỘT TRÁI: BÀI ĐỌC (HÌNH ẢNH HOẶC TEXT) */}
                                    <Col lg={6} className="passage-col border-end bg-light">
                                        <div className="p-4 sticky-content">
                                            {group.image ? (
                                                <div className="text-center">
                                                    <img src={group.image} alt="Reading Passage" className="img-fluid border shadow-sm" />
                                                </div>
                                            ) : (
                                                <div className="passage-text-content">
                                                    {group.passageText ? (
                                                        group.passageText.split('\n').map((line, i) => (
                                                            <p key={i} className="mb-2">{line}</p>
                                                        ))
                                                    ) : (
                                                        <div className="text-center text-muted fst-italic py-5">
                                                            (No passage content available)
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </Col>

                                    {/* CỘT PHẢI: CÁC CÂU HỎI */}
                                    <Col lg={6} className="questions-col bg-white">
                                        <div className="p-4">
                                            {group.questions.map((q) => {
                                                 const isAnswered = !!userAnswers[q._id];
                                                 return (
                                                    <div key={q._id} className={`individual-question mb-4 ${isAnswered ? 'is-answered' : ''}`}>
                                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                                            <div className="fw-bold text-dark d-flex gap-2">
                                                                <span className="question-number-badge">{q.questionNum}.</span>
                                                                <span className="question-text">{q.text}</span>
                                                            </div>
                                                            {isAnswered && <FaCheckCircle className="text-success flex-shrink-0 ms-2" />}
                                                        </div>

                                                        <div className="options-grid ms-md-4 mt-2">
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

export default TakeExamPart7;