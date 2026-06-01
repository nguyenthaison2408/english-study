
import React, { useState } from "react";
import SideBar from "./SideBar";
import { useAuth } from "../../hooks/useAuth";
import UpdateProfileModal from "./UpdateProfileModal";
import "./UserProfile.scss";

export default function UserProfile() {
  const { user, updateProfile } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!user) {
    return (
      <div className="userprofile-page">
        <SideBar active="Tài khoản" />
        <main className="main-content">
          <p>Đang tải dữ liệu người dùng...</p>
        </main>
      </div>
    );
  }
 
  const handleUpdateProfile = async (updateData) => {
    const result = await updateProfile(updateData);
    if (result.success) {
      return result;
    } else {
      throw new Error(result.error);
    }
  };

  // Lấy avatar
  const avatarUrl = user?.avatar || "https://hinhnenpowerpoint.app/wp-content/uploads/2025/07/avatar-con-gian-cute.jpg";
  
  // Lấy tên
  const displayName = user?.name || "User";
  
  // Tạo username từ email hoặc id
  const username = user?.email?.split('@')[0] || user?._id?.substring(0, 7) || "user";

  return (
    <div className="userprofile-page">
      <SideBar active="Tài khoản" />

      <main className="main-content">
 
        <header className="profile-header">
          <div className="avatar-container">
            <img src={avatarUrl} alt="avatar" onError={(e) => {
              e.target.src = "https://via.placeholder.com/120";
            }} />
            <span className="flag-icon">🇻🇳</span>
          </div>
          <h2 className="display-name">{displayName}</h2>
          <p className="username">
            Username: {username}{" "}
            <i
              className="fa-regular fa-copy copy-icon"
              onClick={() => {
                navigator.clipboard.writeText(username);
                alert("Đã copy username!");
              }}
              style={{ cursor: "pointer" }}
            ></i>
          </p>
          <div className="header-buttons">
            <button className="update-btn beautiful-btn" onClick={() => setIsModalOpen(true)}>
  <i className="fa-solid fa-user-pen"></i> Cập nhật thông tin
</button>
            <button className="upgrade-btn">
              <i className="fa-solid fa-crown"></i> Nâng Cấp
            </button>
          </div>
        </header>

       
        <div className="dashboard-grid">
     
          <div className="left-column">
            {/* 4 Ô Thống kê (Grid 2x2) */}
            <div className="stats-grid">
              <div className="stat-card green">
                <div className="icon-wrapper">
                  <i className="fa-solid fa-book"></i>
                </div>
                <div className="stat-info">
                  <span className="stat-value">{user.xpPoints}</span>
                  <span className="stat-label">từ đã học</span>
                </div>
              </div>
              <div className="stat-card orange">
                <div className="icon-wrapper">
                  <i className="fa-solid fa-trophy"></i>
                </div>
                <div className="stat-info">
                  <span className="stat-value">Level</span>
                  <span className="stat-label">{user.level}</span>
                </div>
              </div>
              <div className="stat-card gray">
                <div className="icon-wrapper">
                  <i className="fa-solid fa-fire"></i>
                </div>
                <div className="stat-info">
                 <span className="stat-value">
                    {Math.floor(
                      (new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)
                    )} ngày
                  </span>
                  <span className="stat-label">Streak</span>
                </div>
              </div>
              <div className="stat-card blue">
                <div className="icon-wrapper">
                  <i className="fa-solid fa-medal"></i>
                </div>
                <div className="stat-info">
                  <span className="stat-value">0</span>
                  <span className="stat-label">Điểm KN</span>
                </div>
              </div>
            </div>

            {/* Streak Freeze */}
            <div className="freeze-card">
              <div className="freeze-info">
                <div className="freeze-icon">❄️</div>
                <span>0 Streak Freeze</span>
              </div>
              <button className="equip-btn">Trang bị thêm</button>
            </div>

            {/* Biểu đồ */}
            <div className="chart-card">
              <div className="chart-legend">
                <div className="legend-item blue">
                  <span className="dot"></span> Số từ đã học
                </div>
                <div className="legend-item green">
                  <span className="dot"></span> Số từ đã luyện tập
                </div>
              </div>
              <div className="chart-area">
                <div className="y-axis-line"></div>
                <div className="x-axis-line"></div>
                <div className="x-labels">
                  <span>T2</span>
                  <span>T3</span>
                  <span>T4</span>
                  <span>T5</span>
                  <span>T6</span>
                  <span>T7</span>
                  <span>CN</span>
                  <span>Hôm nay</span>
                </div>
                <div className="chart-placeholder-line"></div>
              </div>
            </div>
          </div>

          {/* -------- CỘT PHẢI (Đá quý, Nhiệm vụ, Referral) -------- */}
          <div className="right-column">
            <div className="panel-card">
              <div className="gems-header">
                <span>Bạn đang có</span>
                <span className="gem-count">💎 20 đá quý</span>
              </div>

              <div className="task-list">
                <div className="task-item">
                  <div className="check-icon">
                    <i className="fa-solid fa-circle-check"></i>
                  </div>
                  <div className="task-text">
                    Check in mỗi ngày nhận ngay 5 đá quý
                  </div>
                </div>
                <div className="task-item">
                  <div className="flag-icon">
                    <i className="fa-regular fa-flag"></i>
                  </div>
                  <div className="task-content">
                    <div className="task-text">
                      Hoàn thành 10 phút học nhận 10 đá quý
                    </div>
                    <div className="progress-bar">
                      <div className="fill" style={{ width: "0%" }}></div>
                    </div>
                  </div>
                  <div className="edit-icon">
                    <i className="fa-solid fa-pen-to-square"></i>
                  </div>
                </div>
              </div>

              <div className="download-banner">
                <i className="fa-solid fa-download"></i> Tải app để kiếm thêm đá
                quý
              </div>

              <div className="referral-section">
                <h4>Nhập mã giới thiệu nhận ngay 500 đá quý</h4>
                <p className="ref-desc text-red">
                  Bạn cần có 500 điểm KN để nhập mã giới thiệu. Điểm KN hiện tại:
                  0
                </p>

                <p className="ref-desc">
                  Chia sẻ mã giới thiệu của bạn <span className="code">{username}</span>{" "}
                  <i
                    className="fa-regular fa-copy"
                    onClick={() => {
                      navigator.clipboard.writeText(username);
                      alert("Đã copy mã giới thiệu!");
                    }}
                    style={{ cursor: "pointer" }}
                  ></i>{" "}
                  với bạn bè ngay nào! Mỗi khi ai đó sử dụng mã, cả bạn và họ đều
                  nhận được 500 đá quý. Không giới hạn số người nhập mã!
                </p>

                <div className="social-list">
                  <button className="social-btn facebook">
                    <div className="content">
                      <span className="title">
                        Theo dõi Lingoland trên Facebook
                      </span>
                      <span className="reward">+30 💎</span>
                    </div>
                    <div className="bg-img fb"></div>
                  </button>
                  <button className="social-btn tiktok">
                    <div className="content">
                      <span className="title">Theo dõi Lingoland trên TikTok</span>
                      <span className="reward">+30 💎</span>
                    </div>
                    <div className="bg-img tt"></div>
                  </button>
                  <button className="social-btn group">
                    <div className="content">
                      <span className="title">
                        Tham gia nhóm Tự học tiếng Anh
                      </span>
                      <span className="reward">+30 💎</span>
                    </div>
                    <div className="bg-img gr"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Update Profile */}
      <UpdateProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentUser={user}
        onUpdate={handleUpdateProfile}
      />
    </div>
  );
}