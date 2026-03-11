// Temporary public-site toggle. See ../../SITE_ACCESS_GATE.md for the
// exact frontend + API steps required to restore the welcome access-code gate.
export const SITE_ACCESS_GATE_DISABLED = import.meta.env.VITE_SITE_GATE_BYPASS === 'true'
