import { useEffect, useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

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
          <div className="space-y-6">
            <ExpenseForm />
            {/* TODO: Add ExpenseList and ExpenseSummary components */}
          </div>
        ) : (
          <AuthForm />
        )}
      </div>
    </div>
  );
};

export default Index;