import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const FixedExpenseList = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const handleEdit = (id: string) => {
    setEditingId(id);
    const expense = fixedExpenses?.find(e => e.id === id);
    setAmount(expense?.amount ? expense.amount.toString() : "");
  };

  const handleSave = async (id: string) => {
    try {
      const { error } = await supabase
        .from("fixed_expenses")
        .update({ amount: parseInt(amount) })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "金額を更新しました",
        description: `金額を${amount}円に更新しました`,
      });

      queryClient.invalidateQueries({ queryKey: ["fixed-expenses"] });
      setEditingId(null);
      setAmount("");
    } catch (error) {
      console.error("Error updating amount:", error);
      toast({
        title: "エラーが発生しました",
        description: "金額の更新に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    }
  };

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
              <TableRow key={expense.id}>
                <TableCell>{expense.name}</TableCell>
                <TableCell>
                  {editingId === expense.id ? (
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-32"
                      min="0"
                    />
                  ) : (
                    `¥${expense.amount.toLocaleString()}`
                  )}
                </TableCell>
                <TableCell>
                  {editingId === expense.id ? (
                    <Button
                      onClick={() => handleSave(expense.id)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      保存
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleEdit(expense.id)}
                      size="sm"
                      variant="outline"
                    >
                      金額を入力
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};