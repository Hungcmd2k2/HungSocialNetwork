import { HttpInterceptorFn } from '@angular/common/http';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  const user = sessionStorage.getItem('session_user');
  let cloneReq = req; // Khởi tạo biến cloneReq bằng request gốc

  if (user) {
    try {
      // Chuyển chuỗi JSON thành object
      const userObject = JSON.parse(user);
      const token = userObject.token;

      // Clone request và thêm Authorization header
      cloneReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error("Invalid session_user data in sessionStorage:", error);
    }
  }

  // Chuyển request (đã hoặc chưa được clone) đến bước tiếp theo
  return next(cloneReq);
};

