import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { PlusCircle } from "lucide-react";
import { SubscriptionForm } from "@/components/subscriptions/SubscriptionForm";

const Subscriptions = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: subscriptions = [], isLoading } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .order("next_billing_date", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const totalAmount = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);

  const handleAddToFixedExpenses = async () => {
    const { error } = await supabase.from("fixed_expenses").insert({
      name: "サブスクリプション合計",
      amount: totalAmount,
    });

    if (error) {
      console.error("Error adding to fixed expenses:", error);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-primary">サブスクリプション</h1>
              <div className="flex gap-4">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      サブスクを追加
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>サブスクリプションを追加</DialogTitle>
                    </DialogHeader>
                    <SubscriptionForm onSuccess={() => setIsDialogOpen(false)} />
                  </DialogContent>
                </Dialog>
                <Button variant="outline" onClick={handleAddToFixedExpenses}>
                  固定費に追加
                </Button>
                <SidebarTrigger />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">合計金額: ¥{totalAmount.toLocaleString()}/月</h2>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>サービス名</TableHead>
                    <TableHead>金額</TableHead>
                    <TableHead>支払いサイクル</TableHead>
                    <TableHead>次回支払日</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell>{subscription.name}</TableCell>
                      <TableCell>¥{subscription.amount.toLocaleString()}</TableCell>
                      <TableCell>{subscription.billing_cycle}</TableCell>
                      <TableCell>
                        {format(new Date(subscription.next_billing_date), "yyyy/MM/dd")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Subscriptions;