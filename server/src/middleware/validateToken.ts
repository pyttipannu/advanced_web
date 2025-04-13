import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface CustomRequest extends Request {
  user?: {id: string; username: string};
}

const validateToken = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access Denied" });
    return;
  }

  try {
    const secret = process.env.SECRET as string;
    const decoded = jwt.verify(token, secret) as { id: string; username: string };
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Invalid token:", error);
    res.status(403).json({ message: "Invalid Token" });
    return; 
  }
};



/*const validateAdmin = (req: CustomRequest, res: Response, next: NextFunction): void => {
  if (req.user?.isAdmin) {
    return next();
  }
  res.status(403).json({ message: "Access Denied, Admins only" });
  return;
};
*/
export { validateToken };
