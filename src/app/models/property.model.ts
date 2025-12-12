
import { User } from './user.model';

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  imageUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  owner: User;
}
