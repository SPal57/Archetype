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
  '00-Active no ILA',
  '00-New',
  '00-T1 Backlog',
  '01-NPI',
  '02-Data Construction',
  '02-ILA creation TEST',
  '03-Implementing ILA',
  '03-TranSCend Project',
  '04-On hold',
  '05-Closed',
  '05-Phasing Out',
  '06-Canceled',
  '07-LIVE',
  'TT-Temp Active',
  'ZZ-Technical status'
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

// 6. Search Status Options (Shows only Status LOVs, no Visio Status)
export const SEARCH_STATUS_OPTIONS = [
  'All Statuses',
  ...STATUS_OPTIONS
];

// 7. PFC Status Options (PFC Status = Status in lane header, extra LOVs removed)
export const PFC_STATUS_OPTIONS = [
  'Any',
  ...STATUS_OPTIONS
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

// 12. Plan GRP Options
export const PLAN_GRP_OPTIONS = [
  'PG-Global',
  'PG-Regional',
  'PG-Plant',
  'PG-Commercial'
];

// 13. Plan Team Options
export const PLAN_TEAM_OPTIONS = [
  'Global Supply Planning',
  'Regional Supply Planning',
  'Site Planning',
  'Value Stream Planning'
];

// 14. Project Options (TranSCend_PRJ / Project in UI)
export const PROJECT_OPTIONS = [
  'ASPAC OTC',
  'DPS MAKE',
  'CSS MAKE',
  'GATT',
  'GET',
  'Kaleidoscope',
  'LATAM OTC',
  'LEGO',
  'EMEA OTC',
  'NA OTC',
  'NPI/LCM',
  'Operate State',
  'Vision',
  'Sirenia',
  'Tundra',
  'Ethicon MAKE',
  'Japan MBP',
  'TTR',
  'SORA',
  'ACE',
  'T1 Retrofit',
  'Epsilon',
  'Marg-Accel',
  'Osprey'
];

// 15. APS Relevant Options (OMP_relevant)
export const APS_RELEVANT_OPTIONS = [
  'Yes',
  'No'
];

// 16. Returns Options
export const RETURNS_OPTIONS = [
  'Yes',
  'No',
  'N/A',
  'Direct Return',
  'Hub Return'
];

// 17. Physical Flow Options
export const PHYSICAL_FLOW_OPTIONS = [
  'Direct Ship',
  'Cross-Dock',
  'Hub & Spoke',
  'Plant to DC',
  'Vendor to Plant'
];

// 18. Financial Flow Options
export const FINANCIAL_FLOW_OPTIONS = [
  'Standard Intercompany',
  'Drop-Ship Financial',
  'Consignment',
  'Third-Party Buy-Sell'
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
  USER_OPTIONS,
  PLAN_GRP_OPTIONS,
  PLAN_TEAM_OPTIONS,
  PROJECT_OPTIONS,
  APS_RELEVANT_OPTIONS,
  RETURNS_OPTIONS,
  PHYSICAL_FLOW_OPTIONS,
  FINANCIAL_FLOW_OPTIONS
};

