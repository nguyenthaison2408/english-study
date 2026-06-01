import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Nav, Tab, Button, Form, InputGroup, Row, Col, Card } from 'react-bootstrap';
import { FaSave, FaArrowLeft, FaImage, FaMusic, FaCheckCircle } from 'react-icons/fa';

import { postCreateNewQuiz, getQuizById, putUpdateQuiz } from '../../../../services/quizService'; 
import './CreateFullTestQuiz.scss';

// --- 1. KHỞI TẠO CẤU TRÚC DỮ LIỆU ---
const initFullTestStructure = () => {
    const structure = [];

    // PART 1 (6 câu)
    structure.push({
        id: 'part1_common', part: 1, type: 'PART_1_COMMON',
        audio: '',
        questions: Array.from({ length: 6 }, (_, i) => ({
            number: i + 1, image: '', correctAnswer: '', explanation: '', 
            options: [{ text: '', image: '' }, { text: '', image: '' }, { text: '', image: '' }, { text: '', image: '' }]
        }))
    });

    // PART 2 (25 câu)
    structure.push({
        id: 'part2_common', part: 2, type: 'PART_AUDIO_COMMON',
        audio: '',
        questions: Array.from({ length: 25 }, (_, i) => ({
            number: i + 7, correctAnswer: '', explanation: '', 
            options: [{ text: '', image: '' }, { text: '', image: '' }, { text: '', image: '' }]
        }))
    });

    // PART 3 (39 câu)
    structure.push({
        id: 'part3_common', part: 3, type: 'PART_AUDIO_COMMON',
        audio: '',
        questions: Array.from({ length: 39 }, (_, i) => ({
            number: i + 32, description: '', correctAnswer: '', explanation: '', 
            options: [{ text: '', image: '' }, { text: '', image: '' }, { text: '', image: '' }, { text: '', image: '' }]
        }))
    });

    // PART 4 (30 câu)
    structure.push({
        id: 'part4_common', part: 4, type: 'PART_AUDIO_COMMON',
        audio: '',
        questions: Array.from({ length: 30 }, (_, i) => ({
            number: i + 71, description: '', correctAnswer: '', explanation: '', 
            options: [{ text: '', image: '' }, { text: '', image: '' }, { text: '', image: '' }, { text: '', image: '' }]
        }))
    });

    // PART 5 (30 câu)
    for (let i = 101; i <= 130; i++) {
        structure.push({
            id: `p5_q${i}`, part: 5, type: 'TEXT_ONLY',
            questions: [{
                number: i, description: '', correctAnswer: '', explanation: '', 
                options: [{ text: '', image: '' }, { text: '', image: '' }, { text: '', image: '' }, { text: '', image: '' }]
            }]
        });
    }

    // PART 6 (16 câu)
    for (let i = 131; i <= 146; i += 4) {
        structure.push({
            id: `p6_g${i}`, part: 6, type: 'PASSAGE',
            passageText: '',
            questions: Array.from({ length: 4 }, (_, idx) => ({ 
                number: i + idx, correctAnswer: '', explanation: '', 
                options: [{ text: '', image: '' }, { text: '', image: '' }, { text: '', image: '' }, { text: '', image: '' }]
            }))
        });
    }

    // PART 7 (54 câu)
    const p7Config = [
        { start: 147, count: 2 }, { start: 149, count: 2 }, { start: 151, count: 2 }, { start: 153, count: 2 },
        { start: 155, count: 3 }, { start: 158, count: 3 },
        { start: 161, count: 4 }, { start: 165, count: 3 }, { start: 168, count: 4 }, { start: 172, count: 4 }, 
        { start: 176, count: 5, label: "Double" }, { start: 181, count: 5, label: "Double" }, 
        { start: 186, count: 5, label: "Triple" }, { start: 191, count: 5, label: "Triple" }, { start: 196, count: 5, label: "Triple" } 
    ];

    p7Config.forEach(cfg => {
        const numPassages = cfg.label === "Triple" ? 3 : (cfg.label === "Double" ? 2 : 1);
        structure.push({
            id: `p7_g${cfg.start}`, part: 7, type: 'PASSAGE_COMPLEX',
            label: cfg.label || "Single",
            passages: Array.from({ length: numPassages }, () => ({ type: 'text', content: '' })), 
            questions: Array.from({ length: cfg.count }, (_, idx) => ({ 
                number: cfg.start + idx, description: '', correctAnswer: '', explanation: '', 
                options: [{ text: '', image: '' }, { text: '', image: '' }, { text: '', image: '' }, { text: '', image: '' }]
            }))
        });
    });

    return structure;
};

const CreateFullTestQuiz = () => {
    const navigate = useNavigate();
    const { id } = useParams(); 
    const [activeTab, setActiveTab] = useState('info'); 
    const [isLoading, setIsLoading] = useState(false);
    
    const [quizInfo, setQuizInfo] = useState({
        title: '', level: 'Hard', timeLimit: 120, description: ''
    });

    const [testData, setTestData] = useState(initFullTestStructure());

    // --- [FIX 1] HÀM TRANSFORM DỮ LIỆU TỪ BACKEND VỀ FRONTEND ---
    const transformFlatToStructure = (questions) => {
        const structure = initFullTestStructure();
        let qIndex = 0; // Con trỏ vị trí câu hỏi trong mảng phẳng

        structure.forEach(group => {
            // Lưu lại vị trí bắt đầu của group này trong mảng questions phẳng
            const groupStartIndex = qIndex;

            // Map từng câu hỏi vào group
            if (group.questions) {
                group.questions = group.questions.map((q) => {
                    const backendQ = questions[qIndex];
                    qIndex++; // Tăng con trỏ
                    
                    if (backendQ) {
                        return {
                            ...q,
                            description: backendQ.description || (Array.isArray(backendQ.questionText) ? backendQ.questionText[backendQ.questionText.length - 1] : backendQ.questionText) || '',
                            image: backendQ.image || backendQ.questionImage || '',
                            correctAnswer: backendQ.correctAnswer || '',
                            explanation: backendQ.explanation || '',
                            options: backendQ.options || q.options
                        };
                    }
                    return q;
                });
            }

            // === [QUAN TRỌNG] KHÔI PHỤC AUDIO CHO PART 1, 2, 3, 4 ===
            if ([1, 2, 3, 4].includes(group.part)) {
                // Lấy câu hỏi đầu tiên của group này để check audio
                const firstQ = questions[groupStartIndex];
                if (firstQ) {
                    // Backend trả về 'questionAudio' hoặc 'audio'
                    group.audio = firstQ.questionAudio || firstQ.audio || '';
                }
            }

            // Khôi phục Passage cho Part 6
            if (group.part === 6) {
                const firstQ = questions[groupStartIndex];
                if (firstQ && Array.isArray(firstQ.questionText) && firstQ.questionText.length > 0) {
                    group.passageText = firstQ.questionText[0];
                }
            }

            // Khôi phục Passage cho Part 7
            if (group.part === 7) {
                const firstQ = questions[groupStartIndex];
                if (firstQ && Array.isArray(firstQ.questionText)) {
                    // Loại bỏ phần tử cuối (câu hỏi) để lấy các đoạn văn
                    const passagesContent = firstQ.questionText.slice(0, -1);
                    if (passagesContent.length > 0) {
                        group.passages = passagesContent.map(content => ({ type: 'text', content }));
                    }
                }
            }
        });

        return structure;
    };

    const fetchFullTestData = useCallback(async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            let res = await getQuizById(id);
            if (res && res.data) {
                const backendData = res.data;
                setQuizInfo({
                    title: backendData.title || '',
                    level: backendData.level || 'Hard',
                    timeLimit: backendData.timeLimit || 120,
                    description: backendData.description || ''
                });

                if (backendData.data && backendData.data.length > 0) {
                    setTestData(backendData.data);
                } else if (backendData.questions && backendData.questions.length > 0) {
                    const transformedData = transformFlatToStructure(backendData.questions);
                    setTestData(transformedData);
                }
            } else {
                toast.error("Không tìm thấy bài thi!");
                navigate('/admin/manage-quiz/part/0');
            }
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi tải dữ liệu bài thi");
        } finally {
            setIsLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        if (id) fetchFullTestData();
    }, [id, fetchFullTestData]);


    // --- HANDLERS ---
    const handleGroupChange = (groupId, field, value) => {
        setTestData(prev => prev.map(item => item.id === groupId ? { ...item, [field]: value } : item));
    };

    const handleQuestionChange = (groupId, qIndex, field, value) => {
        setTestData(prev => prev.map(item => {
            if (item.id !== groupId) return item;
            const newQuestions = [...item.questions];
            newQuestions[qIndex] = { ...newQuestions[qIndex], [field]: value };
            return { ...item, questions: newQuestions };
        }));
    };

    const handleOptionChange = (groupId, qIndex, optIndex, value) => {
        setTestData(prev => prev.map(item => {
            if (item.id !== groupId) return item;
            const newQuestions = [...item.questions];
            const newOptions = [...newQuestions[qIndex].options];
            newOptions[optIndex] = { ...newOptions[optIndex], text: value };
            newQuestions[qIndex] = { ...newQuestions[qIndex], options: newOptions };
            return { ...item, questions: newQuestions };
        }));
    };

    // --- [FIX 2] HÀM SUBMIT ---
    const handleSubmit = async () => {
        if (!quizInfo.title) return toast.error("Vui lòng nhập tên bài thi!");
        
        for (let group of testData) {
            if ([1, 2, 3, 4].includes(group.part) && !group.audio) {
                return toast.error(`Part ${group.part}: Chưa có link audio!`);
            }
            for (let q of group.questions) {
                if (!q.correctAnswer) {
                    return toast.error(`Câu ${q.number}: Chưa chọn đáp án đúng!`);
                }
            }
        }

        let flatQuestions = [];
        
        testData.forEach(group => {
            // Lấy audio chung của group
            const commonAudio = [1, 2, 3, 4].includes(group.part) ? (group.audio || "") : "";
            
            group.questions.forEach(q => {
                let questionTextArray = [];
                const desc = q.description || "";
                
                if (group.part === 6) {
                    const passage = group.passageText || "";
                    questionTextArray = [passage, `Question ${q.number}`];
                } else if (group.part === 7) {
                    const passages = (group.passages || []).map(p => p.content || "");
                    questionTextArray = [...passages, desc];
                } else {
                    questionTextArray = [desc];
                }

                const questionObj = {
                    questionText: questionTextArray,
                    questionImage: q.image || "",
                    options: q.options,
                    correctAnswer: q.correctAnswer || "",
                    explanation: q.explanation || "",
                    point: 1,
                    // === QUAN TRỌNG: Lưu Audio vào từng câu hỏi ===
                    questionAudio: commonAudio 
                };

                flatQuestions.push(questionObj);
            });
        });

        const payload = { 
            ...quizInfo, 
            type: "FULL_TEST", 
            part: 0,
            questions: flatQuestions 
        };

        try {
            setIsLoading(true);
            let res;
            if (id) {
                res = await putUpdateQuiz(id, payload);
                if (res && res.data) {
                    toast.success("Cập nhật Full Test thành công!");
                    navigate('/admin/manage-quiz/part/0');
                }
            } else {
                res = await postCreateNewQuiz(payload);
                if (res && res.data) {
                    toast.success("Tạo đề Full Test thành công!");
                    navigate('/admin/manage-quiz/part/0');
                }
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Lỗi kết nối server");
        } finally {
            setIsLoading(false);
        }
    };

    const renderOptions = (group, qIndex, q) => (
        <Row className="g-2 mt-2">
            {q.options.map((opt, oIdx) => {
                const label = ['A', 'B', 'C', 'D'][oIdx];
                if (!label) return null;
                const isSelected = q.correctAnswer === label;
                return (
                    <Col xs={6} md={group.part === 2 ? 4 : 3} key={oIdx}>
                        <InputGroup size="sm">
                            <InputGroup.Text 
                                className={`cursor-pointer option-label ${isSelected ? 'bg-success text-white' : ''}`}
                                onClick={() => handleQuestionChange(group.id, qIndex, 'correctAnswer', label)}
                            >
                                {label}
                            </InputGroup.Text>
                            <Form.Control 
                                placeholder={group.part === 2 ? `Response` : `Option`}
                                value={opt.text}
                                onChange={(e) => handleOptionChange(group.id, qIndex, oIdx, e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                );
            })}
        </Row>
    );

    const partsToRender = useMemo(() => {
        if (activeTab === 'info') return [];
        const pNum = parseInt(activeTab.replace('part', ''));
        return testData.filter(item => item.part === pNum);
    }, [activeTab, testData]);

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{minHeight: '400px'}}>
                <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
            </div>
        );
    }

    return (
        <div className="create-full-test-container bg-light min-vh-100">
            <div className="d-flex justify-content-between align-items-center bg-white p-3 shadow-sm quiz-header">
                <h4 className="m-0 text-primary fw-bold"><FaCheckCircle /> {id ? `Cập nhật Full Test (ID: ${id})` : 'Tạo Full Test TOEIC (200 Câu)'}</h4>
                <div>
                    <Button variant="outline-secondary" className="me-2" onClick={() => navigate('/admin/manage-quiz/part/0')}><FaArrowLeft /> Quay lại</Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={isLoading}><FaSave /> {id ? 'Cập nhật' : 'Lưu Đề Thi'}</Button>
                </div>
            </div>

            <div className="p-4">
                <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                    <Nav variant="tabs" className="mb-3 bg-white rounded shadow-sm">
                        <Nav.Item><Nav.Link eventKey="info" className="fw-bold text-dark"><i className="fa fa-cog"></i> Cấu hình</Nav.Link></Nav.Item>
                        {[1, 2, 3, 4, 5, 6, 7].map(num => (<Nav.Item key={num}><Nav.Link eventKey={`part${num}`} className="fw-bold">Part {num}</Nav.Link></Nav.Item>))}
                    </Nav>

                    <Tab.Content>
                        <Tab.Pane eventKey="info">
                            <Card className="shadow-sm border-0">
                                <Card.Body>
                                    <Row className="g-3">
                                        <Col md={6}>
                                            <Form.Label className="fw-bold">Tên bài thi</Form.Label>
                                            <Form.Control value={quizInfo.title} onChange={(e) => setQuizInfo({...quizInfo, title: e.target.value})} placeholder="VD: ETS 2024 - Test 1" />
                                        </Col>
                                        <Col md={3}>
                                            <Form.Label className="fw-bold">Thời gian (phút)</Form.Label>
                                            <Form.Control type="number" value={quizInfo.timeLimit} onChange={(e) => setQuizInfo({...quizInfo, timeLimit: e.target.value})} />
                                        </Col>
                                        <Col md={3}>
                                            <Form.Label className="fw-bold">Độ khó</Form.Label>
                                            <Form.Select value={quizInfo.level} onChange={(e) => setQuizInfo({...quizInfo, level: e.target.value})}>
                                                <option value="Medium">Medium</option>
                                                <option value="Hard">Hard</option>
                                            </Form.Select>
                                        </Col>
                                        <Col md={12}>
                                            <Form.Label>Mô tả (Optional)</Form.Label>
                                            <Form.Control as="textarea" rows={3} value={quizInfo.description} onChange={(e) => setQuizInfo({...quizInfo, description: e.target.value})} />
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Tab.Pane>

                        {activeTab !== 'info' && (
                            <div className="part-content-area animate__animated animate__fadeIn">
                                {partsToRender.map((group) => (
                                    <Card key={group.id} className="mb-4 border-0 shadow-sm group-card">
                                        <Card.Header className="bg-white border-bottom py-2">
                                            <span className="badge bg-primary fs-6">Part {group.part} {group.questions.length > 0 && `(Câu ${group.questions[0].number} - ${group.questions[group.questions.length - 1].number})`}</span>
                                        </Card.Header>
                                        <Card.Body className="p-0">
                                            <Row className="g-0">
                                                <Col md={4} className="border-end bg-light left-col-sticky">
                                                    <div className="p-3">
                                                        {[1, 2, 3, 4].includes(group.part) && (
                                                            <div className="mb-3">
                                                                <Form.Label className="fw-bold text-danger"><FaMusic /> Audio Full Part {group.part}</Form.Label>
                                                                <InputGroup size="sm" className="mb-2">
                                                                    <InputGroup.Text className="bg-white"><FaMusic/></InputGroup.Text>
                                                                    <Form.Control value={group.audio} onChange={(e) => handleGroupChange(group.id, 'audio', e.target.value)} placeholder="Link Audio chung..." />
                                                                </InputGroup>
                                                                {group.part === 1 && <div className="text-muted small fst-italic">* Part 1: Nhập ảnh riêng bên phải.</div>}
                                                            </div>
                                                        )}
                                                        {group.part === 6 && (<Form.Control as="textarea" rows={14} className="passage-area" value={group.passageText} onChange={(e) => handleGroupChange(group.id, 'passageText', e.target.value)} placeholder="Nhập đoạn văn..." />)}
                                                        {group.part === 7 && (
                                                            <div>
                                                                {group.passages.map((p, pIdx) => (
                                                                    <Form.Control key={pIdx} as="textarea" rows={8} className="passage-area mb-2" value={p.content} onChange={(e) => { const newPassages = [...group.passages]; newPassages[pIdx].content = e.target.value; handleGroupChange(group.id, 'passages', newPassages); }} placeholder={`Passage ${pIdx + 1}...`} />
                                                                ))}
                                                                {group.passages.length < 3 && (<Button size="sm" variant="outline-dark" className="w-100" onClick={() => { handleGroupChange(group.id, 'passages', [...group.passages, {type: 'text', content: ''}]); }}>+ Thêm đoạn văn</Button>)}
                                                            </div>
                                                        )}
                                                        {group.part === 5 && <div className="text-muted small text-center pt-5">Part 5 không có dữ liệu chung</div>}
                                                    </div>
                                                </Col>
                                                <Col md={8} className="p-3 bg-white">
                                                    {group.questions.map((q, qIndex) => (
                                                        <div key={qIndex} className="mb-4 pb-3 border-bottom">
                                                            <div className="d-flex align-items-center mb-2">
                                                                <span className="badge bg-secondary me-2">Question {q.number}</span>
                                                            </div>
                                                            {group.part === 1 && (
                                                                <div className="d-flex align-items-center mb-2">
                                                                    <div className="me-2 border rounded d-flex align-items-center justify-content-center bg-light" style={{width: '60px', height: '60px'}}>
                                                                         {q.image ? <img src={q.image} alt="" style={{maxWidth: '100%', maxHeight: '100%'}}/> : <FaImage className="text-muted"/>}
                                                                    </div>
                                                                    <InputGroup size="sm" className="flex-grow-1">
                                                                        <InputGroup.Text>Link Ảnh</InputGroup.Text>
                                                                        <Form.Control placeholder="URL hình ảnh..." value={q.image} onChange={(e) => handleQuestionChange(group.id, qIndex, 'image', e.target.value)} />
                                                                    </InputGroup>
                                                                </div>
                                                            )}
                                                            {group.part !== 2 && (<Form.Control as="textarea" rows={2} className="mb-2 fw-bold bg-light" placeholder={group.part === 1 ? "Mô tả ảnh..." : "Nhập câu hỏi..."} value={q.description} onChange={(e) => handleQuestionChange(group.id, qIndex, 'description', e.target.value)} />)}
                                                            {renderOptions(group, qIndex, q)}
                                                            <Form.Control size="sm" className="mt-2" placeholder="Giải thích (optional)..." value={q.explanation} onChange={(e) => handleQuestionChange(group.id, qIndex, 'explanation', e.target.value)} />
                                                        </div>
                                                    ))}
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </Tab.Content>
                </Tab.Container>
            </div>
        </div>
    );
};

export default CreateFullTestQuiz;