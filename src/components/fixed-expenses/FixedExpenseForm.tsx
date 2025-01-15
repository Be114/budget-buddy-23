import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const FixedExpenseForm = () => {
  const [name, setName] = useState("");
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
        amount: 0,
        user_id: user.id,
      });

      if (error) throw error;

      toast({
        title: "固定費テンプレートを登録しました",
        description: `${name}を登録しました`,
      });

      queryClient.invalidateQueries({ queryKey: ["fixed-expenses"] });
      setName("");
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