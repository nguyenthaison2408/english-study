// src/components/Forum/PostForm.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './PostForm.scss'; // Import style riêng của form

const PostForm = ({ 
  onSubmit, 
  initialData = null, 
  onCancel, 
  loading = false,
  mode = 'create' 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [imagePreview, setImagePreview] = useState('');

  // Cập nhật form khi initialData thay đổi
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        image: initialData.image || '',
      });
      setImagePreview(initialData.image || '');
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      image: '',
    });
    setErrors({});
    setTouched({});
    setImagePreview('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Xóa lỗi khi user bắt đầu nhập
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Preview image khi nhập URL
    if (name === 'image') {
      setImagePreview(value);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, formData[name]);
  };

  const validateField = (fieldName, value) => {
    const newErrors = { ...errors };

    switch (fieldName) {
      case 'title':
        if (!value.trim()) {
          newErrors.title = 'Tiêu đề không được để trống';
        } else if (value.length > 100) {
          newErrors.title = 'Tiêu đề không được vượt quá 100 ký tự';
        } else {
          delete newErrors.title;
        }
        break;

      case 'content':
        if (!value.trim()) {
          newErrors.content = 'Nội dung không được để trống';
        } else if (value.length < 10) {
          newErrors.content = 'Nội dung phải có ít nhất 10 ký tự';
        } else if (value.length > 1000) {
          newErrors.content = 'Nội dung không được vượt quá 1000 ký tự';
        } else {
          delete newErrors.content;
        }
        break;

      case 'image':
        if (value && !isValidUrl(value)) {
          newErrors.image = 'URL hình ảnh không hợp lệ';
        } else {
          delete newErrors.image;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate title
    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề không được để trống';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Tiêu đề không được vượt quá 100 ký tự';
    }
    
    // Validate content
    if (!formData.content.trim()) {
      newErrors.content = 'Nội dung không được để trống';
    } else if (formData.content.length < 10) {
      newErrors.content = 'Nội dung phải có ít nhất 10 ký tự';
    } else if (formData.content.length > 1000) {
      newErrors.content = 'Nội dung không được vượt quá 1000 ký tự';
    }
    
    // Validate image URL
    if (formData.image && !isValidUrl(formData.image)) {
      newErrors.image = 'URL hình ảnh không hợp lệ';
    }
    
    setErrors(newErrors);
    
    // Mark all fields as touched
    setTouched({
      title: true,
      content: true,
      image: true,
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }

    try {
      await onSubmit(formData);
      
      // Reset form sau khi submit thành công (chỉ khi create)
      if (mode === 'create') {
        resetForm();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      resetForm();
      onCancel();
    }
  };

  const isFormValid = () => {
    return formData.title.trim() && 
           formData.content.trim() && 
           Object.keys(errors).length === 0;
  };

  const getCharacterCountClass = (current, max) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'text-danger';
    if (percentage >= 75) return 'text-warning';
    return 'text-muted';
  };

  return (
    <div className="post-form-container">
      <div className="post-form-header">
        <h3 className="post-form-title">
          <i className={`fa-solid ${mode === 'edit' ? 'fa-pen-to-square' : 'fa-plus-circle'}`}></i>
          {mode === 'edit' ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
        </h3>
        {mode === 'edit' && (
          <button
            type="button"
            className="btn-close-form"
            onClick={handleCancel}
            disabled={loading}
            title="Đóng"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="post-form" noValidate>
        {/* Title Field */}
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Tiêu đề <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className={`form-control ${touched.title && errors.title ? 'is-invalid' : ''} ${touched.title && !errors.title && formData.title ? 'is-valid' : ''}`}
            placeholder="Nhập tiêu đề bài viết (ví dụ: Tips học TOEIC hiệu quả)"
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength="100"
            disabled={loading}
            autoFocus={mode === 'create'}
          />
          {touched.title && errors.title && (
            <div className="invalid-feedback">
              <i className="fa-solid fa-circle-exclamation"></i>
              {errors.title}
            </div>
          )}
          <div className={`form-text text-end ${getCharacterCountClass(formData.title.length, 100)}`}>
            {formData.title.length}/100 ký tự
          </div>
        </div>

        {/* Content Field */}
        <div className="form-group">
          <label htmlFor="content" className="form-label">
            Nội dung <span className="required">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            className={`form-control ${touched.content && errors.content ? 'is-invalid' : ''} ${touched.content && !errors.content && formData.content ? 'is-valid' : ''}`}
            placeholder="Chia sẻ kinh nghiệm, kiến thức hoặc đặt câu hỏi về TOEIC..."
            rows="6"
            value={formData.content}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength="1000"
            disabled={loading}
          />
          {touched.content && errors.content && (
            <div className="invalid-feedback">
              <i className="fa-solid fa-circle-exclamation"></i>
              {errors.content}
            </div>
          )}
          <div className={`form-text text-end ${getCharacterCountClass(formData.content.length, 1000)}`}>
            {formData.content.length}/1000 ký tự
          </div>
        </div>

        {/* Image Field */}
        <div className="form-group">
          <label htmlFor="image" className="form-label">
            Hình ảnh (tùy chọn)
          </label>
          <input
            type="url"
            id="image"
            name="image"
            className={`form-control ${touched.image && errors.image ? 'is-invalid' : ''} ${touched.image && !errors.image && formData.image ? 'is-valid' : ''}`}
            placeholder="https://example.com/image.jpg"
            value={formData.image}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
          />
          {touched.image && errors.image && (
            <div className="invalid-feedback">
              <i className="fa-solid fa-circle-exclamation"></i>
              {errors.image}
            </div>
          )}
          <div className="form-text">
            <i className="fa-solid fa-circle-info"></i>
            Dán URL hình ảnh từ internet (jpg, png, gif)
          </div>
        </div>

        {/* Image Preview */}
        {imagePreview && !errors.image && (
          <div className="image-preview">
            <label className="form-label">Xem trước hình ảnh</label>
            <div className="preview-wrapper">
              <img 
                src={imagePreview} 
                alt="Preview" 
                onError={(e) => {
                  e.target.style.display = 'none';
                  setErrors(prev => ({ ...prev, image: 'Không thể tải hình ảnh từ URL này' }));
                }}
              />
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="form-actions">
          {onCancel && (
            <button
              type="button"
              className="btn btn-cancel"
              onClick={handleCancel}
              disabled={loading}
            >
              <i className="fa-solid fa-xmark"></i>
              <span>Hủy</span>
            </button>
          )}
          
          <button
            type="submit"
            className="btn btn-submit"
            disabled={loading || !isFormValid()}
          >
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <i className={`fa-solid ${mode === 'edit' ? 'fa-check' : 'fa-paper-plane'}`}></i>
                <span>{mode === 'edit' ? 'Cập nhật' : 'Đăng bài'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;