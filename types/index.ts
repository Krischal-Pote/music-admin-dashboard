export type UserRole = "super_admin" | "artist_manager" | "artist";
export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  dob?: Date;
  gender: "m" | "f" | "o";
  address?: string;
  role: "super_admin" | "artist_manager" | "artist";
  created_at?: Date;
  updated_at?: Date;
}
