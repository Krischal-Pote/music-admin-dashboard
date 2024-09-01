import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken, DecodedToken } from "../../utils/auth";

export const authMiddleware = (roles: string[] = []) => {
  return async (req: NextApiRequest, res: NextApiResponse, next: Function) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded: DecodedToken | null = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (roles.length && !roles.includes(decoded.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = decoded;
    next();
  };
};
