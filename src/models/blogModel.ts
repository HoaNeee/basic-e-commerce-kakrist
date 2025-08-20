export interface BlogModel {
  _id: string;
  user_id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  tags: string[];
  readTime: number;
  status: string;
  deleted: boolean;
  author: {
    fullName: string;
    avatar: string;
  };
  view: number;
  liked: string[];
  likedLength: number;
  createdAt: string;
  updatedAt: string;
  slug: string;
}
