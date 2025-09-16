export interface ImageItem {
  id: string;
  src: string;     // absolute or relative URL returned by backend
  alt?: string;
  uploaded?: boolean; // true if saved on server
}
