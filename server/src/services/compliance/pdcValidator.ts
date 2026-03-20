/**
 * NOVA_OS: PDC GATE VALIDATOR v1.0
 * Mandatory 42-day validation logic for March 2026 Identità standards.
 */

export const PDC_CONFIG = {
  VALIDITY_DAYS: 42,
  MANDATORY_AS_OF: '2026-03-01',
};

export class PDCValidator {
  static checkCompliance(certificateDate: string): { status: 'VALID' | 'EXPIRED' | 'CRITICAL', daysLeft: number } {
    const issueDate = new Date(certificateDate);
    const today = new Date();
    
    // Calculate difference in days
    const diffTime = Math.abs(today.getTime() - issueDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const daysLeft = PDC_CONFIG.VALIDITY_DAYS - diffDays;

    if (daysLeft <= 0) return { status: 'EXPIRED', daysLeft: 0 };
    if (daysLeft <= 7) return { status: 'CRITICAL', daysLeft };
    return { status: 'VALID', daysLeft };
  }
}
