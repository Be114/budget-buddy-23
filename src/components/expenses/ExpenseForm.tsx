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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const categories = [
  { id: "food", name: "食費" },
  { id: "transport", name: "交通費" },
  { id: "daily", name: "日用品" },
  { id: "entertainment", name: "娯楽費" },
  { id: "other", name: "その他" },
];

export const ExpenseForm = () => {
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("expenses").insert({
        date,
        category,
        amount: parseInt(amount),
        memo: memo || null,
      });

      if (error) throw error;

      toast({
        title: "支出を記録しました",
        description: `${amount}円を${categories.find(cat => cat.id === category)?.name || category}として記録しました`,
      });

      // フォームをリセット
      setDate("");
      setCategory("");
      setAmount("");
      setMemo("");
    } catch (error) {
      console.error("Error inserting expense:", error);
      toast({
        title: "エラーが発生しました",
        description: "支出の記録に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">支出を記録</CardTitle>
      </CardHeader>
      <CardContent>
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
              placeholder="1000"
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
          <Button 
            type="submit" 
            className="w-full bg-accent hover:bg-accent-hover"
            disabled={isSubmitting}
          >
            {isSubmitting ? "記録中..." : "記録する"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};