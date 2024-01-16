/**************************************************************************************************
 * This file contains the functions to calculate the password strengt.                            *
 * The password strength is calculated using the following criteria:                              *
 * 1. The password must be at least 8 characters long.                                            *
 * 2. The password must contain at least one number.                                              *
 * 3. The password must contain at least one special character.                                   *
 **************************************************************************************************/

/**
 * Function to calculate the descriptive password strength.
 * @param newPassword The new password.
 * @returns The descriptive password strength.
 */
export function calculateDescriptivePasswordStrength(newPassword: string): string {
  const lengthRequirement: number = newPassword.length >= 8 ? 1 : 0;
  const containsNumber: number = /\d/.test(newPassword) ? 1 : 0;
  const containsSpecialCharacter: number = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? 1 : 0;

  const strength: number = lengthRequirement + containsNumber + containsSpecialCharacter;
  if (newPassword.length === 0) return "No input";
  else if (strength === 0) return "Very Weak";
  else if (strength === 1) return "Weak";
  else if (strength === 2) return "Strong";
  else return "Very Strong";
}

/**
 * Function to calculate the numerical password strength.
 * @param newPassword The new password.
 * @returns The numerical password strength.
 */
export function calculateNumericalPasswordStrength(newPassword: string): number {
  const lengthRequirement: number = newPassword.length >= 8 ? 1 : 0;
  const containsNumber: number = /\d/.test(newPassword) ? 1 : 0;
  const containsSpecialCharacter: number = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? 1 : 0;
  return lengthRequirement + containsNumber + containsSpecialCharacter;
}
