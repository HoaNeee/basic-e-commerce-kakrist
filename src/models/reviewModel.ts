export interface ReviewModel {
  _id: string;
  user_id: string;
  product_id: string;
  title: string;
  content: string;
  star: number;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  countComment?: number;
  images: string[];
  user?: {
    lastName: string;
    firstName: string;
    avatar?: string;
  };
}

export interface CommentModel {
  _id: string;
  user_id: string;
  product_id: string;
  review_id: string;
  parent_id: string;
  content: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  countComment: number;
  user?: {
    lastName: string;
    firstName: string;
    avatar?: string;
  };
}
