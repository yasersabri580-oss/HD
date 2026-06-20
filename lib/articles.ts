import type { StaticImageData } from "next/image";
import hero from "../assets/images/hero.png";
import consultation from "../assets/images/Consultation Scene.png";
import ecg from "../assets/images/ECGMonitor Room.png";
import lab from "../assets/images/Angiography.png";
import { supabase } from "./supabase";
import { pickLocalized, resolveLocale } from "./profile-fallback";

// ---------- Types ----------
export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingMinutes: number;
  publishedAt: string;
  cover: string | StaticImageData;
  content: string[];
  authorId?: string | number;
  authorSlug?: string;
};

/** Internal shape for static articles – mirrors the Supabase multilingual columns */
type LocalizedFields = {
  fa?: string;
  en?: string;
  ps?: string;
};

type LocalizedArticle = {
  slug: string;
  title: LocalizedFields;
  excerpt: LocalizedFields;
  category: LocalizedFields;
  readingMinutes: number;
  publishedAt: string;
  cover: string | StaticImageData;
  content: {
    fa?: string[];
    en?: string[];
    ps?: string[];
  };
  authorId?: string | number;
  authorSlug?: string;
  isFeatured?: boolean;
};
// ---------- Static multilingual articles ----------
const localizedArticles: LocalizedArticle[] = [
  // ... (your existing article "early-signs-of-chest-pain" stays here) ...

 {
  slug: "heart-health-foundation",
  isFeatured: true,
  title: {
    fa: "صحت قلب؛ بنیاد یک زندگی سالم",
    en: "Heart Health: Foundation of a Healthy Life",
    ps: "د زړه روغتیا؛ د سالم ژوند بنسټ",
  },
  excerpt: {
    fa: "بررسی علمی عوامل خطر، تغذیه، فعالیت جسمانی و راه‌های عملی وقایه از بیماری‌های قلبی.",
    en: "A scientific overview of risk factors, nutrition, physical activity and practical ways to prevent heart diseases.",
    ps: "د خطر فکتورونو، تغذیې، بدني فعالیت او د زړه ناروغیو مخنیوي عملي لارو علمي کتنه.",
  },
  category: {
    fa: "وقایه و سلامت قلب",
    en: "Prevention & Heart Health",
    ps: "مخنیوی او د زړه روغتیا",
  },
  readingMinutes: 12,
  publishedAt: "2025/10/15",
  cover: require("../assets/images/heart-health-foundation.jpg"),
  content: {
    fa: [
      "چکیده: صحت قلب یکی از اساسی‌ترین ارکان صحت انسان است. قلب به‌عنوان مرکز دستگاه دوران خون، وظیفه دارد خون، اکسیجن و مواد غذایی را به تمام اعضای بدن برساند. هرگونه اختلال در فعالیت این عضو حیاتی می‌تواند سلامت سایر اعضای بدن را نیز با خطر مواجه سازد. امراض قلبی و عروقی هنوز هم از مهم‌ترین عوامل مرگ‌ومیر در جهان به‌شمار می‌روند، اما تحقیقات علمی نشان می‌دهد که بخش بزرگی از این امراض از طریق وقایه، تشخیص به‌موقع و رعایت شیوهٔ سالم زندگی قابل جلوگیری است.",
      "مقدمه: قلب عضوی عضلانی و نیرومند است که بدون وقفه در تمام طول زندگی خون را در سراسر بدن به گردش درمی‌آورد. این عضو حیاتی در هر دقیقه چندین لیتر خون را پمپ می‌کند تا اکسیجن و مواد مغذی به تمام حجرات بدن برسد. از همین‌رو، حفظ صحت قلب نه‌تنها برای ادامهٔ زندگی، بلکه برای داشتن زندگی سالم، فعال و باکیفیت، اهمیت ویژه‌ای دارد. با پیشرفت علم طب، ثابت شده است که بسیاری از امراض قلبی نتیجهٔ مستقیم شیوهٔ زندگی انسان هستند و با انتخاب عادت‌های سالم می‌توان خطر ابتلا به این امراض را به‌گونهٔ چشمگیری کاهش داد.",
      "عوامل خطر امراض قلبی: عوامل خطر به دو دسته تقسیم می‌شوند. عوامل غیرقابل تغییر: افزایش سن، سابقهٔ خانوادگی امراض قلبی، جنسیت (خطر برخی از امراض قلبی در مردان بیشتر است و در زنان پس از یائسگی افزایش می‌یابد). عوامل قابل تغییر: بلند بودن فشار خون، بلند بودن کلسترول و تری‌گلیسرید، مرض شکر (دیابت)، استعمال دخانیات، چاقی و اضافه‌وزن، کم‌تحرکی، تغذیهٔ ناسالم، استرس یا فشارهای روانی دوامدار، مصرف بیش از حد نوشیدنی‌های الکولی.",
      "تغذیه و نقش آن در صحت قلب: تغذیهٔ سالم یکی از مهم‌ترین عوامل حفظ صحت قلب است. رژیم غذایی متوازن می‌تواند فشار خون، چربی خون و وزن بدن را در حد طبیعی نگه دارد. مواد غذایی مفید برای قلب عبارت‌اند از: میوه‌ها و سبزیجات تازه، غله‌جات کامل، حبوبات، ماهی به‌ویژه ماهی‌های دارای اسیدهای چرب امگا-۳، مغزها و دانه‌های خوراکی، روغن زیتون و سایر روغن‌های نباتی سالم. در مقابل، مصرف بیش از حد نمک، شکر، غذاهای آماده، غذاهای سرخ‌شده، چربی‌های اشباع و چربی‌های ترانس باید محدود گردد.",
      "فعالیت جسمانی: فعالیت جسمانی منظم یکی از مؤثرترین راه‌های حفظ صحت قلب است. متخصصان توصیه می‌کنند که هر فرد در هفته حداقل ۱۵۰ دقیقه فعالیت جسمانی با شدت متوسط، مانند پیاده‌روی سریع، دوچرخه‌سواری یا شنا انجام دهد. ورزش منظم سبب تقویت عضلهٔ قلب، کاهش فشار خون، تنظیم قند خون، کاهش چربی‌های مضر و افزایش توانایی دستگاه دوران خون می‌شود.",
      "کنترول فشار خون، قند و چربی خون: بلند بودن فشار خون، افزایش کلسترول و مرض شکر از مهم‌ترین عوامل ایجاد سکتهٔ قلبی و سکتهٔ مغزی هستند. انجام معاینات طبی به‌صورت منظم و پیروی از توصیه‌های داکتر، نقش مهمی در جلوگیری از عوارض این امراض دارد.",
      "تأثیر استرس بر صحت قلب: استرس دوامدار باعث افزایش ترشح هورمون‌هایی می‌شود که فشار خون و ضربان قلب را بالا می‌برند. اگر این وضعیت برای مدت طولانی ادامه یابد، احتمال ابتلا به امراض قلبی افزایش می‌یابد. استراحت کافی، خواب منظم، ورزش، عبادت، مراقبه و داشتن روابط اجتماعی سالم از بهترین راه‌های کاهش استرس و حفظ صحت قلب هستند.",
      "امراض شایع قلبی: مهم‌ترین امراض قلبی عبارت‌اند از: مرض عروق کرونری قلب، سکتهٔ قلبی، نارسایی قلب، بی‌نظمی ضربان قلب (آریتمی)، امراض دریچه‌های قلب، ضعف عضلهٔ قلب (کاردیومیوپاتی). تشخیص به‌موقع و آغاز درمان، احتمال موفقیت در کنترول این امراض را به میزان قابل توجهی افزایش می‌دهد.",
      "راه‌های وقایه از امراض قلبی: برای حفظ صحت قلب، رعایت نکات زیر ضروری است: ۱. خودداری از استعمال دخانیات. ۲. داشتن رژیم غذایی متوازن و سالم. ۳. انجام ورزش و فعالیت جسمانی به‌صورت منظم. ۴. حفظ وزن مناسب. ۵. کنترول فشار خون، قند و چربی خون. ۶. داشتن خواب کافی و منظم. ۷. کاهش استرس و فشارهای روانی. ۸. انجام معاینات طبی دوره‌ای.",
      "نکتهٔ مهم: وقایه از جوانی آغاز می‌شود. بسیاری از مردم تصور می‌کنند که مراقبت از قلب زمانی آغاز می‌شود که شخص به مرض قلبی مبتلا گردد؛ در حالی‌که این تصور نادرست است. مؤثرترین مرحلهٔ وقایه، دوران نوجوانی و جوانی است؛ زمانی که بنیان صحت آیندهٔ انسان گذاشته می‌شود. داشتن رژیم غذایی متوازن، ورزش منظم، حفظ وزن مناسب، خودداری از استعمال دخانیات و رعایت شیوهٔ سالم زندگی در سنین جوانی، تأثیر مستقیم بر صحت قلب در سال‌های بعد دارد. پژوهش‌های علمی نشان می‌دهد که بسیاری از امراض قلبی و عروقی، نتیجهٔ سال‌ها عادت‌های نادرست غذایی، کم‌تحرکی و شیوهٔ ناسالم زندگی هستند. به عبارت دیگر، بسیاری از امراضی که امروز با آن روبه‌رو هستیم، ریشه در عادت‌ها و طرز زندگی ما در دوران جوانی دارد. وقایهٔ واقعی زمانی آغاز می‌شود که انسان هنوز سالم است، نه زمانی که مرض ظاهر شده باشد. سرمایه‌گذاری بر صحت در جوانی، بهترین تضمین برای داشتن قلبی سالم، عمر طولانی‌تر و کیفیت بهتر زندگی در آینده است.",
      "نتیجه‌گیری: صحت قلب نتیجهٔ رعایت یک شیوهٔ سالم زندگی، تغذیهٔ مناسب، فعالیت جسمانی منظم، کنترول عوامل خطر و انجام معاینات طبی است. بیشتر امراض قلبی قابل وقایه‌اند، مشروط بر آن‌که انسان از سنین جوانی به صحت خود اهمیت بدهد. هر تصمیم سالمی که امروز گرفته می‌شود، آیندهٔ سالم‌تر و زندگی باکیفیت‌تری را برای فرد و جامعه رقم می‌زند.",
      "منابع پیشنهادی: "+
       "۱. سازمان جهانی صحت (WHO)."+
       "۲. انجمن قلب امریکا (American Heart Association)."+
       "۳. رهنمودهای انجمن قلب اروپا (European Society of Cardiology)."+
       "۴. Braunwald's Heart Disease: A Textbook of Cardiovascular Medicine.",
    ],
    en: [
      "Abstract: Heart health is one of the most fundamental pillars of human health. As the centre of the circulatory system, the heart’s function is to deliver blood, oxygen and nutrients to all organs of the body. Any disruption in the activity of this vital organ can endanger the health of other body parts as well. Cardiovascular diseases remain among the leading causes of death worldwide; however, scientific research shows that a large proportion of these diseases can be prevented through prevention, early diagnosis and adherence to a healthy lifestyle.",
      "Introduction: The heart is a powerful, muscular organ that pumps blood throughout the body without interruption for the entire duration of life. This vital organ pumps several litres of blood per minute to deliver oxygen and nutrients to all the body’s cells. Preserving heart health is therefore of special importance, not only for survival but also for living a healthy, active and high-quality life. With the advancement of medical science, it has been proven that many heart diseases are a direct result of human lifestyle, and by adopting healthy habits the risk of developing these diseases can be significantly reduced.",
      "Risk Factors for Heart Disease: Risk factors are divided into two categories. Non-modifiable factors: advancing age, family history of heart disease, sex (the risk of certain heart diseases is higher in men and increases in women after menopause). Modifiable factors: high blood pressure, high cholesterol and triglycerides, diabetes mellitus, tobacco use, obesity and overweight, physical inactivity, unhealthy diet, persistent stress or psychological pressure, excessive alcohol consumption.",
      "Nutrition and Its Role in Heart Health: Healthy nutrition is one of the most important factors in preserving heart health. A balanced diet can keep blood pressure, blood lipids and body weight within normal limits. Foods beneficial for the heart include: fresh fruits and vegetables, whole grains, legumes, fish especially those rich in omega-3 fatty acids, nuts and edible seeds, olive oil and other healthy vegetable oils. In contrast, excessive consumption of salt, sugar, processed foods, fried foods, saturated fats and trans fats should be limited.",
      "Physical Activity: Regular physical activity is one of the most effective ways to preserve heart health. Experts recommend that each person engage in at least 150 minutes of moderate-intensity physical activity per week, such as brisk walking, cycling or swimming. Regular exercise strengthens the heart muscle, lowers blood pressure, regulates blood sugar, reduces harmful lipids and enhances the capacity of the circulatory system.",
      "Controlling Blood Pressure, Blood Sugar and Blood Lipids: High blood pressure, elevated cholesterol and diabetes are among the most important risk factors for heart attack and stroke. Regular medical check-ups and following the doctor’s recommendations play an important role in preventing the complications of these conditions.",
      "The Impact of Stress on Heart Health: Persistent stress causes an increased secretion of hormones that raise blood pressure and heart rate. If this condition continues for a long time, the likelihood of developing heart disease increases. Adequate rest, regular sleep, exercise, prayer or worship, meditation and healthy social relationships are among the best ways to reduce stress and maintain heart health.",
      "Common Heart Diseases: The most important heart diseases include: coronary artery disease, heart attack (myocardial infarction), heart failure, cardiac arrhythmia (irregular heartbeat), heart valve diseases, cardiomyopathy (weakness of the heart muscle). Timely diagnosis and the initiation of treatment significantly increase the likelihood of successfully managing these conditions.",
      "Ways to Prevent Heart Disease: To preserve heart health, it is essential to observe the following points: 1. Refrain from all forms of tobacco use. 2. Maintain a balanced and healthy diet. 3. Engage in regular exercise and physical activity. 4. Maintain a healthy body weight. 5. Control blood pressure, blood sugar and blood lipids. 6. Get adequate and regular sleep. 7. Reduce stress and psychological pressure. 8. Undergo periodic medical check-ups.",
      "Important Note: Prevention Begins in Youth. Many people think that caring for the heart begins only when a person develops heart disease; however, this notion is incorrect. The most effective phase of prevention is adolescence and youth – the time when the foundation for a person’s future health is laid. Maintaining a balanced diet, regular exercise, a healthy weight, avoiding tobacco and adhering to a healthy lifestyle during youth have a direct impact on heart health in later years. Scientific research shows that many cardiovascular diseases are the result of years of poor dietary habits, physical inactivity and an unhealthy lifestyle. In other words, many of the diseases we face today are rooted in the habits and lifestyle of our youth. True prevention begins when a person is still healthy, not after the disease has appeared. Investing in health during youth is the best guarantee for a healthy heart, a longer life and a better quality of life in the future.",
      "Conclusion: Heart health is the result of following a healthy lifestyle, proper nutrition, regular physical activity, controlling risk factors and undergoing medical check-ups. Most heart diseases are preventable, provided that people take care of their health from a young age. Every healthy decision made today leads to a healthier future and a higher quality of life for the individual and for society.",
      "Suggested References: 1. World Health Organization (WHO). 2. American Heart Association (AHA). 3. European Society of Cardiology (ESC) Guidelines. 4. Braunwald's Heart Disease: A Textbook of Cardiovascular Medicine.",
    ],
    ps: [
      "لنډیز: د زړه روغتیا د انسان د روغتیا یو له بنسټیزو ستنو څخه ده. زړه د دوراني سیستم د مرکز په توګه وینه، اکسیجن او غذايي مواد ټولو غړو ته رسوي. د دې حیاتي غړي په فعالیت کې هر ډول ګډوډي د بدن نور غړي هم له خطر سره مخ کوي. د زړه او رګونو ناروغۍ لا هم په نړۍ کې د مړینې له مهمو لاملونو څخه دي، خو څېړنې ښيي چې ډېره برخه یې د مخنیوي، پر وخت تشخیص او سالم ژوند په واسطه د مخنیوي وړ ده.",
      "سریزه: زړه یو قوي عضلاني غړی دی چې د ټول ژوند په اوږدو کې پرته له درېده وینه پمپ کوي. دا په هره دقیقه کې څو لیتره وینه پمپ کوي ترڅو بدن ټولو حجرو ته اکسیجن او غذايي مواد ورسوي. د طب پرمختګ ثابته کړې چې د زړه ډېرې ناروغۍ د انسان د ژوند د ډول مستقیمه پایله دي او د سالم عادتونو غوره کولو سره یې خطر په پام وړ توګه کمېدای شي.",
      "د زړه ناروغیو د خطر فکتورونه: د خطر فکتورونه په دوو ډلو وېشل کېږي. د بدلون وړ نه: عمر، کورنۍ مخینه، جنسیت (د ځینو زړه ناروغیو خطر په نارینه وو کې ډېر دی او په ښځو کې له یائسګۍ وروسته زیاتېږي). د بدلون وړ: د وینې لوړ فشار، لوړ کولیسټرول او ټرای ګلیسریډ، د شکر ناروغي، سګرټ څکول، چاغښت او اضافه وزن، بې تحرکي، ناسالم خواړه، پرله‌پسې رواني فشار، د الکولي څښاک ډېر مصرف.",
      "تغذیه او د زړه روغتیا: متوازن رژیم د وینې فشار، د وینې شحم او وزن د نورمال ساتلو لپاره حیاتي دی. د زړه لپاره ګټور خواړه: تازه میوې او سبزۍ، ټول غلې، دالۍ، غوړ کب په ځانګړي توګه هغه چې اومیګا-۳ لري، مغزیات او تخمونه، د زیتون غوړي او نور سالم نباتي غوړي. په مقابل کې، مالګه، بوره، پروسس شوي خواړه، سرې کړي توکي، مشبوع غوړي او ټرانس غوړ باید محدود شي.",
      "فزیکي فعالیت: په اونۍ کې لږ تر لږه ۱۵۰ دقیقې متوسط شدت فعالیت (تند مزل، بایسکل چلول، لامبو) د زړه عضله پیاوړې کوي، فشار کموي، شکر او شحم تنظیموي او د دوراني سیستم وړتیا لوړوي.",
      "د وینې فشار، شکر او شحم کنټرول: لوړ فشار، لوړ کولیسټرول او شکر د زړه حملې او سټروک مهم لاملونه دي. منظم طبي معاینات او د ډاکټر سپارښتنو تعقیب د اختلاطاتو مخنیوي لپاره حیاتي دي.",
      "د فشار اغېزه پر زړه: مزمن فشار د هورمونونو له لارې د وینې فشار او د زړه ضربان لوړوي. کافي استراحت، منظم خوب، ورزش، عبادت، مراقبه او سالمې ټولنیزې اړیکې د فشار کمولو او د زړه ساتنې اغېزمنې لارې دي.",
      "د زړه عامې ناروغۍ: د زړه کرونري رګونو ناروغي، د زړه حمله، د زړه نیمګړتیا، د زړه نا منظمې ضربان، د زړه د دریچو ناروغۍ او د زړه د عضلې کمزوري (کاردیومیوپاتي). پر وخت تشخیص او درملنه د کنټرول چانس ډېروي.",
      "د زړه ناروغیو مخنیوي لارې: ۱. له سګرټ ډډه. ۲. متوازن او سالم خواړه. ۳. منظم ورزش او فزیکي فعالیت. ۴. د وزن ساتنه. ۵. د فشار/شکر/شحم کنټرول. ۶. کافي او منظم خوب. ۷. د رواني فشار کمول. ۸. منظم طبي معاینات.",
      "مهمه یادونه: مخنیوی له ځوانۍ پیلېږي. ډېر خلک فکر کوي چې د زړه ساتنه هغه وخت پیلېږي کله چې ناروغي پیدا شي، حال دا چې دا فکر ناسم دی. د مخنیوي تر ټولو اغېزمن پړاو نوې ځواني او ځواني ده. متوازن خواړه، منظم ورزش، د وزن ساتنه، له سګرټ ډډه او سالم ژوند په ځوانۍ کې په راتلونکو کلونو کې پر زړه مستقیمه اغېزه لري. څېړنې ښيي چې ډېرې د زړه ناروغۍ د کلونو ناسمو خوړو، بې تحرکۍ او ناسالم عادتونو پایله ده. په ځوانۍ کې پر روغتیا پانګونه د سالم زړه او اوږد ژوند غوره تضمین دی.",
      "پایلې: د زړه روغتیا د سالم ژوند، مناسبې تغذیې، منظم فعالیت، د خطر فکتورونو کنټرول او طبي معایناتو پایله ده. د زړه ډېرې ناروغۍ د مخنیوي وړ دي، که له ځوانۍ څخه خپلې روغتیا ته پام وکړو. هره ننۍ سالم پرېکړه د فرد او ټولنې لپاره روغ راتلونکی او لوړ کیفیت ژوند جوړوي.",
      "وړاندیز شوې سرچینې: ۱. د روغتیا نړیوال سازمان (WHO). ۲. د امریکا د زړه ټولنه (AHA). ۳. د اروپا د زړه ټولنې لارښوونې (ESC). ۴. براونوالډ د زړه ناروغي: د زړه د طب درسي کتاب.",
    ],
  },
}
  
];

// ---------- Resolver helper ----------
function resolveArticle(
  raw: LocalizedArticle,
  locale: string
): Article {
  const content = raw.content[locale as keyof typeof raw.content]?.length
    ? raw.content[locale as keyof typeof raw.content]!
    : raw.content["fa"] ?? raw.content["en"] ?? [];

  return {
    slug: raw.slug,
    title: pickLocalized(raw.title, locale) ?? "",
    excerpt: pickLocalized(raw.excerpt, locale) ?? "",
    category: pickLocalized(raw.category, locale) ?? "",
    readingMinutes: raw.readingMinutes,
    publishedAt: raw.publishedAt,
    cover: raw.cover,
    content,
    authorId: raw.authorId,
    authorSlug: raw.authorSlug,
  };
}

// ---------- Public functions (static only) ----------
export function getArticleBySlug(
  slug: string,
  locale = "fa"
): Article | undefined {
  const found = localizedArticles.find((a) => a.slug === slug);
  return found ? resolveArticle(found, locale) : undefined;
}

export function getRelatedArticles(
  slug: string,
  locale = "fa",
  limit = 2
): Article[] {
  return localizedArticles
    .filter((a) => a.slug !== slug)
    .slice(0, limit)
    .map((a) => resolveArticle(a, locale));
}

// get featured article only one by local
export function getFeaturedArticleByLocale(locale: string): Article | undefined {
  const found = localizedArticles.find((a) => a.isFeatured);
  return found ? resolveArticle(found, locale) : undefined;
}


// ---------- Helper functions ---------- get all articles by local pass
export function getAllArticlesByLocale(locale: string): Article[] {
  return localizedArticles.map((a) => resolveArticle(a, locale));
}

// ---------- Dynamic fetch helpers ----------
export async function fetchArticleBySlug(
  slug: string,
  localePref?: string
): Promise<Article | null> {
  const locale = resolveLocale(localePref);

  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .single();

    if (!error && data) {
      const title =
        pickLocalized(data, "title", locale) || data.title || "";
      const excerpt =
        pickLocalized(data, "excerpt", locale) || data.excerpt || "";

      let content: string[] = [];

      // Multilingual object: { en, fa, ps }
      if (
        data.content &&
        typeof data.content === "object" &&
        !Array.isArray(data.content)
      ) {
        const contentStr =
          data.content[locale] ||
          data.content["fa"] ||
          data.content["en"] ||
          "";
        content = contentStr
          .split("\n\n")
          .map((p: string) => p.trim())
          .filter(Boolean);
      }
      // Direct array (old format)
      else if (Array.isArray(data.content) && data.content.length > 0) {
        content = data.content;
      }
      // Plain string
      else if (typeof data.content === "string" && data.content.trim()) {
        content = [data.content];
      }

      return {
        slug: data.slug,
        title,
        excerpt,
        category:
          pickLocalized(data, "category", locale) || data.category || "",
        readingMinutes: data.reading_minutes || data.readingMinutes || 0,
        publishedAt: data.published_at || data.publishedAt || "",
        cover: data.cover_url || "",
        content,
        authorId: data.author_id || data.doctor_id || 1,
        authorSlug: data.author_slug || data.doctor_slug || "doctor",
      } as Article;
    }
  } catch (err) {
    console.error("Failed to fetch article from Supabase:", err);
  }

  // Static fallback – now locale‑aware
  return getArticleBySlug(slug, locale) ?? null;
}

export async function fetchRelatedArticles(
  slug: string,
  localePref?: string,
  limit = 2
): Promise<Partial<Article>[]> {
  const locale = resolveLocale(localePref);

  try {
    const { data } = await supabase
      .from("articles")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    if (data && data.length > 0) {
      return data
        .filter((a: any) => a.slug !== slug)
        .slice(0, limit)
        .map((d: any) => ({
          slug: d.slug,
          title: pickLocalized(d, "title", locale) || d.title || "",
          excerpt: pickLocalized(d, "excerpt", locale) || d.excerpt || "",
          cover: d.cover_url || "",
        }));
    }
  } catch (err) {
    console.error("Failed to fetch related articles from Supabase:", err);
  }

  // Static fallback – locale‑aware
  return getRelatedArticles(slug, locale, limit).map(
    ({ title, excerpt, cover, slug }) => ({ title, excerpt, cover, slug })
  );
}