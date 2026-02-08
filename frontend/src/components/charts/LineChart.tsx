import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface LineChartProps {
  data: { x: string; y: number }[];
  height?: number;
  lineColor?: string;
}

export default function LineChart({
  data,
  height = 180,
  lineColor = '#00e5ff',
}: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
        <CartesianGrid stroke="#2a2a3a" strokeDasharray="3 3" />
        <XAxis
          dataKey="x"
          tick={{ fill: '#55556a', fontSize: 10 }}
          axisLine={{ stroke: '#2a2a3a' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#55556a', fontSize: 10 }}
          axisLine={{ stroke: '#2a2a3a' }}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1a1a2e',
            border: '1px solid #2a2a3a',
            borderRadius: 4,
            fontSize: 11,
          }}
          labelStyle={{ color: '#8888a0' }}
          itemStyle={{ color: lineColor }}
        />
        <Line
          type="monotone"
          dataKey="y"
          stroke={lineColor}
          strokeWidth={2}
          dot={{ r: 3, fill: lineColor }}
          activeDot={{ r: 5 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
