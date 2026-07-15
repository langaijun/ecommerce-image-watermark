'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslations } from '@/lib/i18n/routing';
import { Upload, X, ImageIcon } from 'lucide-react';
import { useImageStore } from '@/lib/stores/imageStore';
import { formatFileSize } from '@/lib/utils/fileUtils';
import { generateSampleImages } from '@/lib/utils/sampleImages';
import { ACCEPTED_IMAGE_TYPES, MAX_UPLOAD_FILES } from '@/lib/constants/watermark';
import { trackUpload } from '@/lib/utils/analytics';
import { ThumbnailWatermark } from './ThumbnailWatermark';

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
        trackUpload(filesToAdd.length);
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
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 overflow-hidden ${
          isDragActive
            ? 'border-primary bg-primary/10 scale-[1.02]'
            : 'border-border/70 hover:border-primary/50 hover:bg-primary/[0.03]'
        }`}
      >
        {/* Gradient overlay for visual interest */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-accent/[0.04] pointer-events-none" />
        <input {...getInputProps()} />
        <div className="relative">
          <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
            isDragActive ? 'bg-primary/20' : 'bg-primary/10'
          }`}>
            <Upload className={`h-5 w-5 transition-colors ${
              isDragActive ? 'text-primary' : 'text-primary/70'
            }`} />
          </div>
          <p className="text-sm font-medium text-foreground">{t('dragDrop')}</p>
          <p className="text-xs text-muted-foreground mt-1.5">
            {t('formats')} · {t('maxFiles', { count: MAX_UPLOAD_FILES })}
          </p>
        </div>
      </div>

      {/* Try sample images */}
      {images.length === 0 && (
        <button
          onClick={async () => {
            const samples = await generateSampleImages();
            await addImages(samples);
          }}
          className="w-full mt-2 py-2 rounded-lg border border-dashed border-primary/30 text-xs font-medium text-primary/70 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 flex items-center justify-center gap-1.5"
        >
          📸 {t('trySamples')}
        </button>
      )}

      {/* Image gallery */}
      {images.length > 0 && (
        <>
          <div className="flex items-center justify-between mt-4 px-1">
            <span className="text-xs text-muted-foreground font-medium">
              {t('imageCount', { count: images.length })} ·{' '}
              {t('totalSize', { size: formatFileSize(getTotalSize()) })}
            </span>
            <button
              onClick={removeAll}
              className="text-xs text-destructive/80 hover:text-destructive font-medium transition-colors"
            >
              {t('removeAll')}
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 mt-3 overflow-y-auto flex-1 pr-0.5">
            {images.map((img) => (
              <div
                key={img.id}
                onClick={() => selectImage(img.id)}
                className={`relative group aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                  selectedId === img.id
                    ? 'border-primary ring-2 ring-primary/20 scale-[1.02]'
                    : 'border-transparent hover:border-primary/30 hover:scale-[1.02]'
                }`}
              >
                <img
                  src={img.previewUrl}
                  alt={img.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Watermark preview overlay */}
                <ThumbnailWatermark width={120} height={120} />
                {/* Info overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-end">
                  <div className="w-full p-1.5 bg-gradient-to-t from-black/70 to-transparent text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 truncate font-medium">
                    {img.width}×{img.height}
                  </div>
                </div>
                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(img.id);
                  }}
                  className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-destructive hover:scale-110"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-muted-foreground mt-3 px-1 flex items-center gap-1.5">
            <ImageIcon className="h-3 w-3" />
            {t('selectHint')}
          </p>
        </>
      )}
    </div>
  );
}
