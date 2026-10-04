import React, { useState } from 'react';
import { Member, AttendanceStatus } from '../types';
import { toPersianDigits } from '../utils/dongCalculator';
import { Users, CheckCircle, XCircle, Coffee, UserPlus, Trash2, Copy, Check, AlertCircle, HeartHandshake } from 'lucide-react';

interface PollSectionProps {
  members: Member[];
  onUpdateMemberAttendance: (memberId: string, status: AttendanceStatus) => void;
  onAddMember: (newMember: Omit<Member, 'id' | 'paid'>) => void;
  onRemoveMember: (memberId: string) => void;
  onUpdateDietary: (memberId: string, hasEggAllergy: boolean, hasLactoseIntolerance: boolean, customNote?: string) => void;
  eventDate: string;
  onContinue: () => void;
}

export const PollSection: React.FC<PollSectionProps> = ({
  members,
  onUpdateMemberAttendance,
  onAddMember,
  onRemoveMember,
  onUpdateDietary,
  eventDate,
  onContinue,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDepartment, setNewDepartment] = useState('فنی و مهندسی');
  const [newAttendance, setNewAttendance] = useState<AttendanceStatus>('full');
  const [newEggAllergy, setNewEggAllergy] = useState(false);
  const [newLactoseIntolerance, setNewLactoseIntolerance] = useState(false);
  const [newCustomNote, setNewCustomNote] = useState('');
  const [copiedPollText, setCopiedPollText] = useState(false);

  // Filter state
  const [statusFilter, setStatusFilter] = useState<'all' | 'full' | 'light' | 'absent'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Statistics
  const fullCount = members.filter((m) => m.attendance === 'full').length;
  const lightCount = members.filter((m) => m.attendance === 'light').length;
  const absentCount = members.filter((m) => m.attendance === 'absent').length;
  const totalCount = members.length;
  const activeCount = fullCount + lightCount;
  const fullPercent = totalCount > 0 ? Math.round((fullCount / totalCount) * 100) : 0;
  const lightPercent = totalCount > 0 ? Math.round((lightCount / totalCount) * 100) : 0;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onAddMember({
      name: newName.trim(),
      department: newDepartment.trim() || 'عمومی',
      attendance: newAttendance,
      role: 'none',
      dietary: {
        hasEggAllergy: newEggAllergy,
        hasLactoseIntolerance: newLactoseIntolerance,
        isVegetarian: newEggAllergy,
        hasGlutenSensitivity: false,
        customNote: newCustomNote.trim() || undefined
      }
    });

    setNewName('');
    setNewCustomNote('');
    setNewEggAllergy(false);
    setNewLactoseIntolerance(false);
    setShowAddForm(false);
  };

  const copyPollMessage = () => {
    const pollText = `🍳 *نظرسنجی صبحانه گرم دورهمی شرکت* ☕
سلام همکاران عزیز! برای صبحانه گرم روز ${eventDate} موافقید؟

لطفاً گزینه خود را انتخاب کنید تا لیست خرید و دنگ دقیق بسته شود:
۱. پایه هستم (تایید حضور املت داغ و کامل) ✅
۲. این بار نیستم (باشه برای دفعه بعد) ❌
۳. فقط چای و نان پنیر می‌خورم (دنگ کمتر) 🧀

⏱ *مهلت ثبت رای:* تا پایان ساعت اداری امروز
🙏🏻 لطفاً اگر به تخم‌مرغ یا لبنیات حساسیت دارید در پیوی اعلام کنید تا جایگزین تهیه شود.`;

    navigator.clipboard.writeText(pollText);
    setCopiedPollText(true);
    setTimeout(() => setCopiedPollText(false), 2500);
  };

  const filteredMembers = members.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.department.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (statusFilter === 'all') return true;
    return m.attendance === statusFilter;
  });

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="border-b border-neutral-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 mb-1">
          <span>مرحله دوم نقشه راه</span>
          <span>·</span>
          <span>تستِ تمایل (نبض‌سنجی همکاران قبل از خرید)</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
              نظرسنجی و مدیریت حضور همکاران
            </h2>
            <p className="mt-1 text-sm text-neutral-600 max-w-3xl leading-relaxed">
              قبل از هرگونه خرید، با یک نظرسنجی ۳ گزینه‌ای تعداد دقیق نفرات را تفکیک کنید تا نه مواد اولیه اضافه بماند و نه دنگ کسی تضییع شود.
            </p>
          </div>
          <button
            onClick={copyPollMessage}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-xs"
          >
            {copiedPollText ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>متن نظرسنجی کپی شد!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-neutral-300" />
                <span>کپی متن Poll تلگرام/واتساپ</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3 Core Poll Option Cards (Visual Representation of User's prompt options) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Option 1: Full */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-neutral-400">گزینه اول</span>
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-base font-bold text-neutral-900 mb-1">
            ۱. پایه هستم (تایید حضور) ✅
          </h3>
          <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
            حضور در املت داغ سفارشی، نان بربری تازه، پنیر و مخلفات و چای تازه‌دم.
          </p>
          <div className="flex items-baseline justify-between pt-3 border-t border-neutral-100">
            <span className="text-xs text-neutral-500">آمار موافقین:</span>
            <span className="text-xl font-bold text-neutral-900 tabular-nums">
              {toPersianDigits(fullCount)} نفر <span className="text-xs text-neutral-500 font-normal">({toPersianDigits(fullPercent)}%)</span>
            </span>
          </div>
        </div>

        {/* Option 2: Absent */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-neutral-400">گزینه دوم</span>
            <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-base font-bold text-neutral-900 mb-1">
            ۲. این بار نیستم ❌
          </h3>
          <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
            باشه برای دفعه بعد (جلسه بیرون از شرکت، دورکاری، مرخصی یا صبحانه خورده).
          </p>
          <div className="flex items-baseline justify-between pt-3 border-t border-neutral-100">
            <span className="text-xs text-neutral-500">عدم حضور:</span>
            <span className="text-xl font-bold text-neutral-900 tabular-nums">
              {toPersianDigits(absentCount)} نفر
            </span>
          </div>
        </div>

        {/* Option 3: Light */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-neutral-400">گزینه سوم</span>
            <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
              <Coffee className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-base font-bold text-neutral-900 mb-1">
            ۳. فقط چای و نان پنیر 🧀
          </h3>
          <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
            دنگ کمتر؛ فقط شریک در نان، پنیر، گردو و چای (بدون هزینه املت و تخم‌مرغ).
          </p>
          <div className="flex items-baseline justify-between pt-3 border-t border-neutral-100">
            <span className="text-xs text-neutral-500">سبک‌خوران:</span>
            <span className="text-xl font-bold text-neutral-900 tabular-nums">
              {toPersianDigits(lightCount)} نفر <span className="text-xs text-neutral-500 font-normal">({toPersianDigits(lightPercent)}%)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Quorum / Readiness Status banner */}
      <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-900">
        <div className="flex items-center gap-2.5">
          <HeartHandshake className="w-5 h-5 text-emerald-700 shrink-0" />
          <div>
            <strong className="font-semibold block">
              نصاب حضور تکمیل است ({toPersianDigits(activeCount)} همکار پایه و حاضر)
            </strong>
            <span className="text-emerald-700">
              تعداد نفرات برای پخت املت دورهمی و خرید نان داغ اقتصادی و بهینه است.
            </span>
          </div>
        </div>
        <button
          onClick={onContinue}
          className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0"
        >
          ورود به ماشین‌حساب دنگ ←
        </button>
      </div>

      {/* Member Roster & Interactive Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-4 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50/50">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="جستجوی همکار یا واحد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-neutral-900 w-48 sm:w-64"
            />

            {/* Interactive filter tabs */}
            <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                همه ({toPersianDigits(members.length)})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('full')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  statusFilter === 'full'
                    ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                پایه ({toPersianDigits(fullCount)})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('light')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  statusFilter === 'light'
                    ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                چای و پنیر ({toPersianDigits(lightCount)})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('absent')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  statusFilter === 'absent'
                    ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                غایب ({toPersianDigits(absentCount)})
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors whitespace-nowrap cursor-pointer self-end sm:self-auto"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{showAddForm ? 'بستن فرم' : '+ افزودن همکار'}</span>
          </button>
        </div>

        {/* Add Member Dropdown Form */}
        {showAddForm && (
          <form onSubmit={handleAddSubmit} className="p-4 bg-amber-50/40 border-b border-amber-200/60 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">نام و نام خانوادگی:</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="مثال: پرهام سهرابی"
                className="w-full px-2.5 py-1.5 bg-white border border-neutral-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">واحد / تیم:</label>
              <input
                type="text"
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                placeholder="مثال: توسعه‌دهنده بک‌اند"
                className="w-full px-2.5 py-1.5 bg-white border border-neutral-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">وضعیت تمایل اولیه:</label>
              <select
                value={newAttendance}
                onChange={(e) => setNewAttendance(e.target.value as AttendanceStatus)}
                className="w-full px-2.5 py-1.5 bg-white border border-neutral-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              >
                <option value="full">پایه هستم (املت کامل) ✅</option>
                <option value="light">فقط چای و نان پنیر 🧀</option>
                <option value="absent">این بار نیستم ❌</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-md transition-colors cursor-pointer"
              >
                ثبت در لیست همکاران
              </button>
            </div>

            {/* Dietary alert checkbox for quick input */}
            <div className="sm:col-span-4 flex flex-wrap items-center gap-4 pt-1 text-neutral-600">
              <span className="font-semibold text-neutral-700">ملاحظات غذایی اولیه:</span>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newEggAllergy}
                  onChange={(e) => setNewEggAllergy(e.target.checked)}
                  className="rounded border-neutral-300 text-neutral-900"
                />
                <span>حساس به تخم‌مرغ</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newLactoseIntolerance}
                  onChange={(e) => setNewLactoseIntolerance(e.target.checked)}
                  className="rounded border-neutral-300 text-neutral-900"
                />
                <span>حساس به لاکتوز (لبنیات)</span>
              </label>
              <input
                type="text"
                placeholder="یادداشت رژیمی دیگر (مثلاً بدون قند)"
                value={newCustomNote}
                onChange={(e) => setNewCustomNote(e.target.value)}
                className="px-2 py-1 bg-white border border-neutral-300 rounded text-xs flex-1 min-w-[180px]"
              />
            </div>
          </form>
        )}

        {/* Members Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-medium">
              <tr>
                <th className="py-2.5 px-4">همکار</th>
                <th className="py-2.5 px-4">واحد</th>
                <th className="py-2.5 px-4">وضعیت حضور (رأی در نظرسنجی)</th>
                <th className="py-2.5 px-4">ملاحظات غذایی</th>
                <th className="py-2.5 px-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-400">
                    همکاری با این مشخصات یافت نشد.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3 px-4 font-semibold text-neutral-900">
                      {member.name}
                    </td>
                    <td className="py-3 px-4 text-neutral-500">
                      {member.department}
                    </td>
                    <td className="py-3 px-4">
                      {/* Segmented status buttons for fast in-line updating */}
                      <div className="inline-flex items-center gap-1 p-0.5 bg-neutral-100 rounded-lg">
                        <button
                          type="button"
                          onClick={() => onUpdateMemberAttendance(member.id, 'full')}
                          className={`px-2 py-1 rounded text-2xs font-medium transition-colors ${
                            member.attendance === 'full'
                              ? 'bg-emerald-600 text-white font-semibold shadow-2xs'
                              : 'text-neutral-600 hover:text-neutral-900'
                          }`}
                        >
                          پایه هستم ✅
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateMemberAttendance(member.id, 'light')}
                          className={`px-2 py-1 rounded text-2xs font-medium transition-colors ${
                            member.attendance === 'light'
                              ? 'bg-amber-600 text-white font-semibold shadow-2xs'
                              : 'text-neutral-600 hover:text-neutral-900'
                          }`}
                        >
                          چای و نان پنیر 🧀
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateMemberAttendance(member.id, 'absent')}
                          className={`px-2 py-1 rounded text-2xs font-medium transition-colors ${
                            member.attendance === 'absent'
                              ? 'bg-rose-600 text-white font-semibold shadow-2xs'
                              : 'text-neutral-600 hover:text-neutral-900'
                          }`}
                        >
                          این بار نیستم ❌
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {/* Quiet unboxed text metadata (Anti-slop rule) */}
                      {member.dietary.hasEggAllergy || member.dietary.hasLactoseIntolerance || member.dietary.customNote ? (
                        <div className="text-amber-900 font-medium flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                          <span>
                            {[
                              member.dietary.hasEggAllergy ? 'حساسیت تخم‌مرغ' : null,
                              member.dietary.hasLactoseIntolerance ? 'حساسیت لاکتوز' : null,
                              member.dietary.customNote
                            ].filter(Boolean).join(' · ')}
                          </span>
                        </div>
                      ) : (
                        <span className="text-neutral-400">بدون حساسیت ویژه</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => onRemoveMember(member.id)}
                        className="p-1 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="حذف همکار"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
