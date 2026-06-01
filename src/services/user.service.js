import axiosInstance from '../utils/axios.config';

const getAllUsers = () => {
    return axiosInstance.get('/users/all'); 
}

// MỚI: Gọi API phân trang
// Backend nhận query param: page (và limit nếu backend hỗ trợ)
const getUserPaging = (page, limit) => {
    return axiosInstance.get(`/users/paging?page=${page}&limit=${limit}`);
}

const deleteUser = (userId) => {
    return axiosInstance.delete(`/users/${userId}`);
}

export {
    getAllUsers,
    getUserPaging, 
    deleteUser
}