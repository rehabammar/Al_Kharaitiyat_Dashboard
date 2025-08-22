export interface ApiResponse<T> {
  success: boolean;
  message: string;
  redirectPage?: string | null;
  data: T;
}
