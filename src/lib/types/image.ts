// Image type definitions

export interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
  fileSize: number;
  name: string;
}

export interface ImageDimensions {
  width: number;
  height: number;
}
