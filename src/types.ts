export type AttendanceStatus = 'full' | 'light' | 'absent';

export type TeamRole = 'chef' | 'bread' | 'groceries' | 'cleaning' | 'tea' | 'none';

export interface DietaryInfo {
  hasEggAllergy: boolean;
  hasLactoseIntolerance: boolean;
  isVegetarian: boolean;
  hasGlutenSensitivity: boolean;
  customNote?: string;
}

export interface Member {
  id: string;
  name: string;
  department: string;
  attendance: AttendanceStatus; // 'full' = پایه هستم (کامل), 'light' = فقط چای و نان پنیر, 'absent' = این بار نیستم
  dietary: DietaryInfo;
  role: TeamRole;
  paid: boolean;
  paidAmount?: number;
}

export type ExpenseCategory = 'main' | 'bread' | 'dairy' | 'spices' | 'disposables' | 'beverages';

export interface ExpenseItem {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number; // in Tomans
  paidBy: string; // name or id
  date: string;
  appliesTo: 'all' | 'full_only'; // whether light breakfast eaters share this expense
  receiptNote?: string;
  hasReceipt: boolean;
}

export interface VenueOption {
  id: string;
  title: string;
  subtitle: string;
  vibe: string;
  capacity: string;
  pros: string[];
  cons: string[];
  setupTips: string;
  recommendedFor: string;
}

export interface SpiceItem {
  id: string;
  name: string;
  inOffice: boolean; // آیا در شرکت موجود است یا باید خریده شود
  statusNote: string;
}

export interface SupplyItem {
  id: string;
  name: string;
  category: string;
  checked: boolean;
  assignedTo?: string;
}

export interface EventConfig {
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  selectedVenueId: string;
  paymentDeadlineHours: string;
  cancellationHoursLimit: number;
  motherAccount: {
    holderName: string;
    bankName: string;
    cardNumber: string;
    iban: string;
  };
}
