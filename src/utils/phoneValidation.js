// Phone number validation utility
export const validatePhoneNumber = (phone) => {
  if (!phone) return { isValid: true, message: '' }; // Allow empty phone numbers
  
  // Remove all non-digit characters for validation
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check if it's a valid length (7-15 digits for international numbers)
  if (cleanPhone.length < 7 || cleanPhone.length > 15) {
    return { 
      isValid: false, 
      message: 'Phone number must be between 7 and 15 digits' 
    };
  }
  
  // Check if it contains only digits (after cleaning)
  if (!/^\d+$/.test(cleanPhone)) {
    return { 
      isValid: false, 
      message: 'Phone number can only contain digits, spaces, dashes, and parentheses' 
    };
  }
  
  return { isValid: true, message: '' };
};

// Format phone number for display
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleanPhone.length === 10) {
    // US format: (XXX) XXX-XXXX
    return `(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`;
  } else if (cleanPhone.length === 11 && cleanPhone.startsWith('1')) {
    // US format with country code: 1 (XXX) XXX-XXXX
    return `1 (${cleanPhone.slice(1, 4)}) ${cleanPhone.slice(4, 7)}-${cleanPhone.slice(7)}`;
  } else if (cleanPhone.length === 7) {
    // Local format: XXX-XXXX
    return `${cleanPhone.slice(0, 3)}-${cleanPhone.slice(3)}`;
  } else {
    // International format: just return cleaned version
    return cleanPhone;
  }
};

// Clean phone number for storage (remove formatting)
export const cleanPhoneNumber = (phone) => {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
};

// Phone input change handler with validation
export const handlePhoneChange = (value, setFormData, fieldName = 'phone') => {
  // Check if the input contains only allowed characters
  if (value === '' || /^[\d\s\-()+]*$/.test(value)) {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  }
};

// Real-time validation for phone input
export const validatePhoneInput = (phone) => {
  if (!phone) return { isValid: true, message: '', className: '' };
  
  const validation = validatePhoneNumber(phone);
  
  if (validation.isValid) {
    return { 
      isValid: true, 
      message: '', 
      className: 'border-green-300 focus:border-green-500 focus:ring-green-500' 
    };
  } else {
    return { 
      isValid: false, 
      message: validation.message, 
      className: 'border-red-300 focus:border-red-500 focus:ring-green-500' 
    };
  }
}; 
