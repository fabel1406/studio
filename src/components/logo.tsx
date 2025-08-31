import Image from 'next/image';
import { cn } from "@/lib/utils";

export function Logo(props: { className?: string }) {
  return (
    <Image
      src="/images/logo.png"
      alt="EcoConnect Logo"
      width={40}
      height={40}
      className={cn("rounded-full", props.className)}
      priority 
    />
  );
}
