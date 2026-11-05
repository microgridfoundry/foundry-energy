import { page, type RouteHandler } from "fresh";

export const title = "404 - Page not found";

// Return a real 404 status (Fresh otherwise serves this page as 200)
export const handler: RouteHandler<unknown, unknown> = () =>
  page(undefined, { status: 404 });

export default function Error404() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <a
          href="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Return Home
        </a>
      </div>
    </div>
  );
}
