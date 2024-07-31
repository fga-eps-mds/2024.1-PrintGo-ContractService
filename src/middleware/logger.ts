import { Request, Response, NextFunction } from "express";

const logger = (request: Request, response: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${request.method} ${request.originalUrl}`);
  next();
};

export default logger;