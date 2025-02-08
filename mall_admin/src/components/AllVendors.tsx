import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Store } from '@/lib/types'
import { DataTableColumnHeader } from './DataTable/ColumnHeader'
import { ColumnDef, getCoreRowModel, flexRender, useReactTable, getPaginationRowModel, getFilteredRowModel } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import useAxiosToken from '@/hooks/useAxiosToken'
import { Button } from './ui/button'
import { Edit } from 'lucide-react'
import EditStoreReview from '@/pages/Vendor/EditStoreReview'

interface FilterProps{
    filtering:string,
    status:string
}

const emptyData: any[]= []

const AllVendors = ({status, filtering}:FilterProps) => {
    const axios_instance_token = useAxiosToken()

    const stores = useQuery<Store[]>({
        queryKey: ["vendors", status],
        queryFn: async() => await axios_instance_token.get(`/stores`).then(res => {
            return res.data
        })
    })

    const columns:ColumnDef<Store>[] =[{
        accessorKey: "id",
        header:({column})=>(<DataTableColumnHeader column={column} title='No.' />),
        cell:({row}) => <div>
            <Link to={`./${row.original.id}`}>
                <span className='text-gray-400'>#</span>{row.original.id}
            </Link>
        </div>
    },{
        accessorKey: "name",
        header:({column})=>(<DataTableColumnHeader column={column} title='Store name' />),
        cell:({row}) => <div className='capitalize'>
            <Link to={`./${row.original.id}`}>
                {row.original.name}
            </Link>
        </div>
    },{
        accessorKey: "customer",
        header:({column})=>(<DataTableColumnHeader column={column} title='Customer' />),
        cell:({row}) => <div className='capitalize'>
            {row.original.user?.name}
        </div>
    },{
        accessorKey: "nationalId",
        header:({column})=>(<DataTableColumnHeader column={column} title='National Id' />),
        cell:({row}) => <div>
            {row.original.storeDetail?.nationalId}
        </div>
    },{
        accessorKey: "registered",
        header:({column})=>(<DataTableColumnHeader column={column} title='Status' />),
        cell:({row}) => <div>
            {row.original.storeDetail?.isRegistered === "TRUE" ? "Registered" : "Not Registered"}
        </div>
    },
    // {
    //     accessorKey: "customer",
    //     header:({column})=>(<DataTableColumnHeader column={column} title='Review' />),
    //     cell:({row}) => <div>
    //         {row.original.storeReview?.status}
    //     </div>
    // },
    {
        accessorKey: "status",
        header:({column})=>(<DataTableColumnHeader column={column} title='Status' />),
        cell:({row}) => <div>
            <span className={`${row.original.storeReview?.status === "PENDING" && 'bg-gray-300'} ${row.original.storeReview?.status === "APPROVED" && 'bg-emerald-300 text-emerald-700'} ${row.original.storeReview?.status === "REJECTED" && 'bg-rose-300 text-rose-700'} py-2 px-4 rounded-full text-xs`}>{row.original.storeReview?.status}</span>
        </div>
    },{
        accessorKey: "ids",
        header:({column})=>(<DataTableColumnHeader column={column} title='Actions' />),
        cell:({row}) => <div>
            <span className="flex gap-2 items-center"  >
                <EditStoreReview item={row.original} trigger={<button><Edit className="w-4 h-4 text-emerald-400"/></button>} />
                {/* <DeletePackage trackingNumber={row.original.trackingNumber} id={Number(row.original.id)} trigger={<button><Trash2 className="w-4 h-4 text-rose-400" /></button>} />  */}
            </span> 
        </div>
    }
]

    const table = useReactTable({
        data: stores.data || emptyData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        initialState: {
            pagination: {
                pageSize: 20
            }
        },
        state:{
            // sorting,
            globalFilter: filtering
        },
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    })

    return (
        <div className="my-8 p-2 md:px-0 rounded-2xl">
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
        </div>
    )
}

export default AllVendors
