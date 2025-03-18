import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Order } from '@/lib/types'
import { DataTableColumnHeader } from './DataTable/ColumnHeader'
import { ColumnDef, getCoreRowModel, flexRender, useReactTable, getPaginationRowModel, getFilteredRowModel } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import useAxiosToken from '@/hooks/useAxiosToken'
import { Button } from './ui/button'

interface FilterProps{
    filtering:string
}

const emptyData: any[]= []

const AllOrders = ({ filtering}:FilterProps) => {
    const axios_instance_token = useAxiosToken()

    const stores = useQuery<Order[]>({
        queryKey: ["orders"],
        queryFn: async() => await axios_instance_token.get(`/orders`).then(res => {
            console.log(res.data);
            
            return res.data
        })
    })

    const columns:ColumnDef<Order>[] =[{
        accessorKey: "id",
        header:({column})=>(<DataTableColumnHeader column={column} title='No.' />),
        cell:({row}) => { 
            const productNames = row.original.orderItems.map(item => item.name)
            return <div>
            <Link to={`./${row.original.id}`}>
                <p>{productNames.toString()}</p>
                <p><span className='text-gray-400'>#</span>{row.original.id}</p>
            </Link>
        </div>}
    },{
        accessorKey: "Date",
        header:({column})=>(<DataTableColumnHeader column={column} title='Date' />),
        cell:({row}) => {
            return <div className='text-muted-foreground text-nowrap'>
            {new Date(row.original.createdAt as string).toDateString()}
        </div>
        }
    },{
        accessorKey: "Customer",
        header:({column})=>(<DataTableColumnHeader column={column} title='Customer' />),
        cell:({row}) => {
            return <div className='capitalize'>
                <Link to={`./${row.original.id}`}>
                    {row.original.user?.name}
                </Link>
            </div>
        }
    },{
        accessorKey: "total",
        header:({column})=>(<DataTableColumnHeader column={column} title='Total' />),
        cell:({row}) => <div className=''>
            <Link to={`./${row.original.id}`}>
                {row.original.total}
            </Link>
        </div>
    },{
        accessorKey: "items",
        header:({column})=>(<DataTableColumnHeader column={column} title='Items' />),
        cell:({row}) => {
            const itemQuantity = row.original.orderItems.reduce((total, item) =>{
                return total += item.quantity
            }, 0)
            return <div className='capitalize'>
                <Link to={`./${row.original.id}`}>
                    {itemQuantity} items
                </Link>
            </div>
        }
    },{
        accessorKey: "isPaid",
        header:({column})=>(<DataTableColumnHeader column={column} title='Payment Status' />),
        cell:({row}) => {
            return <div className='capitalize'>
                <Link to={`./${row.original.id}`}>
                    {row.original.isPaid}
                </Link>
            </div>
        }
    },{
        accessorKey: "status",
        header:({column})=>(<DataTableColumnHeader column={column} title='Order Status' />),
        cell:({row}) => {
            return <div className='capitalize'>
                <Link to={`./${row.original.id}`}>
                    {row.original.status}
                </Link>
            </div>
        }
    },
    // {
    //     accessorKey: "ids",
    //     header:({column})=>(<DataTableColumnHeader column={column} title='Actions' />),
    //     cell:({row}) => <div>
    //         <span className="flex gap-2 items-center"  >
    //             <EditBrand item={row.original} trigger={<button><Edit className="w-4 h-4 text-emerald-400"/></button>} />
    //             <EditBrandImage item={row.original} trigger={<button><Image className="w-4 h-4 text-blue-400"/></button>} />
    //             {/* <DeletePackage trackingNumber={row.original.trackingNumber} id={Number(row.original.id)} trigger={<button><Trash2 className="w-4 h-4 text-rose-400" /></button>} />  */}
    //         </span> 
    //     </div>
    // }
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

export default AllOrders
