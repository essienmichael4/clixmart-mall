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
    status?:string,
    // store: string,
    review?: string
}

const emptyData: any[]= []

const AllProducts = ({ review, status, filtering}:FilterProps) => {
    const axios_instance_token = useAxiosToken()
    const  fetchProducts = async ():Promise<Product[]> => {
        const search = []
        if(review && review !== undefined && review !== null && review !== "null") search.push(["review", review])
        if(status && status !== undefined && status !== null && status !== "null") search.push(["status", status])
        const params = new URLSearchParams(search).toString()
        console.log(search);
        
        const products = await axios_instance_token.get(`/products/admin/all?${params}`).then(res => {
            return res.data
        })

        return products
    }

    const orders = useQuery<Product[]>({
        queryKey: ["products", {status, review}],
        queryFn: async() => await fetchProducts()
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
        cell:({row}) => <div className=''>
                <Link className='flex items-center gap-2' to={`./${row.original.productId}`}>
                    <div className='rounded-full overflow-hidden w-8 h-8'>
                        <img src={row.original.imageUrl} alt="" />
                    </div>
                    <div className='flex flex-col'>
                        <span className='capitalize'>
                            {row.original.name}
                        </span>
                        <span className='text-xs text-gray-500'>
                            {row.original.productId}
                        </span>
                    </div>
                </Link>
        </div>
    },{
        accessorKey: "category.name",
        header:({column})=>(<DataTableColumnHeader column={column} title='Category' />),
        cell:({row}) => <div className='capitalize text-nowrap text-muted-foreground'>
            {row.original?.category?.name}
        </div>
    },{
        accessorKey: "subCategory.name",
        header:({column})=>(<DataTableColumnHeader column={column} title='Subcategory' />),
        cell:({row}) => {
            return <div className='text-muted-foreground text-nowrap capitalize'>
                {row.original?.subCategory?.name}
            </div>
        }
    },{
        accessorKey: "inventory",
        header:({column})=>(<DataTableColumnHeader column={column} title='Inventory' />),
        cell:({row}) => {
            return <div className='text-muted-foreground text-nowrap'>
                {row.original.quantity || 0} {row.original.inventory  === "INSTOCK" ? "In-Stock" : "Out-Of-Stock"}
            </div>
        }
    },{
        accessorKey: "price",
        header:({column})=>(<DataTableColumnHeader column={column} title='Price' />),
        cell:({row}) => <div className='text-muted-foreground'>
            {row.original.price}
        </div>
    },{
        accessorKey: "status",
        header:({column})=>(<DataTableColumnHeader column={column} title='Status' />),
        cell:({row}) => <div className=''>
            <span className={`${row.original.status === "DRAFT" && 'bg-gray-100'} ${row.original.status === "PUBLISH" && 'bg-emerald-100 text-emerald-700'} ${row.original.status === "ARCHIVE" && 'bg-yellow-100 text-yellow-700'} py-2 px-4 rounded-full text-[.7rem]`}>{row.original.status}</span>
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
        <div className='p-4 mb-8 rounded-lg border'>
            <div className="my-4 md:px-0 rounded-2xl">
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
        </div>
    )
}

export default AllProducts
