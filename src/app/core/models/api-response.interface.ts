export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  redirectPage?: string | null;
  data: T;
}
