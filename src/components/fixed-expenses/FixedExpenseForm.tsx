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
import { useQueryClient } from "@tanstack/react-query";

const categories = [
  { id: "food", name: "食費" },
  { id: "transport", name: "交通費" },
  { id: "daily", name: "日用品" },
  { id: "entertainment", name: "娯楽費" },
  { id: "other", name: "その他" },
];

export const FixedExpenseForm = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [paymentDay, setPaymentDay] = useState("");
  const [memo, setMemo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("ユーザーが見つかりません");
      }

      const { error } = await supabase.from("fixed_expenses").insert({
        name,
        category,
        amount: 0, // 初期値として0を設定
        payment_day: parseInt(paymentDay),
        memo: memo || null,
        user_id: user.id,
      });

      if (error) throw error;

      toast({
        title: "固定費テンプレートを登録しました",
        description: `${name}を登録しました`,
      });

      // キャッシュを更新
      queryClient.invalidateQueries({ queryKey: ["fixed-expenses"] });

      // フォームをリセット
      setName("");
      setCategory("");
      setPaymentDay("");
      setMemo("");
    } catch (error) {
      console.error("Error inserting fixed expense:", error);
      toast({
        title: "エラーが発生しました",
        description: "固定費の登録に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">固定費テンプレートを登録</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              名称
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="家賃"
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
            <label htmlFor="paymentDay" className="text-sm font-medium">
              支払日
            </label>
            <Input
              id="paymentDay"
              type="number"
              value={paymentDay}
              onChange={(e) => setPaymentDay(e.target.value)}
              required
              placeholder="25"
              min="1"
              max="31"
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
              placeholder="メモ"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-accent hover:bg-accent-hover"
            disabled={isSubmitting}
          >
            {isSubmitting ? "登録中..." : "テンプレートを登録"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};