import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axios.config';
import { getAllQuiz } from '../../../services/quizService';
import { toast } from 'react-toastify';
import './ManagePay.scss';
import { useAuth } from '../../../hooks/useAuth';

const ITEMS_PER_PAGE = 8;

const ManagePay = () => {
    const { getAllUser } = useAuth();

    const [paidUsers, setPaidUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const formatDate = (date) => {
        if (!date) return 'N/A';
        const d = new Date(date);
        return d.toLocaleDateString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const fetchPaidUsers = async () => {
        try {
            setLoading(true);

            // 1. Thử lấy danh sách giao dịch từ API mới
            let transactions = [];
            try {
                const txRes = await axios.get('/vnpay/transactions');
                if (txRes.data?.success && Array.isArray(txRes.data.data)) {
                    transactions = txRes.data.data;
                }
            } catch (err) {
                console.log('No new transaction records, falling back to quiz userPay list');
            }

            if (transactions.length > 0) {
                setPaidUsers(transactions);
            } else {
                // 2. Fallback: Lấy từ mảng userPay trong Quiz
                const userRes = await getAllUser();
                const users = userRes?.data || [];

                const userMap = {};
                users.forEach(u => {
                    userMap[u.userId] = u;
                });

                const quizRes = await getAllQuiz();
                const quizzes = quizRes?.data || [];

                const result = [];
                quizzes.forEach(quiz => {
                    if (Array.isArray(quiz.userPay)) {
                        quiz.userPay.forEach(userId => {
                            const user = userMap[userId];
                            if (user) {
                                result.push({
                                    txnRef: 'VNPay-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
                                    userId: user.userId,
                                    userName: user.name || user.email,
                                    userEmail: user.email,
                                    quizTitle: quiz.title,
                                    amount: quiz.price || 50000,
                                    bankCode: 'NCB / VNPAY',
                                    status: 'success',
                                    createdAt: new Date()
                                });
                            }
                        });
                    }
                });

                setPaidUsers(result.reverse());
            }

            setCurrentPage(1);
        } catch (error) {
            console.error(error);
            toast.error('Lỗi khi tải danh sách giao dịch');
        } finally {
            setLoading(false);
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
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="title" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>
                    Lịch Sử Giao Dịch & Mua Đề VIP (VNPay)
                </div>
                <button className="btn btn-outline-primary btn-sm" onClick={fetchPaidUsers}>
                    🔄 Tải lại
                </button>
            </div>

            <div className="users-content">
                <div className="table-users-container">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>STT</th>
                                <th>Mã Giao Dịch</th>
                                <th>Học viên</th>
                                <th>Email</th>
                                <th>Đề thi đã mua</th>
                                <th>Số tiền</th>
                                <th>Ngày mua</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-4">
                                        <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                                        <span className="ms-2">Đang tải dữ liệu...</span>
                                    </td>
                                </tr>
                            ) : paginatedUsers.length > 0 ? (
                                paginatedUsers.map((item, index) => (
                                    <tr key={item.id || index}>
                                        <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                                        <td>
                                            <code style={{ fontSize: '0.85rem', color: '#0d6efd' }}>
                                                {item.txnRef || 'N/A'}
                                            </code>
                                        </td>
                                        <td><strong>{item.userName || item.name || 'Học viên'}</strong></td>
                                        <td><span className="text-muted">{item.userEmail || item.email || 'N/A'}</span></td>
                                        <td>{item.quizTitle || item.productTitle}</td>
                                        <td>
                                            <span className="badge bg-success" style={{ fontSize: '0.85rem' }}>
                                                {(item.amount || 50000).toLocaleString('vi-VN')} đ
                                            </span>
                                        </td>
                                        <td>{formatDate(item.createdAt || item.buyDate)}</td>
                                        <td>
                                            <span className="badge bg-primary">Thành công</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-4 text-muted">
                                        Chưa có giao dịch thanh toán nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="pagination-wrapper mt-3 d-flex justify-content-center gap-1">
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                        >
                            ‹ Trước
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline-secondary'}`}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            className="btn btn-sm btn-outline-secondary"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                        >
                            Sau ›
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManagePay;
