import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { ChatBot } from '@/components/chat/ChatBot';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <TopBar />
      <main className="pb-24">{children}</main>
      <BottomNav />
      <ChatBot />
    </div>
  );
}
