"use client";

import type { Trainer } from "@/lib/types";
import { useImageFallback } from "../hooks/useImageFallback";
import { DEFAULT_TRAINER_INITIALS } from "./constants";
import styles from "./TrainerAvatar.module.css";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function TrainerAvatar({ trainer }: { trainer: Trainer }) {
  const { shouldShowImage, handleImageError } = useImageFallback(trainer.photoUrl);

  return (
    <div className={styles.avatar} aria-hidden="true">
      {trainer.photoUrl && shouldShowImage ? (
        // The image host comes from VivaCRM and may change, so Next image optimization is unsuitable.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={trainer.photoUrl}
          alt=""
          onError={handleImageError}
          referrerPolicy="no-referrer"
        />
      ) : (
        <span>{getInitials(trainer.name) || DEFAULT_TRAINER_INITIALS}</span>
      )}
    </div>
  );
}
