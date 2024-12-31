import React, { useEffect } from 'react'

import {
    Column,
    ColumnDef,
    ColumnFiltersState,
    FilterFn,
    PaginationState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'

import {
    RankingInfo,
    rankItem,
} from '@tanstack/match-sorter-utils'

import { GoogleSpreadsheet } from 'google-spreadsheet'

import config from '../../assets/config.json'

declare module '@tanstack/react-table' {
    interface FilterFns {
        fuzzy: FilterFn<unknown>
    }
    interface FilterMeta {
        itemRank: RankingInfo
    }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)

    addMeta({
        itemRank,
    })

    return itemRank.passed
}


function Table() {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = React.useState('')
    const [data, setData] = React.useState<{ [key: string]: string }[]>([])
    // const [columns, setColumns] = React.useState<ColumnDef<string, any>[]>([])
    const [columns, setColumns] = React.useState<ColumnDef<{ [key: string]: string }, any>[]>([])
    
    // function stringToAsciiArray(str: string): number[] {
    //     return Array.from(str).map(char => char.charCodeAt(0));
    // }
    
    function asciiArrayToString(asciiArray: number[]): string {
        return asciiArray.map(code => String.fromCharCode(code)).join('');
    }

    const fetch = async () => {

        try {
            // var apiKeyArr = stringToAsciiArray("")
            var apikey = asciiArrayToString(config.key)
            const doc = new GoogleSpreadsheet(config.fileId, { apiKey: apikey });
            await doc.loadInfo();

            const configSheet = doc.sheetsByTitle[config.configSheetName]; // or use `doc.sheetsById[id]` or `doc.sheetsByTitle[title]`
            const configRows = await configSheet.getRows(); // can pass in { limit, offset }

            const booksDataSheetName = configRows[0].get("BookDataSheet")

            const headers: string[] = [];

            for (let index = 0; index < configRows.length; index++) {
                const colName = configRows[index].get("BookColumns")
                headers.push(colName)
            }

            const sheet = doc.sheetsByTitle[booksDataSheetName]; // or use `doc.sheetsById[id]` or `doc.sheetsByTitle[title]`
            const rows = await sheet.getRows(); // can pass in { limit, offset }

            var d: { [key: string]: string }[] = []
            const h: ColumnDef<{ [key: string]: string }, any>[] = [];

            for (let index = 0; index < rows.length; index++) {
                let attr: { [key: string]: string } = {}

                headers.forEach((header: string) => {
                    attr[header] = rows[index].get(header)
                });

                d.push(attr)
            }

            setData(d)

            for (let index = 0; index < headers.length; index++) {
                const element = headers[index];

                h.push({
                    accessorKey: element,
                    cell: (info: { getValue: () => any }) => info.getValue(),
                    header: () => <span>{element}</span>,
                    filterFn: 'includesString', //note: normal non-fuzzy filter column - case sensitive
                })
            }
            setColumns(h)

        } catch (e) {
            console.log('Error')
        }
    }

    useEffect(() => {
        fetch();
    }, [])

    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 25,
    })

    const table = useReactTable({
        data,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
        },
        state: {
            columnFilters,
            globalFilter,
            pagination
        },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: 'fuzzy', //apply fuzzy filter to the global filter (most common use case for fuzzy filter)
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(), //client side filtering
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        debugTable: true,
        debugHeaders: true,
        debugColumns: false,
        onPaginationChange: setPagination
    })

    //apply the fuzzy sort if the fullName column is being filtered
    React.useEffect(() => {
        if (table.getState().columnFilters[0]?.id === 'fullName') {
            if (table.getState().sorting[0]?.id !== 'fullName') {
                table.setSorting([{ id: 'fullName', desc: false }])
            }
        }
    }, [table.getState().columnFilters[0]?.id])

    return (
        <div className="p-2" style={{ width: '100%' }}>
            <div className='search-box'>
                <DebouncedInput
                    value={globalFilter ?? ''}
                    onChange={value => setGlobalFilter(String(value))}
                    className="p-2 font-lg shadow border border-block"
                    placeholder="Search all columns..."
                />
            </div>
            <div className="h-2" />
            <table style={{ width: '100%' }}>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => {
                                return (
                                    <th key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder ? null : (
                                            <>
                                                <div
                                                    {...{
                                                        className: header.column.getCanSort()
                                                            ? 'cursor-pointer select-none'
                                                            : '',
                                                        onClick: header.column.getToggleSortingHandler(),
                                                    }}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    {{
                                                        asc: ' 🔼',
                                                        desc: ' 🔽',
                                                    }[header.column.getIsSorted() as string] ?? null}
                                                </div>
                                                {header.column.getCanFilter() ? (
                                                    <div>
                                                        <Filter column={header.column} />
                                                    </div>
                                                ) : null}
                                            </>
                                        )}
                                    </th>
                                )
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => {
                        return (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => {
                                    return (
                                        <td key={cell.id} >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )
                                            }
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div className="h-2" />
            <div className="flex items-center gap-2 center ">
                <button
                    className="border rounded p-1"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<<'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {'>'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                >
                    {'>>'}
                </button>
                <span className="flex items-center gap-1">
                    <div>Page</div>
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount()}
                    </strong>
                </span>
                <span className="flex items-center gap-1">
                    | Go to page:
                    <input
                        type="number"
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            table.setPageIndex(page)
                        }}
                        className="border p-1 rounded w-16"
                    />
                </span>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        table.setPageSize(Number(e.target.value))
                    }}
                >
                    {[10, 20, 25, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
            <div className='center'>{table.getPrePaginationRowModel().rows.length} Rows</div>
        </div>
    )
}

function Filter({ column }: { column: Column<any, unknown> }) {
    const columnFilterValue = column.getFilterValue()

    return (
        <DebouncedInput
            type="text"
            value={(columnFilterValue ?? '') as string}
            onChange={value => column.setFilterValue(value)}
            placeholder={`Search...`}
            className="w-36 border shadow rounded"
        />
    )
}

// A typical debounced input react component
function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
    }, [value])

    return (
        <input {...props} value={value} onChange={e => setValue(e.target.value)} />
    )
}

export default Table