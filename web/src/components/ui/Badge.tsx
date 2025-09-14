export default function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-900">
      {children}
    </span>
  );
}



