

export interface PostForHome{
  userAvatar:string;
  userName:string;
  images:[];
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


