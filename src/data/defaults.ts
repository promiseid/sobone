import { VenueOption, Member, ExpenseItem, SpiceItem, SupplyItem, EventConfig } from '../types';

export const DEFAULT_VENUES: VenueOption[] = [
  {
    id: 'prayer_hall',
    title: 'نمازخانه یا سالن اجتماعات',
    subtitle: 'سفره بزرگ، جمعی و صمیمی‌ترین تجربه دورهمی',
    vibe: 'صمیمی و گرم (سفره‌نشین)',
    capacity: 'تا ۳۰ نفر',
    pros: [
      'امکان پهن کردن سفره بلند و دور هم نشستن تمام اعضای تیم',
      'صمیمیت بالا و شکستن یخ بین اعضای تیم و واحدها',
      'عدم محدودیت صندلی و فضای باز و راحت'
    ],
    cons: [
      'نیاز به جمع‌آوری و تمیزکاری کامل قبل از اذان ظهر',
      'لزوم احتیاط در نریختن خرده نان و لکه چای روی فرش‌ها'
    ],
    setupTips: 'استفاده از ۲ لایه سفره یکبار مصرف ضخیم و گذاشتن دستمال کاغذی در هر ۱ متر از سفره.',
    recommendedFor: 'تیم‌های پرجمعیت و علاقه‌مند به فضای صمیمی و سنتی'
  },
  {
    id: 'conference_room',
    title: 'اتاق کنفرانس (در ساعات غیرجلسه)',
    subtitle: 'شیک، کاری و مرتب با میز بزرگ کنفرانس',
    vibe: 'کاری، مرتب و شیک',
    capacity: '۱۲ تا ۲۰ نفر',
    pros: [
      'میز بزرگ کنفرانس و صندلی‌های ارگونومیک اداری',
      'امکان پخش موسیقی ملایم صبحگاهی از تلویزیون یا اسپیکر اتاق',
      'حفظ پرستیژ کاری در حین گفتگوهای غیررسمی'
    ],
    cons: [
      'باید حتماً از قبل با تقویم جلسات شرکت رزرو و هماهنگ شود',
      'حساسیت بالای میز به روغن املت یا لکه‌های گرما'
    ],
    setupTips: 'پهن کردن رومیزی شکیل یا سفره سفارشی و تخلیه سریع ظروف و تهویه اتاق پس از پایان صبحانه.',
    recommendedFor: 'صبحانه‌های کاری، جلسات شروع فصل، و شرکت‌های با دکور مدرن'
  },
  {
    id: 'pantry_dining',
    title: 'آبدارخانه یا سالن غذاخوری',
    subtitle: 'استاندارد، دم‌دست با امکان چیدمان میز ایستاده (پارتی صبحانه)',
    vibe: 'پویا، پرانرژی و سرپایی',
    capacity: '۸ تا ۱۵ نفر (یا ۲۰ نفر به صورت ایستاده)',
    pros: [
      'نزدیکی به گاز، سینک ظرفشویی، کتری برقی و چای‌ساز',
      'عدم نگرانی از بوی غذا یا ریختن لکه در بخش‌های اصلی شرکت',
      'امکان سرو ایستاده (Breakfast Buffet Party) برای تعامل بیشتر'
    ],
    cons: [
      'ممکن است فضا در صورت نشستن همه افراد کمی فشرده شود',
      'تداخل با رفت‌وآمدهای عادی پرسنل برای آبجوش'
    ],
    setupTips: 'چیدن املت و نان‌ها در وسط به صورت بوفه سلف‌سرویس و چیدن بشقاب‌ها در ابتدا.',
    recommendedFor: 'دفاتر با فضای محدود یا تیم‌هایی که صبحانه سریع و پرانرژی می‌خواهند'
  }
];

export const DEFAULT_MEMBERS: Member[] = [
  {
    id: 'm1',
    name: 'نوید بذربخش',
    department: 'فنی و توسعه نرم‌افزار',
    attendance: 'full',
    dietary: { hasEggAllergy: false, hasLactoseIntolerance: false, isVegetarian: false, hasGlutenSensitivity: false },
    role: 'chef',
    paid: true,
    paidAmount: 85000
  },
  {
    id: 'm2',
    name: 'سارا رضایی',
    department: 'طراحی محصول (Product UI/UX)',
    attendance: 'full',
    dietary: { hasEggAllergy: false, hasLactoseIntolerance: false, isVegetarian: false, hasGlutenSensitivity: false },
    role: 'groceries',
    paid: true,
    paidAmount: 85000
  },
  {
    id: 'm3',
    name: 'علی محمدی',
    department: 'مارکتینگ و محتوا',
    attendance: 'full',
    dietary: { hasEggAllergy: false, hasLactoseIntolerance: true, isVegetarian: false, hasGlutenSensitivity: false, customNote: 'حساس به لبنیات / بدون پنیر' },
    role: 'bread',
    paid: true,
    paidAmount: 85000
  },
  {
    id: 'm4',
    name: 'مریم احمدی',
    department: 'منابع انسانی (HR)',
    attendance: 'light',
    dietary: { hasEggAllergy: true, hasLactoseIntolerance: false, isVegetarian: true, hasGlutenSensitivity: false, customNote: 'حساسیت به تخم‌مرغ / گردو و میوه میل دارد' },
    role: 'tea',
    paid: true,
    paidAmount: 38000
  },
  {
    id: 'm5',
    name: 'رضا کریمی',
    department: 'فروش و توسعه بازار',
    attendance: 'full',
    dietary: { hasEggAllergy: false, hasLactoseIntolerance: false, isVegetarian: false, hasGlutenSensitivity: false },
    role: 'cleaning',
    paid: false
  },
  {
    id: 'm6',
    name: 'مهسا بهرامی',
    department: 'پشتیبانی مشتریان',
    attendance: 'light',
    dietary: { hasEggAllergy: false, hasLactoseIntolerance: false, isVegetarian: false, hasGlutenSensitivity: false },
    role: 'cleaning',
    paid: false
  },
  {
    id: 'm7',
    name: 'پویا شمس',
    department: 'عملیات و زیرساخت',
    attendance: 'full',
    dietary: { hasEggAllergy: false, hasLactoseIntolerance: false, isVegetarian: false, hasGlutenSensitivity: false },
    role: 'chef',
    paid: false
  },
  {
    id: 'm8',
    name: 'فرناز حسینی',
    department: 'مالی و اداری',
    attendance: 'absent',
    dietary: { hasEggAllergy: false, hasLactoseIntolerance: false, isVegetarian: false, hasGlutenSensitivity: false },
    role: 'none',
    paid: false
  }
];

export const DEFAULT_EXPENSES: ExpenseItem[] = [
  {
    id: 'exp1',
    title: 'خرید تخم‌مرغ محلی و گوجه فرنگی رسی درجه یک',
    category: 'main',
    amount: 280000,
    paidBy: 'سارا رضایی',
    date: 'امروز ۰۷:۱۵',
    appliesTo: 'full_only',
    receiptNote: 'فاکتور میوه‌فروشی و سوپرمارکت محله - گوجه رنده شده و تخم‌مرغ',
    hasReceipt: true
  },
  {
    id: 'exp2',
    title: 'نان بربری تازه کنجدی داغ (۶ قرص)',
    category: 'bread',
    amount: 90000,
    paidBy: 'علی محمدی',
    date: 'امروز ۰۷:۴۵',
    appliesTo: 'all',
    receiptNote: 'نانوایی بربری سنتی نبش کوچه شرکت',
    hasReceipt: true
  },
  {
    id: 'exp3',
    title: 'پنیر سنتی لیقوان، مغز گردوی تازه و خیار و گوجه فرنگی',
    category: 'dairy',
    amount: 210000,
    paidBy: 'سارا رضایی',
    date: 'امروز ۰۷:۲۰',
    appliesTo: 'all',
    receiptNote: 'پنیر درجه یک و گردو برای نان پنیر و صبحانه کامل',
    hasReceipt: true
  },
  {
    id: 'exp4',
    title: 'ادویه‌جات، روغن و چای تازه‌دم معطر',
    category: 'spices',
    amount: 60000,
    paidBy: 'نوید بذربخش',
    date: 'دیروز ۱۷:۰۰',
    appliesTo: 'all',
    receiptNote: 'زردچوبه اعلا، فلفل سیاه و چای ارل‌گری',
    hasReceipt: true
  },
  {
    id: 'exp5',
    title: 'سفره ضخیم، دستمال کاغذی و لیوان کاغذی',
    category: 'disposables',
    amount: 45000,
    paidBy: 'نوید بذربخش',
    date: 'دیروز ۱۷:۳۰',
    appliesTo: 'all',
    receiptNote: 'پلاسکو شرکت',
    hasReceipt: true
  }
];

export const DEFAULT_SPICES: SpiceItem[] = [
  { id: 'sp1', name: 'نمک طعام', inOffice: true, statusNote: 'در کابینت آبدارخانه موجود است' },
  { id: 'sp2', name: 'فلفل سیاه تازه سابیده‌شده', inOffice: true, statusNote: 'موجود در جای ادویه' },
  { id: 'sp3', name: 'زردچوبه اعلا (عطر املت)', inOffice: false, statusNote: 'تمام شده؛ باید در لیست خرید باشد' },
  { id: 'sp4', name: 'روغن سرخ‌کردنی یا کره حیوانی', inOffice: true, statusNote: '۱ بطری در یخچال هست' },
  { id: 'sp5', name: 'پودر سیر یا آویشن کوهی (اختیاری)', inOffice: false, statusNote: 'خرید از جیب مادرخرج برای طعم حرفه‌ای' }
];

export const DEFAULT_SUPPLIES: SupplyItem[] = [
  { id: 'sup1', name: 'سفره یکبار مصرف مقاوم و ضخیم', category: 'لوازم پذیرایی', checked: true, assignedTo: 'نوید' },
  { id: 'sup2', name: 'دستمال کاغذی سفره و دستمال توالت اضافه', category: 'بهداشتی', checked: true, assignedTo: 'مریم' },
  { id: 'sup3', name: 'مایع ظرفشویی و اسکاچ نو برای شستشو', category: 'نظافت', checked: true, assignedTo: 'رضا' },
  { id: 'sup4', name: 'کیسه زباله ضخیم جهت جمع‌آوری سریع سفره', category: 'نظافت', checked: false, assignedTo: 'مهسا' },
  { id: 'sup5', name: 'قند، نبات و چای سیاه برای همراهی', category: 'خوراکی', checked: true, assignedTo: 'مریم' },
  { id: 'sup6', name: 'چاقوی تیز و تخته برش گوجه‌فرنگی', category: 'آشپزی', checked: true, assignedTo: 'پویا' }
];

export const DEFAULT_EVENT_CONFIG: EventConfig = {
  eventTitle: 'صبحانه گرم دورهمی تیمی شرکت (املت آتشین)',
  eventDate: 'چهارشنبه ۲۲ مهرماه',
  eventTime: '۰۸:۳۰ صبح تا ۰۹:۳۰',
  selectedVenueId: 'prayer_hall',
  paymentDeadlineHours: 'تا پایان ساعت کاری امروز (ساعت ۱۷:۰۰)',
  cancellationHoursLimit: 24,
  motherAccount: {
    holderName: 'سارا رضایی',
    bankName: 'بانک پاسارگاد',
    cardNumber: '5022-2910-4482-1234',
    iban: 'IR820570029180004482123401'
  }
};
