
/**
 * Form validation utilities for TravelBank Ultra
 */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validators = {
  required: (value: string, fieldName: string): string | null => {
    if (!value || value.trim().length === 0) {
      return `${fieldName} is required`;
    }
    return null;
  },

  email: (value: string): string | null => {
    if (!value) return 'Email is required';
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) return 'Please enter a valid email address';
    return null;
  },

  phone: (value: string): string | null => {
    if (!value) return 'Phone number is required';
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length < 10) return 'Phone number must be at least 10 digits';
    if (cleaned.length > 12) return 'Phone number is too long';
    return null;
  },

  name: (value: string): string | null => {
    if (!value || value.trim().length === 0) return 'Name is required';
    if (value.trim().length < 2) return 'Name must be at least 2 characters';
    if (value.trim().length > 50) return 'Name is too long';
    if (!/^[a-zA-Z\s.'-]+$/.test(value)) return 'Name contains invalid characters';
    return null;
  },

  pan: (value: string): string | null => {
    if (!value) return 'PAN is required';
    const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!regex.test(value.toUpperCase())) return 'Invalid PAN format (e.g., ABCDE1234F)';
    return null;
  },

  aadhaar: (value: string): string | null => {
    if (!value) return 'Aadhaar is required';
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length !== 12) return 'Aadhaar must be 12 digits';
    return null;
  },

  ifsc: (value: string): string | null => {
    if (!value) return 'IFSC code is required';
    const regex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!regex.test(value.toUpperCase())) return 'Invalid IFSC format';
    return null;
  },

  upi: (value: string): string | null => {
    if (!value) return 'UPI ID is required';
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    if (!regex.test(value)) return 'Invalid UPI ID format (e.g., name@bank)';
    return null;
  },

  accountNumber: (value: string): string | null => {
    if (!value) return 'Account number is required';
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length < 8) return 'Account number is too short';
    if (cleaned.length > 18) return 'Account number is too long';
    return null;
  },

  pin: (value: string, length: number = 4): string | null => {
    if (!value) return 'PIN is required';
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length !== length) return `PIN must be ${length} digits`;
    return null;
  },

  amount: (value: string, min: number = 1, max: number = 10000000): string | null => {
    if (!value) return 'Amount is required';
    const num = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return 'Please enter a valid amount';
    if (num < min) return `Minimum amount is ₹${min}`;
    if (num > max) return `Maximum amount is ₹${max.toLocaleString()}`;
    return null;
  },

  date: (value: string): string | null => {
    if (!value) return 'Date is required';
    const date = new Date(value);
    if (isNaN(date.getTime())) return 'Please enter a valid date';
    return null;
  },

  futureDate: (value: string): string | null => {
    const dateError = validators.date(value);
    if (dateError) return dateError;
    const date = new Date(value);
    if (date <= new Date()) return 'Date must be in the future';
    return null;
  },

  pastDate: (value: string): string | null => {
    const dateError = validators.date(value);
    if (dateError) return dateError;
    const date = new Date(value);
    if (date >= new Date()) return 'Date must be in the past';
    return null;
  },

  password: (value: string): string | null => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(value)) return 'Password must contain an uppercase letter';
    if (!/[a-z]/.test(value)) return 'Password must contain a lowercase letter';
    if (!/[0-9]/.test(value)) return 'Password must contain a number';
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) return 'Password must contain a special character';
    return null;
  },

  confirmPassword: (password: string, confirm: string): string | null => {
    if (!confirm) return 'Please confirm your password';
    if (password !== confirm) return 'Passwords do not match';
    return null;
  },

  passport: (value: string): string | null => {
    if (!value) return 'Passport number is required';
    if (value.length < 6) return 'Passport number is too short';
    if (value.length > 12) return 'Passport number is too long';
    return null;
  },

  vehicleNumber: (value: string): string | null => {
    if (!value) return 'Vehicle number is required';
    const regex = /^[A-Z]{2}\s?[0-9]{1,2}\s?[A-Z]{1,3}\s?[0-9]{1,4}$/;
    if (!regex.test(value.toUpperCase())) return 'Invalid vehicle number format';
    return null;
  },

  gst: (value: string): string | null => {
    if (!value) return 'GST number is required';
    const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
    if (!regex.test(value.toUpperCase())) return 'Invalid GST format';
    return null;
  },
};

export const validateForm = (fields: Array<{ value: string; name: string; validator: (value: string) => string | null }>): ValidationResult => {
  const errors: Record<string, string> = {};
  let isValid = true;

  fields.forEach(({ value, name, validator }) => {
    const error = validator(value);
    if (error) {
      errors[name] = error;
      isValid = false;
    }
  });

  return { isValid, errors };
};

export default validators;
