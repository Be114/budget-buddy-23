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
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <AuthForm />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-primary">家計簿アプリ</h1>
              <SidebarTrigger />
            </div>
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
                <ExpenseList />
                <ExpenseSummary />
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;