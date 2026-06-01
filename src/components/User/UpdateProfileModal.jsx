import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";
import "./UpdateProfileModal.scss";

const UpdateProfileModal = ({ isOpen, onClose, currentUser, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
    avatar: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        password: "",
        confirmPassword: "",
        avatar: currentUser.avatar || "",
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên không được để trống";
    }

    if (formData.password) {
      if (formData.password.length < 8) {
        newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
      }
    }

    if (formData.avatar && !isValidUrl(formData.avatar)) {
      newErrors.avatar = "URL avatar không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const updateData = {};
    if (formData.name !== currentUser.name) updateData.name = formData.name;
    if (formData.password) updateData.password = formData.password;
    if (formData.avatar !== currentUser.avatar) updateData.avatar = formData.avatar;

    if (Object.keys(updateData).length === 0) {
      toast.info("Không có thay đổi nào");
      return;
    }

    setLoading(true);
    try {
      const result = await onUpdate(updateData);
      if (result.success) {
        toast.success("Cập nhật thành công");
        handleClose();
      } else {
        toast.error(result.error || "Cập nhật thất bại");
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    setShowPassword(false);
    onClose();
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="upm-overlay" onClick={handleClose}>
      <div className="upm-content" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="upm-header">
          <h2>Cập nhật thông tin</h2>
          <button className="upm-close" onClick={handleClose}>
            ✕
          </button>
        </div>

        {/* FORM */}
        <form className="upm-form" onSubmit={handleSubmit}>
          <div className="avatar-preview">
            <img
              src={formData.avatar || "https://via.placeholder.com/120"}
              alt="avatar"
              onError={(e) => (e.target.src = "https://via.placeholder.com/120")}
            />
          </div>

          <div className="form-group">
            <label>Tên hiển thị *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "error" : ""}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>URL Avatar</label>
            <input
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              className={errors.avatar ? "error" : ""}
            />
            {errors.avatar && <span className="error-message">{errors.avatar}</span>}
            <small className="form-hint">Để trống nếu không đổi avatar</small>
          </div>

          <div className="form-divider">
            <span>Đổi mật khẩu (tùy chọn)</span>
          </div>

          <div className="form-group">
            <label>Mật khẩu mới</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "error" : ""}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                👁
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {formData.password && (
            <div className="form-group">
              <label>Xác nhận mật khẩu *</label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? "error" : ""}
              />
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>
          )}

          <div className="upm-actions">
            <button type="button" className="btn-cancel" onClick={handleClose}>
              Hủy
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default UpdateProfileModal;