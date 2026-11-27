import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

// Your catalog for 2027 onwards: 12 templates and 6 courses, in English, French and Arabic.
// Run it once:   npm run db:catalog
//
// Every product is added as "Coming soon": visible on the site with an email sign-up, and
// impossible to buy until you build it. When one is finished, open it in Admin -> Products,
// upload the file (or add the lessons), untick "Coming soon" and save. Add the product
// screenshots, the real price and the demo link at the same time.
//
// A product that already exists is never changed, so edits you make in the admin are safe
// if you run this again. The old sample templates and course are hidden, not deleted.
//
// The descriptions say what each product is meant to contain. Change them if the finished
// product ends up different, and never describe something you have not built.
// Prices are in cents (12900 = 129.00 USD). They are starting points, not tested prices.

type Text = { name: string; tagline: string; description: string; features: string[] };
type Item = { slug: string; type: "TEMPLATE" | "COURSE"; priceCents: number; featured: boolean; en: Text; fr: Text; ar: Text };

const items: Item[] = [
  // ───────────────────────── TEMPLATES ─────────────────────────
  {
    slug: "trilingual-saas-starter",
    type: "TEMPLATE",
    priceCents: 12900,
    featured: true,
    en: {
      name: "Trilingual SaaS Starter",
      tagline: "A Next.js starter in English, French and Arabic, with right-to-left done properly.",
      description:
        "Start a product that speaks your customers' languages from day one. Sign-up and login, an admin area, translated content, legal pages and email, with layouts that flip correctly for Arabic.\n\nBuilt on Next.js, Tailwind, Prisma and PostgreSQL.",
      features: ["English, French and Arabic with RTL layouts", "Sign-up, login and roles", "Admin dashboard", "Prisma and PostgreSQL", "Legal pages and transactional email"],
    },
    fr: {
      name: "Starter SaaS trilingue",
      tagline: "Un starter Next.js en anglais, français et arabe, avec la lecture de droite à gauche bien faite.",
      description:
        "Lancez un produit qui parle la langue de vos clients dès le premier jour. Inscription et connexion, espace d'administration, contenu traduit, pages légales et e-mails, avec des mises en page qui s'inversent correctement pour l'arabe.\n\nConstruit avec Next.js, Tailwind, Prisma et PostgreSQL.",
      features: ["Anglais, français et arabe avec mise en page RTL", "Inscription, connexion et rôles", "Tableau de bord d'administration", "Prisma et PostgreSQL", "Pages légales et e-mails transactionnels"],
    },
    ar: {
      name: "قالب SaaS بثلاث لغات",
      tagline: "قالب Next.js بالإنجليزية والفرنسية والعربية، مع دعم الكتابة من اليمين إلى اليسار بإتقان.",
      description:
        "ابدأ منتجًا يتحدث لغة عملائك من اليوم الأول. تسجيل وتسجيل دخول، ولوحة إدارة، ومحتوى مترجم، وصفحات قانونية، وبريد إلكتروني، مع تخطيطات تنقلب بشكل صحيح للعربية.\n\nمبني بـ Next.js وTailwind وPrisma وPostgreSQL.",
      features: ["الإنجليزية والفرنسية والعربية مع تخطيط RTL", "التسجيل وتسجيل الدخول والأدوار", "لوحة تحكم الإدارة", "Prisma وPostgreSQL", "صفحات قانونية وبريد إلكتروني"],
    },
  },
  {
    slug: "school-management-starter",
    type: "TEMPLATE",
    priceCents: 24900,
    featured: true,
    en: {
      name: "School Management Starter",
      tagline: "Roles, classes, timetables and a parent portal for a school, ready to adapt.",
      description:
        "A starting point for school software: accounts for the owner, secretary, teachers, students and parents, classes and timetables, and a parent view of attendance and news.\n\nIt comes with sample data only, so you can reshape it for your own client.",
      features: ["Roles for owner, staff, teachers and parents", "Classes and timetables", "Parent portal", "Announcements feed", "Three languages with RTL"],
    },
    fr: {
      name: "Starter de gestion scolaire",
      tagline: "Rôles, classes, emplois du temps et portail parents pour une école, prêts à adapter.",
      description:
        "Un point de départ pour un logiciel scolaire : comptes pour le propriétaire, le secrétariat, les enseignants, les élèves et les parents, classes et emplois du temps, et une vue parents sur la présence et les actualités.\n\nLivré avec des données d'exemple uniquement, pour que vous l'adaptiez à votre propre client.",
      features: ["Rôles pour direction, personnel, enseignants et parents", "Classes et emplois du temps", "Portail parents", "Fil d'actualités", "Trois langues avec RTL"],
    },
    ar: {
      name: "قالب إدارة المدارس",
      tagline: "أدوار وفصول وجداول ومنصّة لأولياء الأمور لمدرسة، جاهزة للتخصيص.",
      description:
        "نقطة انطلاق لبرنامج مدرسي: حسابات للمالك والسكرتارية والمعلمين والطلاب وأولياء الأمور، وفصول وجداول، وعرض لأولياء الأمور للحضور والأخبار.\n\nيأتي ببيانات تجريبية فقط، لتعيد تشكيله حسب عميلك.",
      features: ["أدوار للمالك والموظفين والمعلمين وأولياء الأمور", "الفصول والجداول", "منصّة أولياء الأمور", "موجز الإعلانات", "ثلاث لغات مع RTL"],
    },
  },
  {
    slug: "school-attendance-kit",
    type: "TEMPLATE",
    priceCents: 7900,
    featured: false,
    en: {
      name: "Card and Face Attendance Kit",
      tagline: "Connect card and face attendance terminals to a web app.",
      description:
        "A reference integration for recording attendance from Hikvision card and face terminals over a local network, with a clean event model you can plug into any school or workplace app.\n\nYou need compatible terminals and access to your own network.",
      features: ["Terminal event receiver", "Check-in and check-out records", "Late and absent rules", "Works on a local network", "Setup guide"],
    },
    fr: {
      name: "Kit de présence par carte et visage",
      tagline: "Connectez des bornes de présence à carte et reconnaissance faciale à une application web.",
      description:
        "Une intégration de référence pour enregistrer la présence depuis des bornes Hikvision à carte et à reconnaissance faciale sur un réseau local, avec un modèle d'événements propre à brancher sur n'importe quelle application scolaire ou d'entreprise.\n\nIl faut des bornes compatibles et l'accès à votre propre réseau.",
      features: ["Réception des événements de la borne", "Entrées et sorties enregistrées", "Règles de retard et d'absence", "Fonctionne sur réseau local", "Guide d'installation"],
    },
    ar: {
      name: "حزمة الحضور بالبطاقة والوجه",
      tagline: "اربط أجهزة الحضور بالبطاقة والتعرّف على الوجه بتطبيق ويب.",
      description:
        "تكامل مرجعي لتسجيل الحضور من أجهزة Hikvision للبطاقة والوجه عبر شبكة محلية، مع نموذج أحداث نظيف يمكن ربطه بأي تطبيق مدرسي أو لمكان عمل.\n\nتحتاج إلى أجهزة متوافقة وإلى صلاحية الوصول إلى شبكتك.",
      features: ["استقبال أحداث الجهاز", "سجلات الدخول والخروج", "قواعد التأخر والغياب", "يعمل على شبكة محلية", "دليل الإعداد"],
    },
  },
  {
    slug: "hotel-restaurant-platform",
    type: "TEMPLATE",
    priceCents: 19900,
    featured: false,
    en: {
      name: "Hotel and Restaurant Platform",
      tagline: "Orders, menus and staff dashboards for hospitality businesses.",
      description:
        "A starting point for hospitality software: menus and orders, dashboards that show each member of staff only what their role allows, and several businesses in one install.\n\nIt comes with sample data only.",
      features: ["Menus and orders", "Role-based staff dashboards", "Several businesses in one install", "Hooks for staff attendance", "Three languages with RTL"],
    },
    fr: {
      name: "Plateforme hôtel et restaurant",
      tagline: "Commandes, menus et tableaux de bord du personnel pour l'hôtellerie-restauration.",
      description:
        "Un point de départ pour un logiciel d'hôtellerie : menus et commandes, tableaux de bord qui ne montrent à chaque membre du personnel que ce que son rôle autorise, et plusieurs établissements dans une seule installation.\n\nLivré avec des données d'exemple uniquement.",
      features: ["Menus et commandes", "Tableaux de bord selon le rôle", "Plusieurs établissements dans une installation", "Points d'entrée pour la présence du personnel", "Trois langues avec RTL"],
    },
    ar: {
      name: "منصّة الفنادق والمطاعم",
      tagline: "طلبات وقوائم ولوحات للموظفين لأنشطة الضيافة.",
      description:
        "نقطة انطلاق لبرنامج الضيافة: قوائم وطلبات، ولوحات لا تُظهر لكل موظف إلا ما يسمح به دوره، وعدة منشآت في تثبيت واحد.\n\nيأتي ببيانات تجريبية فقط.",
      features: ["القوائم والطلبات", "لوحات موظفين حسب الدور", "عدة منشآت في تثبيت واحد", "نقاط ربط لحضور الموظفين", "ثلاث لغات مع RTL"],
    },
  },
  {
    slug: "clinic-booking-starter",
    type: "TEMPLATE",
    priceCents: 17900,
    featured: false,
    en: {
      name: "Clinic Booking and Records Starter",
      tagline: "Appointments and patient records, built with privacy first.",
      description:
        "A starting point for a small clinic or midwife practice: appointments, patient records and staff roles, with sensitive data kept apart from any AI features by design.\n\nIt is software, not a compliance certificate. Check the health-data rules where you work before using it with real patients.",
      features: ["Appointments and reminders", "Patient records with roles", "Privacy-first data model", "Optional local AI", "Activity log"],
    },
    fr: {
      name: "Starter rendez-vous et dossiers pour clinique",
      tagline: "Rendez-vous et dossiers patients, conçus d'abord pour la confidentialité.",
      description:
        "Un point de départ pour une petite clinique ou un cabinet de sage-femme : rendez-vous, dossiers patients et rôles du personnel, avec des données sensibles tenues à l'écart de toute fonction d'IA par conception.\n\nC'est un logiciel, pas un certificat de conformité. Vérifiez les règles sur les données de santé de votre pays avant de l'utiliser avec de vrais patients.",
      features: ["Rendez-vous et rappels", "Dossiers patients avec rôles", "Modèle de données axé confidentialité", "IA locale en option", "Journal d'activité"],
    },
    ar: {
      name: "قالب المواعيد والسجلات للعيادات",
      tagline: "مواعيد وسجلات مرضى، مبنية على الخصوصية أولًا.",
      description:
        "نقطة انطلاق لعيادة صغيرة أو عيادة قابلة: مواعيد وسجلات مرضى وأدوار للموظفين، مع إبقاء البيانات الحساسة بعيدة عن أي ميزة ذكاء اصطناعي بحكم التصميم.\n\nهو برنامج وليس شهادة امتثال. راجع قواعد البيانات الصحية في بلدك قبل استخدامه مع مرضى حقيقيين.",
      features: ["المواعيد والتذكيرات", "سجلات مرضى بأدوار", "نموذج بيانات يضع الخصوصية أولًا", "ذكاء اصطناعي محلي اختياري", "سجل النشاط"],
    },
  },
  {
    slug: "privacy-first-ai-router",
    type: "TEMPLATE",
    priceCents: 5900,
    featured: false,
    en: {
      name: "Privacy-First AI Router",
      tagline: "Send each AI task to the right model, and never leak sensitive data to the cloud.",
      description:
        "A small TypeScript library with an example app. Label every task by how sensitive it is: tasks with personal data run only on a local model and fail instead of falling back to the cloud, while other tasks can use faster hosted providers.",
      features: ["Sensitivity label for every task", "Local models with Ollama", "Hosted providers: Anthropic, OpenAI and Groq", "Fails closed for personal data", "Usage logging"],
    },
    fr: {
      name: "Routeur IA axé confidentialité",
      tagline: "Envoyez chaque tâche d'IA au bon modèle, sans jamais laisser fuiter de données sensibles vers le cloud.",
      description:
        "Une petite bibliothèque TypeScript avec une application d'exemple. Étiquetez chaque tâche selon sa sensibilité : les tâches avec données personnelles ne tournent que sur un modèle local et échouent plutôt que de basculer vers le cloud, tandis que les autres peuvent utiliser des fournisseurs hébergés plus rapides.",
      features: ["Étiquette de sensibilité pour chaque tâche", "Modèles locaux avec Ollama", "Fournisseurs hébergés : Anthropic, OpenAI et Groq", "Échec sécurisé pour les données personnelles", "Journal d'utilisation"],
    },
    ar: {
      name: "موجّه ذكاء اصطناعي يضع الخصوصية أولًا",
      tagline: "وجّه كل مهمة ذكاء اصطناعي إلى النموذج المناسب، دون تسريب بيانات حساسة إلى السحابة.",
      description:
        "مكتبة TypeScript صغيرة مع تطبيق مثال. صنّف كل مهمة بحسب حساسيتها: المهام التي تلمس بيانات شخصية تعمل على نموذج محلي فقط وتفشل بدل التحويل إلى السحابة، بينما تستطيع المهام الأخرى استخدام مزوّدين مستضافين أسرع.",
      features: ["تصنيف حساسية لكل مهمة", "نماذج محلية مع Ollama", "مزوّدون مستضافون: Anthropic وOpenAI وGroq", "تفشل بأمان مع البيانات الشخصية", "تسجيل الاستخدام"],
    },
  },
  {
    slug: "ai-inbox-assistant",
    type: "TEMPLATE",
    priceCents: 9900,
    featured: true,
    en: {
      name: "AI Inbox Assistant",
      tagline: "An AI assistant that drafts replies while a person approves every message.",
      description:
        "Incoming messages are sorted and answered with draft replies, and nothing is sent until a person approves it. It includes a kill switch, a daily limit and a log of every decision, and works with Anthropic, OpenAI or Groq.",
      features: ["Triage and draft replies", "Approval queue", "Kill switch and daily limit", "Decision log", "Several AI providers"],
    },
    fr: {
      name: "Assistant IA pour boîte de réception",
      tagline: "Un assistant IA qui rédige des brouillons de réponse, avec une personne qui valide chaque message.",
      description:
        "Les messages entrants sont triés et reçoivent un brouillon de réponse, et rien n'est envoyé tant qu'une personne ne l'a pas validé. Il comprend un interrupteur d'arrêt, une limite quotidienne et un journal de chaque décision, et fonctionne avec Anthropic, OpenAI ou Groq.",
      features: ["Tri et brouillons de réponse", "File de validation", "Interrupteur d'arrêt et limite quotidienne", "Journal des décisions", "Plusieurs fournisseurs d'IA"],
    },
    ar: {
      name: "مساعد ذكاء اصطناعي للبريد الوارد",
      tagline: "مساعد يصوغ مسودات الردود، ويوافق شخص على كل رسالة.",
      description:
        "تُفرز الرسائل الواردة وتُكتب لها مسودات ردود، ولا يُرسل شيء قبل أن يوافق عليه شخص. يشمل مفتاح إيقاف وحدًّا يوميًا وسجلًا لكل قرار، ويعمل مع Anthropic أو OpenAI أو Groq.",
      features: ["الفرز ومسودات الردود", "قائمة الموافقة", "مفتاح إيقاف وحد يومي", "سجل القرارات", "عدة مزوّدين للذكاء الاصطناعي"],
    },
  },
  {
    slug: "whatsapp-assistant-kit",
    type: "TEMPLATE",
    priceCents: 8900,
    featured: false,
    en: {
      name: "WhatsApp Assistant Kit",
      tagline: "A starting point for a WhatsApp Business assistant with handover to a person.",
      description:
        "Receive and answer customer messages through the WhatsApp Business platform, with a team inbox and a handover from the assistant to a person.\n\nYou need your own WhatsApp Business account, and you must follow Meta's rules for business messaging.",
      features: ["Webhook receiver", "Team inbox", "Handover to a person", "Message templates", "Setup guide"],
    },
    fr: {
      name: "Kit assistant WhatsApp",
      tagline: "Un point de départ pour un assistant WhatsApp Business avec passage de relais à une personne.",
      description:
        "Recevez et répondez aux messages clients via la plateforme WhatsApp Business, avec une boîte partagée pour l'équipe et un passage de relais de l'assistant à une personne.\n\nIl faut votre propre compte WhatsApp Business et le respect des règles de Meta pour les messages professionnels.",
      features: ["Réception par webhook", "Boîte partagée pour l'équipe", "Passage de relais à une personne", "Modèles de messages", "Guide d'installation"],
    },
    ar: {
      name: "حزمة مساعد واتساب",
      tagline: "نقطة انطلاق لمساعد واتساب للأعمال مع تحويل المحادثة إلى شخص.",
      description:
        "استقبل رسائل العملاء وأجب عنها عبر منصة واتساب للأعمال، مع صندوق وارد للفريق وتحويل من المساعد إلى شخص.\n\nتحتاج إلى حسابك الخاص في واتساب للأعمال، ويجب أن تلتزم بقواعد Meta للمراسلات التجارية.",
      features: ["استقبال عبر Webhook", "صندوق وارد للفريق", "التحويل إلى شخص", "قوالب الرسائل", "دليل الإعداد"],
    },
  },
  {
    slug: "multi-tenant-business-starter",
    type: "TEMPLATE",
    priceCents: 19900,
    featured: false,
    en: {
      name: "Multi-Tenant Business Starter",
      tagline: "One install, many customers, each with their own data and branding.",
      description:
        "The foundation for software you sell to many businesses: each customer's data is kept separate, each has their own branding and roles, and you manage them all from one admin console.",
      features: ["Tenant isolation in the data model", "Branding for each customer", "Roles for each tenant", "Admin console across all tenants", "Ready for subdomains"],
    },
    fr: {
      name: "Starter multi-clients",
      tagline: "Une installation, plusieurs clients, chacun avec ses données et son image de marque.",
      description:
        "La base d'un logiciel que vous vendez à de nombreuses entreprises : les données de chaque client sont séparées, chacun a son image de marque et ses rôles, et vous les gérez tous depuis une seule console d'administration.",
      features: ["Isolation des clients dans le modèle de données", "Image de marque pour chaque client", "Rôles pour chaque client", "Console d'administration globale", "Prêt pour les sous-domaines"],
    },
    ar: {
      name: "قالب متعدد العملاء",
      tagline: "تثبيت واحد وعملاء كثيرون، لكل منهم بياناته وهويته.",
      description:
        "الأساس لبرنامج تبيعه لأنشطة كثيرة: بيانات كل عميل منفصلة، ولكل عميل هويته وأدواره، وتديرهم جميعًا من لوحة إدارة واحدة.",
      features: ["عزل العملاء في نموذج البيانات", "هوية خاصة بكل عميل", "أدوار لكل عميل", "لوحة إدارة لجميع العملاء", "جاهز للنطاقات الفرعية"],
    },
  },
  {
    slug: "agency-client-portal",
    type: "TEMPLATE",
    priceCents: 14900,
    featured: false,
    en: {
      name: "Agency Client Portal",
      tagline: "A client area for projects, files, approvals and care plans.",
      description:
        "Give each client one place to follow their project: milestones, shared files, approvals and comments, and the status of their care plan. Invoices are recorded for bank-transfer payment.",
      features: ["Projects and milestones", "File sharing", "Approvals and comments", "Care plan tracking", "Invoice records for bank transfer"],
    },
    fr: {
      name: "Portail client pour agence",
      tagline: "Un espace client pour les projets, fichiers, validations et plans de suivi.",
      description:
        "Donnez à chaque client un seul endroit pour suivre son projet : étapes, fichiers partagés, validations et commentaires, et l'état de son plan de suivi. Les factures sont enregistrées pour un paiement par virement bancaire.",
      features: ["Projets et étapes", "Partage de fichiers", "Validations et commentaires", "Suivi du plan de suivi", "Factures pour virement bancaire"],
    },
    ar: {
      name: "بوابة عملاء للوكالات",
      tagline: "منطقة للعميل للمشاريع والملفات والموافقات وخطط الرعاية.",
      description:
        "امنح كل عميل مكانًا واحدًا لمتابعة مشروعه: المراحل والملفات المشتركة والموافقات والتعليقات وحالة خطة الرعاية. تُسجَّل الفواتير للدفع بالتحويل البنكي.",
      features: ["المشاريع والمراحل", "مشاركة الملفات", "الموافقات والتعليقات", "متابعة خطة الرعاية", "سجلات فواتير للتحويل البنكي"],
    },
  },
  {
    slug: "course-store-starter",
    type: "TEMPLATE",
    priceCents: 12900,
    featured: false,
    en: {
      name: "Course and Download Store Starter",
      tagline: "A store for courses and paid downloads, like this website.",
      description:
        "Sell your own courses and files without a monthly platform fee: lessons with progress tracking, protected downloads, Stripe and PayPal checkout, a coming-soon mode with an email list, and an admin dashboard.",
      features: ["Courses with lessons and progress", "Protected paid downloads", "Stripe and PayPal checkout", "Coming-soon mode and email list", "Admin dashboard"],
    },
    fr: {
      name: "Starter boutique de cours et de téléchargements",
      tagline: "Une boutique de cours et de téléchargements payants, comme ce site.",
      description:
        "Vendez vos propres cours et fichiers sans abonnement mensuel à une plateforme : leçons avec suivi de progression, téléchargements protégés, paiement Stripe et PayPal, un mode « bientôt disponible » avec liste d'e-mails, et un tableau de bord d'administration.",
      features: ["Cours avec leçons et progression", "Téléchargements payants protégés", "Paiement Stripe et PayPal", "Mode « bientôt » et liste d'e-mails", "Tableau de bord d'administration"],
    },
    ar: {
      name: "قالب متجر الدورات والتنزيلات",
      tagline: "متجر للدورات والتنزيلات المدفوعة، مثل هذا الموقع.",
      description:
        "بع دوراتك وملفاتك دون اشتراك شهري في منصة: دروس مع تتبّع التقدّم، وتنزيلات محمية، ودفع عبر Stripe وPayPal، ووضع «قريبًا» مع قائمة بريدية، ولوحة إدارة.",
      features: ["دورات بدروس وتتبّع التقدّم", "تنزيلات مدفوعة محمية", "الدفع عبر Stripe وPayPal", "وضع «قريبًا» وقائمة بريدية", "لوحة تحكم الإدارة"],
    },
  },
  {
    slug: "agency-documents-pack",
    type: "TEMPLATE",
    priceCents: 3900,
    featured: false,
    en: {
      name: "Agency Documents Pack",
      tagline: "Proposals, agreements and legal pages for a small software agency.",
      description:
        "Editable documents for a freelancer or small agency: a service agreement, a proposal and statement of work, care plan terms, and website legal pages in three languages.\n\nThese are templates, not legal advice. Have a lawyer in your country check them before you use them with clients.",
      features: ["Service agreement template", "Proposal and statement of work", "Care plan terms", "Legal pages in three languages", "Editable files"],
    },
    fr: {
      name: "Pack de documents pour agence",
      tagline: "Propositions, contrats et pages légales pour une petite agence de logiciels.",
      description:
        "Des documents modifiables pour un freelance ou une petite agence : un contrat de service, une proposition et un cahier des charges, des conditions de plan de suivi, et des pages légales de site web en trois langues.\n\nCe sont des modèles, pas des conseils juridiques. Faites-les relire par un juriste de votre pays avant de les utiliser avec des clients.",
      features: ["Modèle de contrat de service", "Proposition et cahier des charges", "Conditions du plan de suivi", "Pages légales en trois langues", "Fichiers modifiables"],
    },
    ar: {
      name: "حزمة مستندات للوكالات",
      tagline: "عروض واتفاقيات وصفحات قانونية لوكالة برمجيات صغيرة.",
      description:
        "مستندات قابلة للتعديل لمستقل أو وكالة صغيرة: اتفاقية خدمة، وعرض مع وثيقة نطاق العمل، وشروط خطة الرعاية، وصفحات قانونية للموقع بثلاث لغات.\n\nهذه قوالب وليست استشارة قانونية. اطلب من محامٍ في بلدك مراجعتها قبل استخدامها مع العملاء.",
      features: ["قالب اتفاقية خدمة", "عرض ووثيقة نطاق العمل", "شروط خطة الرعاية", "صفحات قانونية بثلاث لغات", "ملفات قابلة للتعديل"],
    },
  },

  // ───────────────────────── COURSES ─────────────────────────
  {
    slug: "self-host-nextjs",
    type: "COURSE",
    priceCents: 7900,
    featured: true,
    en: {
      name: "Self-Host a Next.js App for Real",
      tagline: "Run your own site from a Mac or a small server, with a database and your own domain.",
      description:
        "A practical course on putting a Next.js app on the internet yourself: a database on Neon, a process manager, a Cloudflare Tunnel for your domain, deployments, backups, and what to do when the machine goes down.\n\nIt is built from a real launch, including the mistakes.",
      features: ["Neon database setup", "Cloudflare Tunnel and your own domain", "pm2 and automatic restarts", "One-command deployments", "Backups and monitoring"],
    },
    fr: {
      name: "Héberger soi-même une application Next.js, pour de vrai",
      tagline: "Faites tourner votre site depuis un Mac ou un petit serveur, avec une base de données et votre propre domaine.",
      description:
        "Un cours pratique pour mettre une application Next.js en ligne vous-même : une base de données sur Neon, un gestionnaire de processus, un tunnel Cloudflare pour votre domaine, les déploiements, les sauvegardes, et que faire quand la machine tombe.\n\nIl est tiré d'un vrai lancement, erreurs comprises.",
      features: ["Mise en place de la base Neon", "Tunnel Cloudflare et votre propre domaine", "pm2 et redémarrages automatiques", "Déploiements en une commande", "Sauvegardes et supervision"],
    },
    ar: {
      name: "استضف تطبيق Next.js بنفسك فعلًا",
      tagline: "شغّل موقعك من جهاز Mac أو خادم صغير، مع قاعدة بيانات ونطاقك الخاص.",
      description:
        "دورة عملية لنشر تطبيق Next.js على الإنترنت بنفسك: قاعدة بيانات على Neon، ومدير عمليات، ونفق Cloudflare لنطاقك، وعمليات النشر، والنسخ الاحتياطي، وما العمل عندما يتوقف الجهاز.\n\nمبنية على إطلاق حقيقي، بما فيه من أخطاء.",
      features: ["إعداد قاعدة Neon", "نفق Cloudflare ونطاقك الخاص", "pm2 وإعادة التشغيل التلقائي", "نشر بأمر واحد", "النسخ الاحتياطي والمراقبة"],
    },
  },
  {
    slug: "trilingual-rtl-app",
    type: "COURSE",
    priceCents: 9900,
    featured: true,
    en: {
      name: "Build a Trilingual App with Arabic RTL",
      tagline: "From an empty folder to a deployed app in English, French and Arabic.",
      description:
        "A project course on the details people get wrong: layout direction, fonts and typography, translations that scale, and search optimisation for each language. You finish with a deployed app.",
      features: ["Layout direction with Tailwind", "Fonts and typography", "Translations that scale", "SEO for each language", "Deploy the finished app"],
    },
    fr: {
      name: "Créer une application trilingue avec l'arabe en RTL",
      tagline: "D'un dossier vide à une application déployée en anglais, français et arabe.",
      description:
        "Un cours par projet sur les détails que l'on rate souvent : le sens de la mise en page, les polices et la typographie, des traductions qui passent à l'échelle, et le référencement pour chaque langue. Vous terminez avec une application déployée.",
      features: ["Sens de la mise en page avec Tailwind", "Polices et typographie", "Traductions qui passent à l'échelle", "SEO pour chaque langue", "Déploiement de l'application terminée"],
    },
    ar: {
      name: "ابنِ تطبيقًا بثلاث لغات مع العربية من اليمين إلى اليسار",
      tagline: "من مجلد فارغ إلى تطبيق منشور بالإنجليزية والفرنسية والعربية.",
      description:
        "دورة قائمة على مشروع، تغطي التفاصيل التي يخطئ فيها كثيرون: اتجاه التخطيط، والخطوط والطباعة، وترجمات قابلة للتوسع، وتحسين محركات البحث لكل لغة. تنتهي بتطبيق منشور.",
      features: ["اتجاه التخطيط مع Tailwind", "الخطوط والطباعة", "ترجمات قابلة للتوسع", "SEO لكل لغة", "نشر التطبيق النهائي"],
    },
  },
  {
    slug: "ai-assistants-human-in-the-loop",
    type: "COURSE",
    priceCents: 11900,
    featured: true,
    en: {
      name: "AI Assistants with a Human in the Loop",
      tagline: "Build assistants for small businesses that draft, and a person decides.",
      description:
        "Learn to build AI assistants that are useful and safe: handling untrusted messages, approval queues, using several AI providers, limits and kill switches, and how to turn it into a service you sell.",
      features: ["Safe prompts and untrusted input", "Approval queues", "Several AI providers", "Limits and kill switches", "Package it as a service"],
    },
    fr: {
      name: "Assistants IA avec un humain dans la boucle",
      tagline: "Créez des assistants pour petites entreprises qui rédigent, et une personne décide.",
      description:
        "Apprenez à construire des assistants IA utiles et sûrs : gérer des messages non fiables, files de validation, utiliser plusieurs fournisseurs d'IA, limites et interrupteurs d'arrêt, et comment en faire un service que vous vendez.",
      features: ["Prompts sûrs et entrées non fiables", "Files de validation", "Plusieurs fournisseurs d'IA", "Limites et interrupteurs d'arrêt", "En faire un service"],
    },
    ar: {
      name: "مساعدو ذكاء اصطناعي مع إنسان في الحلقة",
      tagline: "ابنِ مساعدين للأعمال الصغيرة يصوغون المسودات، ويقرر شخص.",
      description:
        "تعلّم بناء مساعدين بالذكاء الاصطناعي مفيدين وآمنين: التعامل مع رسائل غير موثوقة، وقوائم الموافقة، واستخدام عدة مزوّدين، والحدود ومفاتيح الإيقاف، وكيف تحوّله إلى خدمة تبيعها.",
      features: ["مطالبات آمنة ومدخلات غير موثوقة", "قوائم الموافقة", "عدة مزوّدين للذكاء الاصطناعي", "الحدود ومفاتيح الإيقاف", "حوّله إلى خدمة"],
    },
  },
  {
    slug: "sell-software-services",
    type: "COURSE",
    priceCents: 4900,
    featured: false,
    en: {
      name: "Sell Software Services in North Africa",
      tagline: "Packages, deposits, care plans and your first clients, from a developer who does it.",
      description:
        "A short course for freelance developers: fixed-scope packages and pricing, care plans for monthly income, agreement and deposit templates, finding your first ten clients, and working across Arabic, French and English.",
      features: ["Fixed-scope packages and pricing", "Care plans for monthly income", "Agreement and deposit templates", "Finding your first ten clients", "Working in Arabic, French and English"],
    },
    fr: {
      name: "Vendre des services logiciels en Afrique du Nord",
      tagline: "Forfaits, acomptes, plans de suivi et premiers clients, par un développeur qui le fait.",
      description:
        "Un cours court pour développeurs indépendants : forfaits à périmètre fixe et tarification, plans de suivi pour un revenu mensuel, modèles de contrat et d'acompte, trouver vos dix premiers clients, et travailler en arabe, français et anglais.",
      features: ["Forfaits à périmètre fixe et tarification", "Plans de suivi pour un revenu mensuel", "Modèles de contrat et d'acompte", "Trouver vos dix premiers clients", "Travailler en arabe, français et anglais"],
    },
    ar: {
      name: "بيع خدمات البرمجيات في شمال أفريقيا",
      tagline: "باقات ودفعات مقدمة وخطط رعاية وأول عملائك، من مطوّر يمارسها.",
      description:
        "دورة قصيرة للمطورين المستقلين: باقات بنطاق ثابت وتسعيرها، وخطط رعاية لدخل شهري، وقوالب اتفاقيات ودفعات مقدمة، وإيجاد أول عشرة عملاء، والعمل بالعربية والفرنسية والإنجليزية.",
      features: ["باقات بنطاق ثابت وتسعيرها", "خطط رعاية لدخل شهري", "قوالب اتفاقيات ودفعات مقدمة", "إيجاد أول عشرة عملاء", "العمل بالعربية والفرنسية والإنجليزية"],
    },
  },
  {
    slug: "multi-tenant-saas-nextjs",
    type: "COURSE",
    priceCents: 12900,
    featured: false,
    en: {
      name: "Multi-Tenant SaaS with Next.js and Prisma",
      tagline: "Build software that many businesses share, without ever mixing their data.",
      description:
        "A hands-on course on the architecture behind white-label software: a tenant-safe data model, roles and permissions, branding for each customer, billing, and how to deploy and run it.",
      features: ["Tenant-safe data model", "Roles and permissions", "Branding for each tenant", "Billing for each customer", "Deploy and operate it"],
    },
    fr: {
      name: "SaaS multi-clients avec Next.js et Prisma",
      tagline: "Créez un logiciel que plusieurs entreprises partagent, sans jamais mélanger leurs données.",
      description:
        "Un cours pratique sur l'architecture des logiciels en marque blanche : un modèle de données sûr par client, rôles et permissions, image de marque pour chaque client, facturation, et comment le déployer et l'exploiter.",
      features: ["Modèle de données sûr par client", "Rôles et permissions", "Image de marque par client", "Facturation par client", "Déployer et exploiter"],
    },
    ar: {
      name: "SaaS متعدد العملاء مع Next.js وPrisma",
      tagline: "ابنِ برنامجًا تتشاركه شركات كثيرة دون أن تختلط بياناتها أبدًا.",
      description:
        "دورة عملية في بنية البرمجيات ذات العلامة البيضاء: نموذج بيانات آمن لكل عميل، وأدوار وصلاحيات، وهوية لكل عميل، والفوترة، وكيفية نشرها وتشغيلها.",
      features: ["نموذج بيانات آمن لكل عميل", "الأدوار والصلاحيات", "هوية لكل عميل", "فوترة لكل عميل", "النشر والتشغيل"],
    },
  },
  {
    slug: "privacy-first-ai-sensitive-data",
    type: "COURSE",
    priceCents: 8900,
    featured: false,
    en: {
      name: "Privacy-First AI for Sensitive Data",
      tagline: "Use AI with health, school and client data without sending it to the cloud.",
      description:
        "Learn to classify data by how sensitive it is, run local models with Ollama, route each task to the right model, and make the system fail closed instead of open. It is a developer's guide and not legal advice.",
      features: ["Classify data by sensitivity", "Local models with Ollama", "Route tasks safely", "Fail closed, not open", "Logging without leaking data"],
    },
    fr: {
      name: "IA axée confidentialité pour données sensibles",
      tagline: "Utilisez l'IA avec des données de santé, scolaires ou clients sans les envoyer vers le cloud.",
      description:
        "Apprenez à classer les données selon leur sensibilité, à faire tourner des modèles locaux avec Ollama, à orienter chaque tâche vers le bon modèle, et à faire échouer le système de façon sûre plutôt qu'ouverte. C'est un guide pour développeurs, pas un conseil juridique.",
      features: ["Classer les données par sensibilité", "Modèles locaux avec Ollama", "Orienter les tâches en sécurité", "Échouer de façon sûre, pas ouverte", "Journaux sans fuite de données"],
    },
    ar: {
      name: "ذكاء اصطناعي يضع الخصوصية أولًا للبيانات الحساسة",
      tagline: "استخدم الذكاء الاصطناعي مع بيانات صحية ومدرسية وبيانات العملاء دون إرسالها إلى السحابة.",
      description:
        "تعلّم تصنيف البيانات بحسب حساسيتها، وتشغيل نماذج محلية مع Ollama، وتوجيه كل مهمة إلى النموذج المناسب، وجعل النظام يفشل بأمان بدل أن يفشل مفتوحًا. هذا دليل للمطورين وليس استشارة قانونية.",
      features: ["تصنيف البيانات بحسب الحساسية", "نماذج محلية مع Ollama", "توجيه المهام بأمان", "الفشل الآمن لا المفتوح", "سجلات دون تسريب البيانات"],
    },
  },
];

// The first-seed samples. They are hidden, not deleted.
const sampleSlugs = ["saas-starter-kit", "agency-landing-template", "business-plan-notion-pack", "build-your-business-online"];

async function main() {
  let templates = 0;
  let courses = 0;

  for (const item of items) {
    const position = item.type === "TEMPLATE" ? ++templates : ++courses;
    const existing = await prisma.product.findUnique({ where: { slug: item.slug } });
    if (existing) {
      console.log(`- ${item.slug}: already there, left as it is`);
      continue;
    }
    const { name, tagline, description, features } = item.en;
    await prisma.product.create({
      data: {
        slug: item.slug,
        type: item.type,
        name,
        tagline,
        description,
        features,
        priceCents: item.priceCents,
        currency: "usd",
        published: true,
        comingSoon: true,
        featured: item.featured,
        position,
        translations: { fr: item.fr, ar: item.ar },
        // A course needs its (still empty) lesson container so its page can open.
        ...(item.type === "COURSE" ? { course: { create: {} } } : {}),
      },
    });
    console.log(`+ ${item.slug}: added as coming soon`);
  }

  const hidden = await prisma.product.updateMany({ where: { slug: { in: sampleSlugs }, published: true }, data: { published: false } });
  console.log(`Hid ${hidden.count} sample product${hidden.count === 1 ? "" : "s"}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
