/**
 * PROJECT AURA: SOVEREIGN SELECTOR MAP
 * Version: 2026.03.11-ALPHA
 * Target: https://singlepermit.identita.gov.mt/
 */

export const IDENTITA_SELECTOR_MAP = {
  metadata: {
    lastUpdated: '2026-03-11T22:00:00Z',
    portalUrl: 'https://eforms.identita.gov.mt/',
  },
  mapping: {
    // Personal Details
    givenName: { selector: "input[name*='FirstName']", event: 'input' },
    familyName: { selector: "input[name*='LastName']", event: 'input' },
    dateOfBirth: { selector: "input[type='date'][name*='DOB']", event: 'change' },
    
    // 2026 Specific Gates
    pdcCertificateId: { selector: "#input-pdc-verification-code", event: 'input' },
    housingLeaseId: { selector: "input[name*='Housing_ID']", event: 'input' },
    employerLicense: { selector: "#twa-license-number-auth", event: 'input' },
    eidHandshake: { selector: ".eid-login-button-primary", event: 'click' },
    
    // Action Buttons
    uploadPdcButton: { selector: "button.upload-trigger-pdc", event: 'click' },
    submitFormButton: { selector: "#btnSubmitApplication", event: 'click' }
  }
};
