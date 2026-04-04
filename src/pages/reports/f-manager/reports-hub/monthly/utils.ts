export type KassaDisplayStatus =
  | 'open'
  | 'warning'
  | 'closed'
  | 'm_manager_confirmed'
  | 'accountant_confirmed'
  | 'manager_rejected'
  | 'accountant_rejected'
  | 'accepted';

export function getKassaDisplayStatus(kassa: any): KassaDisplayStatus {
  if (kassa?.status === 'accepted') return 'accepted';
  if (kassa?.isManagerRejected) return 'manager_rejected';
  if (kassa?.isAccountantRejected) return 'accountant_rejected';
  if (kassa?.status === 'closed') {
    if (kassa?.isMManagerConfirmed && !kassa?.isAccountantConfirmed) return 'm_manager_confirmed';
    if (kassa?.isAccountantConfirmed && !kassa?.isMManagerConfirmed) return 'accountant_confirmed';
    return 'closed';
  }
  if (kassa?.status === 'warning') return 'warning';
  return 'open';
}

export function isKassaEditable(kassa: any): boolean {
  return ['open', 'warning'].includes(kassa?.status);
}

export const kassaStatusConfig: Record<string, { label: string; className: string }> = {
  open: { label: 'Ochiq', className: 'bg-green-100 text-green-700 border-green-300' },
  warning: { label: 'Kutilmoqda', className: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  closed: { label: 'Yopilgan', className: 'bg-blue-100 text-blue-700 border-blue-300' },
  m_manager_confirmed: { label: 'Manager ✓', className: 'bg-teal-100 text-teal-700 border-teal-300' },
  accountant_confirmed: { label: 'Buxgalter ✓', className: 'bg-teal-100 text-teal-700 border-teal-300' },
  manager_rejected: { label: 'Manager qaytardi', className: 'bg-red-100 text-red-700 border-red-300' },
  accountant_rejected: { label: 'Buxgalter qaytardi', className: 'bg-red-100 text-red-700 border-red-300' },
  accepted: { label: 'Tasdiqlangan', className: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
};
