import type { Nullable } from '@/types';

const imageModules = import.meta.glob('/src/assets/**/*.{jpg,jpeg,png,webp,svg,gif}', {
  eager: true,
});

const imageMap: Record<string, string> = {};

for (const path in imageModules) {
  const filename = path.split('/').pop();
  if (filename) {
    imageMap[filename] = (imageModules[path] as { default: string }).default;
  }
}

export const getImageByFilename = (filename?: Nullable<string>): string => {
  const placeholder = 'placeholder.jpg';
  return imageMap[filename || placeholder] || imageMap[placeholder];
};
