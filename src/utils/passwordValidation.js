// Password strength validation utility
export const validatePasswordStrength = (password) => {
  if (!password) return { score: 0, strength: 'Very Weak', color: 'text-red-600', bgColor: 'bg-red-100' };
  
  let score = 0;
  const feedback = [];
  
  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('At least 8 characters');
  }
  
  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('One uppercase letter');
  }
  
  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('One lowercase letter');
  }
  
  // Number check
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('One number');
  }
  
  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push('One special character');
  }
  
  // Determine strength level
  let strength, color, bgColor;
  
  if (score <= 1) {
    strength = 'Very Weak';
    color = 'text-red-600';
    bgColor = 'bg-red-100';
  } else if (score === 2) {
    strength = 'Weak';
    color = 'text-orange-600';
    bgColor = 'bg-orange-100';
  } else if (score === 3) {
    strength = 'Fair';
    color = 'text-yellow-600';
    bgColor = 'bg-yellow-100';
  } else if (score === 4) {
    strength = 'Good';
    color = 'text-blue-600';
    bgColor = 'bg-blue-100';
  } else {
    strength = 'Strong';
    color = 'text-green-600';
    bgColor = 'bg-green-100';
  }
  
  return {
    score,
    strength,
    color,
    bgColor,
    feedback,
    isValid: score >= 3 // Minimum 3 criteria met
  };
};

// Password confirmation validation
export const validatePasswordConfirmation = (password, confirmPassword) => {
  if (!password || !confirmPassword) {
    return { isValid: false, message: 'Both passwords are required' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, message: 'Passwords do not match' };
  }
  
  return { isValid: true, message: 'Passwords match' };
};

// Get password strength bar width
export const getPasswordStrengthBarWidth = (score) => {
  return `${(score / 5) * 100}%`;
};

// Get password strength bar color
export const getPasswordStrengthBarColor = (score) => {
  if (score <= 1) return 'bg-red-500';
  if (score === 2) return 'bg-orange-500';
  if (score === 3) return 'bg-yellow-500';
  if (score === 4) return 'bg-blue-500';
  return 'bg-green-500';
};
