export interface PostForHome{
  id: number;
  userId: number;
  content: string;  // Dùng kiểu string thay vì String
  privacy: string;  // Dùng kiểu string thay vì String
  tags: string;     // Dùng kiểu string thay vì String
  createdAt: string;  // Giữ kiểu string ban đầu từ API
  updatedAt: string;  // Giữ kiểu string ban đầu từ API
  images: string[];  // Mảng các đường dẫn đến hình ản
}
