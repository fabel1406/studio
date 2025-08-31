import Image from 'next/image';
import { cn } from "@/lib/utils";

export function Logo(props: { className?: string }) {
  return (
    <div className={cn("relative", props.className)}>
        <Image
          src="/images/logo.png"
          alt="EcoConnect Logo"
          width={40}
          height={40}
          className="rounded-full object-contain h-full w-full"
          priority 
        />
    </div>
  );
}
