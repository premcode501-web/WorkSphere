import React, { useEffect, useState } from 'react';
import type { EmployeeCreateRequest, Department } from '../../types';
import { getEmployee } from '../../services/employeeService';
import { getDepartments } from '../../services/departmentService';
import { useAppDispatch } from '../../store/hooks';
import {
  createEmployeeThunk,
  updateEmployeeThunk,
} from '../../store/slices/employeeThunks';
import { unwrapResult } from '@reduxjs/toolkit';
import './EmployeeForm.css';

interface EmployeeFormProps {
  initialValues?: Partial<EmployeeCreateRequest>;
  employeeId?: string;
  onCancel?: () => void;
  onSuccess?: (createdOrUpdated: any) => void;
}

interface ValidationErrors {
  [key: string]: string | undefined;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s\.0-9]*$/;

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialValues = {},
  employeeId,
  onCancel,
  onSuccess,
}) => {
  const [employeeCode, setEmployeeCode] = useState(
    initialValues.employeeCode ?? ''
  );
  const [firstName, setFirstName] = useState(
    initialValues.firstName ?? ''
  );
  const [lastName, setLastName] = useState(
    initialValues.lastName ?? ''
  );
  const [email, setEmail] = useState(
    initialValues.email ?? ''
  );
  const [phoneNumber, setPhoneNumber] = useState(
    initialValues.phoneNumber ?? ''
  );
  const [dateOfJoining, setDateOfJoining] = useState(
    initialValues.dateOfJoining ?? ''
  );
  const [departmentId, setDepartmentId] = useState(
    initialValues.departmentId ?? ''
  );

  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentsLoading, setDepartmentsLoading] =
    useState<boolean>(false);
  const [departmentsError, setDepartmentsError] =
    useState<string | null>(null);

  const [employeeLoading, setEmployeeLoading] =
    useState<boolean>(false);
  const [employeeLoadError, setEmployeeLoadError] =
    useState<string | null>(null);

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

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
        setDepartmentsError(
          err?.message ?? 'Failed to load departments'
        );
      } finally {
        if (!cancelled) {
          setDepartmentsLoading(false);
        }
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

        setEmployeeCode(emp.employeeCode ?? '');
        setFirstName(emp.firstName ?? '');
        setLastName(emp.lastName ?? '');
        setEmail(emp.email ?? '');
        setPhoneNumber(emp.phoneNumber ?? '');

        setDateOfJoining(
          emp.dateOfJoining
            ? emp.dateOfJoining.split('T')[0]
            : ''
        );

        setDepartmentId(emp.departmentId ?? '');
      } catch (err: any) {
        if (cancelled) return;

        console.error('Failed to load employee', err);

        setEmployeeLoadError(
          err?.message ?? 'Failed to load employee details'
        );
      } finally {
        if (!cancelled) {
          setEmployeeLoading(false);
        }
      }
    }

    loadEmployee();

    return () => {
      cancelled = true;
    };
  }, [employeeId]);

  function validate(): boolean {
    const e: ValidationErrors = {};

    if (!employeeCode || employeeCode.trim() === '') {
      e.employeeCode = 'Employee code is required';
    }

    if (!firstName || firstName.trim() === '') {
      e.firstName = 'First name is required';
    }

    if (!lastName || lastName.trim() === '') {
      e.lastName = 'Last name is required';
    }

    if (!email || email.trim() === '') {
      e.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      e.email = 'Enter a valid email';
    }

    if (!departmentId || departmentId.trim() === '') {
      e.departmentId = 'Department is required';
    }

    if (!dateOfJoining || dateOfJoining.trim() === '') {
      e.dateOfJoining = 'Date of joining is required';
    }

    if (
      phoneNumber &&
      phoneNumber.trim() !== '' &&
      !phoneRegex.test(phoneNumber)
    ) {
      e.phoneNumber = 'Enter a valid phone number';
    }

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
      dateOfJoining,
      departmentId: departmentId.trim(),
    };

    try {
      setSubmitting(true);

      if (employeeId) {
        const action = await dispatch(
          updateEmployeeThunk({
            id: employeeId,
            payload,
          })
        );

        const updated = unwrapResult(action);

        setSuccessMessage('Employee updated successfully');
        setApiError(null);

        if (onSuccess) {
          onSuccess(updated);
        }
      } else {
        const action = await dispatch(
          createEmployeeThunk(payload)
        );

        const created = unwrapResult(action);

        setSuccessMessage('Employee created successfully');
        setApiError(null);

        setEmployeeCode('');
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhoneNumber('');
        setDateOfJoining('');
        setDepartmentId('');
        setErrors({});

        if (onSuccess) {
          onSuccess(created);
        }
      }
    } catch (err: any) {
      console.error('Create/update employee failed', err);

      setApiError(
        err?.message ?? 'Failed to save employee'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="employee-form"
      noValidate
    >
      <div className="employee-form-header">
        <div>
          <h3>
            {employeeId
              ? 'Edit Employee'
              : 'Create Employee'}
          </h3>

          <p>
            {employeeId
              ? 'Update employee information'
              : 'Add a new employee to WorkSphere'}
          </p>
        </div>
      </div>

      {employeeId && employeeLoading && (
        <div className="employee-form-info">
          Loading employee details...
        </div>
      )}

      {employeeLoadError && (
        <div className="employee-form-alert error">
          {employeeLoadError}
        </div>
      )}

      {apiError && (
        <div className="employee-form-alert error">
          {apiError}
        </div>
      )}

      {successMessage && (
        <div className="employee-form-alert success">
          {successMessage}
        </div>
      )}

      <div className="employee-form-grid">

        {/* Employee Code */}
        <div className="employee-form-group">
          <label>Employee Code *</label>

          <input
            value={employeeCode}
            onChange={(e) =>
              setEmployeeCode(e.target.value)
            }
            placeholder="e.g. EMP001"
          />

          {errors.employeeCode && (
            <span className="employee-form-error">
              {errors.employeeCode}
            </span>
          )}
        </div>

        {/* Department */}
        <div className="employee-form-group">
          <label>Department *</label>

          {departmentsLoading ? (
            <div className="employee-form-loading">
              Loading departments...
            </div>
          ) : departmentsError ? (
            <div className="employee-form-error">
              {departmentsError}
            </div>
          ) : (
            <select
              value={departmentId}
              onChange={(e) =>
                setDepartmentId(e.target.value)
              }
            >
              <option value="">
                Select Department
              </option>

              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          )}

          {errors.departmentId && (
            <span className="employee-form-error">
              {errors.departmentId}
            </span>
          )}
        </div>

        {/* First Name */}
        <div className="employee-form-group">
          <label>First Name *</label>

          <input
            value={firstName}
            onChange={(e) =>
              setFirstName(e.target.value)
            }
            placeholder="Enter first name"
          />

          {errors.firstName && (
            <span className="employee-form-error">
              {errors.firstName}
            </span>
          )}
        </div>

        {/* Last Name */}
        <div className="employee-form-group">
          <label>Last Name *</label>

          <input
            value={lastName}
            onChange={(e) =>
              setLastName(e.target.value)
            }
            placeholder="Enter last name"
          />

          {errors.lastName && (
            <span className="employee-form-error">
              {errors.lastName}
            </span>
          )}
        </div>

        {/* Email */}
        <div className="employee-form-group">
          <label>Email *</label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="employee@worksphere.com"
          />

          {errors.email && (
            <span className="employee-form-error">
              {errors.email}
            </span>
          )}
        </div>

        {/* Phone */}
        <div className="employee-form-group">
          <label>Phone Number</label>

          <input
            value={phoneNumber}
            onChange={(e) =>
              setPhoneNumber(e.target.value)
            }
            placeholder="Enter phone number"
          />

          {errors.phoneNumber && (
            <span className="employee-form-error">
              {errors.phoneNumber}
            </span>
          )}
        </div>

        {/* Date */}
        <div className="employee-form-group">
          <label>Date of Joining *</label>

          <input
            type="date"
            value={dateOfJoining}
            onChange={(e) =>
              setDateOfJoining(e.target.value)
            }
          />

          {errors.dateOfJoining && (
            <span className="employee-form-error">
              {errors.dateOfJoining}
            </span>
          )}
        </div>

      </div>

      {/* Actions */}
      <div className="employee-form-actions">

        <button
          type="button"
          className="employee-form-cancel"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="employee-form-submit"
          disabled={
            submitting ||
            departmentsLoading ||
            employeeLoading
          }
        >
          {submitting
            ? 'Saving...'
            : employeeId
              ? 'Update Employee'
              : 'Create Employee'}
        </button>

      </div>
    </form>
  );
};

export default EmployeeForm;