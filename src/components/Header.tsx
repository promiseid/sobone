import React from 'react';
import { Coffee, MapPin, Users, Calculator, ShieldCheck, Sparkles, MessageSquare, Copy, Check } from 'lucide-react';
import { toPersianDigits, formatToman } from '../utils/dongCalculator';

interface HeaderProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  eventDate: string;
  totalAttendees: number;
  totalCost: number;
  dongFull: number;
  onQuickCopyInvite: () => void;
  copiedInvite: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  eventDate,
  totalAttendees,
  totalCost,
  dongFull,
  onQuickCopyInvite,
  copiedInvite
}) => {
  const navTabs = [
    { id: 'venues', label: '۱. مکان برگزاری', icon: MapPin },
    { id: 'poll', label: '۲. نظرسنجی تمایل', icon: Users },
    { id: 'dong', label: '۳. حساب و کتاب دنگ', icon: Calculator },
    { id: 'rules', label: '۴. قوانین طلایی و نقش‌ها', icon: ShieldCheck },
    { id: 'checklist', label: '۵. لیست سیاه و احتیاط‌ها', icon: Sparkles },
    { id: 'messages', label: '۶. پیام‌ساز گروهی', icon: MessageSquare },
  ];

  return (
    <header className="border-b border-neutral-200 bg-white sticky top-0 z-30 shadow-xs">
      {/* Top Bar Contract: Brand single element, text nav links, primary actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Single text wordmark brand */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-neutral-900 block leading-tight">
                دانگ‌چاشت
              </span>
              <span className="text-xs text-neutral-500 hidden sm:block">
                سامانه اجرای ۱۰۰٪ صبحانه دورهمی شرکت
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs xl:text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Quick Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onQuickCopyInvite}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-neutral-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
            >
              {copiedInvite ? (
                <>
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span className="text-emerald-800">کپی شد!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-amber-800" />
                  <span>کپی پیام نظرسنجی</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav Tabs Bar */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-neutral-100 no-scrollbar">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quiet Metadata Bar (Anti-Pill discipline: unboxed text with subtle typographic separators) */}
        <div className="py-2 border-t border-neutral-100 flex flex-wrap items-center justify-between text-xs text-neutral-500 gap-y-1">
          <div className="flex items-center gap-2">
            <span>تاریخ دورهمی: {eventDate}</span>
            <span aria-hidden="true">·</span>
            <span>حاضرین قطعی: <strong className="text-neutral-800 tabular-nums">{toPersianDigits(totalAttendees)} نفر</strong></span>
            <span aria-hidden="true">·</span>
            <span>کل هزینه‌ها: <strong className="text-neutral-800 tabular-nums">{formatToman(totalCost)}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span>دنگ تخمینی املت: <strong className="text-amber-800 tabular-nums">{formatToman(dongFull)}</strong></span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-medium">آماده‌سازی ۱۰۰٪ فعال</span>
          </div>
        </div>
      </div>
    </header>
  );
};
