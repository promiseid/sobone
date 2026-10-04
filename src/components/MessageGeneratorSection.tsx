import React, { useState } from 'react';
import { EventConfig, VenueOption, Member, ExpenseItem } from '../types';
import { CalculatedDong, formatToman, toPersianDigits } from '../utils/dongCalculator';
import { MessageSquare, Copy, Check, Share2, Printer, Sparkles, Send } from 'lucide-react';

interface MessageGeneratorSectionProps {
  eventConfig: EventConfig;
  selectedVenue: VenueOption;
  members: Member[];
  expenses: ExpenseItem[];
  calculatedDong: CalculatedDong;
}

export const MessageGeneratorSection: React.FC<MessageGeneratorSectionProps> = ({
  eventConfig,
  selectedVenue,
  members,
  expenses,
  calculatedDong,
}) => {
  const [activeTemplate, setActiveTemplate] = useState<'official' | 'poll' | 'settlement' | 'reminder'>('official');
  const [copied, setCopied] = useState(false);

  const activeMembers = members.filter((m) => m.attendance !== 'absent');
  const chefs = activeMembers.filter((m) => m.role === 'chef').map((m) => m.name).join(' و ') || 'داوطلبان تیم';
  const breadMasters = activeMembers.filter((m) => m.role === 'bread').map((m) => m.name).join(' و ') || 'مسئول نان';

  // Template 1: Official Announcement & 3 Golden Rules
  const officialAnnouncement = `🍳 *دعوتنامه رسمی صبحانه گرم دورهمی شرکت* ☕
سلام به تمام همکاران پرتلاش و دوست‌داشتنی! 

برنامه صبحانه دورهمی کاری برای تقویت انرژی و صمیمیت تیم به شرح زیر نهایی شد:

📅 *زمان:* ${eventConfig.eventDate} | ساعت: ${eventConfig.eventTime}
📍 *مکان:* ${selectedVenue.title} (${selectedVenue.subtitle})
🍽 *منوی برنامه:* املت گوجه‌فرنگی آتشین + نان بربری داغ کنجدی + پنیر سنتی لیقوان و مغز گردو + چای تازه‌دم
👨‍🍳 *تیم سرآشپز:* ${chefs}
🥖 *نان تازه:* ${breadMasters}

---
⚖️ *۳ قانون طلایی برای نظم و عدالت (قانون دنگ):*
۱. ⏰ *زمان طلایی پرداخت:* دنگ‌ها باید حداکثر تا پایان ساعت کاری همان روز (${eventConfig.paymentDeadlineHours}) واریز شود تا مادرخرج معذب نشود.
۲. 🚫 *قانون کنسلی ۲۴ ساعته:* هر عزیزی تا ۲۴ ساعت قبل اعلام حضور کند نامش در لیست خرید قطعی است و دنگ شامل حالش می‌شود (چون مواد اولیه به ازای او خریداری شده است).
۳. 🧼 *معافیت تیم آشپزخانه:* تیم پخت املت از شستن ظرف‌ها و جمع‌کردن سفره کاملاً معاف هستند و سایر همکاران حاضر زحمت نظافت را می‌کشند.

💳 *اطلاعات حساب مادرخرج جهت تسویه:*
شماره کارت: ${eventConfig.motherAccount.cardNumber}
به نام: ${eventConfig.motherAccount.holderName} (${eventConfig.motherAccount.bankName})
شماره شبا: ${eventConfig.motherAccount.iban}

منتظر حضور گرم همه دوستان هستیم! 🌿`;

  // Template 2: Poll text
  const pollTemplate = `🍳 *نظرسنجی حضور در صبحانه گرم دورهمی شرکت* ☕
همکاران عزیز، برای صبحانه گرم روز ${eventConfig.eventDate} موافقید؟

لطفاً گزینه خود را تا عصر انتخاب کنید تا لیست خرید و سهم دنگ نهایی شود:
۱. پایه هستم (تایید حضور املت داغ و کامل) ✅
۲. این بار نیستم (باشه برای دفعه بعد) ❌
۳. فقط چای و نان پنیر می‌خورم (دنگ کمتر) 🧀

📍 مکان برگزاری: ${selectedVenue.title}
🙏🏻 اگر به تخم‌مرغ یا لاکتوز (پنیر) حساسیت دارید لطفاً اطلاع دهید تا گردو یا میوه جایگزین شود.`;

  // Template 3: Settlement & Invoice text
  const settlementTemplate = `🧾 *صورتحساب شفاف فاکتورها و سهم دنگ صبحانه تیمی* 💰
ضمن تشکر از حضور گرم همکاران، حساب و کتاب دقیق صبحانه ${eventConfig.eventDate} آماده شد:

📊 *خلاصه مالی:*
• کل هزینه فاکتورها: ${formatToman(calculatedDong.totalCost)}
• سهم شرکت‌کننده کامل (پایه - املت): ${formatToman(calculatedDong.dongFullPerson)}
• سهم همکاران سبک‌خور (فقط چای و نان پنیر): ${formatToman(calculatedDong.dongLightPerson)}

💳 *حساب مادرخرج جهت واریز:*
شماره کارت: \`${eventConfig.motherAccount.cardNumber.replace(/-/g, '')}\`
به نام: ${eventConfig.motherAccount.holderName} - بانک ${eventConfig.motherAccount.bankName}
مهلت واریز: ${eventConfig.paymentDeadlineHours}

📝 *وضعیت سهم اعضا:*
${calculatedDong.memberBalances
  .filter((b) => b.member.attendance !== 'absent')
  .map(
    (b) =>
      `• ${b.member.name}: ${formatToman(b.calculatedDong)} (${b.member.attendance === 'full' ? 'پایه' : 'نان و پنیر'}) - ${b.isSettled ? '✅ تسویه شده' : '⏳ در انتظار واریز'}`
  )
  .join('\n')}

لطفاً پس از واریز، فیش را در پیوی مادرخرج ارسال فرمایید. سپاس از همکاری همه دوستان! ❤️`;

  // Template 4: Friendly Morning-Of Reminder
  const reminderTemplate = `☀️ *صبح همگی بخیر! یادآوری صبحانه گرم تیمی* 🥖
همکاران گرامی، نان‌های داغ رسید و املت در حال پخت است!
⏰ لطفاً رأس ساعت *${eventConfig.eventTime.split(' ')[0]}* در *${selectedVenue.title}* حاضر باشید تا املت داغ سرو شود و برنامه‌های کاری آغاز روز به تاخیر نیفتد.

پیشاپیش نوش جان! 🍳☕`;

  const getActiveText = () => {
    switch (activeTemplate) {
      case 'official': return officialAnnouncement;
      case 'poll': return pollTemplate;
      case 'settlement': return settlementTemplate;
      case 'reminder': return reminderTemplate;
    }
  };

  const currentText = getActiveText();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareTelegram = () => {
    const encoded = encodeURIComponent(currentText);
    window.open(`https://t.me/share/url?url=&text=${encoded}`, '_blank');
  };

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(currentText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="border-b border-neutral-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 mb-1">
          <span>مرحله ششم نقشه راه</span>
          <span>·</span>
          <span>پیام‌ساز آماده برای Paste در گروه‌های شرکت</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
              متن‌های آماده برای تلگرام، بله، واتساپ و اسلک
            </h2>
            <p className="mt-1 text-sm text-neutral-600 max-w-3xl leading-relaxed">
              تمام اطلاعات، مبالغ، شماره کارت، مکان و ۳ قانون طلایی به صورت هوشمند در متن‌ها جای‌گذاری شده است. فقط با یک کلیک کپی کرده و در گروه شرکت بفرستید.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>چاپ فاکتور</span>
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>متن در حافظه کپی شد!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>کپی متن پیام فعال</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Template Selector Bar (Functional tabs) */}
      <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTemplate('official')}
          className={`px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeTemplate === 'official'
              ? 'bg-white text-neutral-900 shadow-2xs font-bold'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          📢 متن رسمی اعلام برنامه و ۳ قانون طلایی
        </button>
        <button
          onClick={() => setActiveTemplate('poll')}
          className={`px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeTemplate === 'poll'
              ? 'bg-white text-neutral-900 shadow-2xs font-bold'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          🗳️ نظرسنجی اولیه تمایل (Poll)
        </button>
        <button
          onClick={() => setActiveTemplate('settlement')}
          className={`px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeTemplate === 'settlement'
              ? 'bg-white text-neutral-900 shadow-2xs font-bold'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          🧾 صورتحساب فاکتور و تسویه دنگ
        </button>
        <button
          onClick={() => setActiveTemplate('reminder')}
          className={`px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeTemplate === 'reminder'
              ? 'bg-white text-neutral-900 shadow-2xs font-bold'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          ⏰ یادآوری سریع صبح روز دورهمی
        </button>
      </div>

      {/* Message Preview Box */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-neutral-200 bg-neutral-50/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-neutral-700 font-semibold">
            <MessageSquare className="w-4 h-4 text-amber-600" />
            <span>پیش‌نمایش متن آماده برای ارسال</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareTelegram}
              className="flex items-center gap-1 px-2.5 py-1 text-2xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-md transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>ارسال در تلگرام</span>
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1 px-2.5 py-1 text-2xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>ارسال در واتساپ</span>
            </button>
          </div>
        </div>

        {/* Textarea for viewing and quick copy */}
        <div className="p-5">
          <textarea
            readOnly
            value={currentText}
            rows={14}
            className="w-full font-sans text-xs sm:text-sm text-neutral-800 leading-relaxed bg-neutral-50/50 p-4 rounded-xl border border-neutral-200 resize-none focus:outline-hidden"
          />
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 border-t border-neutral-100 bg-neutral-50/50 flex flex-col sm:flex-row items-center justify-between text-2xs text-neutral-500 gap-2">
          <span>
            💡 متن بر اساس فرمت استاندارد گروه‌های کاری فارسی تنظیم شده است و کلمات کلیدی Bold شده‌اند.
          </span>
          <button
            onClick={handleCopy}
            className="text-amber-800 hover:text-amber-900 font-bold cursor-pointer"
          >
            {copied ? '✓ کپی شد!' : 'کپی مجدد متن ↗'}
          </button>
        </div>
      </div>
    </div>
  );
};
