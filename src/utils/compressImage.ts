const MAX_SOURCE_BYTES = 15 * 1024 * 1024;
const TARGET_MAX_BYTES = 900 * 1024;
const DEFAULT_MAX_WIDTH = 1200;
const DEFAULT_MAX_HEIGHT = 1600;
const DEFAULT_QUALITY = 0.82;
const MIN_QUALITY = 0.5;

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Falha ao comprimir imagem'));
      },
      'image/jpeg',
      quality,
    );
  });
}

export async function compressImage(file: File): Promise<File> {
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error('A imagem é demasiado grande. Use um ficheiro com menos de 15 MB.');
  }

  if (file.size <= TARGET_MAX_BYTES && file.type === 'image/jpeg') {
    return file;
  }

  const bitmap = await createImageBitmap(file);

  try {
    let { width, height } = bitmap;
    const ratio = Math.min(
      DEFAULT_MAX_WIDTH / width,
      DEFAULT_MAX_HEIGHT / height,
      1,
    );

    width = Math.round(width * ratio);
    height = Math.round(height * ratio);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('O browser não suporta processamento de imagem.');
    }

    context.drawImage(bitmap, 0, 0, width, height);

    let quality = DEFAULT_QUALITY;
    let blob = await canvasToBlob(canvas, quality);

    while (blob.size > TARGET_MAX_BYTES && quality > MIN_QUALITY) {
      quality -= 0.08;
      blob = await canvasToBlob(canvas, quality);
    }

    const baseName = file.name.replace(/\.[^.]+$/, '') || 'capa';

    return new File([blob], `${baseName}.jpg`, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });
  } finally {
    bitmap.close();
  }
}
