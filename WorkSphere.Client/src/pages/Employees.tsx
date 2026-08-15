import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EmployeeForm from '../components/employees/EmployeeForm';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchEmployees, deleteEmployeeThunk } from '../store/slices/employeeThunks';
import { setPageNumber } from '../store/slices/employeeSlice';

const Employees: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const employees = useAppSelector((s) => s.employees.employees);
  const pageNumber = useAppSelector((s) => s.employees.pageNumber);
  const pageSize = useAppSelector((s) => s.employees.pageSize);
  const totalPages = useAppSelector((s) => s.employees.totalPages);
  const totalCount = useAppSelector((s) => s.employees.totalCount);
  const loading = useAppSelector((s) => s.employees.loading);
  const error = useAppSelector((s) => s.employees.error);

  const [searchTerm, setSearchTerm] = useState<string>(''); // controlled input
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined); // active search used for requests
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);
  //const [deletingId, setDeletingId] = useState<string | null>(null);
  //const [operationMessage, setOperationMessage] = useState<string | null>(null);
  //const [operationError, setOperationError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [operationMessage, setOperationMessage] = useState<string | null>(null);
  const [operationError, setOperationError] = useState<string | null>(null);

  // Fetch employees when pageNumber, pageSize or searchQuery changes (or on mount)
  useEffect(() => {
    // dispatch thunk to fetch
    dispatch(fetchEmployees({ pageNumber, pageSize, search: searchQuery }));
  }, [dispatch, pageNumber, pageSize, searchQuery]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('new') === '1') {
      setShowForm(true);
      setEditingEmployeeId(null);
    }
  }, [location.search]);

  function handlePrev() {
    const newPage = Math.max(1, pageNumber - 1);
    dispatch(setPageNumber(newPage));
    dispatch(fetchEmployees({ pageNumber: newPage, pageSize, search: searchQuery }));
  }

  function handleNext() {
    const newPage = Math.min(totalPages, pageNumber + 1);
    dispatch(setPageNumber(newPage));
    dispatch(fetchEmployees({ pageNumber: newPage, pageSize, search: searchQuery }));
  }

  function handleSearchSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    // When searching, reset to first page and dispatch fetch
    const q = searchTerm.trim() === '' ? undefined : searchTerm.trim();
    setSearchQuery(q);
    dispatch(setPageNumber(1));
    dispatch(fetchEmployees({ pageNumber: 1, pageSize, search: q }));
  }

  function formatDate(dateStr?: string) {
    if (!dateStr) return '';
    try {
      // dateOfJoining is expected as ISO date or YYYY-MM-DD
      const d = new Date(dateStr);
      if (Number.isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString();
    } catch {
      return dateStr;
    }
  }

  function handleCreated() {
    // After create/update, close form. Thunks refresh list as needed.
    setShowForm(false);
    setEditingEmployeeId(null);
    if (location.search.includes('new')) {
      navigate('/employees', { replace: true });
    }
  }

  function handleEdit(id: string) {
    setEditingEmployeeId(id);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    const confirm = window.confirm('Are you sure you want to delete this employee? This action cannot be undone.');
    if (!confirm) return;

    setOperationMessage(null);
    setOperationError(null);
    setDeletingId(id);

    try {
      await dispatch(deleteEmployeeThunk(id));
      setOperationMessage('Employee deleted successfully');
    } catch (err: any) {
      console.error('Failed to delete employee', err);
      setOperationError(err?.message ?? 'Failed to delete employee');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section>
      <h2>Employees</h2>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: 8, minWidth: 240 }}
            aria-label="Search employees"
          />
          <button type="submit" style={{ padding: '8px 12px' }}>Search</button>
        </form>

        <div>
          {!showForm && (
            <button onClick={() => { setEditingEmployeeId(null); setShowForm(true); }} style={{ padding: '8px 12px' }}>New Employee</button>
          )}
        </div>
      </div>

      {showForm && (
        <div style={{ marginBottom: 16 }}>
          <EmployeeForm
            key={editingEmployeeId ?? 'new'}
            employeeId={editingEmployeeId ?? undefined}
            onCancel={() => {
              setShowForm(false);
              setEditingEmployeeId(null);
              if (location.search.includes('new')) {
                navigate('/employees', { replace: true });
              }
            }}
            onSuccess={() => handleCreated()}
          />
        </div>
      )}

      {operationMessage && <div style={{ color: 'green', marginBottom: 8 }}>{operationMessage}</div>}
      {operationError && <div style={{ color: 'red', marginBottom: 8 }}>{operationError}</div>}

      {loading && <p>Loading employees...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && !error && employees.length === 0 && (
        <p>No employees found.</p>
      )}

      {!loading && !error && employees.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd' }}>Employee Code</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd' }}>First Name</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd' }}>Last Name</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd' }}>Email</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd' }}>Phone Number</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd' }}>Department</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd' }}>Date of Joining</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd' }}>Status</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{emp.employeeCode}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{emp.firstName}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{emp.lastName}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{emp.email}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{emp.phoneNumber}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{emp.departmentName}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{formatDate(emp.dateOfJoining)}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{emp.isActive ? 'Active' : 'Inactive'}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>
                    <button onClick={() => handleEdit(emp.id)} disabled={deletingId !== null} style={{ padding: '6px 8px', marginRight: 8 }}>Edit</button>
                    <button onClick={() => handleDelete(emp.id)} disabled={deletingId !== null} style={{ padding: '6px 8px' }}>
                      {deletingId === emp.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
            <div>
              <button onClick={handlePrev} disabled={pageNumber <= 1} style={{ padding: '6px 10px', marginRight: 8 }}>
                Previous
              </button>
              <button onClick={handleNext} disabled={pageNumber >= totalPages} style={{ padding: '6px 10px' }}>
                Next
              </button>
            </div>

            <div>
              <small>
                Page {pageNumber} of {totalPages} | Page size: {pageSize} | Total records: {totalCount}
              </small>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Employees;
