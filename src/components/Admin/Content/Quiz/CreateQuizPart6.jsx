import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { postCreateNewQuiz, getQuizById, putUpdateQuiz } from '../../../../services/quizService'; 
import './CreateQuizPart6.scss'; 

const CreateQuizPart6 = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // 1. Config
    const [quizInfo, setQuizInfo] = useState({
        title: '',
        level: 'Medium',
        timeLimit: 12, 
        part: 6,
    });

    // 2. Init 4 Groups (16 questions total)
    const initGroups = Array.from({ length: 4 }, (_, gIndex) => {
        const startQ = 131 + (gIndex * 4);
        return {
            id: gIndex, 
            groupTitle: `Questions ${startQ}-${startQ + 3} refer to the following...`,
            passageText: "", 
            questions: Array.from({ length: 4 }, (_, qIndex) => ({
                number: startQ + qIndex,
                correctAnswer: '',
                explanation: '',
                options: [
                    { text: '', image: '' }, 
                    { text: '', image: '' }, 
                    { text: '', image: '' }, 
                    { text: '', image: '' }  
                ]
            }))
        };
    });

    const [groups, setGroups] = useState(initGroups);

    // --- FETCH DATA (TRANSFORM FLAT DATA TO GROUPS) ---
    const fetchQuizDetail = useCallback(async () => {
        try {
            let res = await getQuizById(id);
            if (res && res.data) {
                const backendData = res.data;
                console.log("Check Data Part 6:", backendData);

                // 1. Bind Header Info
                setQuizInfo({
                    title: backendData.title || '',
                    level: backendData.level || 'Medium',
                    timeLimit: backendData.timeLimit || 12,
                    part: 6,
                });

                // 2. TRANSFORM LOGIC: Flat Questions -> Grouped UI
                // The JSON shows 'questions' is a flat array of 16 items
                if (backendData.questions && backendData.questions.length > 0) {
                    const newGroups = [];
                    
                    // We need to create 4 groups from 16 questions
                    for (let i = 0; i < 4; i++) {
                        const startIndex = i * 4;
                        // Get 4 questions for this group
                        const chunk = backendData.questions.slice(startIndex, startIndex + 4);
                        
                        if (chunk.length > 0) {
                            // EXTRACTION: 
                            // In your JSON, passage is at questionText[0]
                            // Label (e.g. "Question 131") is at questionText[1]
                            const rawText = chunk[0].questionText; 
                            const passage = Array.isArray(rawText) ? rawText[0] : "";

                            const startQ = 131 + (i * 4);

                            newGroups.push({
                                id: i,
                                groupTitle: `Questions ${startQ}-${startQ + 3} refer to the following...`,
                                passageText: passage,
                                questions: chunk.map((q, idx) => ({
                                    number: startQ + idx, // Re-calculate number to be safe
                                    correctAnswer: q.correctAnswer || "",
                                    explanation: q.explanation || "",
                                    options: q.options.map(opt => ({
                                        text: opt.text || "",
                                        image: opt.image || ""
                                    }))
                                }))
                            });
                        }
                    }
                    
                    if (newGroups.length > 0) {
                        setGroups(newGroups);
                    }
                }
            }
        } catch (error) {
            console.log(error);
            toast.error("Lỗi khi tải dữ liệu bài thi!");
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchQuizDetail();
        }
    }, [id, fetchQuizDetail]);

    // --- HANDLERS ---
    const handleInfoChange = (e) => setQuizInfo({ ...quizInfo, [e.target.name]: e.target.value });

    const handleGroupChange = (gIndex, field, value) => {
        const newGroups = [...groups];
        newGroups[gIndex][field] = value;
        setGroups(newGroups);
    };

    const handleExplanationChange = (gIndex, qIndex, value) => {
        const newGroups = [...groups];
        newGroups[gIndex].questions[qIndex].explanation = value;
        setGroups(newGroups);
    };

    const handleCorrectAnswer = (gIndex, qIndex, value) => {
        const newGroups = [...groups];
        newGroups[gIndex].questions[qIndex].correctAnswer = value;
        setGroups(newGroups);
    };

    const handleOptionChange = (gIndex, qIndex, optIndex, value) => {
        const newGroups = [...groups];
        newGroups[gIndex].questions[qIndex].options[optIndex].text = value;
        setGroups(newGroups);
    };

    // --- SUBMIT (TRANSFORM GROUPS BACK TO FLAT DATA) ---
    const handleSubmit = async () => {
        // 1. Validate
        if (!quizInfo.title) return toast.error("Vui lòng nhập tên bài thi!");

        for (let g of groups) {
            if (!g.passageText) return toast.error(`${g.groupTitle}: Chưa nhập nội dung đoạn văn`);
            for (let q of g.questions) {
                if (!q.correctAnswer) return toast.error(`Câu ${q.number}: Chưa chọn đáp án đúng`);
            }
        }

        // 2. Prepare Payload
        // We must flatten the groups back to the 16-question array format provided in your JSON
        let flatQuestions = [];

        groups.forEach(g => {
            g.questions.forEach(q => {
                // Construct the object exactly as your JSON requires
                flatQuestions.push({
                    // Recreate the array: [Passage, Label]
                    questionText: [g.passageText, `Question ${q.number}`], 
                    questionImage: "", // Part 6 rarely has images, usually text
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                    explanation: q.explanation,
                    point: 1 // Default point
                });
            });
        });

        const payload = { 
            ...quizInfo, 
            questions: flatQuestions // Send 'questions' array, not 'data'
        };

        try {
            let res;
            if (id) {
                res = await putUpdateQuiz(id, payload);
                if (res) { 
                    toast.success("Cập nhật Part 6 thành công!");
                    navigate('/admin/manage-quiz/part/6');
                }
            } else {
                res = await postCreateNewQuiz(payload);
                if (res && res.data) {
                    toast.success("Tạo Part 6 thành công!");
                    navigate('/admin/manage-quiz/part/6');
                }
            }
        } catch (error) {
            console.error("Error submit quiz:", error);
            toast.error(error.response?.data?.message || "Lỗi server");
        }
    };

    return (
        <div className="create-quiz-part6-container">
            <div className="container pt-4">
                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="m-0 fw-bold text-primary">
                        <i className="fa fa-newspaper-o me-2"></i>
                        {id ? `Cập nhật Part 6 (ID: ${id})` : "Tạo đề Part 6 (Text Completion)"}
                    </h2>
                    <button className="btn btn-outline-secondary" onClick={() => navigate('/admin/manage-quiz/part/6')}>
                        <i className="fa fa-arrow-left me-2"></i> Quay lại
                    </button>
                </div>

                {/* INFO CARD */}
                <div className="card shadow-sm mb-5 border-0 bg-white" style={{borderRadius: '12px'}}>
                    <div className="card-body p-4">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label fw-bold text-secondary">Tên bài thi</label>
                                <input 
                                    className="form-control form-control-lg" 
                                    name="title" 
                                    value={quizInfo.title} 
                                    onChange={handleInfoChange} 
                                    placeholder="VD: ETS 2024 Test 1 - Part 6" 
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-bold text-secondary">Mức độ</label>
                                <select className="form-select form-select-lg" name="level" value={quizInfo.level} onChange={handleInfoChange}>
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-bold text-secondary">Thời gian (phút)</label>
                                <input 
                                    type="number" 
                                    className="form-control form-control-lg" 
                                    name="timeLimit" 
                                    value={quizInfo.timeLimit} 
                                    onChange={handleInfoChange} 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* GROUPS LOOP */}
                {groups.map((group, gIndex) => (
                    <div key={gIndex} className="card mb-4 shadow-sm border-0 overflow-hidden">
                        <div className="card-header bg-light border-bottom-0 p-3">
                            <div className="d-flex align-items-center">
                                <i className="fa fa-file-text-o me-2 text-primary fa-lg"></i>
                                <input 
                                    type="text" 
                                    className="form-control fw-bold border-0 bg-transparent text-primary"
                                    value={group.groupTitle}
                                    onChange={(e) => handleGroupChange(gIndex, 'groupTitle', e.target.value)}
                                    style={{fontSize: '1.1rem'}}
                                />
                            </div>
                        </div>

                        <div className="card-body p-0">
                            <div className="row g-0">
                                {/* LEFT: PASSAGE TEXT */}
                                <div className="col-lg-5 border-end">
                                    <div className="p-3 h-100 d-flex flex-column">
                                        <label className="fw-bold mb-2 text-secondary">Nội dung đoạn văn (Passage):</label>
                                        <textarea 
                                            className="form-control flex-grow-1" 
                                            style={{minHeight: '350px', backgroundColor: '#fdfdfd'}}
                                            placeholder={`Nhập nội dung đoạn văn...`}
                                            value={group.passageText}
                                            onChange={(e) => handleGroupChange(gIndex, 'passageText', e.target.value)}
                                        ></textarea>
                                    </div>
                                </div>

                                {/* RIGHT: QUESTIONS */}
                                <div className="col-lg-7">
                                    <div className="p-3" style={{backgroundColor: '#fafafa', height: '100%'}}>
                                        <label className="fw-bold mb-3 text-secondary">Danh sách câu hỏi:</label>
                                        <div className="row g-2">
                                            {group.questions.map((q, qIndex) => (
                                                <div key={qIndex} className="col-12 col-md-6">
                                                    <div className="card border h-100 shadow-sm">
                                                        <div className="card-header py-1 px-3 bg-white fw-bold text-center">
                                                            Question {q.number}
                                                        </div>
                                                        <div className="card-body p-2">
                                                            {/* Options */}
                                                            {q.options.map((opt, oIdx) => {
                                                                const label = ['A', 'B', 'C', 'D'][oIdx];
                                                                const isSelected = q.correctAnswer === label;
                                                                return (
                                                                    <div key={oIdx} className="input-group input-group-sm mb-1">
                                                                        <span 
                                                                            className={`input-group-text cursor-pointer fw-bold ${isSelected ? 'bg-success text-white' : 'bg-light'}`}
                                                                            style={{width: '35px', justifyContent:'center', cursor: 'pointer'}}
                                                                            onClick={() => handleCorrectAnswer(gIndex, qIndex, label)}
                                                                        >
                                                                            {label}
                                                                        </span>
                                                                        <input 
                                                                            type="text" 
                                                                            className={`form-control ${isSelected ? 'border-success' : ''}`}
                                                                            value={opt.text}
                                                                            onChange={(e) => handleOptionChange(gIndex, qIndex, oIdx, e.target.value)}
                                                                        />
                                                                    </div>
                                                                )
                                                            })}
                                                            <textarea 
                                                                className="form-control form-control-sm mt-2" 
                                                                rows="2"
                                                                placeholder="Giải thích..."
                                                                value={q.explanation}
                                                                onChange={(e) => handleExplanationChange(gIndex, qIndex, e.target.value)}
                                                                style={{fontSize: '0.8rem', resize: 'none'}}
                                                            ></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="text-center mt-5 mb-5">
                    <button 
                        className={`btn btn-lg px-5 py-3 shadow ${id ? 'btn-warning text-white' : 'btn-primary'}`} 
                        onClick={handleSubmit}
                        style={{borderRadius: '50px'}}
                    >
                        <i className={`fa ${id ? 'fa-pencil' : 'fa-save'} me-2`}></i> 
                        {id ? "CẬP NHẬT BÀI THI PART 6" : "LƯU BÀI THI PART 6"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateQuizPart6;