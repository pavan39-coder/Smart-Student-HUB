import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import {
  FiActivity,
  FiAward,
  FiBookOpen,
  FiHome,
  FiLayers,
  FiLogOut,
  FiMenu,
  FiUser,
  FiUsers,
  FiX,
} from 'react-icons/fi';

const roleNavigation = {
  student: [
    { label: 'Dashboard', path: '/dashboard', icon: FiHome },
    { label: 'Activities', path: '/activities', icon: FiActivity },
    { label: 'Projects', path: '/projects', icon: FiLayers },
    { label: 'Leaderboard', path: '/leaderboard', icon: FiAward },
    { label: 'Profile', path: '/profile', icon: FiUser },
  ],
  admin: [
    { label: 'Dashboard', path: '/admin', icon: FiHome },
    { label: 'Projects', path: '/projects', icon: FiLayers },
    { label: 'Approvals', path: '/admin/approvals', icon: FiBookOpen },
    { label: 'Students', path: '/admin/students', icon: FiUsers },
  ],
  faculty: [
    { label: 'Dashboard', path: '/faculty', icon: FiHome },
    { label: 'Projects', path: '/projects', icon: FiLayers },
    { label: 'Approvals', path: '/faculty/approvals', icon: FiBookOpen },
    { label: 'My Students', path: '/faculty/students', icon: FiUsers },
  ],
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const homePath = user?.role === 'admin' ? '/admin' : user?.role === 'faculty' ? '/faculty' : '/dashboard';

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const linkClass = (path) => {
    const active = location.pathname === path || (path === '/projects' && location.pathname.startsWith('/project'));
    return `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
      active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
    }`;
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm shadow-slate-900/[0.03] backdrop-blur">
      <nav className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <Link
          to={user ? homePath : '/'}
          onClick={closeMenu}
          className="inline-flex shrink-0 items-center gap-2.5 text-lg font-extrabold tracking-tight text-slate-950"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200">
            <FiAward size={19} />
          </span>
          <span>SAR <span className="text-indigo-600">System</span></span>
        </Link>

        {!user ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
              Sign in
            </Link>
            <Link to="/register" className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100">
              Get started
            </Link>
          </div>
        ) : (
          <>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-200 md:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              aria-controls="account-navigation"
            >
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>

            <div
              id="account-navigation"
              className={`${menuOpen ? 'absolute left-0 right-0 top-full border-b border-slate-200 bg-white p-4 shadow-lg' : 'hidden'} md:static md:flex md:items-center md:gap-1 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
            >
              <div className="flex flex-col gap-1 md:flex-row md:items-center">
                {(roleNavigation[user.role] || []).map(({ label, path, icon: Icon }) => (
                  <Link key={path} to={path} className={linkClass(path)} onClick={closeMenu}>
                    <Icon size={17} />
                    {label}
                  </Link>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 md:ml-4 md:mt-0 md:border-l md:border-t-0 md:pl-4 md:pt-0">
                <div className="min-w-0 md:max-w-36">
                  <p className="truncate text-sm font-semibold text-slate-800">{user.name}</p>
                  <p className="text-xs capitalize text-slate-500">{user.role} account</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-100"
                >
                  <FiLogOut size={16} /> <span className="md:hidden lg:inline">Sign out</span>
                </button>
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
