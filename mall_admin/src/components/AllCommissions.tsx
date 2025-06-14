import useAxiosToken from "@/hooks/useAxiosToken";
import { Commission } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { Edit, } from "lucide-react";
import { Link } from "react-router-dom";
import { DataTableColumnHeader } from "./DataTable/ColumnHeader";
import { Button } from "./ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "./ui/table";
import { Skeleton } from "./ui/skeleton";
import EditCommission from "@/pages/Commission/EditCommission";

const emptyData: any[]= []

const AllCommissions = () => {
    const axios_instance_token = useAxiosToken()
    const {data:commissions, isLoading} = useQuery<Commission[]>({
        queryKey: ["commissions"],
        queryFn: async() => await axios_instance_token.get(`/commissions`).then(res => {
            console.log(res.data);
            
            return res.data
        })
    })

    const columns:ColumnDef<Commission>[] =[{
            accessorKey: "id",
            header:({column})=>(<DataTableColumnHeader column={column} title='No.' />),
            cell:({row}) => <div>
                <Link to={`./${row.original.id}`}>
                    <span className='text-gray-400'>#</span>{row.original.id}
                </Link>
            </div>
        },{
            accessorKey: "category.name",
            header:({column})=>(<DataTableColumnHeader column={column} title='Category' />),
            cell:({row}) => <div className='capitalize'>
                <Link to={`./${row.original.id}`}>
                    {row.original.category?.name}
                </Link>
            </div>
        },{
            accessorKey: "rate",
            header:({column})=>(<DataTableColumnHeader column={column} title='Rate' />),
            cell:({row}) => { 
                return <div className='text-muted-foreground text-nowrap'>
                    {row.original.rate}%
                </div>
            }
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
            header:({column})=>(<DataTableColumnHeader column={column} title='Last Updated' />),
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
                    <EditCommission commission={row.original} trigger={<button><Edit className="w-4 h-4 text-emerald-400"/></button>} />
                    {/* <EditBrandImage item={row.original} trigger={<button><Image className="w-4 h-4 text-blue-400"/></button>} /> */}
                    {/* <DeletePackage trackingNumber={row.original.trackingNumber} id={Number(row.original.id)} trigger={<button><Trash2 className="w-4 h-4 text-rose-400" /></button>} />  */}
                </span> 
            </div>
        }
    ]

    const table = useReactTable({
        data: commissions || emptyData,
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
    </Skeleton> : commissions && commissions?.length > 0 ? <div className="mb-8 p-2 md:px-0 rounded-2xl">
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
        No commissions added yet
        <p className="text-sm text-center text-muted-foreground">Try adding one</p>
    </div>

    return content
}

export default AllCommissions
