'use client';

import { useEffect } from 'react';
import { event } from '@/lib/pixel';

export default function CategoryPixelTracker({ categoryName }) {
  useEffect(() => {
    event('ViewCategory', { content_category: categoryName });
  }, [categoryName]);

  return null;
}
