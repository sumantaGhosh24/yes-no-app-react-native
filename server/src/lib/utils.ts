import jwt from "jsonwebtoken";

export const createAccessToken = (user: object) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!);
};
