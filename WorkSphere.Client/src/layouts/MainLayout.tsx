import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const activeStyle: React.CSSProperties = { fontWeight: '600', textDecoration: 'underline' };

const MainLayout: React.FC = () => {
  return (
    <div style={{maxWidth: 960, margin: '0 auto', padding: '1rem'}}>
      <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <h1 style={{margin: 0}}>WorkSphere</h1>
          <small>Enterprise Workforce Management</small>
        </div>
        <nav>
          <NavLink to="/" style={({ isActive }) => (isActive ? activeStyle : undefined)} end>
            Dashboard
          </NavLink>
          {' | '}
          <NavLink to="/employees" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
            Employees
          </NavLink>
          {' | '}
          <NavLink to="/departments" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
            Departments
          </NavLink>
        </nav>
      </header>

      <main style={{marginTop: '1.5rem'}}>
        <Outlet />
      </main>

      <footer style={{marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem'}}>
        <small>© {new Date().getFullYear()} WorkSphere</small>
      </footer>
    </div>
  );
};

export default MainLayout;
