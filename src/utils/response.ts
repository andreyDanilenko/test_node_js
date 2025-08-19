import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export class ResponseHandler {
  static success<T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = 200
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data
    };
    return res.status(statusCode).json(response);
  }

  static created<T>(
    res: Response,
    data: T,
    message: string = 'Resource created successfully'
  ): Response {
    return this.success(res, data, message, 201);
  }

  static error(
    res: Response,
    error: Error | string,
    statusCode: number = 500
  ): Response {
    const errorMessage = error instanceof Error ? error.message : error;
    
    const response: ApiResponse = {
      success: false,
      error: errorMessage
    };
    
    return res.status(statusCode).json(response);
  }
}
