import React from 'react';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { TableBody, TableHead, TableHeader, TableRow, TableCell } from '../ui/table';

const Table = ({ data, columns }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="relative overflow-x-auto border rounded-sm">
      <table className="w-full text-sm text-gray-500">
        {/* Table Header */}
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr className="text-sm bg-[#0000000F] text-black font-semibold" key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <td className="py-2 px-4 text-center border-black border" key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </TableHeader>

        {/* Table Body */}
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <tr className="text-sm text-black" key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td className="py-2 px-4 border-black border" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Tidak ada data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </table>
    </div>
  );
};

export default Table;
