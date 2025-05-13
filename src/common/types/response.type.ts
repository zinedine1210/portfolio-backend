export interface ApiResponse<T = any> {
  message: string;
  timestamp: string;
  statusCode: number;
  data?: T;
  success: boolean
}

export interface ApiResponseWithPagination<T = any> {
  total: number;
  page: number;
  limit: number;
  data: T;
}