import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="w-full">
      <p className="mb-3 text-sm font-medium uppercase text-accent">404</p>
      <h1 className="text-3xl font-semibold text-foreground">Page not found</h1>
      <Link
        className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent"
        to="/"
      >
        Return home
      </Link>
    </section>
  );
}
