import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../layouts/MainLayout.css';

const MainLayout: React.FC = () => {
  return (
    <div className="app-wrapper">

      {/* Navbar */}
      
      <header className="navbar custom-navbar px-3 px-md-4">
        
        <NavLink to="/" className="navbar-brand app-logo brand-container">
        <img src="src/assets/workSphereLogo.png" alt="WorkSphere Logo" className="app-logo-image" />
        <div className="brand-text">
        <h2>WorkSphere</h2>
        <h6>Enterprise Workforce Management</h6>
      </div>
        </NavLink>

        <nav className="navbar-nav flex-row gap-4 gap-md-5">
          <NavLink
            to="/"
            end
            className={({ isActive }: { isActive: boolean }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/employees"
            className={({ isActive }: { isActive: boolean }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            Employees
          </NavLink>

          <NavLink
            to="/departments"
            className={({ isActive }: { isActive: boolean }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            Departments
          </NavLink>
        </nav>

        <button className="login-btn">
          Login
        </button>
      </header>

      {/* Page Content */}
      <main className="container-fluid px-3 px-md-4 mt-4">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="container-fluid px-3 px-md-4 mt-4">
        <small>
          © {new Date().getFullYear()} WorkSphere
        </small>
      </footer>

    </div>
  );
};

export default MainLayout;