import { Member, ExpenseItem } from '../types';

export interface CalculatedDong {
  totalCost: number;
  sharedExpensesTotal: number;
  fullOnlyExpensesTotal: number;
  fullAttendeesCount: number;
  lightAttendeesCount: number;
  totalActiveAttendees: number;
  dongFullPerson: number;
  dongLightPerson: number;
  memberBalances: {
    member: Member;
    calculatedDong: number;
    totalPaidForExpenses: number;
    netBalance: number; // positive: should receive, negative: should pay
    isSettled: boolean;
  }[];
  totalPaidDongs: number;
  pendingDongsCount: number;
  settlementPercentage: number;
}

export function formatToman(amount: number): string {
  if (isNaN(amount) || !amount) return '۰ تومان';
  return Math.round(amount).toLocaleString('fa-IR') + ' تومان';
}

export function toPersianDigits(n: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(n).replace(/[0-9]/g, (w) => persianDigits[+w]);
}

export function calculateDong(members: Member[], expenses: ExpenseItem[]): CalculatedDong {
  const fullMembers = members.filter((m) => m.attendance === 'full');
  const lightMembers = members.filter((m) => m.attendance === 'light');
  
  const fullCount = fullMembers.length;
  const lightCount = lightMembers.length;
  const totalActive = fullCount + lightCount;

  const totalCost = expenses.reduce((sum, item) => sum + item.amount, 0);

  const sharedExpenses = expenses
    .filter((e) => e.appliesTo === 'all')
    .reduce((sum, item) => sum + item.amount, 0);

  const fullOnlyExpenses = expenses
    .filter((e) => e.appliesTo === 'full_only')
    .reduce((sum, item) => sum + item.amount, 0);

  // Per person calculations
  const sharedPerPerson = totalActive > 0 ? sharedExpenses / totalActive : 0;
  const fullOnlyPerPerson = fullCount > 0 ? fullOnlyExpenses / fullCount : 0;

  const dongFull = Math.round(sharedPerPerson + fullOnlyPerPerson);
  const dongLight = Math.round(sharedPerPerson);

  // Calculate each member's owed dong and what they personally paid in expenses
  const memberBalances = members.map((member) => {
    let owed = 0;
    if (member.attendance === 'full') {
      owed = dongFull;
    } else if (member.attendance === 'light') {
      owed = dongLight;
    } else {
      owed = 0; // absent
    }

    // How much did this member pay out-of-pocket for expenses?
    const paidInExpenses = expenses
      .filter((e) => e.paidBy.trim().toLowerCase() === member.name.trim().toLowerCase())
      .reduce((sum, e) => sum + e.amount, 0);

    const netBalance = paidInExpenses - owed;

    return {
      member,
      calculatedDong: owed,
      totalPaidForExpenses: paidInExpenses,
      netBalance,
      isSettled: member.paid || member.attendance === 'absent' || netBalance >= 0
    };
  });

  const activeMembers = memberBalances.filter((m) => m.member.attendance !== 'absent');
  const paidCount = activeMembers.filter((m) => m.isSettled).length;
  const pendingCount = activeMembers.filter((m) => !m.isSettled).length;
  const settlementPercentage = activeMembers.length > 0 ? Math.round((paidCount / activeMembers.length) * 100) : 100;
  const totalPaidDongs = activeMembers
    .filter((m) => m.isSettled)
    .reduce((sum, m) => sum + m.calculatedDong, 0);

  return {
    totalCost,
    sharedExpensesTotal: sharedExpenses,
    fullOnlyExpensesTotal: fullOnlyExpenses,
    fullAttendeesCount: fullCount,
    lightAttendeesCount: lightCount,
    totalActiveAttendees: totalActive,
    dongFullPerson: dongFull,
    dongLightPerson: dongLight,
    memberBalances,
    totalPaidDongs,
    pendingDongsCount: pendingCount,
    settlementPercentage
  };
}
