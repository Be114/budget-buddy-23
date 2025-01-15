import { AuthForm } from "@/components/auth/AuthForm";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";

const Index = () => {
  const isAuthenticated = false; // TODO: Implement with Supabase auth

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-primary mb-8">
          家計簿アプリ
        </h1>
        {isAuthenticated ? (
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