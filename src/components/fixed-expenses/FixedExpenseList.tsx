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

const categories = {
  food: "食費",
  transport: "交通費",
  daily: "日用品",
  entertainment: "娯楽費",
  other: "その他",
};

export const FixedExpenseList = () => {
  const { data: fixedExpenses, isLoading } = useQuery({
    queryKey: ["fixed-expenses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fixed_expenses")
        .select("*")
        .order("payment_day", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-4">読み込み中...</div>;
  }

  if (!fixedExpenses?.length) {
    return <div className="text-center py-4">固定費の登録がありません</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">固定費一覧</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名称</TableHead>
              <TableHead>カテゴリ</TableHead>
              <TableHead>金額</TableHead>
              <TableHead>支払日</TableHead>
              <TableHead>メモ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fixedExpenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.name}</TableCell>
                <TableCell>{categories[expense.category as keyof typeof categories]}</TableCell>
                <TableCell>¥{expense.amount.toLocaleString()}</TableCell>
                <TableCell>{expense.payment_day}日</TableCell>
                <TableCell>{expense.memo || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};