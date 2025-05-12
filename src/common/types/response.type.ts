export interface ApiResponse<T = any> {
  message: string;
  timestamp: string;
  statusCode: number;
  data?: T;
  success: boolean
}
