import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExpenseEditForm } from "./ExpenseEditForm";

const categories = {
  food: "食費",
  transport: "交通費",
  daily: "日用品",
  entertainment: "娯楽費",
  other: "その他",
} as const;

type Category = keyof typeof categories;

type Expense = {
  id: string;
  date: string;
  category: Category;
  amount: number;
  memo: string | null;
};

export const ExpenseList = () => {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: expenses, isLoading } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      
      // Transform the data to ensure category is of the correct type
      return data.map(expense => ({
        ...expense,
        category: expense.category as Category // Type assertion since we know the values are valid
      }));
    },
  });

  const handleDelete = async (id: string) => {
    if (!confirm("この支出を削除してもよろしいですか？")) return;

    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "エラーが発生しました",
        description: "支出の削除に失敗しました。",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "支出を削除しました",
    });
    queryClient.invalidateQueries({ queryKey: ["expenses"] });
  };

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
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{format(new Date(expense.date), "yyyy/MM/dd")}</TableCell>
                <TableCell>{categories[expense.category]}</TableCell>
                <TableCell>¥{expense.amount.toLocaleString()}</TableCell>
                <TableCell>{expense.memo || "-"}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setEditingExpense(expense)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(expense.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingExpense} onOpenChange={() => setEditingExpense(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>支出を編集</DialogTitle>
          </DialogHeader>
          {editingExpense && (
            <ExpenseEditForm
              expense={editingExpense}
              onClose={() => setEditingExpense(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};