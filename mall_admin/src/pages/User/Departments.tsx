import { Edit, Plus, Trash2 } from "lucide-react"
import AddDepartment from "./_components/AddDepartment"
import AddUser from "./_components/AddUser"
import useAxiosToken from "@/hooks/useAxiosToken"
import { useQuery } from "@tanstack/react-query"
import { Department } from "@/lib/types"
import { DataTableColumnHeader } from "@/components/DataTable/ColumnHeader"
import { ColumnDef, useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Link } from "react-router-dom"
import EditDepartment from "./_components/EditDepartment"
import DeleteDepartment from "./_components/DeleteDepartment"

const emptyData: any[]= []

const Departments = () => {
    const axios_instance_token = useAxiosToken()
    const departmentsQuery = useQuery<Department[]>({
        queryKey: ["departments"],
        queryFn: async() => await axios_instance_token.get(`/department`).then(res => {
            return res.data
        })
    })

    const columns:ColumnDef<Department>[] =[{
        accessorKey: "id",
        header:({column})=>(<DataTableColumnHeader column={column} title='ID' />),
        cell:({row}) => <div>
            <Link to={`./${row.original.id}`}>
                <span className='text-gray-400'>#</span>{row.original.id}
            </Link> 
        </div>
    },{
        accessorKey: "name",
        header:({column})=>(<DataTableColumnHeader column={column} title='Name' />),
        cell:({row}) => <div>
            <p className='-mb-1 font-medium'>{row.original.name}</p>
        </div>
    },{
        accessorKey: "descrpition",
        header:({column})=>(<DataTableColumnHeader column={column} title='Description' />),
        cell:({row}) => <div>
            <p className='-mb-1 font-medium line-clamp-2'>{row.original.description}</p>
        </div>
    },{
        accessorKey: "createdAt",
        header:({column})=>(<DataTableColumnHeader column={column} title='Day Created' />),
        cell:({row}) => <div className='text-muted-foreground text-nowrap'>
            {new Date(row.original.createdAt as string).toDateString()}
        </div>
    },{
    accessorKey: "updatedAt",
    header:({column})=>(<DataTableColumnHeader column={column} title='Actions' />),
    cell:({row}) => <div>
                <span className="flex gap-2 items-center">
                    <EditDepartment department={row.original} trigger={<button><Edit className="w-4 h-4 text-emerald-400"/></button>} />
                    <DeleteDepartment department={row.original} trigger={<button><Trash2 className="w-4 h-4 text-rose-400" /></button>} />
                </span>
    </div>
    }]

    const table = useReactTable({
        data: departmentsQuery.data || emptyData,
        columns,
        getCoreRowModel: getCoreRowModel(),  
    })

    return (
        <>
            <div className="container mx-auto">
                <div className="mt-4 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold">All Departments</h3>
                        <p className="text-xs text-gray-500">Manage all user departments activities from here</p>
                    </div>
                    <div className="flex gap-2">
                        <AddDepartment trigger={
                        <button className="py-1 px-2 md:px-4 flex items-center rounded-md bg-gradient-to-r from-emerald-500 to-emerald-800 text-white">
                            <Plus className="w-3 h-3 mr-1 text-white"/> <span className="text-xs text-nowrap">Add department</span>
                        </button>
                        } /> 
                        <AddUser trigger={
                        <button className="py-2 px-2 md:px-4 flex items-center rounded-md bg-gradient-to-r from-blue-500 to-blue-800 text-white">
                            <Plus className="w-4 h-4 mr-2 text-white"/> <span className="text-xs text-nowrap">Add User</span>
                        </button>
                        } /> 
                    </div>
                </div>
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
                            <TableBody className="text-xs">
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
                </div>
            </div>
        </>
    )
}

export default Departments
