import React, { useEffect, useState } from 'react';
import type { EmployeeCreateRequest, Department } from '../../types';
import { getEmployee } from '../../services/employeeService';
import { getDepartments } from '../../services/departmentService';
import { useAppDispatch } from '../../store/hooks';
import { createEmployeeThunk, updateEmployeeThunk } from '../../store/slices/employeeThunks';
import { unwrapResult } from '@reduxjs/toolkit';

interface EmployeeFormProps {
  initialValues?: Partial<EmployeeCreateRequest>;
  employeeId?: string; // when provided, form operates in edit mode and will load existing data
  onCancel?: () => void;
  onSuccess?: (createdOrUpdated: any) => void; // created/updated EmployeeResponse
}

interface ValidationErrors {
  [key: string]: string | undefined;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s\.0-9]*$/; // permissive

const EmployeeForm: React.FC<EmployeeFormProps> = ({ initialValues = {}, employeeId, onCancel, onSuccess }) => {
  const [employeeCode, setEmployeeCode] = useState(initialValues.employeeCode ?? '');
  const [firstName, setFirstName] = useState(initialValues.firstName ?? '');
  const [lastName, setLastName] = useState(initialValues.lastName ?? '');
  const [email, setEmail] = useState(initialValues.email ?? '');
  const [phoneNumber, setPhoneNumber] = useState(initialValues.phoneNumber ?? '');
  const [dateOfJoining, setDateOfJoining] = useState(initialValues.dateOfJoining ?? '');
  const [departmentId, setDepartmentId] = useState(initialValues.departmentId ?? '');

  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState<boolean>(false);
  const [departmentsError, setDepartmentsError] = useState<string | null>(null);

  const [employeeLoading, setEmployeeLoading] = useState<boolean>(false);
  const [employeeLoadError, setEmployeeLoadError] = useState<string | null>(null);

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    let cancelled = false;
    async function loadDepts() {
      setDepartmentsLoading(true);
      setDepartmentsError(null);
      try {
        const deps = await getDepartments();
        if (cancelled) return;
        setDepartments(deps);
      } catch (err: any) {
        if (cancelled) return;
        console.error('Failed to load departments', err);
        setDepartmentsError(err?.message ?? 'Failed to load departments');
      } finally {
        if (!cancelled) setDepartmentsLoading(false);
      }
    }
    loadDepts();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const id = employeeId;
    if (!id) return;

    let cancelled = false;
    async function loadEmployee() {
      setEmployeeLoading(true);
      setEmployeeLoadError(null);
      try {
        const emp = await getEmployee(id as string);
        if (cancelled) return;
        // populate fields
        setEmployeeCode(emp.employeeCode ?? '');
        setFirstName(emp.firstName ?? '');
        setLastName(emp.lastName ?? '');
        setEmail(emp.email ?? '');
        setPhoneNumber(emp.phoneNumber ?? '');
        // normalize date to yyyy-mm-dd for input[type=date]
        setDateOfJoining(emp.dateOfJoining ? emp.dateOfJoining.split('T')[0] : '');
        setDepartmentId(emp.departmentId ?? '');
      } catch (err: any) {
        if (cancelled) return;
        console.error('Failed to load employee', err);
        setEmployeeLoadError(err?.message ?? 'Failed to load employee details');
      } finally {
        if (!cancelled) setEmployeeLoading(false);
      }
    }
    loadEmployee();
    return () => { cancelled = true; };
  }, [employeeId]);

  function validate(): boolean {
    const e: ValidationErrors = {};
    if (!employeeCode || employeeCode.trim() === '') e.employeeCode = 'Employee code is required';
    if (!firstName || firstName.trim() === '') e.firstName = 'First name is required';
    if (!lastName || lastName.trim() === '') e.lastName = 'Last name is required';
    if (!email || email.trim() === '') e.email = 'Email is required';
    else if (!emailRegex.test(email)) e.email = 'Enter a valid email';
    if (!departmentId || departmentId.trim() === '') e.departmentId = 'Department is required';
    if (!dateOfJoining || dateOfJoining.trim() === '') e.dateOfJoining = 'Date of joining is required';
    if (phoneNumber && phoneNumber.trim() !== '' && !phoneRegex.test(phoneNumber)) e.phoneNumber = 'Enter a valid phone number';

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setApiError(null);
    setSuccessMessage(null);

    if (!validate()) return;

    const payload: EmployeeCreateRequest = {
      employeeCode: employeeCode.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phoneNumber: phoneNumber.trim() || undefined,
      dateOfJoining: dateOfJoining, // assume yyyy-mm-dd from input[type=date]
      departmentId: departmentId.trim()
    };

    try {
      setSubmitting(true);
      if (employeeId) {
        const action = await dispatch(updateEmployeeThunk({ id: employeeId, payload }));
        const updated = unwrapResult(action);
        setSuccessMessage('Employee updated successfully');
        setApiError(null);
        if (onSuccess) onSuccess(updated);
      } else {
        const action = await dispatch(createEmployeeThunk(payload));
        const created = unwrapResult(action);
        setSuccessMessage('Employee created successfully');
        setApiError(null);

        // Reset form only for create
        setEmployeeCode('');
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhoneNumber('');
        setDateOfJoining('');
        setDepartmentId('');
        setErrors({});

        if (onSuccess) onSuccess(created);
      }
    } catch (err: any) {
      console.error('Create/update employee failed', err);
      setApiError(err?.message ?? 'Failed to save employee');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #eee', padding: 12, borderRadius: 4, maxWidth: 800 }} noValidate>
      <h3>{employeeId ? 'Edit Employee' : 'Create Employee'}</h3>

      {employeeId && employeeLoading && <div>Loading employee details...</div>}
      {employeeLoadError && <div style={{ color: 'red', marginBottom: 8 }}>{employeeLoadError}</div>}

      {apiError && <div style={{ color: 'red', marginBottom: 8 }}>{apiError}</div>}
      {successMessage && <div style={{ color: 'green', marginBottom: 8 }}>{successMessage}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12 }}>Employee Code *</label>
          <input value={employeeCode} onChange={(e) => setEmployeeCode(e.target.value)} style={{ width: '100%', padding: 8 }} />
          {errors.employeeCode && <div style={{ color: 'red', fontSize: 12 }}>{errors.employeeCode}</div>}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12 }}>Department *</label>
          {departmentsLoading ? (
            <div>Loading departments...</div>
          ) : departmentsError ? (
            <div style={{ color: 'red' }}>{departmentsError}</div>
          ) : (
            <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} style={{ width: '100%', padding: 8 }}>
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          )}
          {errors.departmentId && <div style={{ color: 'red', fontSize: 12 }}>{errors.departmentId}</div>}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12 }}>First Name *</label>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} style={{ width: '100%', padding: 8 }} />
          {errors.firstName && <div style={{ color: 'red', fontSize: 12 }}>{errors.firstName}</div>}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12 }}>Last Name *</label>
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} style={{ width: '100%', padding: 8 }} />
          {errors.lastName && <div style={{ color: 'red', fontSize: 12 }}>{errors.lastName}</div>}
        </div>

        <div style={{ gridColumn: '1 / 2' }}>
          <label style={{ display: 'block', fontSize: 12 }}>Email *</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: 8 }} />
          {errors.email && <div style={{ color: 'red', fontSize: 12 }}>{errors.email}</div>}
        </div>

        <div style={{ gridColumn: '2 / 3' }}>
          <label style={{ display: 'block', fontSize: 12 }}>Phone Number</label>
          <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} style={{ width: '100%', padding: 8 }} />
          {errors.phoneNumber && <div style={{ color: 'red', fontSize: 12 }}>{errors.phoneNumber}</div>}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12 }}>Date of Joining *</label>
          <input type="date" value={dateOfJoining} onChange={(e) => setDateOfJoining(e.target.value)} style={{ width: '100%', padding: 8 }} />
          {errors.dateOfJoining && <div style={{ color: 'red', fontSize: 12 }}>{errors.dateOfJoining}</div>}
        </div>

        <div style={{ alignSelf: 'end' }}>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onCancel} disabled={submitting} style={{ padding: '8px 12px' }}>
              Cancel
            </button>
            <button type="submit" disabled={submitting || departmentsLoading || employeeLoading} style={{ padding: '8px 12px' }}>
              {submitting ? 'Saving...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EmployeeForm;
