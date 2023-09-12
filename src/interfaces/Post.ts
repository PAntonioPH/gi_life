export interface Post {
  id: number;
  title: string;
  content: string;
  img: string;
  author: string
  photo_author?: string;
  date_update: string;
  time_update: string;
  category: string;
  sub_category: string;
}
