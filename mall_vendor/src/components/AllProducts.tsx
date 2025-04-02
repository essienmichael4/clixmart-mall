import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Product } from '@/lib/types'
import { DataTableColumnHeader } from './DataTable/ColumnHeader'
import { ColumnDef, getCoreRowModel, flexRender, useReactTable, getPaginationRowModel, getFilteredRowModel } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import useAxiosToken from '@/hooks/useAxiosToken'
import { Button } from './ui/button'
// import { DotsVerticalIcon } from '@radix-ui/react-icons'

interface FilterProps{
    filtering:string,
    status:string,
    store: string
}

const emptyData: any[]= []

const AllProducts = ({store, status, filtering}:FilterProps) => {
    const axios_instance_token = useAxiosToken()

    const orders = useQuery<Product[]>({
        queryKey: ["products", status],
        queryFn: async() => await axios_instance_token.get(`/products/store/${store}?status=${status}`).then(res => {
            console.log(res.data);
            
            return res.data
        })
    })

    const columns:ColumnDef<Product>[] =[{
        accessorKey: "id",
        header:({column})=>(<DataTableColumnHeader column={column} title='ID.' />),
        cell:({row}) => <div>
            <Link to={`./${row.original.productId}`}>
                <span className='text-gray-400'>#</span>{row.original.id}
            </Link>
        </div>
    },{
        accessorKey: "name",
        header:({column})=>(<DataTableColumnHeader column={column} title='Product Name' />),
        cell:({row}) => <div>
            <Link to={`./${row.original.productId}`}>
                {row.original.name}
            </Link>
        </div>
    },{
        accessorKey: "category.name",
        header:({column})=>(<DataTableColumnHeader column={column} title='Category' />),
        cell:({row}) => <div>
            {row.original?.category?.name}
        </div>
    },{
        accessorKey: "subCategory.name",
        header:({column})=>(<DataTableColumnHeader column={column} title='Subcategory' />),
        cell:({row}) => {
            return <div className='text-muted-foreground text-nowrap'>
                {row.original?.subCategory?.name}
            </div>
        }
    },{
        accessorKey: "inventory",
        header:({column})=>(<DataTableColumnHeader column={column} title='Inventory' />),
        cell:({row}) => {
            return <div className='text-muted-foreground text-nowrap'>
                {row.original.inventory  === "INSTOCK" ? "In-Stock" : "Out-Of-Stock"}
            </div>
        }
    },{
        accessorKey: "quantity",
        header:({column})=>(<DataTableColumnHeader column={column} title='Quantity' />),
        cell:({row}) => {
            return <div>
                {row.original.quantity}
            </div>
        }
    },{
        accessorKey: "price",
        header:({column})=>(<DataTableColumnHeader column={column} title='Price' />),
        cell:({row}) => <div>
            {row.original.price}
        </div>
    },{
        accessorKey: "status",
        header:({column})=>(<DataTableColumnHeader column={column} title='Status' />),
        cell:({row}) => <div>
            <span className={`${row.original.status === "DRAFT" && 'bg-gray-300'} ${row.original.status === "PUBLISH" && 'bg-emerald-300 text-emerald-700'} ${row.original.status === "ARCHIVE" && 'bg-yellow-300 text-yellow-700'}  py-2 px-4 rounded-full text-xs`}>{row.original.status}</span>
        </div>
    },
    // {
    //     accessorKey: "ids",
    //     header:({column})=>(<DataTableColumnHeader column={column} title='Actions' />),
    //     cell:({row}) => <div>
    //         <span className="flex gap-2 items-center"  >
    //             <DotsVerticalIcon />
                
    //         </span> 
    //     </div>
    // }
    ]

    const table = useReactTable({
        data: orders.data || emptyData,
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

export default AllProducts
