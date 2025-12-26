interface SuccessResponse<T = any> {
  message: string;
  data: T;
}
interface PaginatedResponse<T = any> {
  rows: T[];
  count: number;
  hasNext: boolean;
  hasPrev: boolean;
}
export type { SuccessResponse, PaginatedResponse };
