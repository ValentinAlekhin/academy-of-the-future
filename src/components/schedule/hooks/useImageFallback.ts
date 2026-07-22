"use client";

import { useState } from "react";

export function useImageFallback(source: string | null) {
  const [failedSource, setFailedSource] = useState<string | null>(null);

  return {
    shouldShowImage: Boolean(source && failedSource !== source),
    handleImageError: () => setFailedSource(source),
  };
}
