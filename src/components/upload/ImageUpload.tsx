'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslations } from '@/lib/i18n/routing';
import { Upload, X } from 'lucide-react';
import { useImageStore } from '@/lib/stores/imageStore';
import { formatFileSize } from '@/lib/utils/fileUtils';
import { ACCEPTED_IMAGE_TYPES, MAX_UPLOAD_FILES } from '@/lib/constants/watermark';

export function ImageUpload() {
  const t = useTranslations('upload');
  const { images, selectedId, addImages, removeImage, removeAll, selectImage, getTotalSize } =
    useImageStore();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const remaining = MAX_UPLOAD_FILES - images.length;
      const filesToAdd = acceptedFiles.slice(0, remaining);
      if (filesToAdd.length > 0) {
        await addImages(filesToAdd);
      }
    },
    [images.length, addImages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_IMAGE_TYPES,
    maxFiles: MAX_UPLOAD_FILES,
  });

  return (
    <div className="flex flex-col h-full">
      {/* Upload zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-accent/50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm font-medium">{t('dragDrop')}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {t('formats')} · {t('maxFiles', { count: MAX_UPLOAD_FILES })}
        </p>
      </div>

      {/* Image gallery */}
      {images.length > 0 && (
        <>
          <div className="flex items-center justify-between mt-3 px-1">
            <span className="text-sm text-muted-foreground">
              {t('imageCount', { count: images.length })} ·{' '}
              {t('totalSize', { size: formatFileSize(getTotalSize()) })}
            </span>
            <button
              onClick={removeAll}
              className="text-xs text-destructive hover:underline"
            >
              {t('removeAll')}
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2 overflow-y-auto flex-1">
            {images.map((img) => (
              <div
                key={img.id}
                onClick={() => selectImage(img.id)}
                className={`relative group aspect-square rounded-md overflow-hidden cursor-pointer border-2 transition-colors ${
                  selectedId === img.id
                    ? 'border-primary ring-1 ring-primary'
                    : 'border-transparent hover:border-primary/30'
                }`}
              >
                <img
                  src={img.previewUrl}
                  alt={img.name}
                  className="w-full h-full object-cover"
                />
                {/* Info overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                  <div className="w-full p-1 bg-black/60 text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity truncate">
                    {img.width}×{img.height}
                  </div>
                </div>
                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(img.id);
                  }}
                  className="absolute top-0.5 right-0.5 h-5 w-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mt-2 px-1">
            {t('selectHint')}
          </p>
        </>
      )}
    </div>
  );
}
