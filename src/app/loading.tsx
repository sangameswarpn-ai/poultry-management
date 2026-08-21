export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"></div>
        <div className="h-4 w-4 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]"></div>
        <div className="h-4 w-4 animate-bounce rounded-full bg-primary"></div>
      </div>
      <p className="mt-4 text-sm font-medium text-muted-foreground animate-pulse">
        Synchronizing biosecurity parameters...
      </p>
    </div>
  );
}
