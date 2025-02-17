import React, { useState, useEffect } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { CiSearch } from 'react-icons/ci';
import Pagination from './Pagination';
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '../ui/table';
import { Input } from '../ui/input';

const TablePagination = ({
  data,
  columns,
  fetchData,
  pagination,
  setSearch,
  debouncedFetchData,
  tittleAddButton,
  showAddButton,
  actionAddButton,
  showSearchBar,
}) => {
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState('');
  const [isShowAddButton, setIsShowAddButton] = useState(true);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter: filtering,
      pagination: {
        pageIndex: pagination.currentPage - 1,
        pageSize: pagination.dataPerpages,
      },
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
    manualPagination: true,
    pageCount: pagination.totalPage,
  });

  const handlePageChange = (pageIndex) => {
    debouncedFetchData(
      pageIndex + 1,
      table.getState().pagination.pageSize,
      filtering
    );
  };

  const handlePageSizeChange = (pageSize) => {
    fetchData(1, pageSize, filtering);
  };

  useEffect(() => {
    debouncedFetchData(1, table.getState().pagination.pageSize, filtering);
  }, [filtering, debouncedFetchData, table.getState().pagination.pageSize]);

  return (
    <div className="">
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <div className="mb-4 md:mb-0">
          {showAddButton && (
            <button
              onClick={actionAddButton}
              className="bg-[#072B2E] text-white font-semibold rounded-[5px] py-[6px] px-[15px]"
            >
              {tittleAddButton}
            </button>
          )}
        </div>
        {showSearchBar && (
          <div className="relative flex items-center w-full md:w-[368px]">
            <CiSearch className="absolute left-4 top-2 text-blue-gray-300 text-xl" />
            <Input
              type="text"
              value={filtering}
              onChange={(e) => setFiltering(e.target.value)}
              label={'Search...'}
              className="rounded-md text-sm border-black shadow pl-12 py-2 w-full"
              placeholder="Search..."
            />
          </div>
        )}
      </div>

      <div className="relative overflow-x-auto border rounded-sm mb-3">
        <table className="w-full text-sm text rtl:text-right text-gray-500  dark:text-gray-400">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                className="text-sm bg-[#0000000F] text-black  font-semibold"
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => (
                  <td
                    className="py-[4px] px-[7px] text-center border-black border"
                    key={header.id}
                  >
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  className="text-sm text-black"
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      className="py-[4px]  border-black border px-[7px] overflow-hidden  text-ellipsis whitespace-nowrap"
                      key={cell.id}
                    >
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap max-w-full font-medium">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Tidak ada data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </table>
      </div>
      <div>
        <Pagination
          table={table}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
};

export default TablePagination;
