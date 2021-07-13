import jwt from "jsonwebtoken";
import { ulid } from "ulid";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.log("JWT SECRET IS UNDEFINED");
  process.exit(0);
}

export const createJWT = (letters: string[]): string => {
  return jwt.sign({ user: ulid(), letters }, JWT_SECRET);
};

export const verifyJWT = (token: string): jwt.JwtPayload => {
  const result = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
  return result;
};
