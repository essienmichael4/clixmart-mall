import { DataTableColumnHeader } from "@/components/DataTable/ColumnHeader"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import useAxiosToken from "@/hooks/useAxiosToken"
import { Payouts } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"

const emptyData: any[]= []

const VendorPayouts = () => {
    const axios_instance_token = useAxiosToken()
    const {data:payouts, isLoading} = useQuery<Payouts[]>({
        queryKey: ["payouts"],
        queryFn: async() => await axios_instance_token.get(`/stores/payouts`).then(res => {
            console.log(res.data);
            
            return res.data
        })
    })

    const columns:ColumnDef<Payouts>[] =[
        {
            accessorKey: "id",
            header:({column})=>(<DataTableColumnHeader column={column} title='No.' />),
            cell:({row}) => <div>
                {/* <Link to={`./${row.original.id}`}> */}
                    <span className='text-gray-400'>#</span>{row.original.id}
                {/* </Link> */}
            </div>
        },{
            accessorKey: "store.name",
            header:({column})=>(<DataTableColumnHeader column={column} title='Store' />),
            cell:({row}) => <div className=''>
                {/* <Link to={`./${row.original.id}`}> */}
                    {row.original.store.name}
                {/* </Link> */}
            </div>
        },{
            accessorKey: "totalAmount",
            header:({column})=>(<DataTableColumnHeader column={column} title='Amount Paid' />),
            cell:({row}) => { 
                return <div className='text-muted-foreground text-nowrap'>
                    {row.original.totalAmount}
                </div>
            }
        },{
            accessorKey: "status",
            header:({column})=>(<DataTableColumnHeader column={column} title='Status' />),
            cell:({row}) => { 
                return <div className='text-muted-foreground text-nowrap'>
                    {row.original.status}
                </div>
            }
        },{
            accessorKey: "paidBy.name",
            header:({column})=>(<DataTableColumnHeader column={column} title='PaidBy' />),
            cell:({row}) => { 
                return <div className='text-muted-foreground text-nowrap'>
                    {row.original.paidBy.name}
                </div>
            }
        },{
            accessorKey: "ids",
            header:({column})=>(<DataTableColumnHeader column={column} title='Actions' />),
            cell:({}) => <div>
                <span className="flex gap-2 items-center"  >
                    {/* <AddPaymentDialog store={row.original} trigger={<button className="flex flex-col items-center text-xs"><PlusCircle className="w-4 h-4 text-emerald-400"/> payment</button>} /> */}
                    {/* <EditBrandImage item={row.original} trigger={<button><Image className="w-4 h-4 text-blue-400"/></button>} /> */}
                    {/* <DeletePackage trackingNumber={row.original.trackingNumber} id={Number(row.original.id)} trigger={<button><Trash2 className="w-4 h-4 text-rose-400" /></button>} />  */}
                </span> 
            </div>
        }
    ]
    
    const table = useReactTable({
        data: payouts || emptyData,
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
    </Skeleton> : payouts && payouts?.length > 0 ? <div className="mb-8 p-2 md:px-0 rounded-2xl">
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
        No payments made yet...
        <p className="text-sm text-center text-muted-foreground">Try making one.</p>
    </div>

    return content
}

export default VendorPayouts
