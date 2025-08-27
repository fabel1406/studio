import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center text-center px-4">
        <span className="text-9xl font-bold text-primary">404</span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Page Not Found
        </h1>
        <p className="mt-6 text-base leading-7 text-muted-foreground">
            Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-10">
            <Button asChild>
                <Link href="/">Go back home</Link>
            </Button>
        </div>
    </div>
  )
}
