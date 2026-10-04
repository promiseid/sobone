import React, { useState } from 'react';
import { Member, TeamRole, EventConfig } from '../types';
import { ShieldCheck, Clock, UserX, Sparkles, ChefHat, ShoppingBag, Utensils, Coffee, Check, Copy, AlertTriangle } from 'lucide-react';

interface GoldenRulesSectionProps {
  members: Member[];
  eventConfig: EventConfig;
  onUpdateMemberRole: (memberId: string, role: TeamRole) => void;
  onContinue: () => void;
}

export const GoldenRulesSection: React.FC<GoldenRulesSectionProps> = ({
  members,
  eventConfig,
  onUpdateMemberRole,
  onContinue,
}) => {
  const [copiedRules, setCopiedRules] = useState(false);

  const copyRulesText = () => {
    const rulesText = `⚖️ *۳ قانون طلایی صبحانه تیمی شرکت (قانون دنگ)* 🍳

۱. ⏰ *زمان طلایی پرداخت:*
«دنگ‌ها باید حداکثر تا پایان ساعت کاری همان روز (${eventConfig.paymentDeadlineHours}) واریز شود تا حساب مادرخرج معطل نماند.»

۲. 🚫 *قانون کنسلی ۲۴ ساعته:*
«هر کسی تا ۲۴ ساعت قبل اعلام حضور کند، نامش در لیست خرید قطعی است و دنگ شامل حالش می‌شود (حتی اگر دقیقه‌ی نود نیاید)، چون مواد اولیه متناسب با تعداد وی خریداری شده است.»

۳. 🧼 *معافیت عادلانه تیم نظافت:*
«تیم آشپزخانه (کسانی که زحمت پخت املت را کشیدند) از شستن ظرف‌ها و جمع‌کردن سفره معاف هستند و سایر همکاران حاضر مسئول نظافتند.»`;

    navigator.clipboard.writeText(rulesText);
    setCopiedRules(true);
    setTimeout(() => setCopiedRules(false), 2000);
  };

  const getRoleBadge = (role: TeamRole) => {
    switch (role) {
      case 'chef':
        return { label: 'سرآشپز املت 👨‍🍳 (معاف از ظرف)', color: 'text-amber-800' };
      case 'bread':
        return { label: 'مسئول نان داغ 🥖', color: 'text-neutral-700' };
      case 'groceries':
        return { label: 'مسئول خرید 🛒', color: 'text-neutral-700' };
      case 'cleaning':
        return { label: 'تیم نظافت و شستشو 🧽', color: 'text-blue-800' };
      case 'tea':
        return { label: 'مسئول دم کردن چای ☕', color: 'text-neutral-700' };
      default:
        return { label: 'بدون نقش تعیین‌شده', color: 'text-neutral-400' };
    }
  };

  const activeMembers = members.filter((m) => m.attendance !== 'absent');
  const chefs = activeMembers.filter((m) => m.role === 'chef');
  const cleaners = activeMembers.filter((m) => m.role === 'cleaning');

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="border-b border-neutral-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 mb-1">
          <span>مرحله چهارم نقشه راه</span>
          <span>·</span>
          <span>تضمین نظم، عدالت و جلوگیری از معذب شدن</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
              قوانین طلایی دنگ و تقسیم عادلانه وظایف
            </h2>
            <p className="mt-1 text-sm text-neutral-600 max-w-3xl leading-relaxed">
              برای اینکه دورهمی شرکت تبدیل به یک خاطره شیرین بدون دلخوری شود، این ۳ اصل محوری را به عنوان منشور رسمی صبحانه به تیم اعلام کنید.
            </p>
          </div>
          <button
            onClick={copyRulesText}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-xs"
          >
            {copiedRules ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>قوانین کپی شد!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>کپی متن ۳ قانون طلایی</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3 Golden Rules Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Rule 1 */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-neutral-400">قانون طلایی ۰۱</span>
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-neutral-900 mb-2">
              زمان طلایی پرداخت (Dead-line)
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-medium mb-3">
              «دنگ‌ها باید حداکثر تا پایان ساعت کاری همان روز واریز شود.»
            </p>
            <div className="text-2xs text-neutral-500 leading-normal bg-neutral-50 p-3 rounded-lg border border-neutral-100">
              چرا مهم است؟ به تعویق انداختن واریزی باعث معذب شدن مادرخرج می‌شود و پیگیری دوباره بار روانی منفی در محیط کار ایجاد می‌کند.
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-100 text-2xs text-amber-800 font-semibold">
            مهلت تعیین‌شده: {eventConfig.paymentDeadlineHours}
          </div>
        </div>

        {/* Rule 2 */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-neutral-400">قانون طلایی ۰۲</span>
              <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-900 flex items-center justify-center">
                <UserX className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-neutral-900 mb-2">
              قانون کنسلی ۲۴ ساعته
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-medium mb-3">
              «هر کسی تا ۲۴ ساعت قبل اعلام حضور کند، نامش در لیست خرید است و دنگ شامل حالش می‌شود (حتی در غیبت دقیقه نود).»
            </p>
            <div className="text-2xs text-neutral-500 leading-normal bg-neutral-50 p-3 rounded-lg border border-neutral-100">
              چرا عادلانه است؟ چون نان، تخم‌مرغ و پنیر با احتساب سهم وی خریداری شده و عدم پرداخت او سهم بقیه را به ناحق گران‌تر می‌کند.
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-100 text-2xs text-rose-800 font-semibold">
            حداکثر مهلت کنسلی بدون دنگ: ۲۴ ساعت قبل
          </div>
        </div>

        {/* Rule 3 */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-neutral-400">قانون طلایی ۰۳</span>
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-base font-bold text-neutral-900 mb-2">
              معافیت عادلانه تیم آشپزخانه
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-medium mb-3">
              «تیم آشپزخانه (کسانی که املت پختند) از شستن ظرف‌ها و جمع‌کردن سفره کاملاً معاف هستند.»
            </p>
            <div className="text-2xs text-neutral-500 leading-normal bg-neutral-50 p-3 rounded-lg border border-neutral-100">
              چرا اصولی است؟ انرژی پخت، خرد کردن گوجه و ایستادن پای گاز نباید با ظرف‌شویی سنگین همراه شود؛ سایر همکاران حاضر وظیفه نظافت را تقبل می‌کنند.
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-100 text-2xs text-emerald-800 font-semibold">
            پزندگان املت: معاف قطعی از آب و اسکاچ
          </div>
        </div>
      </div>

      {/* Role Delegation Matrix (Direct execution of Rule 3) */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-neutral-900">
              میز تخصیص نقش‌ها و وظایف صبحانه
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              مسئول هر بخش را مشخص کنید تا در روز اجرا هیچ کاری روی زمین نماند.
            </p>
          </div>

          {chefs.length > 0 && cleaners.length === 0 && (
            <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>حتماً حداقل ۱ نفر را برای تیم نظافت انتخاب کنید!</span>
            </div>
          )}
        </div>

        {/* Members Role Assignment Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {activeMembers.map((member) => {
            const roleInfo = getRoleBadge(member.role);
            return (
              <div
                key={member.id}
                className="p-3 rounded-lg border border-neutral-200 bg-neutral-50/50 hover:bg-neutral-50 flex items-center justify-between gap-2"
              >
                <div>
                  <div className="text-xs font-bold text-neutral-900">{member.name}</div>
                  <div className="text-2xs text-neutral-500">{member.department}</div>
                  <div className={`text-2xs font-semibold mt-1 ${roleInfo.color}`}>
                    {roleInfo.label}
                  </div>
                </div>

                <select
                  value={member.role}
                  onChange={(e) => onUpdateMemberRole(member.id, e.target.value as TeamRole)}
                  className="text-2xs py-1 px-2 bg-white border border-neutral-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900 cursor-pointer"
                >
                  <option value="none">بدون نقش</option>
                  <option value="chef">سرآشپز املت 👨‍🍳 (معاف)</option>
                  <option value="bread">مسئول نان تازه 🥖</option>
                  <option value="groceries">مسئول خرید اقلام 🛒</option>
                  <option value="tea">مسئول چای و نبات ☕</option>
                  <option value="cleaning">تیم نظافت و شستشو 🧽</option>
                </select>
              </div>
            );
          })}
        </div>

        {/* Roles Quick Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-neutral-100 text-xs text-neutral-600">
          <div>
            <strong className="block text-neutral-900 font-semibold">👨‍🍳 تیم پخت املت:</strong>
            <span>{chefs.map((c) => c.name).join('، ') || 'تعیین نشده'}</span>
          </div>
          <div>
            <strong className="block text-neutral-900 font-semibold">🥖 مسئول نان:</strong>
            <span>{activeMembers.filter((m) => m.role === 'bread').map((m) => m.name).join('، ') || 'تعیین نشده'}</span>
          </div>
          <div>
            <strong className="block text-neutral-900 font-semibold">☕ مسئول چای:</strong>
            <span>{activeMembers.filter((m) => m.role === 'tea').map((m) => m.name).join('، ') || 'تعیین نشده'}</span>
          </div>
          <div>
            <strong className="block text-neutral-900 font-semibold">🧽 تیم شستشو:</strong>
            <span>{cleaners.map((m) => m.name).join('، ') || 'تعیین نشده'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
