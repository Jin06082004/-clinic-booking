// Validate URL to ensure it's a valid image URL
export const isValidImageUrl = (url) => {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

// Get safe image URL or fallback to placeholder
export const getSafeImageUrl = (url, placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"%3EKhông có ảnh%3C/text%3E%3C/svg%3E') => {
  if (isValidImageUrl(url)) {
    return url;
  }
  return placeholder;
};

// Format date to YYYY-MM-DD
export const formatDateForInput = (date = new Date()) => {
  return date.toISOString().split('T')[0];
};

// Map status từ tiếng Anh sang tiếng Việt
export const translateStatus = (status) => {
  const statusMap = {
    'pending': 'Chờ xác nhận',
    'confirmed': 'Đã xác nhận',
    'cancelled': 'Đã hủy',
    'completed': 'Hoàn thành'
  };
  return statusMap[status] || status;
};

// Map status từ tiếng Việt sang tiếng Anh
export const translateStatusToEn = (status) => {
  const statusMap = {
    'Chờ xác nhận': 'pending',
    'Đã xác nhận': 'confirmed',
    'Đã hủy': 'cancelled',
    'Hoàn thành': 'completed'
  };
  return statusMap[status] || status;
};

// Map ngày trong tuần từ tiếng Anh sang tiếng Việt
export const translateDay = (day) => {
  const dayMap = {
    'Monday': 'Thứ Hai',
    'Tuesday': 'Thứ Ba',
    'Wednesday': 'Thứ Tư',
    'Thursday': 'Thứ Năm',
    'Friday': 'Thứ Sáu',
    'Saturday': 'Thứ Bảy',
    'Sunday': 'Chủ Nhật'
  };
  return dayMap[day] || day;
};

// Map ngày trong tuần từ tiếng Việt sang tiếng Anh
export const translateDayToEn = (day) => {
  const dayMap = {
    'Thứ Hai': 'Monday',
    'Thứ Ba': 'Tuesday',
    'Thứ Tư': 'Wednesday',
    'Thứ Năm': 'Thursday',
    'Thứ Sáu': 'Friday',
    'Thứ Bảy': 'Saturday',
    'Chủ Nhật': 'Sunday'
  };
  return dayMap[day] || day;
};

// Format date sang tiếng Việt
export const formatDateVN = (date) => {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// Map role từ tiếng Anh sang tiếng Việt
export const translateRole = (role) => {
  const roleMap = {
    "admin": "Quản Trị Viên",
    "receptionist": "Lễ Tân",
    "user": "Người Dùng"
  };
  return roleMap[role] || role;
};
