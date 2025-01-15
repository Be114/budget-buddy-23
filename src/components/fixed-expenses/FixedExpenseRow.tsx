import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

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
  const [amount, setAmount] = useState(expense.amount.toString());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("fixed_expenses")
        .update({ amount: parseInt(amount) })
        .eq("id", expense.id);

      if (error) throw error;

      toast({
        title: "金額を更新しました",
        description: `金額を${amount}円に更新しました`,
      });

      queryClient.invalidateQueries({ queryKey: ["fixed-expenses"] });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating amount:", error);
      toast({
        title: "エラーが発生しました",
        description: "金額の更新に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    }
  };

  return (
    <TableRow>
      <TableCell>{expense.name}</TableCell>
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
        {isEditing ? (
          <Button
            onClick={handleSave}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            保存
          </Button>
        ) : (
          <Button
            onClick={() => setIsEditing(true)}
            size="sm"
            variant="outline"
          >
            金額を入力
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};