import * as React from "react";
import { ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utilites/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

const ComboboxContext = React.createContext<
  { open: boolean; contentId: string } | undefined
>(undefined);
function useCombobox() {
  const context = React.useContext(ComboboxContext);
  if (!context) throw new Error("Combobox parts require a Combobox root");
  return context;
}
function Combobox({
  open,
  defaultOpen = false,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof Popover>) {
  const [uncontrolledOpen, setOpen] = React.useState(defaultOpen);
  const contentId = React.useId();
  const resolvedOpen = open ?? uncontrolledOpen;
  return (
    <ComboboxContext.Provider value={{ open: resolvedOpen, contentId }}>
      <Popover
        {...props}
        open={resolvedOpen}
        onOpenChange={(next) => {
          setOpen(next);
          onOpenChange?.(next);
        }}
      />
    </ComboboxContext.Provider>
  );
}

const ComboboxTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    placeholder?: string;
    value?: string;
    open?: boolean;
  }
>(({ className, placeholder = "Select...", value, open, ...props }, ref) => {
  const context = useCombobox();
  return (
    <PopoverTrigger asChild>
      <button
        ref={ref}
        role="combobox"
        aria-controls={props["aria-controls"] ?? context.contentId}
        aria-expanded={open ?? context.open}
        aria-haspopup="listbox"
        className={cn(
          "flex h-11 w-full items-center justify-between border-3 border-input bg-background px-4 py-2 text-sm font-medium shadow-[4px_4px_0px_hsl(var(--shadow-color))] transition duration-200 focus:translate-x-[4px] focus:translate-y-[4px] focus:shadow-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        <span className={cn("truncate", !value && "text-muted-foreground")}>
          {value || placeholder}
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 stroke-[2.5] opacity-50" />
      </button>
    </PopoverTrigger>
  );
});
ComboboxTrigger.displayName = "ComboboxTrigger";

/**
 * Multi-select trigger. Each entry in `values` has a `value` (identifier)
 * and a `label` (display text). The `onRemove` callback receives the `value`
 * of the chip that was dismissed, so you can remove it from state directly.
 */
const ComboboxMultiTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    placeholder?: string;
    values?: { value: string; label: string }[];
    open?: boolean;
    onRemove?: (value: string) => void;
  }
>(
  (
    {
      className,
      placeholder = "Select...",
      values = [],
      open,
      onRemove,
      ...props
    },
    ref,
  ) => {
    const context = useCombobox();
    return (
      // The chips live OUTSIDE the trigger button. They used to be inside it, so
      // each chip's remove control had to be a bare <svg onClick> — mouse-only,
      // unfocusable and unnamed — because a real <button> there would have been
      // interactive content nested inside the trigger (axe `nested-interactive`).
      <div
        className={cn(
          "flex min-h-11 w-full flex-wrap items-center gap-1.5 border-3 border-input bg-background px-3 py-2 text-sm font-medium shadow-[4px_4px_0px_hsl(var(--shadow-color))] transition duration-200 focus-within:translate-x-[4px] focus-within:translate-y-[4px] focus-within:shadow-none",
          className,
        )}
      >
        {values.map(({ value, label }) => (
          <span
            key={value}
            className="flex items-center gap-1 border-2 border-foreground bg-accent px-1.5 py-0.5 text-xs font-bold"
          >
            {label}
            <button
              type="button"
              aria-label={`Remove ${label}`}
              onClick={(e) => {
                e.stopPropagation();
                onRemove?.(value);
              }}
              className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-3 w-3 stroke-[3] hover:opacity-70" />
            </button>
          </span>
        ))}
        <PopoverTrigger asChild>
          <button
            ref={ref}
            role="combobox"
            aria-controls={props["aria-controls"] ?? context.contentId}
            aria-expanded={open ?? context.open}
            aria-haspopup="listbox"
            className="flex flex-1 items-center justify-between gap-2 bg-transparent text-left focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            {...props}
          >
            {values.length === 0 && (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 stroke-[2.5] opacity-50" />
          </button>
        </PopoverTrigger>
      </div>
    );
  },
);
ComboboxMultiTrigger.displayName = "ComboboxMultiTrigger";

const ComboboxContent = React.forwardRef<
  React.ElementRef<typeof PopoverContent>,
  React.ComponentPropsWithoutRef<typeof PopoverContent>
>(({ className, children, align = "start", ...props }, ref) => {
  const context = useCombobox();
  return (
    <PopoverContent
      ref={ref}
      id={context.contentId}
      align={align}
      className={cn("p-0", className)}
      {...props}
    >
      <Command>{children}</Command>
    </PopoverContent>
  );
});
ComboboxContent.displayName = "ComboboxContent";

export {
  Combobox,
  ComboboxTrigger,
  ComboboxMultiTrigger,
  ComboboxContent,
  CommandInput as ComboboxInput,
  CommandList as ComboboxList,
  CommandEmpty as ComboboxEmpty,
  CommandGroup as ComboboxGroup,
  CommandItem as ComboboxItem,
  CommandSeparator as ComboboxSeparator,
};
