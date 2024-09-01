import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key_here"; // Ensure this is in your environment variables

export interface DecodedToken extends JwtPayload {
  id: string;
  role: "super_admin" | "artist_manager" | "artist";
}

export const generateToken = (user: DecodedToken): string => {
  return jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
    expiresIn: "1h",
  });
};

export const verifyToken = (token: string): DecodedToken | null => {
  try {
    return jwt.verify(token, SECRET_KEY) as DecodedToken;
  } catch (error) {
    return null;
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};
