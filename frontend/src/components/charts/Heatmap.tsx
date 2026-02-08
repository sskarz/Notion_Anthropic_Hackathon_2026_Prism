interface HeatmapProps {
  data: { label: string; value: number }[];
}

export default function Heatmap({ data }: HeatmapProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="grid grid-cols-4 gap-1">
      {data.map((entry, i) => (
        <div
          key={i}
          className="flex flex-col items-center justify-center rounded p-2 text-center"
          style={{ backgroundColor: `rgba(0, 229, 255, ${(entry.value / maxValue) * 0.7 + 0.1})` }}
        >
          <span className="text-[10px] font-medium text-bg-primary truncate w-full">
            {entry.label}
          </span>
          <span className="text-xs font-semibold text-bg-primary">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}
