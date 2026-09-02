import { Response } from 'express';

export interface ApiResponseOptions<T = any> {
  res: Response;
  statusCode?: number;
  success?: boolean;
  message: string;
  data?: T;
}

export const sendResponse = <T>({
  res,
  statusCode = 200,
  success = true,
  message,
  data,
}: ApiResponseOptions<T>) => {
  return res.status(statusCode).json({
    success,
    message,
    ...(data !== undefined && { data }),
  });
};
