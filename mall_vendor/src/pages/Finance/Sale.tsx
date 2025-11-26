import { DataTableColumnHeader } from "@/components/DataTable/ColumnHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import useAxiosToken from "@/hooks/useAxiosToken";
import { CommissionTransaction } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, useReactTable, getCoreRowModel, getPaginationRowModel, flexRender } from "@tanstack/react-table";
import { Link, useParams } from "react-router-dom";

const emptyData: any[]= []

const Sale = () => {
    const axios_instance_token = useAxiosToken()
    const {store} = useParams()
    const {data:itemTransactions, isLoading} = useQuery<CommissionTransaction[]>({
        queryKey: ["commissions", "transactions"],
        queryFn: async() => await axios_instance_token.get(`/commissions/${store}/transactions`).then(res => {
            console.log(res.data);
            
            return res.data
        })
    })

    const columns:ColumnDef<CommissionTransaction>[] =[{
            accessorKey: "id",
            header:({column})=>(<DataTableColumnHeader column={column} title='No.' />),
            cell:({row}) => <div>
                <Link to={`./${row.original.id}`}>
                    <span className='text-gray-400'>#</span>{row.original.id}
                </Link>
            </div>
        },{
            accessorKey: "saleAmount",
            header:({column})=>(<DataTableColumnHeader column={column} title='Sale Amount' />),
            cell:({row}) => <div className='capitalize'>
                <Link to={`./${row.original.id}`}>
                    {row.original.saleAmount}
                </Link>
            </div>
        },{
            accessorKey: "rate",
            header:({column})=>(<DataTableColumnHeader column={column} title='Commission Rate' />),
            cell:({row}) => { 
                return <div className='text-muted-foreground text-nowrap'>
                    {row.original.commissionRate}%
                </div>
            }
        },{
            accessorKey: "commissionAmount",
            header:({column})=>(<DataTableColumnHeader column={column} title='Commission Amount' />),
            cell:({row}) => { 
                return <div className='text-muted-foreground text-nowrap'>
                    {row.original.commissionAmount}
                </div>
            }
        },{
            accessorKey: "vendorEarning",
            header:({column})=>(<DataTableColumnHeader column={column} title='Vendor Earning' />),
            cell:({row}) => { 
                return <div className='text-muted-foreground text-nowrap'>
                    {row.original.vendorEarning}
                </div>
            }
        },{
            accessorKey: "isPaid",
            header:({column})=>(<DataTableColumnHeader column={column} title='Is Paid' />),
            cell:({row}) => { 
                return <div className='text-muted-foreground text-nowrap'>
                    {row.original.isPaid.toString()}
                </div>
            }
        },{
            accessorKey: "processedStatus",
            header:({column})=>(<DataTableColumnHeader column={column} title='Proccessed' />),
            cell:({row}) => { 
                return <div className='text-muted-foreground text-nowrap'>
                    {row.original.processedStatus}
                </div>
            }
        }
    ]

    const table = useReactTable({
        data: itemTransactions || emptyData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        initialState: {
            pagination: {
                pageSize: 20
            }
        },
        getPaginationRowModel: getPaginationRowModel(),
    })

    const content = isLoading ? <Skeleton>
      <div className="sm:h-72 md:h-80 lg:h-96 w-full">

      </div>
    </Skeleton> : itemTransactions && itemTransactions?.length > 0 ? <div className="mb-8 p-2 md:px-0 rounded-2xl">
        <div className="w-full rounded-md  bg-white/75">
            <Table>
                <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                        return (
                        <TableHead key={header.id}>
                            {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                                )}
                        </TableHead>
                        )
                    })}
                    </TableRow>
                ))}
                </TableHeader>
                <TableBody>
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                    <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                    >
                        {row.getVisibleCells().map((cell) => (
                        <TableCell className='py-6' key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                        ))}
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                            No results.
                        </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                >
                Previous
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                >
                Next
            </Button>
        </div>
    </div> : <div className='bg-gray-100 rounded-lg h-[300px] flex flex-col items-center justify-center'>
        No transactions yet
        <p className="text-sm text-center text-muted-foreground">Wait for customers to start ordering.</p>
    </div>
    
    return (
        <div>
            <div>
                <h4 className="font-semibold text-md">Sales</h4>
                <p className="text-xs text-gray-400">Completed/Delivered orders.</p>
            </div>
            <div className="mt-2">
                {content}
            </div>
        </div>
    )
}

export default Sale
