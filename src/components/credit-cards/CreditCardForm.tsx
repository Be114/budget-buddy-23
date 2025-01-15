import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface CreditCardFormProps {
  onSuccess?: () => void;
}

export function CreditCardForm({ onSuccess }: CreditCardFormProps) {
  const { toast } = useToast();
  const [cardName, setCardName] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("credit_card_payments").insert({
      card_name: cardName,
      payment_amount: parseInt(amount),
      payment_date: paymentDate,
      description,
    });

    if (error) {
      toast({
        title: "エラー",
        description: "支払い情報の登録に失敗しました。",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "成功",
      description: "支払い情報を登録しました。",
    });
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="card-name">カード名</Label>
        <Input
          id="card-name"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">支払い金額</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="payment-date">支払い日</Label>
        <Input
          id="payment-date"
          type="date"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">説明</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full">
        登録
      </Button>
    </form>
  );
}