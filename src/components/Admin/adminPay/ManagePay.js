import React, { useEffect, useState } from 'react';
import { getAllQuiz } from '../../../services/quizService';
import { toast } from 'react-toastify';
import './ManagePay.scss';
import { useAuth } from '../../../hooks/useAuth';

const ITEMS_PER_PAGE = 5;

const ManagePay = () => {
    const { getAllUser } = useAuth();

    const [paidUsers, setPaidUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('vi-VN');
    };

    const fetchPaidUsers = async () => {
        try {
            // Lấy toàn bộ user
            const userRes = await getAllUser();
            const users = userRes?.data || [];

            const userMap = {};
            users.forEach(u => {
                userMap[u.userId] = u;
            });

            // Lấy toàn bộ quiz
            const quizRes = await getAllQuiz();
            const quizzes = quizRes?.data || [];

            // danh sách user đã mua
            const result = [];

            quizzes.forEach(quiz => {
                if (Array.isArray(quiz.userPay)) {
                    quiz.userPay.forEach(userId => {
                        const user = userMap[userId];
                        if (user) {
                            result.push({
                                userId: user.userId,
                                name: user.name,
                                email: user.email,
                                productTitle: quiz.title,
                                buyDate: new Date() 
                            });
                        }
                    });
                }
            });

         setPaidUsers(result.reverse());

            setCurrentPage(1);
        } catch (error) {
            console.error(error);
            toast.error('Lỗi khi tải danh sách user đã mua');
        }
    };

    useEffect(() => {
        fetchPaidUsers();
    }, []);

   
    const totalPages = Math.ceil(paidUsers.length / ITEMS_PER_PAGE);

    const paginatedUsers = paidUsers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="manage-user-container">
            <div className="title">Danh sách user đã mua hàng</div>

            <div className="users-content">
                <div className="table-users-container">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>User ID</th>
                                <th>Tên user</th>
                                <th>Sản phẩm</th>
                                <th>Ngày mua</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers.length > 0 ? (
                                paginatedUsers.map((user, index) => (
                                    <tr key={index}>
                                        <td>
                                            {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                        </td>
                                        <td>{user.userId}</td>
                                        <td>{user.name || 'No name'}</td>
                                        <td>{user.productTitle}</td>
                                        <td>{formatDate(user.buyDate)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        Không có user nào mua hàng
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            
                {totalPages > 1 && (
                    <div className="pagination-wrapper">
                        <button
                            className="btn-page prev"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                        >
                            ‹
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                className={`btn-page ${currentPage === i + 1 ? 'active' : ''}`}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            className="btn-page next"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                        >
                            ›
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManagePay;
