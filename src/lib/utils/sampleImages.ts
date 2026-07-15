interface SampleConfig {
  width: number;
  height: number;
  name: string;
  bgGradient: [string, string];
  shape: 'circle' | 'rect' | 'diamond';
  shapeColor: string;
}

const SAMPLES: SampleConfig[] = [
  {
    width: 1000,
    height: 1000,
    name: 'sample-product-square.jpg',
    bgGradient: ['#f0f4ff', '#dbe4ff'],
    shape: 'circle',
    shapeColor: '#6366f1',
  },
  {
    width: 800,
    height: 1200,
    name: 'sample-product-portrait.jpg',
    bgGradient: ['#fef3f2', '#fde8e8'],
    shape: 'rect',
    shapeColor: '#f43f5e',
  },
  {
    width: 1200,
    height: 800,
    name: 'sample-product-wide.jpg',
    bgGradient: ['#ecfdf5', '#d1fae5'],
    shape: 'diamond',
    shapeColor: '#10b981',
  },
];

function drawSampleImage(config: SampleConfig): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = config.width;
  canvas.height = config.height;
  const ctx = canvas.getContext('2d')!;

  // Gradient background
  const grad = ctx.createLinearGradient(0, 0, config.width, config.height);
  grad.addColorStop(0, config.bgGradient[0]);
  grad.addColorStop(1, config.bgGradient[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, config.width, config.height);

  const cx = config.width / 2;
  const cy = config.height / 2;
  const size = Math.min(config.width, config.height) * 0.25;

  // Shape
  ctx.fillStyle = config.shapeColor;
  ctx.globalAlpha = 0.15;
  if (config.shape === 'circle') {
    ctx.beginPath();
    ctx.arc(cx, cy, size, 0, Math.PI * 2);
    ctx.fill();
  } else if (config.shape === 'rect') {
    ctx.fillRect(cx - size, cy - size * 1.2, size * 2, size * 2.4);
  } else {
    ctx.beginPath();
    ctx.moveTo(cx, cy - size);
    ctx.lineTo(cx + size, cy);
    ctx.lineTo(cx, cy + size);
    ctx.lineTo(cx - size, cy);
    ctx.closePath();
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Shape outline
  ctx.strokeStyle = config.shapeColor;
  ctx.lineWidth = 3;
  ctx.globalAlpha = 0.4;
  if (config.shape === 'circle') {
    ctx.beginPath();
    ctx.arc(cx, cy, size, 0, Math.PI * 2);
    ctx.stroke();
  } else if (config.shape === 'rect') {
    ctx.strokeRect(cx - size, cy - size * 1.2, size * 2, size * 2.4);
  } else {
    ctx.beginPath();
    ctx.moveTo(cx, cy - size);
    ctx.lineTo(cx + size, cy);
    ctx.lineTo(cx, cy + size);
    ctx.lineTo(cx - size, cy);
    ctx.closePath();
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Text
  const fontSize = Math.round(Math.min(config.width, config.height) * 0.045);
  ctx.fillStyle = config.shapeColor;
  ctx.font = `600 ${fontSize}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SAMPLE PRODUCT', cx, cy + size + fontSize * 1.5);

  // Size label
  const labelSize = Math.round(fontSize * 0.55);
  ctx.font = `400 ${labelSize}px system-ui, sans-serif`;
  ctx.fillStyle = '#999';
  ctx.fillText(`${config.width} × ${config.height}`, cx, cy + size + fontSize * 2.5);

  return canvas;
}

export async function generateSampleImages(): Promise<File[]> {
  const files: File[] = [];

  for (const config of SAMPLES) {
    const canvas = drawSampleImage(config);
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.92);
    });
    files.push(new File([blob], config.name, { type: 'image/jpeg' }));
  }

  return files;
}
