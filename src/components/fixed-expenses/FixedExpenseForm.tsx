import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const FixedExpenseForm = () => {
  const [templates, setTemplates] = useState(Array(10).fill(""));
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

      // Filter out empty template names
      const validTemplates = templates.filter(name => name.trim() !== "");

      if (validTemplates.length === 0) {
        toast({
          title: "エラー",
          description: "少なくとも1つのテンプレート名を入力してください",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("fixed_expense_templates").insert(
        validTemplates.map(name => ({
          name,
          amount: 0,
          user_id: user.id,
        }))
      );

      if (error) throw error;

      toast({
        title: "固定費テンプレートを登録しました",
        description: `${validTemplates.length}件のテンプレートを登録しました`,
      });

      queryClient.invalidateQueries({ queryKey: ["fixed-expenses"] });
      setTemplates(Array(10).fill(""));
    } catch (error) {
      console.error("Error inserting fixed expense templates:", error);
      toast({
        title: "エラーが発生しました",
        description: "固定費の登録に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTemplateChange = (index: number, value: string) => {
    const newTemplates = [...templates];
    newTemplates[index] = value;
    setTemplates(newTemplates);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">固定費テンプレートを登録</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              名称（最大10件まで登録可能）
            </label>
            <div className="space-y-2">
              {templates.map((template, index) => (
                <Input
                  key={index}
                  type="text"
                  value={template}
                  onChange={(e) => handleTemplateChange(index, e.target.value)}
                  placeholder={`固定費${index + 1} (例: 家賃、光熱費など)`}
                />
              ))}
            </div>
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