export interface PostInfo{
  id: number;
  userId: number;
  content: string;  // Dùng kiểu string thay vì String
  privacy: string;  // Dùng kiểu string thay vì String
  tags: string;     // Dùng kiểu string thay vì String
  created_at: string;  // Giữ kiểu string ban đầu từ API
  updated_at: string;  // Giữ kiểu string ban đầu từ API
}
