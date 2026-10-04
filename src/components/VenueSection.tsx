import React from 'react';
import { VenueOption } from '../types';
import { MapPin, CheckCircle2, ShieldAlert, Sparkles, Users, UtensilsCrossed, CalendarClock, Coffee } from 'lucide-react';

interface VenueSectionProps {
  venues: VenueOption[];
  selectedVenueId: string;
  onSelectVenue: (venueId: string) => void;
  onContinue: () => void;
}

export const VenueSection: React.FC<VenueSectionProps> = ({
  venues,
  selectedVenueId,
  onSelectVenue,
  onContinue,
}) => {
  const selectedVenue = venues.find((v) => v.id === selectedVenueId) || venues[0];

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="border-b border-neutral-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 mb-1">
          <span>مرحله اول نقشه راه</span>
          <span>·</span>
          <span>انتخاب فضای اجرایی رویداد</span>
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
          کجا «تست» بگیریم؟ مکان‌های پیشنهادی در محیط کار
        </h2>
        <p className="mt-1 text-sm text-neutral-600 max-w-3xl leading-relaxed">
          برای تبدیل ایده به اجرای ۱۰۰ درصدی، اولین قدم انتخاب فضایی متناسب با امکانات و فرهنگ سازمانی شرکت شماست. یکی از ۳ فضای زیر را متناسب با ظرفیت و حال‌وهوای تیم برگزینید.
        </p>
      </div>

      {/* Three Venue Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {venues.map((venue) => {
          const isSelected = venue.id === selectedVenueId;
          return (
            <div
              key={venue.id}
              onClick={() => onSelectVenue(venue.id)}
              className={`relative rounded-xl border p-5 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-neutral-900 bg-amber-50/40 ring-2 ring-neutral-900 shadow-sm'
                  : 'border-neutral-200 bg-white hover:border-neutral-400 hover:bg-neutral-50/50'
              }`}
            >
              <div>
                {/* Header of Card */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-xs text-neutral-500 font-mono tracking-tight block mb-0.5">
                      {venue.capacity}
                    </span>
                    <h3 className="text-lg font-bold text-neutral-900">
                      {venue.title}
                    </h3>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                      isSelected
                        ? 'bg-neutral-900 border-neutral-900 text-white'
                        : 'border-neutral-300 bg-white text-transparent'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 fill-current" />
                  </div>
                </div>

                <p className="text-xs text-neutral-600 mb-4 leading-relaxed font-medium">
                  {venue.subtitle}
                </p>

                {/* Vibe badge unboxed */}
                <div className="text-xs text-amber-800 font-medium mb-4 pb-3 border-b border-neutral-200">
                  حال‌وهوا: {venue.vibe}
                </div>

                {/* Pros List */}
                <div className="space-y-2 mb-4">
                  <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>نقاط قوت اصلی:</span>
                  </div>
                  <ul className="text-xs text-neutral-600 space-y-1 pr-2">
                    {venue.pros.map((pro, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-neutral-400 font-mono">·</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons / Considerations */}
                <div className="space-y-2 mb-4">
                  <div className="text-xs font-semibold text-amber-900 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                    <span>ملاحظات و چالش‌ها:</span>
                  </div>
                  <ul className="text-xs text-neutral-600 space-y-1 pr-2">
                    {venue.cons.map((con, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-neutral-400 font-mono">·</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom selection button */}
              <div className="pt-4 border-t border-neutral-100">
                <div className="text-xs text-neutral-500 mb-3">
                  مناسب برای: {venue.recommendedFor}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectVenue(venue.id);
                  }}
                  className={`w-full py-2 px-3 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                      : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                  }`}
                >
                  {isSelected ? '✓ انتخاب شده برای این دورهمی' : 'انتخاب این فضا'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep-Dive Setup Blueprint for Selected Venue */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
              <MapPin className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-base font-bold text-neutral-900">
                دستورالعمل اجرایی برای: {selectedVenue.title}
              </h4>
              <p className="text-xs text-neutral-500">
                نکات چیدمان، بهداشت و زمان‌بندی برای برگزاری بدون دردسر
              </p>
            </div>
          </div>
          <button
            onClick={onContinue}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
          >
            ادامه به مرحله ۲: نظرسنجی تمایل ←
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-neutral-700">
          <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200/60">
            <div className="flex items-center gap-2 font-bold text-neutral-900 mb-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>ترفند چیدمان و ضد لکه</span>
            </div>
            <p className="leading-relaxed">
              {selectedVenue.setupTips}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200/60">
            <div className="flex items-center gap-2 font-bold text-neutral-900 mb-2">
              <CalendarClock className="w-4 h-4 text-amber-600" />
              <span>زمان‌بندی طلایی حضور</span>
            </div>
            <p className="leading-relaxed">
              شروع چیدن سفره یا میز: <strong>۰۸:۱۵</strong> | شروع صبحانه: <strong>۰۸:۳۰</strong> | پایان و پاکسازی کامل فضا: حداکثر <strong>۰۹:۲۰</strong> تا فعالیت کاری شرکت مختل نشود.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200/60">
            <div className="flex items-center gap-2 font-bold text-neutral-900 mb-2">
              <UtensilsCrossed className="w-4 h-4 text-amber-600" />
              <span>تجهیزات الزامی این فضا</span>
            </div>
            <p className="leading-relaxed">
              {selectedVenue.id === 'prayer_hall' && '۲ رول سفره یکبار مصرف عریض، زیرانداز دستمال سفره، خوشبوکننده هوا پس از جمع‌آوری.'}
              {selectedVenue.id === 'conference_room' && 'رومیزی ضدآب نایلونی، زیرقابلمه‌ای چوبی برای تابه املت داغ، تهویه روشن اسپلیت.'}
              {selectedVenue.id === 'pantry_dining' && 'استفاده از کانتر آبدارخانه به عنوان میز بار، چیدن لیوان‌ها و قنددان به صورت ردیفی.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
