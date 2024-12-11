export interface PostForComment{
  userAvatar:string;
  userName:string;
  images:{fileName:string,filePath:string}[];
  id: number;
  userId: number;
  content: string;
  privacy: string;
  tags: string;
  createdAt: string;
  updatedAt: string;
  liked: boolean;
  totalLike:number;
  totalComment:number;
  comments: { userAvatar:string,userName: string; content: string }[];
}
