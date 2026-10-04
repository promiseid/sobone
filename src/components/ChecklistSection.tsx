import React, { useState } from 'react';
import { SpiceItem, SupplyItem, Member } from '../types';
import { Flame, AlertCircle, CheckSquare, Square, Plus, Trash2, ShieldCheck, Heart, Sparkles } from 'lucide-react';

interface ChecklistSectionProps {
  spices: SpiceItem[];
  supplies: SupplyItem[];
  members: Member[];
  onToggleSpiceInOffice: (id: string) => void;
  onToggleSupplyChecked: (id: string) => void;
  onAddSupplyItem: (name: string, category: string) => void;
  onRemoveSupplyItem: (id: string) => void;
  onContinue: () => void;
}

export const ChecklistSection: React.FC<ChecklistSectionProps> = ({
  spices,
  supplies,
  members,
  onToggleSpiceInOffice,
  onToggleSupplyChecked,
  onAddSupplyItem,
  onRemoveSupplyItem,
  onContinue,
}) => {
  const [newSupplyName, setNewSupplyName] = useState('');
  const [newSupplyCategory, setNewSupplyCategory] = useState('ملزومات پذیرایی');

  const handleAddSupply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplyName.trim()) return;
    onAddSupplyItem(newSupplyName.trim(), newSupplyCategory);
    setNewSupplyName('');
  };

  // Filter members with dietary needs
  const allergicMembers = members.filter(
    (m) =>
      m.attendance !== 'absent' &&
      (m.dietary.hasEggAllergy || m.dietary.hasLactoseIntolerance || m.dietary.isVegetarian || m.dietary.customNote)
  );

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="border-b border-neutral-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 mb-1">
          <span>مرحله پنجم نقشه راه</span>
          <span>·</span>
          <span>احتیاط‌های نهایی و لیست سیاه و سفید</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
              ادویه‌جات، ملاحظات غذایی و تجهیزات فراموش‌نشدنی
            </h2>
            <p className="mt-1 text-sm text-neutral-600 max-w-3xl leading-relaxed">
              نمک، فلفل سیاه و زردچوبه معمولاً در خریدها جا می‌مانند. همچنین برای حفظ احترام همکاران، جایگزین‌های اختصاصی برای حساسیت به تخم‌مرغ و لاکتوز تدارک دیده شده است.
            </p>
          </div>
          <button
            onClick={onContinue}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-xs"
          >
            مرحله نهایی: تولید پیام گروهی ←
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Section 1: Spices Checklist (Directly from prompt) */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Flame className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-sm font-bold text-neutral-900">
                چک‌لیست ادویه‌های حیاتی املت
              </h3>
              <p className="text-xs text-neutral-500">
                بررسی موجودی ادویه‌ها در آبدارخانه برای جلوگیری از خرید اضافه یا بی طعم شدن
              </p>
            </div>
          </div>

          <div className="divide-y divide-neutral-100">
            {spices.map((spice) => (
              <div
                key={spice.id}
                className="py-3 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-semibold text-neutral-900">{spice.name}</div>
                  <div className="text-2xs text-neutral-500 mt-0.5">{spice.statusNote}</div>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleSpiceInOffice(spice.id)}
                  className={`px-3 py-1.5 rounded-lg text-2xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    spice.inOffice
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                  }`}
                >
                  {spice.inOffice ? '✓ در شرکت موجود است' : 'باید خریده شود'}
                </button>
              </div>
            ))}
          </div>

          <div className="p-3 bg-amber-50 rounded-lg text-2xs text-amber-900 leading-relaxed border border-amber-200/60">
            💡 <strong>توصیه سرآشپز:</strong> زردچوبه باید با روغن تفت بخورد تا بوی خامی آن گرفته شود؛ برای همین حتماً قبل از رسیدن گوجه‌ها از وجود روغن و زردچوبه اطمینان حاصل کنید.
          </div>
        </div>

        {/* Section 2: Dietary Considerations & Allergies (Directly from prompt) */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Heart className="w-5 h-5 text-rose-600" />
            <div>
              <h3 className="text-sm font-bold text-neutral-900">
                رادار حساسیت‌ها و ملاحظات غذایی همکاران
              </h3>
              <p className="text-xs text-neutral-500">
                «آیا کسی حساسیت به تخم‌مرغ یا لاکتوز (پنیر) دارد؟»
              </p>
            </div>
          </div>

          {allergicMembers.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-400">
              هیچ حساسیت یا محدودیت رژیمی توسط همکاران حاضر گزارش نشده است.
            </div>
          ) : (
            <div className="space-y-3">
              {allergicMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-lg space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900">{member.name}</span>
                    <span className="text-2xs text-neutral-500">{member.department}</span>
                  </div>

                  <div className="text-neutral-700 flex flex-wrap gap-2 text-2xs">
                    {member.dietary.hasEggAllergy && (
                      <span className="text-rose-800 font-semibold">حساسیت به تخم‌مرغ</span>
                    )}
                    {member.dietary.hasLactoseIntolerance && (
                      <span className="text-amber-800 font-semibold">حساسیت به لاکتوز (پنیر)</span>
                    )}
                    {member.dietary.isVegetarian && (
                      <span className="text-emerald-800 font-semibold">گیاه‌خوار</span>
                    )}
                    {member.dietary.customNote && (
                      <span className="text-neutral-600">({member.dietary.customNote})</span>
                    )}
                  </div>

                  {/* Smart Suggested Substitutes */}
                  <div className="pt-2 border-t border-neutral-200/60 text-2xs text-neutral-600">
                    <strong className="text-neutral-800">جایگزین پیشنهادی خرید: </strong>
                    {member.dietary.hasEggAllergy && 'خرید مغز گردوی اضافه، خیار و گوجه خردشده، ارده و شیره، یا میوه فصل.'}
                    {member.dietary.hasLactoseIntolerance && 'حذف پنیر از بشقاب وی، جایگزینی کره گیاهی، مربا یا عسل.'}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-3 bg-neutral-100 rounded-lg text-2xs text-neutral-600 leading-relaxed">
            🌿 <strong>اصل احترام متقابل:</strong> هزینه اقلام جایگزین (مثل گردو یا میوه اضافه) دقیقاً به عنوان بخشی از هزینه‌های تیمی تسهیم می‌شود تا همکاران احساس تفکیک منفی نکنند.
          </div>
        </div>
      </div>

      {/* Disposables & Hygiene Supplies */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-sm font-bold text-neutral-900">
                چک‌لیست بهداشتی، سفره و نظافت
              </h3>
              <p className="text-xs text-neutral-500">
                تیک بزنید تا مطمئن شوید همه وسایل پیش از شروع مهیاست
              </p>
            </div>
          </div>

          {/* Quick add supply form */}
          <form onSubmit={handleAddSupply} className="flex items-center gap-2 text-xs">
            <input
              type="text"
              placeholder="افزودن وسیله جدید..."
              value={newSupplyName}
              onChange={(e) => setNewSupplyName(e.target.value)}
              className="px-3 py-1.5 bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-lg transition-colors cursor-pointer shrink-0"
            >
              + افزودن
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {supplies.map((item) => (
            <div
              key={item.id}
              onClick={() => onToggleSupplyChecked(item.id)}
              className={`p-3 rounded-lg border transition-colors cursor-pointer flex items-center justify-between gap-2 text-xs ${
                item.checked
                  ? 'bg-neutral-50 border-neutral-200 text-neutral-500 line-through'
                  : 'bg-white border-neutral-300 text-neutral-900 hover:border-neutral-400'
              }`}
            >
              <div className="flex items-center gap-2">
                {item.checked ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-neutral-400 shrink-0" />
                )}
                <span>{item.name}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.assignedTo && (
                  <span className="text-2xs text-neutral-400 no-underline">({item.assignedTo})</span>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveSupplyItem(item.id);
                  }}
                  className="text-neutral-300 hover:text-rose-500 p-1 cursor-pointer"
                  title="حذف"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
