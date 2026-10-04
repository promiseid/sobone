import React, { useState } from 'react';
import { Member, ExpenseItem, EventConfig, ExpenseCategory } from '../types';
import { CalculatedDong, formatToman, toPersianDigits } from '../utils/dongCalculator';
import {
  CreditCard,
  Plus,
  Receipt,
  Check,
  Copy,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  Trash2,
  ExternalLink,
  Info
} from 'lucide-react';

interface DongManagerSectionProps {
  members: Member[];
  expenses: ExpenseItem[];
  eventConfig: EventConfig;
  calculatedDong: CalculatedDong;
  onAddExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  onRemoveExpense: (expenseId: string) => void;
  onToggleMemberPaid: (memberId: string) => void;
  onUpdateMotherAccount: (account: EventConfig['motherAccount']) => void;
  onContinue: () => void;
}

export const DongManagerSection: React.FC<DongManagerSectionProps> = ({
  members,
  expenses,
  eventConfig,
  calculatedDong,
  onAddExpense,
  onRemoveExpense,
  onToggleMemberPaid,
  onUpdateMotherAccount,
  onContinue
}) => {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<ExpenseItem | null>(null);

  // New expense form state
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newPaidBy, setNewPaidBy] = useState(members[0]?.name || 'سارا رضایی');
  const [newCategory, setNewCategory] = useState<ExpenseCategory>('main');
  const [newAppliesTo, setNewAppliesTo] = useState<'all' | 'full_only'>('all');
  const [newReceiptNote, setNewReceiptNote] = useState('');

  // Account edit state
  const [holderName, setHolderName] = useState(eventConfig.motherAccount.holderName);
  const [bankName, setBankName] = useState(eventConfig.motherAccount.bankName);
  const [cardNumber, setCardNumber] = useState(eventConfig.motherAccount.cardNumber);
  const [iban, setIban] = useState(eventConfig.motherAccount.iban);

  const [copiedCard, setCopiedCard] = useState(false);
  const [copiedIban, setCopiedIban] = useState(false);

  const handleCopyCard = () => {
    navigator.clipboard.writeText(eventConfig.motherAccount.cardNumber.replace(/-/g, ''));
    setCopiedCard(true);
    setTimeout(() => setCopiedCard(false), 2000);
  };

  const handleCopyIban = () => {
    navigator.clipboard.writeText(eventConfig.motherAccount.iban);
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2000);
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateMotherAccount({
      holderName,
      bankName,
      cardNumber,
      iban
    });
    setShowAccountModal(false);
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseInt(newAmount.replace(/,/g, ''), 10);
    if (!newTitle.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    onAddExpense({
      title: newTitle.trim(),
      amount: parsedAmount,
      paidBy: newPaidBy,
      category: newCategory,
      appliesTo: newAppliesTo,
      date: 'امروز ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      receiptNote: newReceiptNote.trim() || 'فاکتور تسویه‌شده خرید',
      hasReceipt: true
    });

    setNewTitle('');
    setNewAmount('');
    setNewReceiptNote('');
    setShowAddExpense(false);
  };

  const getCategoryLabel = (category: ExpenseCategory) => {
    switch (category) {
      case 'main': return 'املت و تخم‌مرغ';
      case 'bread': return 'نان بربری تازه';
      case 'dairy': return 'پنیر، گردو و لبنیات';
      case 'spices': return 'ادویه، چای و روغن';
      case 'disposables': return 'سفره و بهداشتی';
      case 'beverages': return 'نوشیدنی';
      default: return 'سایر';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-neutral-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 mb-1">
          <span>مرحله سوم نقشه راه</span>
          <span>·</span>
          <span>مدیریت دنگ با دقت ۱۰۰ درصد و مادرخرج</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
              محاسبه دنگ، فاکتورهای خرید و تسویه‌حساب
            </h2>
            <p className="mt-1 text-sm text-neutral-600 max-w-3xl leading-relaxed">
              تفکیک هوشمند هزینه‌ها تا تک‌تومان: افراد سبک‌خور فقط در نان و پنیر شریک هستند، و سهم املت و مواد گرم منحصراً بین حاضران پایه تقسیم می‌شود.
            </p>
          </div>
          <button
            onClick={() => setShowAddExpense(!showAddExpense)}
            className="flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>ثبت فاکتور خرید جدید</span>
          </button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cost */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <div className="text-xs text-neutral-500 mb-1">کل هزینه‌های فاکتورها</div>
          <div className="text-xl font-bold text-neutral-900 tabular-nums">
            {formatToman(calculatedDong.totalCost)}
          </div>
          <div className="mt-2 text-xs text-neutral-500">
            {toPersianDigits(expenses.length)} قلم فاکتور ثبت‌شده
          </div>
        </div>

        {/* Dong for Full attendee */}
        <div className="bg-white rounded-xl border border-amber-300 bg-amber-50/30 p-4">
          <div className="text-xs font-semibold text-amber-900 mb-1">سهم دنگ شرکت‌کننده کامل (پایه)</div>
          <div className="text-xl font-bold text-amber-950 tabular-nums">
            {formatToman(calculatedDong.dongFullPerson)}
          </div>
          <div className="mt-2 text-xs text-amber-800">
            املت داغ + نان تازه + پنیر و گردو + چای
          </div>
        </div>

        {/* Dong for Light attendee */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <div className="text-xs text-neutral-500 mb-1">سهم دنگ سبک‌خور (نان و پنیر)</div>
          <div className="text-xl font-bold text-neutral-800 tabular-nums">
            {formatToman(calculatedDong.dongLightPerson)}
          </div>
          <div className="mt-2 text-xs text-emerald-700 font-medium">
            دنگ کمتر (بدون هزینه املت)
          </div>
        </div>

        {/* Settlement status */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
            <span>وضعیت تسویه واریزی‌ها</span>
            <span className="font-bold tabular-nums text-neutral-800">
              {toPersianDigits(calculatedDong.settlementPercentage)}%
            </span>
          </div>
          <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden mt-2 mb-2">
            <div
              className="h-full bg-emerald-600 transition-all duration-300"
              style={{ width: `${calculatedDong.settlementPercentage}%` }}
            />
          </div>
          <div className="text-xs text-neutral-500">
            {calculatedDong.pendingDongsCount === 0 ? (
              <span className="text-emerald-700 font-medium">همه اعضا تسویه کردند!</span>
            ) : (
              <span>{toPersianDigits(calculatedDong.pendingDongsCount)} نفر در انتظار واریز</span>
            )}
          </div>
        </div>
      </div>

      {/* Mother Account Card (Directly solves "نصب اپلیکیشن‌های دنگچی و جلوگیری از معذب شدن") */}
      <div className="bg-neutral-900 text-white rounded-xl p-6 relative overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
              <CreditCard className="w-4 h-4" />
              <span>کارت رسمی مادرخرج دورهمی</span>
              <span>·</span>
              <span>واریز مستقیم دنگ</span>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-neutral-400">شماره کارت جهت واریز دنگ همکاران:</div>
              <div className="text-2xl sm:text-3xl font-mono font-bold tracking-widest tabular-nums text-amber-100">
                {eventConfig.motherAccount.cardNumber}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-300">
              <div>
                نام صاحب حساب: <strong className="text-white">{eventConfig.motherAccount.holderName}</strong>
              </div>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <div>
                بانک مقصد: <strong className="text-white">{eventConfig.motherAccount.bankName}</strong>
              </div>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <div className="font-mono tabular-nums text-neutral-400">
                شبا: {eventConfig.motherAccount.iban}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full md:w-auto">
            <button
              onClick={handleCopyCard}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              {copiedCard ? (
                <>
                  <Check className="w-4 h-4 text-emerald-950" />
                  <span>شماره کارت کپی شد!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>کپی شماره کارت</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyIban}
              className="flex items-center justify-center gap-2 px-3 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-lg transition-colors cursor-pointer border border-neutral-700"
            >
              {copiedIban ? 'شبا کپی شد!' : 'کپی شبا'}
            </button>

            <button
              onClick={() => setShowAccountModal(true)}
              className="px-3 py-2.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              ویرایش حساب
            </button>
          </div>
        </div>

        {/* Golden Payment Deadline Reminder */}
        <div className="mt-4 pt-4 border-t border-neutral-800 flex items-center gap-2 text-xs text-amber-300/90">
          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>زمان طلایی پرداخت (قانون دنگ):</strong> تمام دنگ‌ها باید حداکثر <strong>{eventConfig.paymentDeadlineHours}</strong> واریز شوند تا مادرخرج معذب نشود.
          </span>
        </div>
      </div>

      {/* Add Expense Form Modal / Inline */}
      {showAddExpense && (
        <form onSubmit={handleExpenseSubmit} className="bg-amber-50/50 rounded-xl border border-amber-200 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
            <h4 className="text-sm font-bold text-neutral-900">
              ثبت فاکتور جدید و محاسبه خودکار سهم
            </h4>
            <span className="text-xs text-neutral-500">
              عکس یا یادداشت رسید را وارد کنید تا شفافیت کامل باشد
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">عنوان خرید / فاکتور:</label>
              <input
                type="text"
                required
                placeholder="مثال: خرید گوجه، تخم‌مرغ و کره"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">مبلغ به تومان:</label>
              <input
                type="text"
                required
                placeholder="مثال: 150000"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-900 tabular-nums"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">پرداخت‌کننده (کی خرید کرده؟):</label>
              <select
                value={newPaidBy}
                onChange={(e) => setNewPaidBy(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name} ({m.department})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">دسته‌بندی اقلام:</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              >
                <option value="main">املت و تخم‌مرغ</option>
                <option value="bread">نان تازه بربری / سنگک</option>
                <option value="dairy">پنیر، گردو و مخلفات</option>
                <option value="spices">ادویه، روغن و چای</option>
                <option value="disposables">سفره و ملزومات بهداشتی</option>
                <option value="beverages">نوشیدنی</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">این هزینه شامل چه کسانی است؟</label>
              <select
                value={newAppliesTo}
                onChange={(e) => setNewAppliesTo(e.target.value as 'all' | 'full_only')}
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              >
                <option value="all">همه حاضرین (شامل نان و پنیر خورها)</option>
                <option value="full_only">فقط املت‌خوران پایه (مخصوص تخم‌مرغ/گوجه)</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">توضیح فاکتور یا رسید:</label>
              <input
                type="text"
                placeholder="مثال: فاکتور سوپرمارکت بهار - با تخفیف"
                value={newReceiptNote}
                onChange={(e) => setNewReceiptNote(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddExpense(false)}
              className="px-3 py-1.5 bg-neutral-200 text-neutral-700 rounded-lg text-xs font-medium cursor-pointer"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
            >
              ثبت فاکتور در جدول دنگ
            </button>
          </div>
        </form>
      )}

      {/* Two columns: Expenses List & Member Settlement Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Expenses List */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="p-4 border-b border-neutral-200 bg-neutral-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-amber-700" />
              <h3 className="text-sm font-bold text-neutral-900">
                فاکتورها و رسیدهای خرید
              </h3>
            </div>
            <span className="text-xs text-neutral-500">
              کل: <strong className="text-neutral-800 tabular-nums">{formatToman(calculatedDong.totalCost)}</strong>
            </span>
          </div>

          <div className="divide-y divide-neutral-100 max-h-96 overflow-y-auto">
            {expenses.map((exp) => (
              <div key={exp.id} className="p-4 hover:bg-neutral-50/60 transition-colors flex items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="font-semibold text-neutral-900 flex items-center gap-2">
                    <span>{exp.title}</span>
                    <span className="text-neutral-400 font-normal">·</span>
                    <span className="text-neutral-500 font-normal">{getCategoryLabel(exp.category)}</span>
                  </div>
                  <div className="text-neutral-500 flex items-center gap-2 text-2xs">
                    <span>خریدار: <strong className="text-neutral-700">{exp.paidBy}</strong></span>
                    <span>·</span>
                    <span>{exp.date}</span>
                    <span>·</span>
                    <span className={exp.appliesTo === 'full_only' ? 'text-amber-800' : 'text-neutral-600'}>
                      {exp.appliesTo === 'full_only' ? 'فقط املت‌خوران' : 'مشترک بین همه'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-left font-bold text-neutral-900 tabular-nums">
                    {formatToman(exp.amount)}
                  </div>
                  <button
                    onClick={() => setSelectedReceipt(exp)}
                    className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
                    title="مشاهده جزئیات فاکتور"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRemoveExpense(exp.id)}
                    className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                    title="حذف فاکتور"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Colleague Settlement Ledger */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="p-4 border-b border-neutral-200 bg-neutral-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-neutral-900">
                دفتر کل تسویه‌حساب همکاران
              </h3>
            </div>
            <span className="text-xs text-neutral-500">
              کلیک برای تغییر وضعیت پرداخت
            </span>
          </div>

          <div className="divide-y divide-neutral-100 max-h-96 overflow-y-auto">
            {calculatedDong.memberBalances.map(({ member, calculatedDong: owed, totalPaidForExpenses, netBalance, isSettled }) => {
              if (member.attendance === 'absent') return null;

              return (
                <div
                  key={member.id}
                  className="p-4 hover:bg-neutral-50/60 transition-colors flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-900">{member.name}</span>
                      <span className="text-neutral-400">·</span>
                      <span className="text-neutral-500 text-2xs">{member.department}</span>
                      <span className="text-neutral-400">·</span>
                      <span className="text-2xs text-amber-800">
                        {member.attendance === 'full' ? 'پایه (املت)' : 'چای و پنیر'}
                      </span>
                    </div>

                    <div className="text-2xs text-neutral-500 flex items-center gap-2">
                      <span>دنگ سهم: <strong className="text-neutral-800 tabular-nums">{formatToman(owed)}</strong></span>
                      {totalPaidForExpenses > 0 && (
                        <>
                          <span>·</span>
                          <span className="text-emerald-700">پرداخت خرید: {formatToman(totalPaidForExpenses)}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Net balance calculation */}
                    <div className="text-left">
                      {netBalance > 0 ? (
                        <div className="text-emerald-700 font-bold tabular-nums flex items-center gap-1">
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                          <span>{formatToman(netBalance)} طلبکار</span>
                        </div>
                      ) : netBalance < 0 ? (
                        <div className="text-neutral-900 font-bold tabular-nums flex items-center gap-1">
                          <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{formatToman(Math.abs(netBalance))} بدهکار</span>
                        </div>
                      ) : (
                        <div className="text-neutral-400">تسویه سر‌به‌سر</div>
                      )}
                    </div>

                    {/* Paid status button */}
                    <button
                      type="button"
                      onClick={() => onToggleMemberPaid(member.id)}
                      className={`px-3 py-1 rounded-md text-2xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                        isSettled
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      }`}
                    >
                      {isSettled ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-700" />
                          <span>واریز شد</span>
                        </>
                      ) : (
                        <span>در انتظار واریز</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Receipt Modal (Transparency requirement from prompt) */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2 text-neutral-900 font-bold text-sm">
                <Receipt className="w-4 h-4 text-amber-600" />
                <span>رسید و فاکتور شفاف خرید</span>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer text-xs"
              >
                بستن ✕
              </button>
            </div>

            <div className="p-4 bg-neutral-50 rounded-lg space-y-3 text-xs text-neutral-700">
              <div className="flex justify-between">
                <span className="text-neutral-500">عنوان فاکتور:</span>
                <strong className="text-neutral-900">{selectedReceipt.title}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">مبلغ پرداخت شده:</span>
                <strong className="text-neutral-900 tabular-nums text-sm font-bold text-emerald-800">
                  {formatToman(selectedReceipt.amount)}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">پرداخت‌کننده اولیه:</span>
                <span>{selectedReceipt.paidBy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">زمان خرید:</span>
                <span>{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">نوع تسهیم:</span>
                <span>{selectedReceipt.appliesTo === 'all' ? 'تقسیم بین تمام افراد' : 'فقط املت‌خوران'}</span>
              </div>
              <div className="pt-2 border-t border-neutral-200">
                <span className="text-neutral-500 block mb-1">یادداشت فاکتور:</span>
                <p className="italic text-neutral-600 bg-white p-2 rounded border border-neutral-200">
                  «{selectedReceipt.receiptNote}»
                </p>
              </div>
            </div>

            <p className="text-2xs text-neutral-500 leading-relaxed">
              💡 طبق قانون شماره ۳، ارسال و مشاهده فاکتورها شفافیت ۱۰۰ درصدی ایجاد کرده و هرگونه معذب شدن در جمع را رفع می‌کند.
            </p>

            <button
              onClick={() => setSelectedReceipt(null)}
              className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              متوجه شدم
            </button>
          </div>
        </div>
      )}

      {/* Edit Account Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveAccount} className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-neutral-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-sm text-neutral-900">
                ویرایش حساب بانکی مادرخرج
              </h3>
              <button
                type="button"
                onClick={() => setShowAccountModal(false)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">نام صاحب حساب:</label>
              <input
                type="text"
                required
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">نام بانک:</label>
              <input
                type="text"
                required
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">شماره کارت (۱۶ رقمی):</label>
              <input
                type="text"
                required
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="5022-2910-1234-5678"
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg font-mono focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">شماره شبا (با IR):</label>
              <input
                type="text"
                required
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                placeholder="IR8205700..."
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg font-mono focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAccountModal(false)}
                className="px-3 py-1.5 bg-neutral-100 text-neutral-700 rounded-lg font-medium cursor-pointer"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-semibold cursor-pointer"
              >
                ذخیره اطلاعات حساب
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
