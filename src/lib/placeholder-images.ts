import data from '@/app/lib/placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

// Add safety check to ensure placeholderImages exists and is an array
export const PlaceHolderImages: ImagePlaceholder[] = Array.isArray(data?.placeholderImages) 
  ? data.placeholderImages 
  : [];
