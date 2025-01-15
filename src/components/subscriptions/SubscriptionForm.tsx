import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface SubscriptionFormProps {
  onSuccess?: () => void;
}

export function SubscriptionForm({ onSuccess }: SubscriptionFormProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [nextBillingDate, setNextBillingDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("subscriptions").insert({
      name,
      amount: parseInt(amount),
      billing_cycle: billingCycle,
      next_billing_date: nextBillingDate,
    });

    if (error) {
      toast({
        title: "エラー",
        description: "サブスクリプションの登録に失敗しました。",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "成功",
      description: "サブスクリプションを登録しました。",
    });
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">サービス名</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">金額</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="billing-cycle">支払いサイクル</Label>
        <Select value={billingCycle} onValueChange={setBillingCycle}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">毎月</SelectItem>
            <SelectItem value="yearly">年間</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="next-billing-date">次回支払日</Label>
        <Input
          id="next-billing-date"
          type="date"
          value={nextBillingDate}
          onChange={(e) => setNextBillingDate(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        登録
      </Button>
    </form>
  );
}