export interface ICustomResponse<T = any> {
    statusCode: number;
    data: T;
    message: string[];    
    timestamp: string;
  }
  
export class CustomResponse {
  
  private constructor() {}

  static success<T>(data: T, message: string = 'Operation was successful', statusCode: number = 200): ICustomResponse<T> {
    return {
      statusCode,
      data,
      message:[message],
      timestamp: new Date().toISOString()
    };
  }

  static error(message: string = 'Operation failed', statusCode: number = 500): ICustomResponse<null> {
    return {
      statusCode,
      data: null,
      message:[message],
      timestamp: new Date().toISOString()
    };
  }
  
}
