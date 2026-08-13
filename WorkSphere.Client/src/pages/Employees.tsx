import React, { useEffect, useState } from 'react';
import type { EmployeeResponse, PaginatedResponse } from '../types';
import { getEmployees } from '../services/employeeService';

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>(''); // controlled input
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined); // active search used for requests

  // Fetch employees whenever pageNumber, pageSize or searchQuery changes
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const resp: PaginatedResponse<EmployeeResponse> = await getEmployees(
          pageNumber,
          pageSize,
          searchQuery
        );

        if (cancelled) return;

        setEmployees(resp.items ?? []);
        setTotalCount(resp.totalCount ?? resp.items.length ?? 0);
        setTotalPages(resp.totalPages ?? Math.max(1, Math.ceil((resp.totalCount ?? resp.items.length ?? 0) / pageSize)));
      } catch (err: any) {
        if (cancelled) return;
        console.error('Failed to load employees', err);
        setError(err?.message ?? 'Failed to load employees');
        setEmployees([]);
        setTotalCount(0);
        setTotalPages(1);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [pageNumber, pageSize, searchQuery]);

  function handlePrev() {
    setPageNumber((p) => Math.max(1, p - 1));
  }

  function handleNext() {
    setPageNumber((p) => Math.min(totalPages, p + 1));
  }

  function handleSearchSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    // When searching, reset to first page
    setPageNumber(1);
    setSearchQuery(searchTerm.trim() === '' ? undefined : searchTerm.trim());
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

  return (
    <section>
      <h2>Employees</h2>

      <form onSubmit={handleSearchSubmit} style={{ marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
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
