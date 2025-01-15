import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const categories = [
  { id: "food", name: "食費" },
  { id: "transport", name: "交通費" },
  { id: "daily", name: "日用品" },
  { id: "entertainment", name: "娯楽費" },
  { id: "other", name: "その他" },
];

type ExpenseEditFormProps = {
  expense: {
    id: string;
    date: string;
    category: string;
    amount: number;
    memo: string | null;
  };
  onClose: () => void;
};

export const ExpenseEditForm = ({ expense, onClose }: ExpenseEditFormProps) => {
  const [date, setDate] = useState(expense.date);
  const [category, setCategory] = useState(expense.category);
  const [amount, setAmount] = useState(expense.amount.toString());
  const [memo, setMemo] = useState(expense.memo || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("expenses")
        .update({
          date,
          category,
          amount: parseInt(amount),
          memo: memo || null,
        })
        .eq("id", expense.id);

      if (error) throw error;

      toast({
        title: "支出を更新しました",
        description: `${amount}円を${
          categories.find((cat) => cat.id === category)?.name || category
        }として更新しました`,
      });

      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      onClose();
    } catch (error) {
      console.error("Error updating expense:", error);
      toast({
        title: "エラーが発生しました",
        description: "支出の更新に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="date" className="text-sm font-medium">
          日付
        </label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="category" className="text-sm font-medium">
          カテゴリ
        </label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger>
            <SelectValue placeholder="カテゴリを選択" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label htmlFor="amount" className="text-sm font-medium">
          金額
        </label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min="0"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="memo" className="text-sm font-medium">
          メモ
        </label>
        <Input
          id="memo"
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="買い物メモ"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          キャンセル
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "更新中..." : "更新する"}
        </Button>
      </div>
    </form>
  );
};