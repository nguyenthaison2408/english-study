// src/utils/dateFormatter.js
export const formatDate = (dateString) => {
  if (!dateString) return 'Không xác định';
  
  try {
    const date = new Date(dateString);
    
    // Kiểm tra date hợp lệ
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    // Format theo kiểu Việt Nam: dd/MM/yyyy HH:mm
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Hoặc dùng Intl.DateTimeFormat (có sẵn trong browser)
export const formatDateLocale = (dateString, locale = 'vi-VN') => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  } catch {
    return dateString || 'Không xác định';
  }
};