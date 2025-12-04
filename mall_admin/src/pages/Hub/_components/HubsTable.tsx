import { DataTableColumnHeader } from "@/components/DataTable/ColumnHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useHubs } from "@/hooks/useHubs";
import { Hub } from "@/lib/types";
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { Link } from "react-router-dom";

interface FilterProps{
    search:string,
    limit: number,
    page: number,
    setLimit: (value:number)=>void,
    setPage: (value:number)=>void
}

const emptyData: any[]= []

const HubsTable = ({page, limit, setLimit, setPage, search}:FilterProps) => {
    const {hubs, meta} = useHubs(1, 10, search)

    const columns:ColumnDef<Hub>[] =[{
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
            accessorKey: "type",
            header:({column})=>(<DataTableColumnHeader column={column} title='Hub type' />),
            cell:({row}) => <div className="flex gap-2">
                {row.original.types.map((type)=>{
                    return <span>{type.name}</span>
                })}
                
            </div>
        },{
            accessorKey: "createdAt",
            header:({column})=>(<DataTableColumnHeader column={column} title='Day Created' />),
            cell:({row}) => <div className='text-muted-foreground text-nowrap'>
                {new Date(row.original.createdAt as string).toDateString()}
            </div>
        },{
        accessorKey: "ids",
        header:({column})=>(<DataTableColumnHeader column={column} title='Actions' />),
        cell:({}) => <div>
                    <span className="flex gap-2 items-center">
                        {/* <EditDepartment department={row.original} trigger={<button><Edit className="w-4 h-4 text-emerald-400"/></button>} />
                        <DeleteDepartment department={row.original} trigger={<button><Trash2 className="w-4 h-4 text-rose-400" /></button>} /> */}
                    </span>
        </div>
    }]

    const table = useReactTable({
        data: hubs || emptyData,
        columns,
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
        state:{
            pagination: {
                pageIndex: page - 1,
                pageSize: limit,
            }
        },
        getPaginationRowModel: getPaginationRowModel(),
        pageCount: meta?.pageCount,
    })

    return (
        <div className="mt-2 mb-8 p-2 md:px-0 rounded-2xl">
            <div className="w-full rounded-md  bg-white/75">
                <Table>
                    <TableHeader className="bg-gray-200">
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
            <div className="flex text-xs items-center justify-between space-x-2 py-4 mt-4">
                  <div>
                    <span className="mr-2">Items per page</span>
                    <select 
                      className="border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
                      value={limit}
                      onChange={e=> {setLimit(Number(e.target.value))}} >

                      {[10,20,50,100].map((pageSize)=>(
                        <option key={pageSize} value={pageSize}>
                          {pageSize}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex space-x-2">
                      <button
                        className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                        onClick={()=>setPage(1)}
                        disabled={page === 1}>
                        <ChevronsLeft size={16} />
                      </button>
                      <button
                        className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                        onClick={()=>setPage(page - 1)}
                        disabled={page === 1}>
                        <ChevronLeft size={16} />
                      </button>

                      <span className="flex items-center">
                        <input 
                          className="w-16 p-2 rounded-md border border-gray-300 text-center"
                          min={1}
                          max={table.getPageCount()}
                          type="number"
                          value={table.getState().pagination.pageIndex + 1}
                          onChange={e=> {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            setPage(page)
                          }}
                        />
                        <span className="ml-1">of {meta?.pageCount}</span>
                      </span>

                      <button
                        className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                        onClick={()=>setPage(page + 1)}
                        disabled={ page === Number(meta?.pageCount) }>
                        <ChevronRight size={16} />
                      </button>
                      <button
                        className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                        onClick={()=>setPage(Number(meta?.pageCount))}
                        disabled={page === Number(meta?.pageCount)}>
                        <ChevronsRight size={16} />
                      </button>
                  </div>
            </div>
        </div>
    )
}

export default HubsTable
