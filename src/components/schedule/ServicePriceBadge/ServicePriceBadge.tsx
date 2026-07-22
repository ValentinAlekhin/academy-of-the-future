"use client";

import { useId, useState } from "react";
import styles from "./ServicePriceBadge.module.css";
import {
  DEFAULT_TRIAL_PRICE_RUB,
  priceFormatter,
} from "./constants";

interface ServicePriceBadgeProps {
  priceRub: number | null;
}

export function ServicePriceBadge({ priceRub }: ServicePriceBadgeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const dialogId = useId();
  const price = priceRub ?? DEFAULT_TRIAL_PRICE_RUB;
  const formattedPrice = priceFormatter.format(price);

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.badge}
        aria-expanded={isExpanded}
        aria-controls={dialogId}
        aria-label="Доступные услуги для записи"
        onClick={() => setIsExpanded((current) => !current)}
      >
        {isExpanded ? formattedPrice : "энергия"}
      </button>
      {isExpanded ? (
        <div
          className={styles.popover}
          id={dialogId}
          role="dialog"
          aria-label="Доступные услуги для записи"
        >
          <span>Доступные услуги для записи</span>
          <div>
            <span>Разовая тренировка</span>
            <strong>
              {formattedPrice} / 1 посещение
            </strong>
          </div>
        </div>
      ) : null}
    </div>
  );
}
