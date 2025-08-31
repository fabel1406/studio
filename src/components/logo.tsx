import Image from 'next/image';

export function Logo(props: { className?: string }) {
  return (
    <Image
      src="/images/logo.jpg"
      alt="EcoConnect Logo"
      width={40}
      height={40}
      className={props.className}
      priority 
    />
  );
}
