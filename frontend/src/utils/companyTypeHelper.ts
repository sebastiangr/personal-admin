import { CompanyType } from '@/types';

export const companyTypeMap: Record<CompanyType, string> = {
  [CompanyType.AGENCY_STUDIO]: 'Agencia / Studio',
  [CompanyType.TECH_STARTUP]: 'Startup Tecnológica',
  [CompanyType.SOFTWARE_COMPANY]: 'Empresa de Software',
  [CompanyType.INDUSTRY]: 'Industria / Corporativo',
  [CompanyType.ECOMMERCE]: 'E-commerce',
  [CompanyType.FREELANCE_COLLECTIVE]: 'Colectivo Freelance',
};

export const companyTypeOptions = Object.entries(companyTypeMap).map(([value, label]) => ({
  value: value as CompanyType,
  label,
}));