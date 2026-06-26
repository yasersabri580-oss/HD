import { AnimatedCounter } from "../components/animated-counter";
import { PulseIcon } from "../components/icons";
import type { Locale } from "../lib/l10n";

type StatCardProps = {
  value: number;
  label: string;
  suffix?: string;
  note: string;
  locale: Locale;
};

export function StatCard({
  value,
  label,
  suffix = "",
  note,
  locale,
}: StatCardProps) {
  return (
    <article className="stat-card">
      <span className="stat-icon">
        <PulseIcon />
      </span>

      <strong className="stat-value">
        <AnimatedCounter
          value={value}
          suffix={suffix}
          locale={locale}
        />
      </strong>

      <div>
        <p className="stat-label">{label}</p>
        <p>{note}</p>
      </div>
    </article>
  );
}