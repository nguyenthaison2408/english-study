import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllQuiz, deleteQuiz } from '../../../services/quizService';
import { toast } from 'react-toastify';

const QuizListByPart = () => {
    const { partNumber } = useParams();
    const navigate = useNavigate();
    const [listQuiz, setListQuiz] = useState([]);

    // ✅ Xử lý title động
    const getPartTitle = () => {
        if (partNumber === "0") return "Full Test";
        return `Part ${partNumber}`;
    };

    const fetchListQuiz = useCallback(async () => {
        try {
            let res = await getAllQuiz();
            if (res && res.data) {
                // Lọc theo part number (bao gồm cả part 0 = Full Test)
                const filtered = res.data.filter(q => q.part === Number(partNumber));
                setListQuiz(filtered);
            }
        } catch (error) {
            console.log(error);
            toast.error("Lỗi khi tải danh sách bài thi");
        }
    }, [partNumber]);

    useEffect(() => {
        fetchListQuiz();
    }, [partNumber, fetchListQuiz]);

    const handleDelete = async (id) => {
        if (window.confirm(`Bạn có chắc muốn xóa bài thi ${getPartTitle()} này không?`)) {
            try {
                let res = await deleteQuiz(id);
                if (res) {
                    toast.success("Xóa thành công!");
                    fetchListQuiz();
                }
            } catch (error) {
                console.log(error);
                toast.error("Xóa thất bại!");
            }
        }
    };

    const handleEdit = (quizId) => {
        // Route: /admin/update-quiz-part{N}/{id}
        navigate(`/admin/update-quiz-part${partNumber}/${quizId}`);
    };

    const handleCreateNew = () => {
        // ✅ Xử lý route tạo mới cho Full Test
        if (partNumber === "0") {
            navigate('/admin/create-full-test');
        } else {
            navigate(`/admin/create-quiz-part${partNumber}`);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Danh sách bài thi - {getPartTitle()}</h3>
                <div>
                    <button className="btn btn-secondary me-2" onClick={() => navigate('/admin/manage-quiz')}>
                        <i className="fa fa-arrow-left"></i> Quay lại
                    </button>
                    <button className="btn btn-primary" onClick={handleCreateNew}>
                        <i className="fa fa-plus"></i> Tạo mới {getPartTitle()}
                    </button>
                </div>
            </div>
           
            <div className="table-responsive">
                <table className="table table-bordered table-hover shadow-sm">
                    <thead className="table-dark">
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Tên bài thi</th>
                            <th scope="col">Mô tả</th>
                            <th scope="col">Độ khó</th>
                            <th scope="col">Thời gian</th>
                            <th scope="col" className="text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listQuiz && listQuiz.length > 0 ? (
                            listQuiz.map((item, index) => (
                                <tr key={item._id}>
                                    <td>{index + 1}</td>
                                    <td className="fw-bold text-primary">{item.title}</td>
                                    <td>{item.description || '---'}</td>
                                    <td>
                                        <span className={`badge ${
                                            item.level === 'Easy' ? 'bg-success' :
                                            item.level === 'Medium' ? 'bg-warning text-dark' : 'bg-danger'
                                        }`}>
                                            {item.level}
                                        </span>
                                    </td>
                                    <td>{item.timeLimit} phút</td>
                                    <td className="text-center">
                                        <button
                                            className="btn btn-outline-warning btn-sm me-2"
                                            onClick={() => handleEdit(item._id)}
                                            title="Sửa bài thi"
                                        >
                                            <i className="fa fa-pencil"></i>
                                        </button>
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => handleDelete(item._id)}
                                            title="Xóa bài thi"
                                        >
                                            <i className="fa fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-muted">
                                    <i className="fa fa-folder-open fa-2x mb-2 d-block"></i>
                                    Chưa có bài thi nào cho {getPartTitle()}.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default QuizListByPart;