import { AnimatedCounter } from "../components/animated-counter";
import { PulseIcon } from "../components/icons";

type StatCardProps = {
  value: number;
  label: string;
  suffix?: string;
  note: string;
};

export function StatCard({ value, label, suffix = "", note }: StatCardProps) {
  return (
    <article className="stat-card">
      <span className="stat-icon">
        <PulseIcon />
      </span>
      <strong className="stat-value">
        <AnimatedCounter value={value} suffix={suffix} />
      </strong>
      <div>
        <p className="stat-label">{label}</p>
        <p>{note}</p>
      </div>
    </article>
  );
}