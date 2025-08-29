import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ScrollToTop } from "@/components/scroll-to-top";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
