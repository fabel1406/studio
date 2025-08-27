// src/app/dashboard/needs/components/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import type { Need } from "@/lib/types"

const categories = [
    { value: "AGRO", label: "Agroindustrial" },
    { value: "FOOD", label: "Alimentario" },
    { value: "BIOMASS", label: "Biomasa" },
    { value: "OTHERS", label: "Otros" },
]

const statuses = [
    { value: "ACTIVE", label: "Activa" },
    { value: "PAUSED", label: "En Pausa" },
    { value: "CLOSED", label: "Cerrada" },
]

type ColumnsProps = {
  deleteNeed: (id: string, type: string) => void;
}

export const columns = ({ deleteNeed }: ColumnsProps): ColumnDef<Need>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "residueType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
    cell: ({ row }) => <div className="w-[120px]">{row.getValue("residueType")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
   {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Categoría" />
    ),
    cell: ({ row }) => {
      const category = categories.find(
        (cat) => cat.value === row.getValue("category")
      )
      return <div className="w-[100px]">{category?.label}</div>
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cantidad" />
    ),
    cell: ({ row }) => {
        const unit = row.original.unit;
        const frequency = row.original.frequency;
        const freqMap = { 'ONCE': 'única', 'WEEKLY': 'semanal', 'MONTHLY': 'mensual' };
        return <div className="w-[120px]">{row.getValue("quantity")} {unit} ({freqMap[frequency]})</div>
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(s => s.value === row.getValue("status"))

      if (!status) return null

      return (
        <Badge variant={status.value === 'ACTIVE' ? 'default' : 'secondary'}>
          {status.label}
        </Badge>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} deleteNeed={deleteNeed} />,
  },
]
