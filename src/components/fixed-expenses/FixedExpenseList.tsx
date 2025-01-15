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
import { FixedExpenseRow } from "./FixedExpenseRow";

export const FixedExpenseList = () => {
  const { data: fixedExpenses, isLoading } = useQuery({
    queryKey: ["fixed-expenses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fixed_expenses")
        .select("*")
        .order("created_at", { ascending: true });

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
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">固定費一覧</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名称</TableHead>
              <TableHead>金額</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fixedExpenses.map((expense) => (
              <FixedExpenseRow key={expense.id} expense={expense} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};