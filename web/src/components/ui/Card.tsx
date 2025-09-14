import { PropsWithChildren } from "react";

export function Card({ children }: PropsWithChildren) {
  return (
    <div className="rounded-xl border bg-white/80 p-6 shadow-sm backdrop-blur dark:bg-zinc-900/60">
      {children}
    </div>
  );
}

export function CardHeader({ title, actions }: { title: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold">{title}</h2>
      {actions}
    </div>
  );
}

export function CardContent({ children }: PropsWithChildren) {
  return <div className="space-y-3">{children}</div>;
}



