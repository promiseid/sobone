/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  DEFAULT_VENUES,
  DEFAULT_MEMBERS,
  DEFAULT_EXPENSES,
  DEFAULT_SPICES,
  DEFAULT_SUPPLIES,
  DEFAULT_EVENT_CONFIG
} from './data/defaults';
import {
  Member,
  ExpenseItem,
  SpiceItem,
  SupplyItem,
  EventConfig,
  AttendanceStatus,
  TeamRole
} from './types';
import { calculateDong, toPersianDigits, formatToman } from './utils/dongCalculator';
import { Header } from './components/Header';
import { VenueSection } from './components/VenueSection';
import { PollSection } from './components/PollSection';
import { DongManagerSection } from './components/DongManagerSection';
import { GoldenRulesSection } from './components/GoldenRulesSection';
import { ChecklistSection } from './components/ChecklistSection';
import { MessageGeneratorSection } from './components/MessageGeneratorSection';
import {
  Coffee,
  CheckCircle2,
  Calendar,
  Sparkles,
  RotateCcw,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const STORAGE_KEY = 'dongchasht_office_breakfast_v1';

export default function App() {
  // Load state from local storage or defaults
  const [venues] = useState(DEFAULT_VENUES);
  const [selectedVenueId, setSelectedVenueId] = useState<string>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_venue`);
    return saved || DEFAULT_EVENT_CONFIG.selectedVenueId;
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_members`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_MEMBERS;
  });

  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_expenses`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_EXPENSES;
  });

  const [spices, setSpices] = useState<SpiceItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_spices`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_SPICES;
  });

  const [supplies, setSupplies] = useState<SupplyItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_supplies`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_SUPPLIES;
  });

  const [eventConfig, setEventConfig] = useState<EventConfig>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_config`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_EVENT_CONFIG;
  });

  const [activeTab, setActiveTab] = useState<string>('venues');
  const [copiedQuickInvite, setCopiedQuickInvite] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_venue`, selectedVenueId);
    localStorage.setItem(`${STORAGE_KEY}_members`, JSON.stringify(members));
    localStorage.setItem(`${STORAGE_KEY}_expenses`, JSON.stringify(expenses));
    localStorage.setItem(`${STORAGE_KEY}_spices`, JSON.stringify(spices));
    localStorage.setItem(`${STORAGE_KEY}_supplies`, JSON.stringify(supplies));
    localStorage.setItem(`${STORAGE_KEY}_config`, JSON.stringify(eventConfig));
  }, [selectedVenueId, members, expenses, spices, supplies, eventConfig]);

  // Derived financial calculations
  const calculatedDong = calculateDong(members, expenses);

  const selectedVenue = venues.find((v) => v.id === selectedVenueId) || venues[0];

  // Quick reset to defaults
  const handleResetDefaults = () => {
    if (window.confirm('آیا مایلید تمام اطلاعات برنامه به مقادیر اولیه نمونه بازگردانی شود؟')) {
      localStorage.clear();
      setSelectedVenueId(DEFAULT_EVENT_CONFIG.selectedVenueId);
      setMembers(DEFAULT_MEMBERS);
      setExpenses(DEFAULT_EXPENSES);
      setSpices(DEFAULT_SPICES);
      setSupplies(DEFAULT_SUPPLIES);
      setEventConfig(DEFAULT_EVENT_CONFIG);
      setActiveTab('venues');
    }
  };

  // Member actions
  const handleUpdateMemberAttendance = (memberId: string, status: AttendanceStatus) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, attendance: status } : m))
    );
  };

  const handleAddMember = (newMember: Omit<Member, 'id' | 'paid'>) => {
    const created: Member = {
      ...newMember,
      id: 'm_' + Date.now(),
      paid: false
    };
    setMembers((prev) => [...prev, created]);
  };

  const handleRemoveMember = (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  const handleUpdateMemberRole = (memberId: string, role: TeamRole) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role } : m))
    );
  };

  const handleToggleMemberPaid = (memberId: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, paid: !m.paid } : m))
    );
  };

  // Expenses actions
  const handleAddExpense = (expense: Omit<ExpenseItem, 'id'>) => {
    const created: ExpenseItem = {
      ...expense,
      id: 'exp_' + Date.now()
    };
    setExpenses((prev) => [...prev, created]);
  };

  const handleRemoveExpense = (expenseId: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
  };

  // Checklist actions
  const handleToggleSpiceInOffice = (id: string) => {
    setSpices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, inOffice: !s.inOffice } : s))
    );
  };

  const handleToggleSupplyChecked = (id: string) => {
    setSupplies((prev) =>
      prev.map((s) => (s.id === id ? { ...s, checked: !s.checked } : s))
    );
  };

  const handleAddSupplyItem = (name: string, category: string) => {
    setSupplies((prev) => [
      ...prev,
      { id: 'sup_' + Date.now(), name, category, checked: false }
    ]);
  };

  const handleRemoveSupplyItem = (id: string) => {
    setSupplies((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdateMotherAccount = (account: EventConfig['motherAccount']) => {
    setEventConfig((prev) => ({ ...prev, motherAccount: account }));
  };

  const handleQuickCopyInvite = () => {
    const quickText = `🍳 سلام همکاران عزیز! برای صبحانه گرم روز ${eventConfig.eventDate} در ${selectedVenue.title} موافقید؟
۱. پایه هستم (تایید حضور) ✅
۲. این بار نیستم ❌
۳. فقط چای و نان پنیر می‌خورم (دنگ کمتر) 🧀`;
    navigator.clipboard.writeText(quickText);
    setCopiedQuickInvite(true);
    setTimeout(() => setCopiedQuickInvite(false), 2000);
  };

  // Steps flow
  const tabOrder = ['venues', 'poll', 'dong', 'rules', 'checklist', 'messages'];
  const currentStepIndex = tabOrder.indexOf(activeTab);

  const goToNextTab = () => {
    if (currentStepIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentStepIndex + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevTab = () => {
    if (currentStepIndex > 0) {
      setActiveTab(tabOrder[currentStepIndex - 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-between selection:bg-amber-100 selection:text-amber-900">
      
      {/* 1. Header (Top Bar Contract) */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        eventDate={eventConfig.eventDate}
        totalAttendees={calculatedDong.totalActiveAttendees}
        totalCost={calculatedDong.totalCost}
        dongFull={calculatedDong.dongFullPerson}
        onQuickCopyInvite={handleQuickCopyInvite}
        copiedInvite={copiedQuickInvite}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 flex-1">
        
        {/* Editorial Headline & Progress Hero (Anti-slop: clean typography, no pill sandwich, single elevation) */}
        <section className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
                <span>دستورالعمل اجرایی ۱۰۰٪</span>
                <span aria-hidden="true">·</span>
                <span>صبحانه گرم دورهمی شرکت</span>
                <span aria-hidden="true">·</span>
                <span>نسخه تیمی و شفاف</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight leading-tight">
                {eventConfig.eventTitle}
              </h1>

              <p className="text-sm text-neutral-600 leading-relaxed">
                نقشه راه ۵ مرحله‌ای برای انتقال برنامه صبحانه از «حالت تئوری» به «مرحله اجرای ۱۰۰ درصدی»: انتخاب بهترین فضا در محیط کار، تست تمایل با نظرسنجی ۳ گزینه‌ای، مدیریت سهم دنگ تا تک‌تومان با مادرخرج، و ۳ قانون طلایی برای جلوگیری از معذب شدن و بی‌نظمی.
              </p>

              {/* Quiet Metadata List */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-1 text-xs text-neutral-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span>زمان: <strong>{eventConfig.eventDate}</strong> ({eventConfig.eventTime})</span>
                </div>
                <span aria-hidden="true" className="text-neutral-300">·</span>
                <div>
                  مکان: <strong className="text-neutral-900">{selectedVenue.title}</strong>
                </div>
                <span aria-hidden="true" className="text-neutral-300">·</span>
                <div>
                  مادرخرج: <strong className="text-neutral-900">{eventConfig.motherAccount.holderName}</strong>
                </div>
              </div>
            </div>

            {/* Quick Summary Pill-Free Box */}
            <div className="p-5 rounded-xl bg-neutral-900 text-white w-full lg:w-72 shrink-0 space-y-4">
              <div className="text-xs text-neutral-400 font-medium flex items-center justify-between">
                <span>پیشرفت اجرای رویداد</span>
                <span className="font-bold text-amber-400">مرحله {toPersianDigits(currentStepIndex + 1)} از ۶</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-400">حاضرین قطعی:</span>
                  <span className="font-bold tabular-nums text-white">
                    {toPersianDigits(calculatedDong.totalActiveAttendees)} نفر
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">سهم املت‌خوران:</span>
                  <span className="font-bold tabular-nums text-amber-300">
                    {formatToman(calculatedDong.dongFullPerson)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">سهم چای و پنیر:</span>
                  <span className="font-bold tabular-nums text-neutral-200">
                    {formatToman(calculatedDong.dongLightPerson)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">وضعیت واریزی‌ها:</span>
                  <span className="font-bold tabular-nums text-emerald-400">
                    {toPersianDigits(calculatedDong.settlementPercentage)}% تسویه
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowConfigModal(true)}
                className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>تنظیم تاریخ و مشخصات برنامه</span>
              </button>
            </div>
          </div>

          {/* Stepper Bar */}
          <div className="mt-8 pt-6 border-t border-neutral-100">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {[
                { id: 'venues', label: '۱. مکان رویداد' },
                { id: 'poll', label: '۲. تست تمایل' },
                { id: 'dong', label: '۳. حساب دنگ' },
                { id: 'rules', label: '۴. قوانین طلایی' },
                { id: 'checklist', label: '۵. احتیاط‌ها' },
                { id: 'messages', label: '۶. پیام‌ساز' },
              ].map((step, idx) => {
                const isCurrent = activeTab === step.id;
                const isPassed = idx < currentStepIndex;
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveTab(step.id)}
                    className={`p-2.5 rounded-lg text-right text-xs transition-colors cursor-pointer border ${
                      isCurrent
                        ? 'border-neutral-900 bg-neutral-900 text-white font-bold'
                        : isPassed
                        ? 'border-neutral-200 bg-emerald-50/60 text-emerald-900 hover:bg-emerald-100/50'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-2xs opacity-80">قدم {toPersianDigits(idx + 1)}</span>
                      {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <div className="truncate font-medium">{step.label}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Tab Content Display */}
        <section>
          {activeTab === 'venues' && (
            <VenueSection
              venues={venues}
              selectedVenueId={selectedVenueId}
              onSelectVenue={setSelectedVenueId}
              onContinue={goToNextTab}
            />
          )}

          {activeTab === 'poll' && (
            <PollSection
              members={members}
              onUpdateMemberAttendance={handleUpdateMemberAttendance}
              onAddMember={handleAddMember}
              onRemoveMember={handleRemoveMember}
              onUpdateDietary={() => {}}
              eventDate={eventConfig.eventDate}
              onContinue={goToNextTab}
            />
          )}

          {activeTab === 'dong' && (
            <DongManagerSection
              members={members}
              expenses={expenses}
              eventConfig={eventConfig}
              calculatedDong={calculatedDong}
              onAddExpense={handleAddExpense}
              onRemoveExpense={handleRemoveExpense}
              onToggleMemberPaid={handleToggleMemberPaid}
              onUpdateMotherAccount={handleUpdateMotherAccount}
              onContinue={goToNextTab}
            />
          )}

          {activeTab === 'rules' && (
            <GoldenRulesSection
              members={members}
              eventConfig={eventConfig}
              onUpdateMemberRole={handleUpdateMemberRole}
              onContinue={goToNextTab}
            />
          )}

          {activeTab === 'checklist' && (
            <ChecklistSection
              spices={spices}
              supplies={supplies}
              members={members}
              onToggleSpiceInOffice={handleToggleSpiceInOffice}
              onToggleSupplyChecked={handleToggleSupplyChecked}
              onAddSupplyItem={handleAddSupplyItem}
              onRemoveSupplyItem={handleRemoveSupplyItem}
              onContinue={goToNextTab}
            />
          )}

          {activeTab === 'messages' && (
            <MessageGeneratorSection
              eventConfig={eventConfig}
              selectedVenue={selectedVenue}
              members={members}
              expenses={expenses}
              calculatedDong={calculatedDong}
            />
          )}
        </section>

        {/* Step Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
          <button
            type="button"
            onClick={goToPrevTab}
            disabled={currentStepIndex === 0}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              currentStepIndex === 0
                ? 'opacity-40 cursor-not-allowed text-neutral-400 bg-neutral-100'
                : 'text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 cursor-pointer'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
            <span>مرحله قبلی</span>
          </button>

          <span className="text-xs text-neutral-400 hidden sm:inline">
            استفاده از کیبورد یا دکمه‌ها برای مرور سریع مراحل نقشه راه
          </span>

          <button
            type="button"
            onClick={goToNextTab}
            disabled={currentStepIndex === tabOrder.length - 1}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              currentStepIndex === tabOrder.length - 1
                ? 'opacity-40 cursor-not-allowed text-neutral-400 bg-neutral-100'
                : 'text-white bg-neutral-900 hover:bg-neutral-800 cursor-pointer shadow-xs'
            }`}
          >
            <span>مرحله بعدی</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-neutral-200 bg-white py-6 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900">دانگ‌چاشت</span>
            <span aria-hidden="true">·</span>
            <span>سامانه اجرای ۱۰۰٪ صبحانه دورهمی شرکت</span>
            <span aria-hidden="true">·</span>
            <span>طراحی شده بر اساس فرهنگ سازمان‌های خلاق</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleResetDefaults}
              className="flex items-center gap-1 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
              title="بارگذاری مجدد داده‌های پیش‌فرض"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>بازنشانی به داده‌های نمونه</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Event Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-neutral-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-sm text-neutral-900">
                تنظیمات کلی رویداد صبحانه شرکت
              </h3>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">عنوان رویداد:</label>
                <input
                  type="text"
                  value={eventConfig.eventTitle}
                  onChange={(e) => setEventConfig({ ...eventConfig, eventTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">تاریخ برگزاری:</label>
                  <input
                    type="text"
                    value={eventConfig.eventDate}
                    onChange={(e) => setEventConfig({ ...eventConfig, eventDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">ساعت برگزاری:</label>
                  <input
                    type="text"
                    value={eventConfig.eventTime}
                    onChange={(e) => setEventConfig({ ...eventConfig, eventTime: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">مهلت واریز دنگ (ددلاین):</label>
                <input
                  type="text"
                  value={eventConfig.paymentDeadlineHours}
                  onChange={(e) => setEventConfig({ ...eventConfig, paymentDeadlineHours: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg cursor-pointer"
              >
                تایید و بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
