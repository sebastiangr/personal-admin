export type ContactStatus = 'BACKLOG' | 'TO_CONTACT' | 'WAITING' | 'IN_PROGRESS' | 'ARCHIVED' | 'HIRED';

export const statusMap: Record<ContactStatus, { text: string; colorClass: string }> = {
  BACKLOG:     { text: 'En Radar',      colorClass: 'badge-neutral' },
  TO_CONTACT:  { text: 'Por Contactar', colorClass: 'badge-info' },
  WAITING:     { text: 'En Espera',     colorClass: 'badge-warning' },
  IN_PROGRESS: { text: 'En Proceso',    colorClass: 'badge-primary' },
  ARCHIVED:    { text: 'Archivado',     colorClass: 'badge-error' },
  HIRED:       { text: '¡Contratado!',   colorClass: 'badge-success' },
};

export const selectableStatuses: ContactStatus[] = [
  'BACKLOG',
  'TO_CONTACT',
  'WAITING',
  'IN_PROGRESS',
  'ARCHIVED',
];

export const statusOptions = (Object.keys(statusMap) as ContactStatus[]).map((value: ContactStatus) => ({
  value,
  label: statusMap[value].text,
}));