import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";

interface FixedExpense {
  id: string;
  name: string;
  amount: number;
}

interface FixedExpenseRowProps {
  expense: FixedExpense;
}

export const FixedExpenseRow = ({ expense }: FixedExpenseRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(expense.name);
  const [amount, setAmount] = useState(expense.amount.toString());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("fixed_expenses")
        .update({ name, amount: parseInt(amount) })
        .eq("id", expense.id);

      if (error) throw error;

      toast({
        title: "固定費を更新しました",
        description: `${name}の金額を${amount}円に更新しました`,
      });

      queryClient.invalidateQueries({ queryKey: ["fixed-expenses"] });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating fixed expense:", error);
      toast({
        title: "エラーが発生しました",
        description: "固定費の更新に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm("この固定費を削除してもよろしいですか？")) return;

    try {
      const { error } = await supabase
        .from("fixed_expenses")
        .delete()
        .eq("id", expense.id);

      if (error) throw error;

      toast({
        title: "固定費を削除しました",
        description: `${expense.name}を削除しました`,
      });

      queryClient.invalidateQueries({ queryKey: ["fixed-expenses"] });
    } catch (error) {
      console.error("Error deleting fixed expense:", error);
      toast({
        title: "エラーが発生しました",
        description: "固定費の削除に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    }
  };

  return (
    <TableRow>
      <TableCell>
        {isEditing ? (
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
          />
        ) : (
          expense.name
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
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
        <div className="space-x-2">
          {isEditing ? (
            <>
              <Button
                onClick={handleSave}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                保存
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                size="sm"
                variant="outline"
              >
                キャンセル
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => setIsEditing(true)}
                size="sm"
                variant="outline"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleDelete}
                size="sm"
                variant="outline"
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};