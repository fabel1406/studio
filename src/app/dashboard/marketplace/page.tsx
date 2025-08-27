import { mockResidues } from "@/lib/data";
import { ResidueCard } from "@/components/residue-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ListFilter, PlusCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link";


export default function MarketplacePage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <div className="flex flex-col md:flex-row items-center justify-between space-y-2">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Marketplace</h2>
            <p className="text-muted-foreground">Discover residues or find valuable resources.</p>
        </div>
        <div className="flex items-center space-x-2">
            <Button asChild>
                <Link href="/dashboard/residues/create">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Residue
                </Link>
            </Button>
        </div>
      </div>
      
      <div className="bg-card p-4 rounded-lg border shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input placeholder="Search by type (e.g. Alperujo...)" />
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="AGRO">Agro-industrial</SelectItem>
                    <SelectItem value="FOOD">Food Waste</SelectItem>
                    <SelectItem value="BIOMASS">Biomass</SelectItem>
                    <SelectItem value="OTHERS">Others</SelectItem>
                </SelectContent>
            </Select>
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Filter by country" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="spain">Spain</SelectItem>
                    <SelectItem value="portugal">Portugal</SelectItem>
                    <SelectItem value="france">France</SelectItem>
                </SelectContent>
            </Select>
             <Button variant="outline">
                <ListFilter className="mr-2 h-4 w-4" /> Advanced Filters
            </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {mockResidues.map((residue) => (
          <ResidueCard key={residue.id} residue={residue} />
        ))}
      </div>
    </div>
  );
}
