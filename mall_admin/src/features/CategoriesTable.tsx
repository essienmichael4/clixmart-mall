import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Category } from '@/lib/types'
import { ColumnDef, getCoreRowModel, flexRender, useReactTable, getPaginationRowModel, getFilteredRowModel, getExpandedRowModel, ExpandedState } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import useAxiosToken from '@/hooks/useAxiosToken'
import { Edit, Trash2 } from 'lucide-react'
import EditPackage from '@/pages/Category/EditPackage'
import { Button } from '@/components/ui/button'
import DeletePackage from '@/pages/Category/DeletePackage'
import { DataTableColumnHeader } from '@/components/DataTable/ColumnHeader'
import React from 'react'

interface FilterProps{
    filtering:string
    categories:Category[] 
}

const emptyData: any[]= []

const CategoriesTable = ({categories, filtering}:FilterProps) => {
    // const axios_instance_token = useAxiosToken()
    const [expanded, setExpanded] = React.useState<ExpandedState>({})
    
    // const orders = useQuery<Categories[]>({
    //     queryKey: ["categories"],
    //     queryFn: async() => await axios_instance_token.get(`/categories`).then(res => res.data)
    // })

    const columns:ColumnDef<Category>[] =[{
        accessorKey: "id",
        header:({column})=>(<DataTableColumnHeader column={column} title='No.' />),
        cell:({row}) => <div>
            {row.getCanExpand() ? (
                <button
                  {...{
                    onClick: row.getToggleExpandedHandler(),
                    style: { cursor: 'pointer' },
                  }}
                >
                  {row.getIsExpanded() ? '👇' : '👉'}
                </button>
              ) : (
                '🔵'
              )}{' '}
            <Link to={`./${row.original.id}`}>
                <span className='text-gray-400'>#</span>{row.original.id}
            </Link>
        </div>
    },{
        accessorKey: "name",
        header:({column})=>(<DataTableColumnHeader column={column} title='Name' />),
        cell:({row}) => <div>
            {row.original.name}
        </div>
    },{
        accessorKey: "createdAt",
        header:({column})=>(<DataTableColumnHeader column={column} title='Day Created' />),
        cell:({row}) => {
            return <div className='text-muted-foreground text-nowrap'>
                {new Date(row.original.createdAt as string).toDateString()}
            </div>
        }
    },{
        accessorKey: "updatedAt",
        header:({column})=>(<DataTableColumnHeader column={column} title='Day Updated' />),
        cell:({row}) => {
            return <div className='text-muted-foreground text-nowrap'>
                {new Date(row.original.updatedAt as string).toDateString()}
            </div>
        }
    },{
        accessorKey: "ids",
        header:({column})=>(<DataTableColumnHeader column={column} title='Actions' />),
        cell:({row}) => <div>
            <span className="flex gap-2 items-center"  >
                {/* <EditPackage item={row.original} trigger={<button><Edit className="w-4 h-4 text-emerald-400"/></button>} /> */}
                {/* <DeletePackage trackingNumber={row.original.trackingNumber} id={Number(row.original.id)} trigger={<button><Trash2 className="w-4 h-4 text-rose-400" /></button>} />  */}
            </span> 
        </div>
    }]

    const table = useReactTable({
        data: categories || emptyData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        initialState: {
            pagination: {
                pageSize: 20
            }
        },
        state:{
            // sorting,
            expanded: expanded,
            globalFilter: filtering
        },
        onExpandedChange: setExpanded,
        getSubRows: (row) => row.subCategories,
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
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

export default CategoriesTable
