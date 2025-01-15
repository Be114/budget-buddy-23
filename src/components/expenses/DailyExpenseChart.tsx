import {
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface DailyExpenseData {
  date: string;
  amount: number;
  formattedDate: string;
}

interface DailyExpenseChartProps {
  data: DailyExpenseData[];
}

export const DailyExpenseChart = ({ data }: DailyExpenseChartProps) => {
  return (
    <div className="h-[300px]">
      <ChartContainer
        config={{
          expenses: {
            theme: {
              light: "hsl(var(--primary))",
              dark: "hsl(var(--primary))",
            },
          },
        }}
      >
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="formattedDate"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `¥${value.toLocaleString()}`}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
          />
          <ChartTooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <p className="text-sm">
                      {payload[0].payload.formattedDate}
                    </p>
                    <p className="font-medium">
                      ¥{payload[0].value.toLocaleString()}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};