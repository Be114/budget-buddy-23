import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays } from "date-fns";
import { ja } from "date-fns/locale";
import { DailyExpenseChart } from "./DailyExpenseChart";

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

  const dailyTotals = expenses.reduce((acc, expense) => {
    const date = expense.date;
    acc[date] = (acc[date] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

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
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">日別支出推移</h2>
      <DailyExpenseChart data={lineData} />
    </div>
  );
};