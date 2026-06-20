import { createElement } from "react";
import type { ReactNode } from "react";
import angiography from "../assets/images/Angiography.png";
import appointment from "../assets/images/Appointment.png";
import consultationScene from "../assets/images/Consultation Scene.png";
import doctor from "../assets/images/Doctor.png";
import ecg from "../assets/images/ECGMonitor Room.png";
import anatomy from "../assets/images/HeartAnatomy Visual.png";
import dashboard from "../assets/images/HeartTechnology  Dashboard.png";
import hero from "../assets/images/hero.png";
import patientTrust from "../assets/images/PatientTrust.png";
import procedure from "../assets/images/Procedure Success.png";
import reception from "../assets/images/Clinic Reception.png";
import seminar from "../assets/images/Medical Seminar.png";
import {
  CalendarIcon,
  HeartIcon,
  LabIcon,
  PhoneIcon,
  PulseIcon,
  ShieldIcon,
} from "../components/icons";

export const site = {
  brand: "داکتر محب الله احمدزی",

  brand_en: "Dr. Mohibullah Ahmadzai",

  brandSubline: "متخصص داخله قلب (آنژیوگرافی و آنژیوپلاستی)",

  brandSubline_en:
    "Cardiologist & Interventional Cardiology Specialist",

  tagline: "مراقبت از قلب",

  heroTitle: "مراقبت تخصصی قلب با تجربه، دقت و تکنولوژی روز",

  heroCopy:
    "ارائه خدمات تخصصی تشخیص و درمان بیماری‌های قلبی با بیش از هشت سال تجربه در بخش‌های مداخلوی و غیرمداخلوی قلب.",

  primaryCta: "گرفتن وقت ملاقات",

  secondaryCta: "ارتباط از طریق واتسپ",

  mission:
    "هدف ما ارائه خدمات تخصصی قلب مبتنی بر دانش روز، دقت علمی و ارتباط انسانی برای ایجاد آرامش و اعتماد در مسیر درمان بیماران است.",

  experienceYears: 8,

  schedule:
    "سه‌شنبه و پنج‌شنبه: ۸:۳۰ صبح تا ۴:۳۰ عصر (FMIC) | همه روزه: ۴:۳۰ عصر تا ۸:۳۰ شام (کلینیک ابهر)",

  footerCopy:
    "ارائه خدمات تخصصی قلب، آنژیوگرافی و آنژیوپلاستی با تمرکز بر کیفیت، دقت و سلامت بیماران.",

  quickLinks: [
    { label: "درباره داکتر", href: "#about" },
    { label: "خدمات", href: "#services" },
    { label: "تکنولوژی", href: "#technology" },
    { label: "سوالات", href: "#faq" },
    { label: "مقالات", href: "#articles" },
    { label: "وقت", href: "#appointment" },
    { label: "تماس", href: "#contact" },
  ],
};

export const heroGallery = {
  hero,
  doctor,
  lab: angiography,
  dashboard,
  consultation: consultationScene,
  ecg,
  anatomy,
  procedure,
  appointment,
  reception,
  patientTrust,
  seminar,
};

export const aboutHighlights = [
  {
    title: "تحصیلات",
    text:
      "فارغ‌التحصیل دانشگاه شیخ زاید و تکمیل تخصص داخله قلب در FMIC و دانشگاه آغاخان پاکستان.",
  },
  {
    title: "تجربه",
    text:
      "بیش از هشت سال تجربه در بخش‌های مداخلوی و غیرمداخلوی قلب.",
  },
  {
    title: "فعالیت علمی",
    text:
      "انتشار مقالات علمی بین‌المللی و حضور در کنفرانس‌های داخلی و خارجی قلب.",
  },
];

type IconItem = { icon: ReactNode; title: string; text: string };

export const services: IconItem[] = [
  {
    icon: createElement(LabIcon),
    title: "آنژیوگرافی",
    text: "بررسی دقیق عروق قلب برای تشخیص انسداد و بیماری‌های عروقی.",
  },
  {
    icon: createElement(HeartIcon),
    title: "آنژیوپلاستی",
    text: "باز کردن عروق مسدود شده قلب با روش‌های مداخلوی پیشرفته.",
  },
  {
    icon: createElement(CalendarIcon),
    title: "مشاوره قلب",
    text: "تشخیص، درمان و پیگیری بیماری‌های قلبی به صورت تخصصی.",
  },
  {
    icon: createElement(PulseIcon),
    title: "اکوکاردیوگرافی",
    text: "ارزیابی عملکرد عضلات و دریچه‌های قلب با استفاده از امواج صوتی.",
  },
  {
    icon: createElement(ShieldIcon),
    title: "تست ورزش",
    text: "ارزیابی عملکرد قلب هنگام فعالیت بدنی کنترل‌شده.",
  },
  {
    icon: createElement(PhoneIcon),
    title: "هولتر قلب و فشار خون",
    text: "ثبت و بررسی ریتم قلب و فشار خون در طول شبانه‌روز.",
  },
];

export const technologyHighlights = [
  {
    title: "Angiography Precision Lab",
    text: "تصویربرداری دقیق عروق قلب برای تشخیص سریع و تصمیم‌گیری درمانی مطمئن.",
  },
  {
    title: "Comprehensive Cardiac Evaluation",
    text: "ترکیب اکوکاردیوگرافی، تست ورزش، هولتر و معاینات تخصصی قلب.",
  },
  {
    title: "Continuous Patient Follow-up",
    text: "پیگیری مداوم وضعیت بیمار و تنظیم برنامه درمانی.",
  },
];

export const stats = [
  {
    value: 8,
    suffix: "+",
    label: "سال تجربه",
    note: "در بخش قلب و عروق",
  },
  {
    value: 2013,
    label: "سال فراغت",
    note: "دانشگاه شیخ زاید",
  },
  {
    value: 2018,
    label: "دیپلوم تخصص قلب",
    note: "وزارت صحت عامه و FMIC",
  },
  {
    value: 2026,
    label: "استاد تریننگ",
    note: "وزارت صحت عامه افغانستان",
  },
];

export const qualifications = [
  {
    year: "2013",
    title: "دکتور طب (MD)",
    text: "فارغ‌التحصیل از دانشگاه شیخ زاید افغانستان.",
  },
  {
    year: "2015",
    title: "تجربه داخله عمومی",
    text: "دو سال فعالیت و کسب تجربه در بخش طب داخلی.",
  },
  {
    year: "2017",
    title: "فیلوشیپ قلب مداخلوی",
    text: "تکمیل Training Academy for Cardiovascular Interventions در هند.",
  },
  {
    year: "2018",
    title: "دیپلوم متخصص قلب",
    text: "اخذ دیپلوم تخصصی از وزارت صحت عامه، FMIC و دانشگاه آغاخان.",
  },
  {
    year: "2021",
    title: "تقدیرنامه شورای ملی افغانستان",
    text: "دریافت تقدیرنامه به پاس خدمات شایسته در بخش قلب.",
  },
  {
    year: "2026",
    title: "استاد تریننگ تخصص قلب",
    text: "انتصاب از طرف وزارت صحت عامه افغانستان.",
  },
];

export const achievements = [
  "چاپ مقالات پژوهشی در ژورنال‌های بین‌المللی",
  "اشتراک در کنفرانس‌های داخلی و خارجی قلب",
  "دریافت تقدیرنامه شورای ملی افغانستان در سال 2021",
  "استاد تریننگ تخصص قلب در سال 2026",
  "تکمیل فیلوشیپ قلب مداخلوی در هند",
];

export const faqs = [
  {
    question: "آیا قبل از مراجعه باید ناشتا باشیم؟",
    answer:
      "بسته به نوع معاینه یا آزمایش، ممکن است نیاز به ناشتا بودن باشد.",
  },
  {
    question: "جواب تست‌ها چه مدت زمان می‌برد؟",
    answer:
      "مدت زمان آماده شدن جواب بسته به نوع تست متفاوت است.",
  },
  {
    question: "آنژیوگرافی دردناک است؟",
    answer:
      "خیر، این پروسیجر معمولاً با حداقل ناراحتی انجام می‌شود.",
  },
  {
    question: "چه مدارکی همراه داشته باشیم؟",
    answer:
      "نتایج آزمایش‌ها، نوار قلب، اکو و لیست داروهای مصرفی را همراه داشته باشید.",
  },
];

export const testimonials = [];

export const appointmentOptions = [
  {
    icon: CalendarIcon,
    title: "معاینه حضوری",
    text: "بررسی تخصصی علائم، معاینه و طراحی برنامه درمانی.",
  },
  {
    icon: LabIcon,
    title: "خدمات تشخیصی قلب",
    text: "آنژیوگرافی، اکوکاردیوگرافی، تست ورزش و هولتر.",
  },
  {
    icon: PhoneIcon,
    title: "پیگیری درمان",
    text: "پیگیری وضعیت بیمار و تنظیم برنامه درمانی.",
  },
];

export const contact = {
  phoneDisplay: "+93 79 776 6778",
  phoneLink: "+93797766778",
  whatsAppUrl: "https://wa.me/93797766778",
  address: "FMIC کارته سخی و کلینیک ابهر، کابل، افغانستان",
  socials: [
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
  ],
};
// site-data.ts

export const staticSite = {
  brand: "دکتر محب الله احمدزی",
  brandSubline: "فوق تخصص قلب و عروق - اینترونشنال کاردیولوژیست",
  tagline: "مراقبت تخصصی و مدرن از سلامت قلب شما",
  heroTitle: "مراقبت از قلب، تضمین زندگی سالم",
  heroCopy: "کلینیک فوق تخصصی قلب و عروق ابهر با بهره‌گیری از دانش روز دنیا و تجهیزات پیشرفته، خدمات جامع تشخیصی و درمانی بیماری‌های قلبی را تحت نظارت دکتر محب الله احمدزی ارائه می‌دهد.",
  primaryCta: "دریافت نوبت ویزیت",
  secondaryCta: "مشاهده خدمات کلینیک",
  mission: "رسالت ما ارائه بالاترین سطح مراقبت‌های پزشکی قلب با استانداردهای جهانی و بازگرداندن لبخند سلامتی به بیماران است.",
  schedule: "شنبه تا پنج‌شنبه بر اساس برنامه زمان‌بندی کلینیک‌ها",
  footerCopy: "تمامی حقوق مادی و معنوی این وب‌سایت محفوظ است.",
  experienceYears: 8,
  quickLinks: [
    { label: "خانه", href: "#hero" },
    { label: "درباره پزشک", href: "#about" },
    { label: "خدمات تخصصی", href: "#services" },
    { label: "رزومه و مدارک", href: "#qualifications" },
    { label: "تماس با ما", href: "#contact" }
  ]
};

export const staticServices = [
  { icon_name: "heart", title: { fa: "آنژیوگرافی و آنژیوپلاستی" }, body: { fa: "انجام پروسیجرهای مداخلوی پیشرفته عروق کرونر جهت باز کردن رگ‌های مسدود قلب." } },
  { icon_name: "activity", title: { fa: "پیس میکر (باتری قلب)" }, body: { fa: "تعبیه، تنظیم و بررسی انواع باتری‌ها و هماهنگ‌کننده‌های ضربان قلب." } },
  { icon_name: "stethoscope", title: { fa: "ویزیت و مشاوره قلبی" }, body: { fa: "ویزیت تخصصی، نوار قلب (ECG) و مشاوره‌های قلبی پیش از جراحی‌های عمومی." } },
  { icon_name: "trending-up", title: { fa: "مدیریت فشار خون و دیابت" }, body: { fa: "کنترل و درمان تخصصی فشار خون بالا و عوارض قلبی ناشی از بیماری دیابت." } },
  { icon_name: "shield", title: { fa: "ایکوکاردیوگرافی جامع" }, body: { fa: "انجام ایکوکاردیوگرافی اطفال، بزرگسالان، استرس اکو و بررسی مادرزادی." } },
  { icon_name: "clock", title: { fa: "هولتر ریتم و فشار خون" }, body: { fa: "پایش ۲۴ تا ۴۸ ساعته ریتم قلب و نوسانات فشار خون جهت تشخیص دقیق." } },
  { icon_name: "award", title: { fa: "بررسی بیماران جراحی قلب" }, body: { fa: "پیگیری و معاینه تخصصی بیماران دارای سابقه تعویض دریچه یا جراحی قلب باز." } },
  { icon_name: "user", title: { fa: "مشاوره قلبی مادران باردار" }, body: { fa: "مراقبت‌ها و ارزیابی‌های پیشگیرانه سیستم قلبی-عروقی در دوران بارداری." } }
];

export const staticStats = [
  { value: "8+", suffix: "سال", label: { fa: "تجربه تخصصی" }, note: { fa: "در حوزه مداخلوی قلب" } },
  { value: "1000+", suffix: "پروسیجر", label: { fa: "آنژیوگرافی موفق" }, note: { fa: "بیمارستان FMIC و هند" } },
  { value: "100%", suffix: "تعهد", label: { fa: "مراقبت حرفه‌ای" }, note: { fa: "پایبند به سلامت بیمار" } }
];

export const staticAboutHighlights = [
  { title: { fa: "استاد ترینینگ وزارت صحت عامه" }, body: { fa: "انتخاب به عنوان استاد آموزش پزشکان متخصص قلب در سال ۲۰۲۶ پس از موفقیت در آزمون رقابتی." } },
  { title: { fa: "فلوشیپ بین‌المللی از هند" }, body: { fa: "گذراندن دوره فوق‌تخصصی فیلوشپ عملیات‌های مداخلوی در آکادمی حیدرآباد هند." } },
  { title: { fa: "پژوهشگر ژورنال‌های جهانی" }, body: { fa: "چاپ مقالات تحقیقی متعدد در ژورنال‌های معتبر بین‌المللی و سخنرانی در کنفرانس‌ها." } }
];

export const staticQualifications = [
  { year: "2006 - 2013", title: { fa: "درجه علمی MD" }, body: { fa: "ورود به دانشکده طب دانشگاه شیخ زاید و فارغ‌التحصیلی با رتبه عالی." } },
  { year: "2013 - 2015", title: { fa: "داخله عمومی" }, body: { fa: "کسب تجارب بالینی پایه در رشته امراض داخله عمومی." } },
  { year: "2015 - 2018", title: { fa: "تخصص داخله قلبی" }, body: { fa: "طی نمودن موفقانه پروگرام تخصصی در انستیتوت فرانسوی FMIC و دانشگاه آقاخان کراچی." } },
  { year: "2017 - 2018", title: { fa: "فیلوشیپ اینترونشنال کاردیولوژی" }, body: { fa: "کسب تخصص عملیات‌های مداخلوی قلب در Training Academy هند (حیدرآباد)." } }
];

export const staticAchievements = [
  { fa: "دریافت تقدیرنامه رسمی از سوی ریاست کمیسیون صحت و جوانان شورای ملی (پارلمان) در سال ۲۰۲۱" },
  { fa: "دارای دیپلوم مشترک تخصص قلب از وزارت صحت عامه، انستیتوت FMIC و دانشگاه آقاخان" },
  { fa: "انتصاب رسمی به حیث استاد ترینر برنامه‌های تخصصی قلب و عروق افغانستان در سال ۲۰۲۶" }
];

export const staticContact = {
  phoneDisplay: "0093797766778",
  phoneLink: "tel:0093797766778",
  whatsAppUrl: "https://wa.me/93797766778",
  address: {
    fa: "مرکز ۱: انستیتوت طبی فرانسه برای مادران و اطفال (FMIC)، کارته سخی، عقب پوهنتون طبی کابل | مرکز ۲: کلینیک ابهر، سرک ۸۰ متره میدان هوایی، بین چهارراهی لب جر خیرخانه و تانک تیل آریانا، کابل، افغانستان"
  }
};

export const staticFaqs = [
  { question: { fa: "ساعات کاری کلینیک‌ها به چه صورت است؟" }, answer: { fa: "روزهای سه‌شنبه و پنج‌شنبه از ساعت ۸:۳۰ صبح الی ۴:۳۰ عصر در شفاخانه فرانسوی (FMIC) و همه روزه از ساعت ۴:۳۰ عصر الی ۸:۳۰ شام در کلینیک ابهر آماده ویزیت بیماران هستیم." } },
  { question: { fa: "آیا برای انجام ایکوکاردیوگرافی یا تست ورزش باید ناشتا باشیم؟" }, answer: { fa: "به طور کلی برای اکو معمولی نیاز به ناشتا بودن نیست، اما برای استرس اکو یا تست‌های تشخیصی خاص، توصیه‌های لازم هنگام رزرو نوبت به شما اعلام خواهد شد." } }
];

export const staticHeroGallery = {
  hero: "/images/hero-cardiology.jpg",
  doctor: "/images/dr-mohibullah.jpg",
  patientTrust: "/images/patient-care.jpg",
  reception: "/images/abhar-clinic-reception.jpg",
  consultation: "/images/consultation-room.jpg",
  lab: "/images/cath-lab.jpg"
};