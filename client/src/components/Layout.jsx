import { Outlet } from 'react-router-dom';

// Main layout component for authenticated routes
function AuthenticatedLayout() {
  return (
    <div className="authenticated-layout">
      <main>
        <Outlet />
      </main>
    </div>
  );
}

// Layout component for public routes
function PublicLayout() {
  return (
    <div className="public-layout">
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export { AuthenticatedLayout, PublicLayout };
