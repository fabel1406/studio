import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ScrollToTop } from "@/components/scroll-to-top";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
