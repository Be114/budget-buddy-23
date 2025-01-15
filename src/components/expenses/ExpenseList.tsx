import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

const categories = {
  food: "食費",
  transport: "交通費",
  daily: "日用品",
  entertainment: "娯楽費",
  other: "その他",
};

export const ExpenseList = () => {
  const { data: expenses, isLoading } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-4">読み込み中...</div>;
  }

  if (!expenses?.length) {
    return <div className="text-center py-4">支出の記録がありません</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">支出履歴</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>日付</TableHead>
              <TableHead>カテゴリ</TableHead>
              <TableHead>金額</TableHead>
              <TableHead>メモ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{format(new Date(expense.date), "yyyy/MM/dd")}</TableCell>
                <TableCell>{categories[expense.category as keyof typeof categories]}</TableCell>
                <TableCell>¥{expense.amount.toLocaleString()}</TableCell>
                <TableCell>{expense.memo || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};