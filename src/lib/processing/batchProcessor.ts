import { Zip, ZipPassThrough } from 'fflate';
import type { WatermarkConfig, SizeSpec, ProcessedImage, ProcessResult } from '@/lib/types';
import { processImage } from './imageProcessor';

export interface BatchProcessOptions {
  images: File[];
  watermarkConfig: WatermarkConfig;
  format: string;
  quality: number;
  selectedSizes: SizeSpec[];
  platformId?: string;
  filenameTemplate?: string;
  concurrency?: number;
  onProgress?: (current: number, total: number, name: string) => void;
  signal?: AbortSignal;
}

/**
 * Batch processing pipeline.
 * Expands tasks: images × sizes, processes with concurrency pool, streams to ZIP.
 */
export async function runBatchProcess(
  options: BatchProcessOptions
): Promise<ProcessResult> {
  const {
    images,
    watermarkConfig,
    format,
    quality,
    selectedSizes,
    platformId,
    filenameTemplate,
    concurrency = 3,
    signal,
  } = options;

  // Expand tasks: each image × each size, with sequential index
  let seqIndex = 0;
  const tasks = images.flatMap((image) =>
    selectedSizes.map((size) => ({ image, sizeSpec: size, seqIndex: ++seqIndex }))
  );

  const totalTasks = tasks.length;
  let completed = 0;
  const success: ProcessedImage[] = [];
  const failed: { file: string; error: string }[] = [];

  // ZIP streaming
  const zipChunks: Uint8Array[] = [];
  const zip = new Zip((error, data) => {
    if (error) throw error;
    zipChunks.push(new Uint8Array(data));
  });

  // Concurrency pool
  let taskIndex = 0;

  async function processNext(): Promise<void> {
    if (signal?.aborted) return;
    if (taskIndex >= totalTasks) return;

    const task = tasks[taskIndex++];
    const { image, sizeSpec, seqIndex: fileIndex } = task;

    try {
      const result = await processImage(
        image,
        watermarkConfig,
        format,
        quality,
        sizeSpec,
        platformId,
        filenameTemplate,
        fileIndex
      );

      // Write to ZIP
      const zipFile = new ZipPassThrough(result.fileName);
      zip.add(zipFile);

      const arrayBuffer = await result.blob.arrayBuffer();
      zipFile.push(new Uint8Array(arrayBuffer), true);

      success.push(result);
      completed++;
      options.onProgress?.(completed, totalTasks, image.name);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      failed.push({ file: image.name, error: error.message });
      completed++;
      options.onProgress?.(completed, totalTasks, image.name);
    }

    // Continue with next task
    if (taskIndex < totalTasks && !signal?.aborted) {
      await processNext();
    }
  }

  // Start concurrent workers
  const workers = Array.from(
    { length: Math.min(concurrency, totalTasks) },
    () => processNext()
  );
  await Promise.all(workers);

  // Finalize ZIP
  zip.end();
  const zipBlob = new Blob(zipChunks as BlobPart[], { type: 'application/zip' });

  // Statistics
  const totalOriginalSize = images.reduce((sum, f) => sum + f.size, 0);
  const totalProcessedSize = success.reduce(
    (sum, r) => sum + r.processedSize,
    0
  );

  return {
    success,
    failed,
    zipBlob,
    totalOriginalSize,
    totalProcessedSize,
  };
}
