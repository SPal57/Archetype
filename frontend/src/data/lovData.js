/**
 * Master Lists of Values (LOVs) for J&J Archetype Provisioning Hub
 * 
 * Central registry for all dropdown options across the application.
 * - Owner Roles are synced from SharePoint: MEDTECHArchetypes-ILA / Lists / Business_owner_role_LOV
 * - Additional field LOVs (Franchise, Status, Wave, Patterns, Nodes, IncoTerms) are consolidated here.
 */

// 1. Business Owner Roles (Synced from SharePoint Business_owner_role_LOV list)
export const OWNER_ROLE_OPTIONS = [
  'ExtOps Supplier Planner',
  'Global PLAN Lanes Optimization',
  'Global PLAN Projects AR',
  'Global PLAN Projects NPI',
  'Global PLAN SNP DRP',
  'Global PLAN SNP E2E Planner',
  'Global PLAN SNP Regional Ambassador',
  'Global PLAN SNP RM',
  'Global PLAN SNP Site Ambassador',
  'Operate State Team',
  'Site PP&L',
  'Regional Supply Planning',
  'Local Supply Planning'
];

// 2. Franchises (Synced from SharePoint Franchise_LOV list)
export const FRANCHISE_OPTIONS = [
  'Cilag',
  'CSS',
  'DePuy',
  'ETH Bio',
  'ETH Endo',
  'ETH WCH',
  'MedTech',
  'Megadyne',
  'Mentor',
  'Mitek',
  'Neuwave',
  'One Ethicon',
  'Ottava',
  'Torax',
  'MedTech EMEA',
  'MedTech LATAM',
  'MedTech US',
  'MedTech ASPAC',
  'MedTech Canada',
  'Abiomed',
  'EP Neuro'
];

// 3. Lane Statuses
export const STATUS_OPTIONS = [
  'Draft',
  'New',
  'In Review',
  'Approved'
];

// 4. Waves (Synced from SharePoint Waves_LOV list)
export const WAVE_OPTIONS = [
  'Operate state',
  'TEST',
  'W1 > W3',
  'W2.1',
  'W2 > W3',
  'W3',
  'W3 > Norderstedt',
  'W4',
  'W4R1-IS',
  'Norderstedt',
  'W2.1 > W3',
  'W3 > W4',
  'W4 > Norderstedt',
  'W0a',
  'W0b',
  'REDIRECT',
  'Veraseal FR',
  'W1MBP',
  'W1.1'
];

// 5. Pattern IDs (Lane / Counter Patterns)
export const PATTERN_ID_OPTIONS = [
  'P-V-P',
  'P-FP',
  'P-P',
  'P-V-V-P'
];

// 6. Search Status Options (Includes intermediate workflow states)
export const SEARCH_STATUS_OPTIONS = [
  'All Statuses',
  'Approved',
  'Approval in Progress',
  'Ready for Approval',
  'New',
  'Draft',
  'Reopened'
];

// 7. PFC Status Options (Advanced Search)
export const PFC_STATUS_OPTIONS = [
  'Any',
  'Approved',
  'New',
  'Draft',
  'In Progress'
];

// 8. Node Types
export const NODE_TYPE_OPTIONS = [
  { code: 'P', label: 'P (Plant / Hub)', color: 'purple' },
  { code: 'V', label: 'V (Vendor)', color: 'orange' }
];

// 9. Node Purposes
export const NODE_PURPOSE_OPTIONS = [
  { code: 'M', label: 'M (Manufacturing)', color: 'green' },
  { code: 'DC', label: 'DC (Distribution Center)', color: 'amber' }
];

// 10. IncoTerms (International Commercial Terms)
export const INCO_TERM_OPTIONS = [
  'EXW',
  'CIF',
  'DAP',
  'FOB',
  'DDP',
  'FCA',
  'CIP',
  'CPT',
  'CFR'
];

// 11. Default Active Users
export const USER_OPTIONS = [
  'Andres Simar',
  'Lisa Chen',
  'Anna Mueller',
  'Guest (not approver)'
];

export default {
  OWNER_ROLE_OPTIONS,
  FRANCHISE_OPTIONS,
  STATUS_OPTIONS,
  WAVE_OPTIONS,
  PATTERN_ID_OPTIONS,
  SEARCH_STATUS_OPTIONS,
  PFC_STATUS_OPTIONS,
  NODE_TYPE_OPTIONS,
  NODE_PURPOSE_OPTIONS,
  INCO_TERM_OPTIONS,
  USER_OPTIONS
};

