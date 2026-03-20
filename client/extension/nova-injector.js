/**
 * NOVA GHOST-PILOT INJECTOR
 * Native DOM Orchestration for 2026 Identità Portal
 */

const IDENTITA_SELECTOR_MAP_LOCAL = {
  mapping: {
    givenName: { selector: "input[name*='FirstName']", event: 'input' },
    familyName: { selector: "input[name*='LastName']", event: 'input' },
    dateOfBirth: { selector: "input[type='date'][name*='DOB']", event: 'change' },
    pdcCertificateId: { selector: "input[id*='PDC_Ref']", event: 'input' },
    housingLeaseId: { selector: "input[name*='Housing_ID']", event: 'input' },
    uploadPdcButton: { selector: "button.upload-trigger-pdc", event: 'click' },
    submitFormButton: { selector: "#btnSubmitApplication", event: 'click' }
  }
};

const injectAuraManifest = (manifest) => {
  const map = IDENTITA_SELECTOR_MAP_LOCAL.mapping;

  Object.keys(manifest).forEach(key => {
    const fieldMapping = map[key];
    if (fieldMapping) {
      const element = document.querySelector(fieldMapping.selector);
      
      if (element) {
        // Step 1: Set Value
        element.value = manifest[key];
        
        // Step 2: Trigger Native Events (Crucial for React/Angular/Vue portals)
        const event = new Event(fieldMapping.event, { bubbles: true });
        element.dispatchEvent(event);
        
        // Step 3: Visual Feedback (Aura Cyber-Teal highlight)
        element.style.boxShadow = "0 0 10px #00F0FF";
        element.style.transition = "box-shadow 0.3s ease";
      }
    }
  });
};

// Listen for the "Nova Manifest" message from the background script
window.addEventListener("message", (event) => {
  if (event.data.type === "NOVA_TRIGGER_SYNC") {
    injectAuraManifest(event.data.payload);
  }
});
