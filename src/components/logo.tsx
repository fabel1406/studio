import Image from 'next/image';
import { cn } from "@/lib/utils";

export function Logo(props: { className?: string }) {
  return (
    <div className={cn("relative", props.className)}>
        <Image
          src="/images/logo.png"
          alt="EcoConnect Logo"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="rounded-full object-contain"
          priority 
        />
    </div>
  );
}
