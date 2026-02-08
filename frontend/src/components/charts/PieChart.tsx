import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = ['#00e5ff', '#22c55e', '#eab308', '#ef4444', '#6366f1', '#8888a0', '#a855f7'];

interface PieChartProps {
  data: { name: string; value: number }[];
  height?: number;
}

export default function PieChart({ data, height = 180 }: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius="45%"
          outerRadius="75%"
          paddingAngle={2}
          stroke="none"
        >
          {data.map((entry, i) => (
            <Cell key={i} name={entry.name} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#1a1a2e',
            border: '1px solid #2a2a3a',
            borderRadius: 4,
            fontSize: 11,
          }}
          itemStyle={{ color: '#e0e0e8' }}
        />
        <Legend
          iconSize={8}
          wrapperStyle={{ fontSize: 10, color: '#8888a0' }}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}
