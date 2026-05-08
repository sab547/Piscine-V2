import Image from 'next/image';
import { ImgHTMLAttributes } from 'react';

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  containerClassName?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill,
  priority = false,
  containerClassName = '',
  className = '',
  ...props
}: OptimizedImageProps) {
  // For data URLs (base64) or relative paths, use regular img tag
  // These are typically photos captured on client side
  const isDataUrl = src?.startsWith('data:');
  const isRelativePath = src && !src.startsWith('http');

  if (isDataUrl || isRelativePath) {
    return (
      <div className={containerClassName}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          {...(props as any)}
        />
      </div>
    );
  }

  // For external URLs, use Next.js Image for optimization
  return (
    <div className={containerClassName}>
      <Image
        src={src}
        alt={alt}
        width={typeof width === 'string' ? 500 : (width || 500)}
        height={typeof height === 'string' ? 500 : (height || 500)}
        priority={priority}
        className={className}
        {...(props as any)}
      />
    </div>
  );
}
