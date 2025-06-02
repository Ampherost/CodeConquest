'use client';

import { useEffect } from 'react';

interface Props {
  moduleId: string;
  title: string;
  chapterSlug: string;
}

export default function ClientTracker({ moduleId, title, chapterSlug }: Props) {
  useEffect(() => {
    const lastViewed = {
      moduleId,
      title,
      chapterSlug,
      timestamp: Date.now()
    };

    localStorage.setItem('lastViewedModule', JSON.stringify(lastViewed));
  }, [moduleId, title, chapterSlug]);

  return null; // No visual output
}
