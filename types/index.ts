export type UserRole = "super_admin" | "artist_manager" | "artist";
export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  role: string;
  address: string;
  created_at: string;
  updated_at: string;
  password: string;
  __v: number;
}
