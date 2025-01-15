import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { format, subDays } from "date-fns";
import { ja } from "date-fns/locale";

const categories = {
  food: "食費",
  transport: "交通費",
  daily: "日用品",
  entertainment: "娯楽費",
  other: "その他",
};

const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD"];

export const ExpenseSummary = () => {
  const { data: expenses } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .order("date", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  if (!expenses?.length) {
    return null;
  }

  // カテゴリ別の合計金額を計算
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryTotals).map(([category, amount]) => ({
    name: categories[category as keyof typeof categories],
    value: amount,
  }));

  // 日別の支出合計を計算
  const dailyTotals = expenses.reduce((acc, expense) => {
    const date = expense.date;
    acc[date] = (acc[date] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  // 過去7日間のデータを作成
  const today = new Date();
  const lineData = Array.from({ length: 7 }, (_, i) => {
    const date = format(subDays(today, 6 - i), "yyyy-MM-dd");
    return {
      date,
      amount: dailyTotals[date] || 0,
      formattedDate: format(new Date(date), "M/d", { locale: ja }),
    };
  });

  return (
    <div className="mt-8 space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-4">カテゴリ別支出</h2>
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
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value }) => `${name}: ¥${value.toLocaleString()}`}
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">日別支出推移</h2>
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
            <LineChart data={lineData}>
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
      </div>
    </div>
  );
};