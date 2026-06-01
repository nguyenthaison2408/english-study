import './SideBar.scss';
// Đã xóa FaGithub ra khỏi dòng import này
import { FaUsers, FaBook, FaQuestionCircle, FaTachometerAlt, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const SideBar = (props) => {
    const { collapsed } = props;
    
    // Lấy thông tin user và hàm logout từ Context
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Hàm xử lý đăng xuất
    const handleLogout = () => {
        logout();
        navigate('/adminlogin');
    };

    return (
        <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="logo-container">
                    {/* Hiển thị Avatar */}
                    {user && user.avatar ? (
                        <img 
                            src={user.avatar} 
                            alt="Avatar" 
                            className="logo-img" 
                            style={{ 
                                width: '40px', 
                                height: '40px', 
                                borderRadius: '50%', 
                                objectFit: 'cover'
                            }} 
                        />
                    ) : (
                        <div className="logo-circle">
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                    )}
                    
                    {/* Hiển thị Tên Admin */}
                    {!collapsed && (
                        <span className="logo-text">
                            {user?.name || user?.email || "Admin"}
                        </span>
                    )}
                </div>
            </div>

            <div className="sidebar-content">
                <nav className="sidebar-nav">
                    <Link to="/admin" className="nav-item">
                        <FaTachometerAlt className="nav-icon" />
                        {!collapsed && <span>Dashboard</span>}
                    </Link>
                    
                    <div className="nav-divider"></div>
                    
                    <Link to="/admin/manage-users" className="nav-item">
                        <FaUsers className="nav-icon" />
                        {!collapsed && <span>Quản lý Users</span>}
                    </Link>
                    
                    <Link to="/admin/manage-quiz" className="nav-item">
                        <FaBook className="nav-icon" />
                        {!collapsed && <span>Quản lý Bài Quiz</span>}
                    </Link>
                    
                    <Link to="/admin/manage-pay" className="nav-item">
                        <FaQuestionCircle className="nav-icon" />
                        {!collapsed && <span>Lịch sử thanh toán</span>}
                    </Link>
                </nav>
            </div>

            <div className="sidebar-footer">
                {/* Nút đăng xuất */}
                <div 
                    className="footer-btn" 
                    onClick={handleLogout} 
                    style={{cursor: 'pointer'}}
                >
                    <FaSignOutAlt className="footer-icon" />
                    {!collapsed && <span>Đăng xuất</span>}
                </div>
            </div>
        </div>
    );
}

export default SideBar;