import React from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  trend: string;
  description?: string;
  trendDirection?: "up" | "down";
  icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  trend,
  description,
  trendDirection = "up",
  icon,
}) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-2 transition-all hover:shadow-md hover:-translate-y-1">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon && <span className="text-xl">{icon}</span>}
        <span className="text-xs font-medium uppercase tracking-wider">{title}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold">{value}</span>
        <span className={`text-sm font-semibold ${trendDirection === "up" ? "text-green-600" : "text-red-600"}`}>
          {trend}
        </span>
      </div>
      {description && <div className="text-xs text-muted-foreground">{description}</div>}
    </div>
  );
};
