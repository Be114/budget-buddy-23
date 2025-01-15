import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-primary">設定</h1>
              <SidebarTrigger />
            </div>

            <div className="bg-white rounded-lg shadow divide-y">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">通知設定</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications">メール通知</Label>
                    <Switch id="email-notifications" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="payment-reminders">支払い通知</Label>
                    <Switch id="payment-reminders" />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">表示設定</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dark-mode">ダークモード</Label>
                    <Switch id="dark-mode" />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">アカウント</h2>
                <div className="space-y-4">
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleSignOut}
                  >
                    ログアウト
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Settings;