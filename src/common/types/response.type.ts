export interface ApiResponse<T = any> {
  message: string;
  timestamp: string;
  data?: T;
  success: boolean
}
