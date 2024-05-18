import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/custom-errors';

export function ErrorHandler(
  err: CustomError,
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error('Error:', message);
  res.status(status).json({ message });

  next();
}
