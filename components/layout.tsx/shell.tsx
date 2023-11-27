import { cn } from "@/lib/utils";

type ShellProps = React.HTMLAttributes<HTMLDivElement>;

function Shell({ children, className }: ShellProps) {
  return (
    <div
      className={cn(
        "border-border w-fit rounded-lg border px-3 py-4 backdrop-blur-[2px] dark:backdrop-blur-[1px] md:p-6",
        className
      )}
    >
      {children}
    </div>
  );
}

export { Shell };
