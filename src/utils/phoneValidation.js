/**
 * Yemeni Phone Number Validation Utility
 * Standard: Exactly 9 local digits starting with valid mobile prefixes:
 * 77 (Yemen Mobile - CDMA/4G/5G)
 * 78 (Yemen Mobile)
 * 73 (YOU / MTN)
 * 71 (Sabafon)
 * 70 (Y Telecom)
 */

export const YEMENI_PHONE_PREFIXES = ['77', '78', '73', '71', '70'];

export function cleanYemeniPhone(input) {
  if (!input) return '';
  let cleaned = String(input).trim().replace(/\D/g, '');

  // Strip international dial codes if present
  if (cleaned.startsWith('967') && cleaned.length >= 12) {
    cleaned = cleaned.substring(3);
  } else if (cleaned.startsWith('00967') && cleaned.length >= 14) {
    cleaned = cleaned.substring(5);
  } else if (cleaned.startsWith('0') && cleaned.length === 10) {
    cleaned = cleaned.substring(1);
  }

  // Truncate to maximum 9 digits
  if (cleaned.length > 9) {
    cleaned = cleaned.slice(0, 9);
  }

  return cleaned;
}

export function validateYemeniPhone(input) {
  if (!input || String(input).trim() === '') {
    return {
      valid: false,
      error: 'يرجى إدخال رقم الهاتف',
      cleaned: '',
      formatted: '',
      fullInternational: '',
    };
  }

  const cleaned = cleanYemeniPhone(input);

  // Check for non-digit inputs
  if (/[^\d]/.test(cleaned)) {
    return {
      valid: false,
      error: 'لا يُسمح بإدخال أحرف أو رموز، يرجى كتابة أرقام فقط',
      cleaned,
      formatted: cleaned,
      fullInternational: '',
    };
  }

  // Must be exactly 9 digits
  if (cleaned.length < 9) {
    return {
      valid: false,
      error: `رقم الهاتف ناقص (${cleaned.length} من 9 أرقام)، يجب أن يتكون من 9 أرقام بالضبط`,
      cleaned,
      formatted: cleaned,
      fullInternational: '',
    };
  }

  if (cleaned.length > 9) {
    return {
      valid: false,
      error: `رقم الهاتف لا يقبل أكثر من 9 أرقام محلية`,
      cleaned,
      formatted: cleaned,
      fullInternational: '',
    };
  }

  // Must start with valid prefix
  const prefix = cleaned.substring(0, 2);
  if (!YEMENI_PHONE_PREFIXES.includes(prefix)) {
    return {
      valid: false,
      error: `يجب أن يبدأ الرقم بأحد شبكات الهاتف اليمنية المعتمدة (77, 78, 73, 71, 70)`,
      cleaned,
      formatted: cleaned,
      fullInternational: '',
    };
  }

  // Format as 77x xxx xxx
  const formatted = `${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6, 9)}`;

  return {
    valid: true,
    error: null,
    cleaned,
    formatted,
    fullInternational: `+967 ${formatted}`,
  };
}

