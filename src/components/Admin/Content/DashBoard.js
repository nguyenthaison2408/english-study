import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../utils/axios.config';
import { 
  Users, 
  BookOpen, 
  Award, 
  DollarSign, 
  RefreshCw, 
  PlusCircle, 
  UserCheck, 
  CreditCard,
  Clock,
  CheckCircle2
} from 'lucide-react';
import './DashBoard.scss';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      const res = await axios.get('/dashboard/stats');
      if (res.data?.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Vừa xong';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    });
  };

  const getScoreBadgeClass = (score) => {
    if (score >= 80 || score >= 8) return 'high';
    if (score >= 50 || score >= 5) return 'medium';
    return 'low';
  };

  if (loading) {
    return (
      <div className="admin-dashboard-container d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3 text-muted">Đang tải dữ liệu bảng điều khiển...</p>
        </div>
      </div>
    );
  }

  const overview = stats?.overview || {};
  const partDistribution = stats?.partDistribution || [];
  const recentActivities = stats?.recentActivities || [];

  // Tìm giá trị max để tính tỉ lệ phần trăm thanh bar
  const maxPartCount = Math.max(...partDistribution.map((p) => p.count), 1);

  return (
    <div className="admin-dashboard-container">
      {/* HEADER */}
      <div className="dashboard-header">
        <div className="header-left">
          <h2>Bảng Điều Khiển Quản Trị (Admin Dashboard)</h2>
          <p>Tổng quan hệ thống luyện thi TOEIC, học viên và doanh thu thời gian thực</p>
        </div>
        <div className="header-right">
          <button 
            className={`btn-refresh ${refreshing ? 'loading' : ''}`}
            onClick={fetchStats}
            title="Làm mới số liệu"
          >
            <RefreshCw size={16} /> Làm mới
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="kpi-cards-grid">
        {/* Total Users */}
        <div className="kpi-card">
          <div className="card-info">
            <div className="card-title">Tổng Người Dùng</div>
            <div className="card-value">{overview.totalUsers || 0}</div>
            <div className="card-subtext">
              <span>{overview.totalStudents || 0}</span> học viên, {overview.totalAdmins || 0} admin
            </div>
          </div>
          <div className="card-icon-wrapper users">
            <Users size={28} />
          </div>
        </div>

        {/* Total Quizzes */}
        <div className="kpi-card">
          <div className="card-info">
            <div className="card-title">Kho Đề Thi TOEIC</div>
            <div className="card-value">{overview.totalQuizzes || 0}</div>
            <div className="card-subtext">
              <span>Đầy đủ 7 Part</span> & Full Test
            </div>
          </div>
          <div className="card-icon-wrapper quizzes">
            <BookOpen size={28} />
          </div>
        </div>

        {/* Total Exam Results */}
        <div className="kpi-card">
          <div className="card-info">
            <div className="card-title">Lượt Thi Đã Nộp</div>
            <div className="card-value">{overview.totalResults || 0}</div>
            <div className="card-subtext">
              <span>{overview.totalPosts || 0}</span> bài viết diễn đàn
            </div>
          </div>
          <div className="card-icon-wrapper results">
            <Award size={28} />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="kpi-card">
          <div className="card-info">
            <div className="card-title">Doanh Thu Mở Khóa Đề</div>
            <div className="card-value">
              {(overview.totalRevenue || 0).toLocaleString('vi-VN')} đ
            </div>
            <div className="card-subtext">
              <span>{overview.totalBuyers || 0}</span> lượt thanh toán VNPay
            </div>
          </div>
          <div className="card-icon-wrapper revenue">
            <DollarSign size={28} />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT: DISTRIBUTION & RECENT ACTIVITIES */}
      <div className="dashboard-main-grid">
        {/* Cột Trái: Phân Bố Đề Thi Theo Part */}
        <div className="section-card">
          <div className="card-header-inner">
            <h3>Phân Bố Đề Thi Theo Part</h3>
            <span className="badge-tag">{overview.totalQuizzes || 0} Đề Trong Hệ Thống</span>
          </div>

          <div className="part-bars-list">
            {partDistribution.map((item, index) => {
              const percent = Math.round((item.count / maxPartCount) * 100);
              return (
                <div className="bar-item" key={index}>
                  <div className="bar-label-row">
                    <span>{item.part}</span>
                    <span>{item.count} đề</span>
                  </div>
                  <div className="bar-track">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${item.count > 0 ? Math.max(percent, 8) : 0}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cột Phải: Hoạt Động Thi Gần Đây */}
        <div className="section-card">
          <div className="card-header-inner">
            <h3>Lượt Thi Gần Đây Nhất</h3>
            <span className="badge-tag">Thời gian thực</span>
          </div>

          <div className="table-responsive">
            <table className="recent-table">
              <thead>
                <tr>
                  <th>Học viên</th>
                  <th>Bài thi</th>
                  <th>Điểm</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.length > 0 ? (
                  recentActivities.map((act) => (
                    <tr key={act.id}>
                      <td>
                        <div className="user-cell">
                          <span className="u-name">{act.userName}</span>
                          {act.userEmail && <span className="u-email">{act.userEmail}</span>}
                        </div>
                      </td>
                      <td>
                        <strong>{act.quizTitle}</strong>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{act.part}</div>
                      </td>
                      <td>
                        <span className={`badge-score ${getScoreBadgeClass(act.score)}`}>
                          {act.score} đ
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '0.8rem' }}>
                          <Clock size={12} /> {formatDate(act.completedAt)}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-muted">
                      Chưa có lượt nộp bài nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS BAR */}
      <div className="quick-actions-bar">
        <div className="qa-left">
          <h4>Truy Cập Nhanh Quản Trị</h4>
          <p>Các tác vụ thường xuyên dành cho Quản trị viên hệ thống</p>
        </div>
        <div className="qa-buttons">
          <button 
            className="btn-qa primary"
            onClick={() => navigate('/admin/manage-quiz')}
          >
            <PlusCircle size={16} /> Quản Lý & Tạo Đề Thi
          </button>
          <button 
            className="btn-qa outline"
            onClick={() => navigate('/admin/manage-users')}
          >
            <UserCheck size={16} /> Danh Sách Học Viên
          </button>
          <button 
            className="btn-qa outline"
            onClick={() => navigate('/admin/manage-pay')}
          >
            <CreditCard size={16} /> Quản Lý Đơn Mua VIP
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;