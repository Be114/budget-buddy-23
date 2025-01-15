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
import { CreditCardForm } from "@/components/credit-cards/CreditCardForm";

const CreditCards = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["credit-card-payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("credit_card_payments")
        .select("*")
        .order("payment_date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const totalAmount = payments.reduce((sum, payment) => sum + payment.payment_amount, 0);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-primary">クレジットカード支払い</h1>
              <div className="flex gap-4">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      支払いを追加
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>クレジットカード支払いを追加</DialogTitle>
                    </DialogHeader>
                    <CreditCardForm onSuccess={() => setIsDialogOpen(false)} />
                  </DialogContent>
                </Dialog>
                <SidebarTrigger />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">総支払額: ¥{totalAmount.toLocaleString()}</h2>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>カード名</TableHead>
                    <TableHead>支払い金額</TableHead>
                    <TableHead>支払い日</TableHead>
                    <TableHead>説明</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.card_name}</TableCell>
                      <TableCell>¥{payment.payment_amount.toLocaleString()}</TableCell>
                      <TableCell>
                        {format(new Date(payment.payment_date), "yyyy/MM/dd")}
                      </TableCell>
                      <TableCell>{payment.description || "-"}</TableCell>
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

export default CreditCards;