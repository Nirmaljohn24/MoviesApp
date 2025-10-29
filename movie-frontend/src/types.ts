
export interface Movie {
  _id?: string;
  title: string;
  type: 'Movie' | 'TV Show';
  director?: string;
  budget?: number;
  location?: string;
  duration?: string;
  yearOrTime?: string;
  details?: string;
  createdAt?: string;
}
