export function StatusBlock({ title = 'Status', message = 'Ready' }: { title?: string; message?: string }) { return <section><h2>{title}</h2><p>{message}</p></section>; }
