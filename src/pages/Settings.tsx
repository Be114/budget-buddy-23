import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Skeleton } from "@/components/ui/skeleton";

const Settings = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, []);

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
                <h2 className="text-lg font-semibold mb-4">アカウント情報</h2>
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-1">
                      <Label className="text-sm text-gray-500">メールアドレス</Label>
                      <p className="text-sm font-medium">{user?.email}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <Label className="text-sm text-gray-500">アカウント作成日</Label>
                      <p className="text-sm font-medium">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString('ja-JP') : ''}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <Label className="text-sm text-gray-500">最終ログイン</Label>
                      <p className="text-sm font-medium">
                        {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('ja-JP') : ''}
                      </p>
                    </div>
                  </div>
                )}
              </div>

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