const BRAZILIAN_MOBILE_PATTERN =
  /^(?:1[1-9]|2[12478]|3[1-578]|4[1-9]|5[1345]|6[1-9]|7[134579]|8[1-9]|9[1-9])9\d{8}$/;

const EMAIL_PATTERN =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

export function brazilianPhoneDigits(value: string): string {
  const raw = value.replace(/\D/g, '');
  const withoutCountryCode = raw.length > 11 && raw.startsWith('55') ? raw.slice(2) : raw;
  return withoutCountryCode.slice(0, 11);
}

export function formatBrazilianPhone(value: string): string {
  const digits = brazilianPhoneDigits(value);
  if (digits.length <= 2) return digits.replace(/(\d{0,2})/, '($1');
  if (digits.length <= 6) return digits.replace(/(\d{2})(\d+)/, '($1) $2');
  if (digits.length <= 10) return digits.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
  return digits.replace(/(\d{2})(\d{5})(\d+)/, '($1) $2-$3');
}

export function brazilianCepDigits(value: string): string {
  return value.replace(/\D/g, '').slice(0, 8);
}

export function formatBrazilianCep(value: string): string {
  const digits = brazilianCepDigits(value);
  if (digits.length <= 5) return digits;
  return digits.replace(/(\d{5})(\d+)/, '$1-$2');
}

export function isValidBrazilianCep(value: string): boolean {
  const digits = brazilianCepDigits(value);
  return digits.length === 8 && digits !== '00000000';
}

export function isValidBrazilianWhatsapp(value: string): boolean {
  const digits = brazilianPhoneDigits(value);
  return BRAZILIAN_MOBILE_PATTERN.test(digits) && !/^(\d)\1+$/.test(digits);
}

export function isValidEmail(value: string): boolean {
  const email = value.trim();
  const [local, domain, extra] = email.split('@');

  if (!local || !domain || extra || email.length > 254 || local.length > 64) return false;
  if (local.startsWith('.') || local.endsWith('.') || local.includes('..')) return false;

  return EMAIL_PATTERN.test(email);
}

export function cpfDigits(value: string): string {
  return value.replace(/\D/g, '').slice(0, 11);
}

export function formatCpf(value: string): string {
  const digits = cpfDigits(value);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return digits.replace(/(\d{3})(\d+)/, '$1.$2');
  if (digits.length <= 9) return digits.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4');
}

export function isValidCpf(value: string): boolean {
  const digits = cpfDigits(value);
  if (digits.length !== 11 || /^(\d)\1+$/.test(digits)) return false;

  const calculateDigit = (length: number) => {
    const sum = digits
      .slice(0, length)
      .split('')
      .reduce((total, digit, index) => total + Number(digit) * (length + 1 - index), 0);
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  return calculateDigit(9) === Number(digits[9]) && calculateDigit(10) === Number(digits[10]);
}

export function isValidAdultBirthDate(value: string, referenceDate = new Date()): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const birthDate = new Date(year, month - 1, day, 12);

  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day
  ) {
    return false;
  }

  let age = referenceDate.getFullYear() - year;
  const birthdayHasPassed =
    referenceDate.getMonth() > month - 1 ||
    (referenceDate.getMonth() === month - 1 && referenceDate.getDate() >= day);
  if (!birthdayHasPassed) age -= 1;

  return age >= 18 && age <= 100;
}

export function formatBirthDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : value;
}

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function adultBirthDateBounds(referenceDate = new Date()): { min: string; max: string } {
  const minimum = new Date(referenceDate.getFullYear() - 100, referenceDate.getMonth(), referenceDate.getDate());
  const maximum = new Date(referenceDate.getFullYear() - 18, referenceDate.getMonth(), referenceDate.getDate());
  return { min: toIsoDate(minimum), max: toIsoDate(maximum) };
}
