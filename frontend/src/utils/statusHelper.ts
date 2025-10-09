
// El tipo para nuestros estados de la DB, para tener autocompletado y seguridad de tipos.
export type ContactStatus = 'BACKLOG' | 'TO_CONTACT' | 'CONTACTED' | 'WAITING_RESPONSE' | 'IN_CONVERSATION' | 'REJECTED' | 'HIRED';

// El diccionario que mapea el estado de la DB a la UI
export const statusMap: Record<ContactStatus, { text: string; colorClass: string }> = {
  BACKLOG:          { text: 'Pendiente',      colorClass: 'badge-neutral' },
  TO_CONTACT:       { text: 'Por Contactar',  colorClass: 'badge-ghost' },
  CONTACTED:        { text: 'Contactado',     colorClass: 'badge-info' }, // "Contactado" es más conciso
  WAITING_RESPONSE: { text: 'En Espera',      colorClass: 'badge-warning' },
  IN_CONVERSATION:  { text: 'En Conversación',colorClass: 'badge-primary' },
  REJECTED:         { text: 'Archivado',      colorClass: 'badge-error' }, // "Archivado" es menos negativo y profesional
  HIRED:            { text: '¡Contratado!',   colorClass: 'badge-success' },
};

// Una lista de los estados que el usuario puede seleccionar.
// Podemos excluir algunos si no queremos que se seleccionen manualmente.
export const selectableStatuses: ContactStatus[] = [
  'BACKLOG',
  'TO_CONTACT',
  'CONTACTED',
  'WAITING_RESPONSE',
  'IN_CONVERSATION',
  'REJECTED',
];