import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DollarSign, Globe, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      <section className="relative pt-16 pb-24 sm:pt-24 sm:pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 dark:from-primary/10 dark:via-background dark:to-secondary/20"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
                Turn Your Residues
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary via-green-500 to-secondary">
                  into Resources
                </span>
              </h1>
              <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
                EcoConnect is the B2B marketplace where organic waste finds its value. We connect generators with transformers to create a sustainable, circular economy.
              </p>
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="text-lg py-7 px-8">
                  <Link href="/register">Get Started</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg py-7 px-8">
                  <Link href="/dashboard/marketplace">Explore Marketplace</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-64 sm:h-80 lg:h-full lg:min-h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://picsum.photos/800/600"
                  alt="Organic residues being processed"
                  fill
                  style={{objectFit: 'cover'}}
                  className="transform hover:scale-105 transition-transform duration-500"
                  data-ai-hint="sustainability technology"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-card dark:bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold">Why EcoConnect?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Unlock new revenue streams, reduce your environmental footprint, and build a more sustainable business model.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary">
                  <DollarSign className="h-8 w-8" />
                </div>
                <CardTitle className="mt-4 text-2xl font-semibold">Economic Benefits</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Convert waste disposal costs into profits. Access a new market of buyers for your organic residues and discover competitively priced raw materials.
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary">
                  <Globe className="h-8 w-8" />
                </div>
                <CardTitle className="mt-4 text-2xl font-semibold">Environmental Impact</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Contribute to a circular economy by diverting waste from landfills. Reduce CO₂ emissions and promote resource valorization for a healthier planet.
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary">
                  <Users className="h-8 w-8" />
                </div>
                <CardTitle className="mt-4 text-2xl font-semibold">Social Responsibility</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Enhance your corporate image, meet sustainability goals, and connect with a community of eco-conscious businesses dedicated to making a difference.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
