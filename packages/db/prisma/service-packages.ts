import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

// Your real service packages, written for schools, clinics and hotels. Run it once:
//   npm run db:services
//
// What it does:
//  - Adds the four packages below (Starter Site, Management Platform, AI Assistant, Care Plan)
//    in English, French and Arabic. A package that already exists is never overwritten, so
//    anything you edit in Admin -> Products is safe if you run this again.
//  - Hides the three sample services from the first seed (launch-site, custom-platform,
//    ai-automation). They are hidden, not deleted.
//
// The prices are starting points written from how this kind of work usually sells. They have
// not been tested in your market. Change them in Admin -> Products at any time. The full
// terms (scope, exclusions, deposits, the agreement template) are in SERVICES.md.
//
// Prices are stored in cents: 150000 means 1,500.00 USD.

const packages = [
  {
    slug: "starter-site",
    name: "Starter Site",
    tagline: "A fast website in Arabic, French and English for your school, clinic or hotel, live in two weeks.",
    description: [
      "For organisations that need a credible web presence now: who you are, what you offer, and how people reach you, in Arabic, French and English, with the right-to-left layout done properly.",
      "How it works: we agree the pages and the content in a short written scope. I design and build the site, you review it twice, and it goes live on your own domain. You own the site and everything on it.",
      "Timeline and payment: about two weeks from the day I receive your content. 50% to start and 50% before launch, by bank transfer. The first month of hosting is included. After that it moves to a Care Plan or to a host of your choice.",
    ].join("\n\n"),
    priceCents: 150000,
    features: [
      "Up to 6 pages",
      "Arabic, French and English versions",
      "Contact form and WhatsApp button",
      "Search engine basics and visit statistics",
      "2 rounds of changes",
      "Your own domain with secure HTTPS",
      "First month of hosting included",
    ],
    featured: true,
    position: 1,
    translations: {
      fr: {
        name: "Site de départ",
        tagline: "Un site rapide en arabe, en français et en anglais pour votre école, clinique ou hôtel, en ligne en deux semaines.",
        description: [
          "Pour les organisations qui ont besoin d'une présence web crédible dès maintenant : qui vous êtes, ce que vous proposez et comment vous joindre, en arabe, en français et en anglais, avec une mise en page de droite à gauche soignée.",
          "Comment ça se passe : nous fixons les pages et le contenu dans un court cahier des charges écrit. Je conçois et je construis le site, vous le relisez deux fois, puis il est mis en ligne sur votre propre nom de domaine. Le site et tout son contenu vous appartiennent.",
          "Délai et paiement : environ deux semaines à partir de la réception de votre contenu. 50 % au démarrage et 50 % avant la mise en ligne, par virement bancaire. Le premier mois d'hébergement est inclus. Ensuite, le site passe sur un Plan de suivi ou chez l'hébergeur de votre choix.",
        ].join("\n\n"),
        features: [
          "Jusqu'à 6 pages",
          "Versions en arabe, français et anglais",
          "Formulaire de contact et bouton WhatsApp",
          "Bases du référencement et statistiques de visite",
          "2 cycles de modifications",
          "Votre nom de domaine avec HTTPS sécurisé",
          "Premier mois d'hébergement inclus",
        ],
      },
      ar: {
        name: "الموقع الأساسي",
        tagline: "موقع سريع بالعربية والفرنسية والإنجليزية لمدرستك أو عيادتك أو فندقك، يعمل خلال أسبوعين.",
        description: [
          "للمؤسسات التي تحتاج إلى حضور موثوق على الإنترنت الآن: من أنتم، وماذا تقدّمون، وكيف يصل الناس إليكم، بالعربية والفرنسية والإنجليزية، مع تنسيق من اليمين إلى اليسار منجز بإتقان.",
          "كيف نعمل: نتفق على الصفحات والمحتوى في وثيقة نطاق مكتوبة قصيرة. أصمّم الموقع وأبنيه، وتراجعونه مرتين، ثم يُنشر على نطاقكم الخاص. الموقع وكل ما فيه ملك لكم.",
          "المدة والدفع: نحو أسبوعين من يوم استلام المحتوى. 50% عند البدء و50% قبل الإطلاق، بالتحويل البنكي. الشهر الأول من الاستضافة مشمول. بعد ذلك ينتقل الموقع إلى خطة الرعاية أو إلى مزوّد استضافة تختارونه.",
        ].join("\n\n"),
        features: [
          "حتى 6 صفحات",
          "نسخ بالعربية والفرنسية والإنجليزية",
          "نموذج تواصل وزر واتساب",
          "أساسيات تحسين محركات البحث وإحصاءات الزيارات",
          "جولتا تعديلات",
          "نطاقكم الخاص مع HTTPS آمن",
          "الشهر الأول من الاستضافة مشمول",
        ],
      },
    },
  },
  {
    slug: "management-platform",
    name: "Management Platform",
    tagline: "Custom software that runs the daily work of your school, clinic or hotel.",
    description: [
      "For organisations that still run on paper, spreadsheets and WhatsApp. One platform with accounts and permissions for your staff, the records you keep (students, patients or guests), attendance or bookings, payments, reports, and AI assistants where they genuinely save time. Built around how you really work, in Arabic, French and English.",
      "How it works: every project starts with a paid Discovery Sprint, five working days for 600 USD. We map how you work today, and I deliver a written scope, a fixed price and a timeline. If you go ahead, the 600 USD is deducted from the price. If you do not, you keep the scope document and owe nothing more.",
      "Timeline and payment: usually 8 to 12 weeks, in stages you review and approve. The price is fixed once the scope is signed. Payment is 40% to start, 30% at the midpoint demo and 30% at launch, by bank transfer. Hosting and support continue through a Care Plan.",
    ].join("\n\n"),
    priceCents: 750000,
    features: [
      "Paid Discovery Sprint with a written scope",
      "Staff accounts with roles and permissions",
      "Records, attendance or bookings for your sector",
      "Payments, invoices and reports",
      "Arabic, French and English, right-to-left ready",
      "AI assistance where it saves time",
      "Training for your team",
      "Launch, hosting setup and 30 days of support",
    ],
    featured: true,
    position: 2,
    translations: {
      fr: {
        name: "Plateforme de gestion",
        tagline: "Un logiciel sur mesure qui fait tourner le quotidien de votre école, clinique ou hôtel.",
        description: [
          "Pour les organisations qui fonctionnent encore avec du papier, des tableurs et WhatsApp. Une seule plateforme avec des comptes et des droits pour votre équipe, les dossiers que vous tenez (élèves, patients ou clients), les présences ou les réservations, les paiements, les rapports et des assistants IA là où ils font vraiment gagner du temps. Conçue autour de votre façon de travailler, en arabe, en français et en anglais.",
          "Comment ça se passe : chaque projet commence par un Sprint de découverte payant, cinq jours ouvrés pour 600 USD. Nous cartographions votre façon de travailler aujourd'hui, et je vous remets un cahier des charges écrit, un prix fixe et un calendrier. Si vous poursuivez, les 600 USD sont déduits du prix. Sinon, vous gardez le cahier des charges et ne devez rien de plus.",
          "Délai et paiement : en général 8 à 12 semaines, par étapes que vous relisez et validez. Le prix est fixe une fois le cahier des charges signé. Le paiement se fait à 40 % au démarrage, 30 % à la démonstration de mi-parcours et 30 % au lancement, par virement bancaire. L'hébergement et le support continuent avec un Plan de suivi.",
        ].join("\n\n"),
        features: [
          "Sprint de découverte payant avec cahier des charges écrit",
          "Comptes du personnel avec rôles et droits",
          "Dossiers, présences ou réservations adaptés à votre secteur",
          "Paiements, factures et rapports",
          "Arabe, français et anglais, prêt pour la lecture de droite à gauche",
          "Assistance IA là où elle fait gagner du temps",
          "Formation de votre équipe",
          "Lancement, mise en place de l'hébergement et 30 jours de support",
        ],
      },
      ar: {
        name: "منصّة الإدارة",
        tagline: "برنامج مخصّص يُدير العمل اليومي لمدرستك أو عيادتك أو فندقك.",
        description: [
          "للمؤسسات التي لا تزال تعمل بالورق وجداول البيانات وواتساب. منصة واحدة بحسابات وصلاحيات لفريقكم، والسجلات التي تحتفظون بها (طلاب أو مرضى أو نزلاء)، والحضور أو الحجوزات، والمدفوعات، والتقارير، ومساعدين أذكياء حيث يوفّرون وقتًا فعلًا. تُبنى حول طريقة عملكم الحقيقية، بالعربية والفرنسية والإنجليزية.",
          "كيف نعمل: يبدأ كل مشروع بأسبوع استكشاف مدفوع، خمسة أيام عمل مقابل 600 دولار. نرسم معًا كيف تعملون اليوم، وأسلّمكم وثيقة نطاق مكتوبة وسعرًا ثابتًا وجدولًا زمنيًا. إذا واصلتم، تُخصم الـ600 دولار من السعر. وإذا لم تواصلوا، تحتفظون بوثيقة النطاق ولا تدينون بشيء آخر.",
          "المدة والدفع: عادةً من 8 إلى 12 أسبوعًا، على مراحل تراجعونها وتوافقون عليها. يصبح السعر ثابتًا بعد توقيع النطاق. الدفع 40% عند البدء و30% عند العرض في منتصف المشروع و30% عند الإطلاق، بالتحويل البنكي. وتستمر الاستضافة والدعم عبر خطة الرعاية.",
        ].join("\n\n"),
        features: [
          "أسبوع استكشاف مدفوع مع وثيقة نطاق مكتوبة",
          "حسابات للموظفين بأدوار وصلاحيات",
          "سجلات وحضور أو حجوزات تناسب قطاعكم",
          "مدفوعات وفواتير وتقارير",
          "عربي وفرنسي وإنجليزي، ودعم كامل للكتابة من اليمين إلى اليسار",
          "مساعدة بالذكاء الاصطناعي حيث توفّر الوقت",
          "تدريب فريقكم",
          "الإطلاق وإعداد الاستضافة و30 يومًا من الدعم",
        ],
      },
    },
  },
  {
    slug: "ai-assistant",
    name: "AI Assistant Setup",
    tagline: "An assistant that handles one repetitive job for you, with a person approving what matters.",
    description: [
      "For organisations buried in repetitive messages and paperwork: answering common questions by email or on your website, sorting and summarising requests, preparing reports, and following up with parents, patients or guests.",
      "How it works: we choose one process. I build the assistant on top of the tools you already use, with clear rules, a log of everything it does, and an approval step for anything sensitive. Nothing important is sent without a person's approval unless you decide otherwise later. WhatsApp can be connected where the WhatsApp Business rules allow it.",
      "Timeline and payment: two to four weeks. 50% to start and 50% when it works, by bank transfer. 30 days of support are included. The AI service itself is paid by you directly at cost, and for one process that is usually small.",
    ].join("\n\n"),
    priceCents: 180000,
    features: [
      "Process audit and one assistant built",
      "Connects to your email and website forms",
      "Approval step for sensitive actions",
      "Activity log of everything it does",
      "Walkthrough for your team",
      "30 days of support",
    ],
    featured: false,
    position: 3,
    translations: {
      fr: {
        name: "Mise en place d'un assistant IA",
        tagline: "Un assistant qui prend en charge une tâche répétitive, avec une personne qui valide ce qui compte.",
        description: [
          "Pour les organisations submergées de messages et de papiers répétitifs : répondre aux questions courantes par e-mail ou sur votre site, trier et résumer les demandes, préparer des rapports, relancer parents, patients ou clients.",
          "Comment ça se passe : nous choisissons un processus. Je construis l'assistant par-dessus les outils que vous utilisez déjà, avec des règles claires, un journal de tout ce qu'il fait et une étape de validation pour tout ce qui est sensible. Rien d'important n'est envoyé sans l'accord d'une personne, sauf si vous en décidez autrement plus tard. WhatsApp peut être connecté lorsque les règles de WhatsApp Business le permettent.",
          "Délai et paiement : deux à quatre semaines. 50 % au démarrage et 50 % quand l'assistant fonctionne, par virement bancaire. 30 jours de support sont inclus. Le service d'IA lui-même est payé directement par vous, au prix coûtant, et pour un seul processus cela reste généralement modeste.",
        ].join("\n\n"),
        features: [
          "Audit du processus et un assistant livré",
          "Connexion à votre messagerie et à vos formulaires",
          "Étape de validation pour les actions sensibles",
          "Journal de tout ce qu'il fait",
          "Prise en main pour votre équipe",
          "30 jours de support",
        ],
      },
      ar: {
        name: "إعداد مساعد ذكاء اصطناعي",
        tagline: "مساعد يتولى مهمة متكررة واحدة عنكم، ويوافق شخص على ما يهم.",
        description: [
          "للمؤسسات المثقلة برسائل وأوراق متكررة: الرد على الأسئلة الشائعة عبر البريد أو موقعكم، وفرز الطلبات وتلخيصها، وإعداد التقارير، ومتابعة الأولياء أو المرضى أو النزلاء.",
          "كيف نعمل: نختار عملية واحدة. أبني المساعد فوق الأدوات التي تستخدمونها فعلًا، بقواعد واضحة وسجل لكل ما يفعله وخطوة موافقة لكل ما هو حسّاس. لا يُرسل شيء مهم دون موافقة شخص، إلا إذا قررتم غير ذلك لاحقًا. ويمكن ربط واتساب حيث تسمح قواعد واتساب للأعمال بذلك.",
          "المدة والدفع: من أسبوعين إلى أربعة أسابيع. 50% عند البدء و50% عندما يعمل المساعد، بالتحويل البنكي. الدعم لمدة 30 يومًا مشمول. وتدفعون تكلفة خدمة الذكاء الاصطناعي نفسها مباشرة بسعر التكلفة، وهي غالبًا صغيرة لعملية واحدة.",
        ].join("\n\n"),
        features: [
          "تدقيق العملية وبناء مساعد واحد",
          "يرتبط ببريدكم ونماذج موقعكم",
          "خطوة موافقة للإجراءات الحسّاسة",
          "سجل نشاط لكل ما يفعله",
          "جلسة تدريب لفريقكم",
          "دعم لمدة 30 يومًا",
        ],
      },
    },
  },
  {
    slug: "care-plan",
    name: "Care Plan",
    tagline: "From 150 USD a month: hosting, backups, monitoring and fixes, so your platform just keeps working.",
    description: [
      "For every site or platform I build, and for existing ones I take over. I host it, watch it, keep it updated and fix problems, so you never have to think about servers.",
      "Two levels. Essential is 150 USD a month: hosting, daily backups, uptime monitoring, security and software updates, fixes for anything that breaks, and 2 hours of small changes each month. Plus is 350 USD a month: everything in Essential, 6 hours of changes each month, replies within one working day, and a monthly report on your visits and what to improve.",
      "Billing: monthly by bank transfer, or yearly in advance with one month free. After the first three months you can stop at any time with 30 days' notice, and you always keep your data. I do not promise that a site will never go down, but I watch it and fix it fast.",
    ].join("\n\n"),
    priceCents: 15000,
    features: [
      "Hosting and daily backups",
      "Uptime monitoring and alerts",
      "Security and software updates",
      "Fixes for anything that breaks",
      "2 hours of changes a month (6 on Plus)",
      "Replies within one working day (Plus)",
      "Monthly report (Plus)",
    ],
    featured: false,
    position: 4,
    translations: {
      fr: {
        name: "Plan de suivi",
        tagline: "À partir de 150 USD par mois : hébergement, sauvegardes, supervision et corrections, pour que votre plateforme continue simplement de fonctionner.",
        description: [
          "Pour chaque site ou plateforme que je construis, et pour ceux que je reprends. Je l'héberge, je le surveille, je le tiens à jour et je règle les problèmes, pour que vous n'ayez jamais à penser aux serveurs.",
          "Deux niveaux. Essentiel à 150 USD par mois : hébergement, sauvegardes quotidiennes, supervision de disponibilité, mises à jour de sécurité et logicielles, correction de tout ce qui tombe en panne et 2 heures de petites modifications par mois. Plus à 350 USD par mois : tout l'Essentiel, 6 heures de modifications par mois, réponse sous un jour ouvré et un rapport mensuel sur vos visites et les pistes d'amélioration.",
          "Facturation : mensuelle par virement bancaire, ou annuelle d'avance avec un mois offert. Après les trois premiers mois, vous pouvez arrêter à tout moment avec un préavis de 30 jours, et vous gardez toujours vos données. Je ne promets pas qu'un site ne tombera jamais en panne, mais je le surveille et je le répare vite.",
        ].join("\n\n"),
        features: [
          "Hébergement et sauvegardes quotidiennes",
          "Supervision de disponibilité et alertes",
          "Mises à jour de sécurité et logicielles",
          "Correction de tout ce qui tombe en panne",
          "2 heures de modifications par mois (6 avec Plus)",
          "Réponse sous un jour ouvré (Plus)",
          "Rapport mensuel (Plus)",
        ],
      },
      ar: {
        name: "خطة الرعاية",
        tagline: "من 150 دولارًا شهريًا: استضافة ونسخ احتياطي ومراقبة وإصلاحات، ليبقى نظامكم يعمل دائمًا.",
        description: [
          "لكل موقع أو منصة أبنيها، وللأنظمة القائمة التي أتولاها. أستضيفها وأراقبها وأحدّثها وأصلح المشكلات، فلا تحتاجون إلى التفكير في الخوادم أبدًا.",
          "مستويان. الأساسية بـ150 دولارًا شهريًا: استضافة ونسخ احتياطي يومي ومراقبة التوفّر وتحديثات الأمان والبرمجيات وإصلاح أي عطل وساعتان من التعديلات الصغيرة كل شهر. والمتقدمة بـ350 دولارًا شهريًا: كل ما في الأساسية، و6 ساعات تعديلات كل شهر، والرد خلال يوم عمل واحد، وتقرير شهري عن زياراتكم وما يمكن تحسينه.",
          "الفوترة: شهريًا بالتحويل البنكي، أو سنويًا مقدّمًا مع شهر مجاني. بعد الأشهر الثلاثة الأولى يمكنكم التوقف في أي وقت بإشعار 30 يومًا، وتحتفظون دائمًا ببياناتكم. لا أعد بأن الموقع لن يتعطل أبدًا، لكنني أراقبه وأصلحه بسرعة.",
        ].join("\n\n"),
        features: [
          "استضافة ونسخ احتياطي يومي",
          "مراقبة التوفّر وتنبيهات",
          "تحديثات الأمان والبرمجيات",
          "إصلاح أي عطل",
          "ساعتا تعديلات شهريًا (6 في المتقدمة)",
          "رد خلال يوم عمل (المتقدمة)",
          "تقرير شهري (المتقدمة)",
        ],
      },
    },
  },
];

const sampleServices = ["launch-site", "custom-platform", "ai-automation"];

async function main() {
  for (const p of packages) {
    const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (existing) {
      console.log(`- ${p.slug}: already there, left as it is`);
      continue;
    }
    await prisma.product.create({ data: { ...p, type: "SERVICE", currency: "usd", published: true } });
    console.log(`+ ${p.slug}: added`);
  }

  const hidden = await prisma.product.updateMany({ where: { slug: { in: sampleServices }, published: true }, data: { published: false } });
  console.log(`Hid ${hidden.count} sample service${hidden.count === 1 ? "" : "s"}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
