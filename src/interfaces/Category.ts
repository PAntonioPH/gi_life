export interface Category {
  id: number;
  name: string;
  active: boolean;
  date_update: string;
  url: string
  time_update: string;
  father: null;
  father_name?: string
  children: Category[];
  posts?: any
}
