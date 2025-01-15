import { useEffect, useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { ExpenseSummary } from "@/components/expenses/ExpenseSummary";
import { FixedExpenseForm } from "@/components/fixed-expenses/FixedExpenseForm";
import { FixedExpenseList } from "@/components/fixed-expenses/FixedExpenseList";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-primary mb-8">
          家計簿アプリ
        </h1>
        {session ? (
          <div className="flex flex-col space-y-8">
            <FixedExpenseList />
            <div className="flex justify-between items-center">
              <ExpenseForm />
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-accent hover:bg-accent-hover">
                    固定費を登録
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <FixedExpenseForm />
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex flex-col space-y-8">
              <ExpenseSummary />
              <ExpenseList />
            </div>
          </div>
        ) : (
          <AuthForm />
        )}
      </div>
    </div>
  );
};

export default Index;