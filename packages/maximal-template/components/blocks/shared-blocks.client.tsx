"use client";
import { sharedLibraryCopy } from "@/content/shared";

import * as React from "react";
import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  flexRender,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type RowData,
  type RowSelectionState,
  type SortingState,
  type Table as TanstackTable,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  Search,
  Settings2,
  Home,
  RefreshCw,
  AlertTriangle,
  ServerCrash,
  Construction,
  Wifi,
  Ban,
  Clock,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils/cn";
import { safeHref } from "@/lib/utils/strings";
import Link from "next/link";

const dataTableFeatures = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns,
  sortFns,
});

type DataTableFeatures = typeof dataTableFeatures;

type DataTableInstance<TData extends RowData> = TanstackTable<
  DataTableFeatures,
  TData
>;

// DataTable Context
type DataTableContextValue<TData extends RowData> = {
  table: DataTableInstance<TData>;
};

const DataTableContext =
  React.createContext<DataTableContextValue<RowData> | null>(null);

function useDataTable<TData extends RowData>() {
  const context = React.useContext(DataTableContext);
  if (!context) {
    throw new Error("DataTable components must be used within a <DataTable />");
  }

  return context as unknown as DataTableContextValue<TData>;
}

// Column Header with sorting
interface DataTableColumnHeaderProps<
  TData extends RowData,
  TValue,
> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<DataTableFeatures, TData, TValue>;
  title: string;
}

function DataTableColumnHeader<TData extends RowData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("-ml-3 h-8 data-[state=open]:bg-accent", className)}
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      <span>{title}</span>
      {column.getIsSorted() === "desc" ? (
        <ArrowDown className="ml-2 h-4 w-4" />
      ) : column.getIsSorted() === "asc" ? (
        <ArrowUp className="ml-2 h-4 w-4" />
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
}

// Toolbar
type DataTableToolbarProps<TData extends RowData> = {
  table: DataTableInstance<TData>;
  filterPlaceholder?: string;
  filterColumn?: string;
  showColumnVisibility?: boolean;
};

function DataTableToolbar<TData extends RowData>({
  table,
  filterPlaceholder = "Filter...",
  filterColumn,
  showColumnVisibility = true,
}: DataTableToolbarProps<TData>) {
  const column = filterColumn ? table.getColumn(filterColumn) : undefined;

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex flex-1 items-center space-x-2">
        {column ? (
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={filterPlaceholder}
              value={String(column.getFilterValue() ?? "")}
              onChange={(event) => column.setFilterValue(event.target.value)}
              className="h-9 w-[150px] pl-9 lg:w-[250px]"
            />
          </div>
        ) : null}
      </div>

      {showColumnVisibility ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto h-9">
              <Settings2 className="mr-2 h-4 w-4" />
              {sharedLibraryCopy.columns}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((tableColumn) => tableColumn.getCanHide())
              .map((tableColumn) => (
                <DropdownMenuCheckboxItem
                  key={tableColumn.id}
                  className="capitalize"
                  checked={tableColumn.getIsVisible()}
                  onCheckedChange={(value) =>
                    tableColumn.toggleVisibility(Boolean(value))
                  }
                >
                  {tableColumn.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  );
}

// Pagination
type DataTablePaginationProps<TData extends RowData> = {
  table: DataTableInstance<TData>;
  pageSizeOptions?: number[];
};

function DataTablePagination<TData extends RowData>({
  table,
  pageSizeOptions = [10, 20, 30, 50],
}: DataTablePaginationProps<TData>) {
  const pagination = table.store.state.pagination;
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const filteredCount = table.getFilteredRowModel().rows.length;

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        {selectedCount > 0 ? (
          <>
            {selectedCount}
            {sharedLibraryCopy.of}
            {filteredCount}
            {sharedLibraryCopy.rowSSelected}
          </>
        ) : null}
      </div>

      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">{sharedLibraryCopy.rowsPerPage}</p>
          <Select
            value={`${pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="h-9 w-[85px]">
              <SelectValue placeholder={pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          {sharedLibraryCopy.page}
          {pagination.pageIndex + 1}
          {sharedLibraryCopy.of}
          {table.getPageCount()}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {sharedLibraryCopy.previous}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {sharedLibraryCopy.next}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Main DataTable component
export type DataTableProps<TData extends RowData> = {
  columns: ColumnDef<DataTableFeatures, TData>[];
  data: TData[];

  // Features
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enableColumnVisibility?: boolean;
  enableRowSelection?: boolean;
  enablePagination?: boolean;

  // Pagination
  pageSize?: number;
  pageSizeOptions?: number[];

  // Search
  filterColumn?: string;
  filterPlaceholder?: string;

  // Empty/Loading
  emptyMessage?: string;
  isLoading?: boolean;

  // Callbacks
  onRowSelectionChange?: (selectedRows: TData[]) => void;
};

function DataTable<TData extends RowData>({
  columns,
  data,
  enableSorting = true,
  enableFiltering = true,
  enableColumnVisibility = true,
  enableRowSelection = false,
  enablePagination = true,
  pageSize = 10,
  pageSizeOptions = [10, 20, 30, 50],
  filterColumn,
  filterPlaceholder = "Filter...",
  emptyMessage = sharedLibraryCopy.noResults,
  isLoading = false,
  onRowSelectionChange,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<ColumnVisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const tableColumns = React.useMemo<
    ColumnDef<DataTableFeatures, TData>[]
  >(() => {
    if (!enableRowSelection) return columns;

    const selectionColumn: ColumnDef<DataTableFeatures, TData> = {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(Boolean(value))
          }
          aria-label={sharedLibraryCopy.selectAll}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
          aria-label={sharedLibraryCopy.selectRow}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    };

    return [selectionColumn, ...columns];
  }, [columns, enableRowSelection]);

  const table = useTable({
    features: dataTableFeatures,
    data,
    columns: tableColumns,
    enableSorting,
    enableFilters: enableFiltering,
    enableColumnFilters: enableFiltering,
    enableHiding: enableColumnVisibility,
    enableRowSelection,
    manualPagination: !enablePagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize,
      },
    },
  });

  const onRowSelectionChangeRef = React.useRef(onRowSelectionChange);
  React.useEffect(() => {
    onRowSelectionChangeRef.current = onRowSelectionChange;
  }, [onRowSelectionChange]);

  React.useEffect(() => {
    const notify = onRowSelectionChangeRef.current;
    if (!notify) return;

    notify(table.getFilteredSelectedRowModel().rows.map((row) => row.original));
  }, [rowSelection, table]);

  const contextValue = React.useMemo(
    () =>
      ({
        table,
      }) as unknown as DataTableContextValue<RowData>,
    [table],
  );

  return (
    <DataTableContext.Provider value={contextValue}>
      <div className="space-y-4">
        {(enableFiltering || enableColumnVisibility) && (
          <DataTableToolbar
            table={table}
            filterPlaceholder={filterPlaceholder}
            {...(filterColumn === undefined ? {} : { filterColumn })}
            showColumnVisibility={enableColumnVisibility}
          />
        )}

        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center">
                    <div className="h-6 w-6 animate-spin border-3 border-foreground border-t-transparent" />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {enablePagination ? (
          <DataTablePagination
            table={table}
            pageSizeOptions={pageSizeOptions}
          />
        ) : null}
      </div>
    </DataTableContext.Provider>
  );
}

export {
  DataTable,
  DataTableColumnHeader,
  DataTableToolbar,
  DataTablePagination,
  dataTableFeatures,
  useDataTable,
};

// ============================================================================
// ERROR PAGE VARIANT 1: 404 Not Found
// ============================================================================

// ============================================================================
// ERROR PAGE VARIANT 2: 500 Server Error
// ============================================================================
export type ServerErrorPageProps = {
  title?: string;
  description?: string;
  errorId?: string;
  onRetry?: () => void;
  homeHref?: string;
  supportEmail?: string;
  className?: string;
};

export function ServerErrorPage({
  title = sharedLibraryCopy.label500,
  description = sharedLibraryCopy.somethingWentWrongOnOurEndOurTeamHas,
  errorId,
  onRetry,
  homeHref = "/",
  supportEmail,
  className,
}: ServerErrorPageProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center bg-background p-4",
        className,
      )}
    >
      <div className="max-w-lg space-y-8 text-center">
        {/* Large 500 */}
        <div className="relative">
          <h1 className="text-[150px] leading-none font-black text-muted-foreground/20 md:text-[200px]">
            {title}
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-24 w-24 items-center justify-center border-3 border-foreground bg-destructive shadow-[6px_6px_0px_hsl(var(--shadow-color))]">
              <ServerCrash className="h-12 w-12 text-destructive-foreground" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-black uppercase md:text-3xl">
            {sharedLibraryCopy.serverError}
          </h2>
          <p className="text-muted-foreground">{description}</p>
          {errorId && (
            <p className="border-2 border-foreground bg-muted p-2 font-mono text-xs text-muted-foreground">
              {sharedLibraryCopy.errorID}
              {errorId}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          {onRetry && (
            <Button onClick={onRetry}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {sharedLibraryCopy.tryAgain}
            </Button>
          )}
          <Button variant="outline" asChild>
            <a href={safeHref(homeHref)}>
              <Home className="mr-2 h-4 w-4" />
              {sharedLibraryCopy.backToHome}
            </a>
          </Button>
        </div>

        {supportEmail && (
          <p className="text-sm text-muted-foreground">
            {sharedLibraryCopy.stillHavingIssues}{" "}
            <a
              href={safeHref(`mailto:${supportEmail}`)}
              className="font-bold text-primary hover:underline"
            >
              {sharedLibraryCopy.contactSupport}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// ERROR PAGE VARIANT 3: Maintenance Page
// ============================================================================
export type MaintenancePageProps = {
  title?: string;
  description?: string;
  estimatedTime?: string;
  features?: string[];
  statusPageUrl?: string;
  className?: string;
};

export function MaintenancePage({
  title = sharedLibraryCopy.underMaintenance,
  description = sharedLibraryCopy.weReCurrentlyPerformingScheduledMaintenanceToImproveYour,
  estimatedTime,
  features,
  statusPageUrl,
  className,
}: MaintenancePageProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center bg-background p-4",
        className,
      )}
    >
      <div className="max-w-lg space-y-8 text-center">
        <div className="mx-auto flex h-32 w-32 items-center justify-center border-3 border-foreground bg-warning shadow-[8px_8px_0px_hsl(var(--shadow-color))]">
          <Construction className="h-16 w-16 text-warning-foreground" />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-black tracking-tight uppercase md:text-4xl">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground">{description}</p>

          {estimatedTime && (
            <div className="inline-flex items-center gap-2 border-3 border-foreground bg-muted px-4 py-2">
              <Clock className="h-5 w-5" />
              <span className="font-bold">
                {sharedLibraryCopy.estimatedTime}
                {estimatedTime}
              </span>
            </div>
          )}
        </div>

        {features && features.length > 0 && (
          <div className="space-y-3 border-3 border-foreground bg-card p-6 text-left">
            <h3 className="text-sm font-bold uppercase">
              {sharedLibraryCopy.whatWeAposReWorkingOn}
            </h3>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li
                  key={`feature-${index}`}
                  className="flex items-start gap-2 text-sm"
                >
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 border-foreground bg-primary text-primary-foreground">
                    {sharedLibraryCopy.separator}
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {statusPageUrl && (
          <Button variant="outline" asChild>
            <a
              href={safeHref(statusPageUrl)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {sharedLibraryCopy.checkStatusPage}
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// ERROR PAGE VARIANT 4: Offline Page
// ============================================================================
export type OfflinePageProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
};

export function OfflinePage({
  title = sharedLibraryCopy.youReOffline,
  description = sharedLibraryCopy.itLooksLikeYouVeLostYourInternetConnection,
  onRetry,
  className,
}: OfflinePageProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center bg-background p-4",
        className,
      )}
    >
      <div className="max-w-md space-y-8 text-center">
        <div className="mx-auto flex h-32 w-32 items-center justify-center border-3 border-foreground bg-muted shadow-[8px_8px_0px_hsl(var(--shadow-color))]">
          <Wifi className="h-16 w-16 text-muted-foreground" />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-black tracking-tight uppercase md:text-4xl">
            {title}
          </h1>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <div className="space-y-4">
          <div className="border-3 border-foreground bg-muted/30 p-4 text-left">
            <h3 className="mb-2 text-sm font-bold uppercase">
              {sharedLibraryCopy.thingsToTry}
            </h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>{sharedLibraryCopy.checkYourWiFiConnection}</li>
              <li>{sharedLibraryCopy.restartYourRouter}</li>
              <li>{sharedLibraryCopy.tryDisablingVPNIfYouAposReUsingOne}</li>
            </ul>
          </div>

          {onRetry && (
            <Button onClick={onRetry} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              {sharedLibraryCopy.tryAgain}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ERROR PAGE VARIANT 5: 403 Forbidden
// ============================================================================
export type ForbiddenPageProps = {
  title?: string;
  description?: string;
  homeHref?: string;
  loginHref?: string;
  className?: string;
};

export function ForbiddenPage({
  title = sharedLibraryCopy.label403,
  description = sharedLibraryCopy.youDonTHavePermissionToAccessThisPage,
  homeHref = "/",
  loginHref,
  className,
}: ForbiddenPageProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center bg-background p-4",
        className,
      )}
    >
      <div className="max-w-lg space-y-8 text-center">
        {/* Large 403 */}
        <div className="relative">
          <h1 className="text-[150px] leading-none font-black text-muted-foreground/20 md:text-[200px]">
            {title}
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-24 w-24 items-center justify-center border-3 border-foreground bg-warning shadow-[6px_6px_0px_hsl(var(--shadow-color))]">
              <Ban className="h-12 w-12 text-warning-foreground" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-black uppercase md:text-3xl">
            {sharedLibraryCopy.accessDenied}
          </h2>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild>
            <a href={safeHref(homeHref)}>
              <Home className="mr-2 h-4 w-4" />
              {sharedLibraryCopy.backToHome}
            </a>
          </Button>
          {loginHref && (
            <Button variant="outline" asChild>
              <a href={safeHref(loginHref)}>
                <Lock className="mr-2 h-4 w-4" />
                {sharedLibraryCopy.signIn}
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ERROR PAGE VARIANT 6: Coming Soon
// ============================================================================

// ============================================================================
// ERROR PAGE VARIANT 7: Generic Error
// ============================================================================
export type GenericErrorPageProps = {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actions?: Array<{
    label: string;
    href?: string;
    onClick?: () => void;
    variant?: "default" | "outline";
  }>;
  className?: string;
};

export function GenericErrorPage({
  icon,
  title = sharedLibraryCopy.somethingWentWrong,
  description = sharedLibraryCopy.anUnexpectedErrorOccurredPleaseTryAgainLater,
  actions,
  className,
}: GenericErrorPageProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center bg-background p-4",
        className,
      )}
    >
      <div className="max-w-md space-y-8 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center border-3 border-foreground bg-destructive/10 shadow-[6px_6px_0px_hsl(var(--shadow-color))]">
          {icon || <AlertTriangle className="h-12 w-12 text-destructive" />}
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-black tracking-tight uppercase md:text-3xl">
            {title}
          </h1>
          <p className="text-muted-foreground">{description}</p>
        </div>

        {actions && actions.length > 0 && (
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            {actions.map((action) => (
              <Button
                key={action.label}
                variant={action.variant || "default"}
                onClick={action.onClick}
                asChild={!!action.href}
              >
                {action.href ? (
                  <a href={safeHref(action.href)}>{action.label}</a>
                ) : (
                  action.label
                )}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Export all variants
// ============================================================================
export const ErrorPages = {
  ServerError: ServerErrorPage,
  Maintenance: MaintenancePage,
  Offline: OfflinePage,
  Forbidden: ForbiddenPage,

  Generic: GenericErrorPage,
};

export function ErrorBlock({
  title,
  description = sharedLibraryCopy.theRequestedSurfaceIsUnavailable,
  onRetry,
}: {
  title: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <main className="grid min-h-dvh place-items-center px-6 py-12">
      <section className="w-full max-w-lg space-y-5 border-3 border-foreground bg-card p-8 text-center shadow-[8px_8px_0px_hsl(var(--shadow-color))]">
        <p className="text-sm font-bold tracking-widest text-primary uppercase">
          {sharedLibraryCopy.requestBoundary}
        </p>
        <h1 className="text-3xl font-black uppercase">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
        <div className="flex flex-wrap justify-center gap-3">
          {onRetry ? (
            <Button onClick={onRetry}>{sharedLibraryCopy.tryAgain2}</Button>
          ) : null}
          <Button asChild variant="outline">
            <Link href="/">{sharedLibraryCopy.returnHome}</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
