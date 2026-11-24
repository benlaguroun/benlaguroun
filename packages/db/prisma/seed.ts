import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

// Everything below is SAMPLE content so the site looks alive on first run.
// English lives in the normal columns; French and Arabic live in `translations`.
// Re-running the seed refreshes translations but never overwrites your own edits
// to prices, links or English text.
async function main() {
  // ---- Services ---------------------------------------------------------
  const services = [
    {
      slug: "launch-site",
      name: "Launch Site",
      tagline: "A fast, branded website live in two weeks.",
      description:
        "A complete marketing site built on Next.js with your brand, copy structure, SEO basics, and a contact flow that feeds your inbox. Ideal for founders who need to look credible and start collecting leads.",
      priceCents: 150000,
      features: ["Up to 5 pages", "Brand-matched design", "SEO and analytics setup", "2 revision rounds", "Hosting handover"],
      featured: true,
      position: 1,
      translations: {
        fr: {
          name: "Site de lancement",
          tagline: "Un site rapide, à votre image, en ligne en deux semaines.",
          description:
            "Un site vitrine complet construit avec Next.js, à vos couleurs, avec structure de contenu, bases SEO et un formulaire de contact qui alimente votre boîte mail. Idéal pour les fondateurs qui doivent gagner en crédibilité et commencer à collecter des prospects.",
          features: ["Jusqu'à 5 pages", "Design aligné sur votre marque", "SEO et analytics", "2 cycles de révision", "Passation de l'hébergement"],
        },
        ar: {
          name: "موقع الإطلاق",
          tagline: "موقع سريع بهويتك يعمل خلال أسبوعين.",
          description:
            "موقع تعريفي متكامل مبني بـ Next.js بهوية علامتك، مع هيكلة للمحتوى وأساسيات تحسين محركات البحث ونموذج تواصل يصل مباشرة إلى بريدك. مثالي للمؤسسين الذين يحتاجون إلى مظهر موثوق وبدء جمع العملاء المحتملين.",
          features: ["حتى 5 صفحات", "تصميم يتوافق مع علامتك", "إعداد SEO والتحليلات", "جولتا مراجعة", "تسليم الاستضافة"],
        },
      },
    },
    {
      slug: "custom-platform",
      name: "Custom Platform",
      tagline: "Multi-user web apps with auth, payments and dashboards.",
      description:
        "For businesses that need more than a brochure: user accounts, role-based access, payments, admin tools and AI-powered features, designed and built end to end.",
      priceCents: null,
      features: ["Discovery and scoping", "Auth and roles", "Payments and billing", "Admin dashboard", "Deployment and monitoring"],
      featured: true,
      position: 2,
      translations: {
        fr: {
          name: "Plateforme sur mesure",
          tagline: "Applications multi-utilisateurs avec authentification, paiements et tableaux de bord.",
          description:
            "Pour les entreprises qui ont besoin de plus qu'une vitrine : comptes utilisateurs, accès par rôle, paiements, outils d'administration et fonctions propulsées par l'IA, conçus et réalisés de bout en bout.",
          features: ["Cadrage et découverte", "Authentification et rôles", "Paiements et facturation", "Tableau de bord admin", "Déploiement et supervision"],
        },
        ar: {
          name: "منصّة مخصّصة",
          tagline: "تطبيقات متعددة المستخدمين مع تسجيل دخول ومدفوعات ولوحات تحكم.",
          description:
            "للشركات التي تحتاج أكثر من موقع تعريفي: حسابات مستخدمين وصلاحيات حسب الدور ومدفوعات وأدوات إدارة وميزات مدعومة بالذكاء الاصطناعي، تُصمَّم وتُبنى من البداية إلى النهاية.",
          features: ["تحليل ونطاق المشروع", "تسجيل الدخول والأدوار", "المدفوعات والفوترة", "لوحة تحكم الإدارة", "النشر والمراقبة"],
        },
      },
    },
    {
      slug: "ai-automation",
      name: "AI Automation Setup",
      tagline: "Put repetitive business work on autopilot.",
      description:
        "Workflow audits and AI agent automations for support, lead follow-up and reporting, wired into the tools you already use.",
      priceCents: 90000,
      features: ["Workflow audit", "2 automations built", "Team walkthrough", "30 days support"],
      featured: false,
      position: 3,
      translations: {
        fr: {
          name: "Mise en place d'automatisation IA",
          tagline: "Mettez le travail répétitif en pilote automatique.",
          description:
            "Audit des flux de travail et automatisations par agents IA pour le support, le suivi des prospects et le reporting, connectés aux outils que vous utilisez déjà.",
          features: ["Audit des flux", "2 automatisations livrées", "Prise en main de l'équipe", "30 jours de support"],
        },
        ar: {
          name: "إعداد أتمتة بالذكاء الاصطناعي",
          tagline: "اجعل المهام المتكررة تعمل تلقائيًا.",
          description:
            "تدقيق لسير العمل وأتمتة بوكلاء الذكاء الاصطناعي للدعم ومتابعة العملاء المحتملين وإعداد التقارير، مرتبطة بالأدوات التي تستخدمها بالفعل.",
          features: ["تدقيق سير العمل", "بناء أتمتتين", "جلسة تدريب للفريق", "دعم لمدة 30 يومًا"],
        },
      },
    },
  ];
  for (const s of services) {
    await prisma.product.upsert({
      where: { slug: s.slug },
      update: { translations: s.translations },
      create: { ...s, type: "SERVICE" },
    });
  }

  // ---- Templates --------------------------------------------------------
  const templates = [
    {
      slug: "saas-starter-kit",
      name: "SaaS Starter Kit",
      tagline: "Auth, billing and a dashboard, ready to customize.",
      description:
        "A production-ready Turborepo starter with Next.js, Tailwind, better-auth, Prisma and PostgreSQL. Skip the first month of setup and start building your actual product.",
      priceCents: 7900,
      features: ["Next.js + TypeScript", "better-auth with roles", "Prisma + PostgreSQL", "Stripe-ready billing hooks", "Lifetime updates"],
      deliveryUrl: "https://example.com/replace-with-your-download-link",
      previewUrl: "https://example.com",
      featured: true,
      position: 1,
      translations: {
        fr: {
          name: "Kit de démarrage SaaS",
          tagline: "Authentification, facturation et tableau de bord, prêts à personnaliser.",
          description:
            "Une base Turborepo prête pour la production avec Next.js, Tailwind, better-auth, Prisma et PostgreSQL. Gagnez le premier mois de mise en place et commencez à construire votre vrai produit.",
          features: ["Next.js + TypeScript", "better-auth avec rôles", "Prisma + PostgreSQL", "Facturation compatible Stripe", "Mises à jour à vie"],
        },
        ar: {
          name: "حزمة SaaS الجاهزة",
          tagline: "تسجيل دخول وفوترة ولوحة تحكم، جاهزة للتخصيص.",
          description:
            "قاعدة Turborepo جاهزة للإنتاج بـ Next.js وTailwind وbetter-auth وPrisma وPostgreSQL. وفّر أول شهر من الإعداد وابدأ ببناء منتجك الفعلي.",
          features: ["Next.js + TypeScript", "better-auth مع الأدوار", "Prisma + PostgreSQL", "جاهزة لفوترة Stripe", "تحديثات مدى الحياة"],
        },
      },
    },
    {
      slug: "agency-landing-template",
      name: "Agency Landing Template",
      tagline: "A conversion-focused landing page for service businesses.",
      description:
        "A polished landing page template with hero, services, proof, pricing and contact sections. Edit one config file and ship.",
      priceCents: 3900,
      features: ["Single config file", "Responsive and accessible", "Dark and light themes", "SEO metadata built in"],
      deliveryUrl: "https://example.com/replace-with-your-download-link",
      previewUrl: "https://example.com",
      featured: true,
      position: 2,
      translations: {
        fr: {
          name: "Modèle de landing page d'agence",
          tagline: "Une page d'atterrissage axée conversion pour les entreprises de services.",
          description:
            "Un modèle de landing page soigné avec héros, services, preuves, tarifs et contact. Modifiez un seul fichier de configuration et publiez.",
          features: ["Un seul fichier de config", "Responsive et accessible", "Thèmes sombre et clair", "Métadonnées SEO intégrées"],
        },
        ar: {
          name: "قالب صفحة هبوط للوكالات",
          tagline: "صفحة هبوط تركّز على التحويل لشركات الخدمات.",
          description:
            "قالب صفحة هبوط متقن يضم الواجهة الرئيسية والخدمات والإثباتات والأسعار والتواصل. عدّل ملف إعداد واحد وانشر.",
          features: ["ملف إعداد واحد", "متجاوب وسهل الوصول", "وضعان داكن وفاتح", "بيانات SEO مدمجة"],
        },
      },
    },
    {
      slug: "business-plan-notion-pack",
      name: "Business Plan Pack",
      tagline: "Plan, price and launch an offer with proven worksheets.",
      description:
        "A set of worksheets and checklists covering offer design, pricing, outreach and a 90-day launch plan.",
      priceCents: 2900,
      features: ["Offer design worksheet", "Pricing calculator", "90-day launch checklist"],
      deliveryUrl: "https://example.com/replace-with-your-download-link",
      featured: false,
      position: 3,
      translations: {
        fr: {
          name: "Pack Business Plan",
          tagline: "Planifiez, tarifez et lancez une offre avec des fiches éprouvées.",
          description:
            "Un ensemble de fiches et de listes de contrôle couvrant la conception d'offre, la tarification, la prospection et un plan de lancement sur 90 jours.",
          features: ["Fiche de conception d'offre", "Calculateur de prix", "Checklist de lancement 90 jours"],
        },
        ar: {
          name: "حزمة خطة العمل",
          tagline: "خطّط وسعّر وأطلق عرضك بأوراق عمل مجرَّبة.",
          description:
            "مجموعة أوراق عمل وقوائم تحقق تغطي تصميم العرض والتسعير والتواصل مع العملاء وخطة إطلاق لـ90 يومًا.",
          features: ["ورقة تصميم العرض", "حاسبة الأسعار", "قائمة إطلاق لـ90 يومًا"],
        },
      },
    },
  ];
  for (const t of templates) {
    await prisma.product.upsert({
      where: { slug: t.slug },
      update: { translations: t.translations },
      create: { ...t, type: "TEMPLATE" },
    });
  }

  // ---- Course -----------------------------------------------------------
  const courseSlug = "build-your-business-online";

  const courseTranslations = {
    fr: {
      name: "Construire son business en ligne",
      tagline: "De l'idée aux premiers clients, étape par étape.",
      description:
        "Une formation pratique pour valider une offre, construire votre marque et votre site, et décrocher vos premiers clients. Leçons courtes, exemples concrets et modèles à copier.",
      features: ["12 leçons ciblées", "Fiches et modèles", "Accès à vie", "Suivi de progression"],
    },
    ar: {
      name: "ابنِ عملك على الإنترنت",
      tagline: "من الفكرة إلى أول العملاء، خطوة بخطوة.",
      description:
        "دورة عملية للتحقق من عرضك وبناء علامتك وموقعك والحصول على أول عملائك. دروس قصيرة وأمثلة حقيقية وقوالب يمكنك نسخها.",
      features: ["12 درسًا مركّزًا", "أوراق عمل وقوالب", "وصول مدى الحياة", "تتبّع التقدّم"],
    },
  };

  const modules = [
    {
      position: 1,
      title: "Start with a clear offer",
      translations: { fr: { title: "Partir d'une offre claire" }, ar: { title: "ابدأ بعرض واضح" } },
      lessons: [
        {
          slug: "welcome",
          position: 1,
          title: "Welcome and how to use this course",
          summary: "What you will build and how to get the most from each lesson.",
          content:
            "Welcome! This course is built around action. Each lesson ends with a small task. Do the task before moving on.\n\nBy the end you will have a defined offer, a brand, a simple website and a plan to reach your first customers.",
          durationMin: 4,
          isPreview: true,
          translations: {
            fr: {
              title: "Bienvenue et mode d'emploi",
              summary: "Ce que vous allez construire et comment tirer le meilleur de chaque leçon.",
              content:
                "Bienvenue ! Cette formation est centrée sur l'action. Chaque leçon se termine par une petite tâche. Faites la tâche avant de passer à la suite.\n\nÀ la fin, vous aurez une offre définie, une marque, un site simple et un plan pour atteindre vos premiers clients.",
            },
            ar: {
              title: "مرحبًا وكيف تستفيد من الدورة",
              summary: "ما الذي ستبنيه وكيف تحقق أقصى استفادة من كل درس.",
              content:
                "مرحبًا بك! هذه الدورة قائمة على التطبيق. ينتهي كل درس بمهمة صغيرة، أنجزها قبل أن تنتقل إلى ما بعدها.\n\nفي النهاية سيكون لديك عرض محدد وعلامة وموقع بسيط وخطة للوصول إلى أول عملائك.",
            },
          },
        },
        {
          slug: "pick-your-niche",
          position: 2,
          title: "Pick a niche people pay for",
          summary: "Find a problem that is painful, specific and budgeted.",
          content:
            "A good niche has three traits: the problem is painful, the buyer is easy to find, and they already spend money on it.\n\nTask: write down three possible niches and score each one from 1 to 5 on those traits.",
          durationMin: 12,
          isPreview: false,
          translations: {
            fr: {
              title: "Choisir une niche qui paie",
              summary: "Trouvez un problème douloureux, précis et budgété.",
              content:
                "Une bonne niche a trois qualités : le problème est douloureux, l'acheteur est facile à trouver et il dépense déjà de l'argent pour le résoudre.\n\nTâche : notez trois niches possibles et attribuez à chacune une note de 1 à 5 sur ces trois critères.",
            },
            ar: {
              title: "اختر مجالًا يدفع الناس مقابله",
              summary: "ابحث عن مشكلة مؤلمة ومحددة ولها ميزانية.",
              content:
                "للمجال الجيد ثلاث صفات: المشكلة مؤلمة، والمشتري سهل الوصول إليه، وهو ينفق المال بالفعل على حلّها.\n\nالمهمة: اكتب ثلاثة مجالات محتملة وقيّم كلًّا منها من 1 إلى 5 وفق هذه الصفات.",
            },
          },
        },
        {
          slug: "write-your-offer",
          position: 3,
          title: "Write your offer in one sentence",
          summary: "A simple formula for a clear, sellable promise.",
          content:
            "Formula: I help [who] achieve [result] in [timeframe] without [pain].\n\nTask: write five versions and test them on three people.",
          durationMin: 10,
          isPreview: false,
          translations: {
            fr: {
              title: "Écrire son offre en une phrase",
              summary: "Une formule simple pour une promesse claire et vendable.",
              content:
                "Formule : J'aide [qui] à obtenir [résultat] en [délai] sans [frein].\n\nTâche : écrivez cinq versions et testez-les auprès de trois personnes.",
            },
            ar: {
              title: "اكتب عرضك في جملة واحدة",
              summary: "صيغة بسيطة لوعد واضح وقابل للبيع.",
              content:
                "الصيغة: أساعد [من] على تحقيق [النتيجة] خلال [المدة] دون [العائق].\n\nالمهمة: اكتب خمس نسخ واختبرها على ثلاثة أشخاص.",
            },
          },
        },
      ],
    },
    {
      position: 2,
      title: "Brand and website",
      translations: { fr: { title: "Marque et site web" }, ar: { title: "العلامة والموقع" } },
      lessons: [
        {
          slug: "brand-basics",
          position: 1,
          title: "Brand basics: name, voice, look",
          summary: "Make decisions once, then reuse them everywhere.",
          content:
            "Pick a name, two colors, one font pairing, and three words that describe your voice. Write them on a single page. That page is your brand kit.",
          durationMin: 14,
          isPreview: false,
          translations: {
            fr: {
              title: "Les bases de la marque : nom, voix, style",
              summary: "Prenez les décisions une fois, puis réutilisez-les partout.",
              content:
                "Choisissez un nom, deux couleurs, une paire de polices et trois mots qui décrivent votre voix. Notez-les sur une seule page. Cette page est votre kit de marque.",
            },
            ar: {
              title: "أساسيات العلامة: الاسم والصوت والمظهر",
              summary: "اتخذ القرارات مرة واحدة ثم أعد استخدامها في كل مكان.",
              content:
                "اختر اسمًا ولونين وزوج خطوط وثلاث كلمات تصف صوتك. اكتبها في صفحة واحدة، فهذه الصفحة هي دليل علامتك.",
            },
          },
        },
        {
          slug: "launch-your-site",
          position: 2,
          title: "Launch a one-page site",
          summary: "What goes on the page and what to leave off.",
          content:
            "Your first site needs: a headline with your offer, proof, three steps to work with you, pricing or a way to enquire, and a clear call to action.",
          durationMin: 18,
          isPreview: false,
          translations: {
            fr: {
              title: "Lancer un site d'une page",
              summary: "Ce qui va sur la page et ce qu'il faut laisser de côté.",
              content:
                "Votre premier site a besoin : d'un titre avec votre offre, de preuves, de trois étapes pour travailler avec vous, d'un tarif ou d'un moyen de vous écrire, et d'un appel à l'action clair.",
            },
            ar: {
              title: "أطلق موقعًا من صفحة واحدة",
              summary: "ما الذي يوضع في الصفحة وما الذي يُترك.",
              content:
                "يحتاج موقعك الأول إلى: عنوان يحمل عرضك، وإثباتات، وثلاث خطوات للعمل معك، وسعر أو وسيلة للتواصل، ودعوة واضحة لاتخاذ إجراء.",
            },
          },
        },
      ],
    },
  ];

  const existing = await prisma.product.findUnique({ where: { slug: courseSlug }, include: { course: true } });

  if (!existing) {
    await prisma.product.create({
      data: {
        slug: courseSlug,
        type: "COURSE",
        name: "Build Your Business Online",
        tagline: "From idea to first paying customers, step by step.",
        description:
          "A practical course on validating an offer, building your brand and website, and landing your first clients. Short lessons, real examples, and templates you can copy.",
        priceCents: 14900,
        features: ["12 focused lessons", "Worksheets and templates", "Lifetime access", "Progress tracking"],
        featured: true,
        position: 1,
        translations: courseTranslations,
        course: {
          create: {
            modules: {
              create: modules.map((m) => ({
                position: m.position,
                title: m.title,
                translations: m.translations,
                lessons: { create: m.lessons },
              })),
            },
          },
        },
      },
    });
  } else {
    // Course already exists: only refresh translations.
    await prisma.product.update({ where: { id: existing.id }, data: { translations: courseTranslations } });
    if (existing.course) {
      for (const m of modules) {
        await prisma.module.updateMany({
          where: { courseId: existing.course.id, position: m.position },
          data: { translations: m.translations },
        });
        for (const l of m.lessons) {
          await prisma.lesson.updateMany({
            where: { slug: l.slug, module: { courseId: existing.course.id } },
            data: { translations: l.translations },
          });
        }
      }
    }
  }

  // ---- Portfolio --------------------------------------------------------
  const projects = [
    {
      slug: "school-management-platform",
      title: "School Management Platform",
      client: "Private school (sample)",
      summary: "Multi-role portal with attendance, parent access and an AI layer.",
      body:
        "A multi-tenant platform for a school: automated attendance, a parent portal, a social feed and AI-assisted reporting.\n\nReplace this sample text with your real case study: the problem, what you built, and the result.",
      tags: ["Next.js", "Turborepo", "PostgreSQL", "AI"],
      featured: true,
      position: 1,
      translations: {
        fr: {
          title: "Plateforme de gestion scolaire",
          client: "École privée (exemple)",
          summary: "Portail multi-rôles avec présence, accès parents et couche IA.",
          body:
            "Une plateforme multi-établissements pour une école : présence automatisée, portail parents, fil social et reporting assisté par IA.\n\nRemplacez ce texte d'exemple par votre véritable étude de cas : le problème, ce que vous avez construit et le résultat.",
        },
        ar: {
          title: "منصّة إدارة مدرسية",
          client: "مدرسة خاصة (مثال)",
          summary: "بوابة متعددة الأدوار مع الحضور ووصول أولياء الأمور وطبقة ذكاء اصطناعي.",
          body:
            "منصّة متعددة المدارس: حضور آلي وبوابة لأولياء الأمور وخلاصة اجتماعية وتقارير بمساعدة الذكاء الاصطناعي.\n\nاستبدل هذا النص التجريبي بدراسة الحالة الحقيقية: المشكلة وما بنيته والنتيجة.",
        },
      },
    },
    {
      slug: "hospitality-suite",
      title: "Hospitality Management Suite",
      client: "Hospitality group (sample)",
      summary: "Bookings, staff and guest management for multi-property operators.",
      body: "Replace this sample text with your real case study.",
      tags: ["Multi-tenant", "TypeScript", "Prisma"],
      featured: true,
      position: 2,
      translations: {
        fr: {
          title: "Suite de gestion hôtelière",
          client: "Groupe hôtelier (exemple)",
          summary: "Réservations, personnel et clients pour les exploitants multi-établissements.",
          body: "Remplacez ce texte d'exemple par votre véritable étude de cas.",
        },
        ar: {
          title: "نظام إدارة الضيافة",
          client: "مجموعة ضيافة (مثال)",
          summary: "حجوزات وموظفون وضيوف للمشغّلين متعددي المنشآت.",
          body: "استبدل هذا النص التجريبي بدراسة الحالة الحقيقية.",
        },
      },
    },
    {
      slug: "print-on-demand-store",
      title: "Character-Driven Print on Demand Store",
      client: "Own brand (sample)",
      summary: "A branded storefront with automated fulfilment.",
      body: "Replace this sample text with your real case study.",
      tags: ["E-commerce", "Stripe", "Next.js"],
      featured: false,
      position: 3,
      translations: {
        fr: {
          title: "Boutique d'impression à la demande à personnages",
          client: "Marque propre (exemple)",
          summary: "Une boutique de marque avec exécution automatisée.",
          body: "Remplacez ce texte d'exemple par votre véritable étude de cas.",
        },
        ar: {
          title: "متجر طباعة عند الطلب بشخصيات",
          client: "علامة خاصة (مثال)",
          summary: "متجر بهوية خاصة مع تنفيذ آلي للطلبات.",
          body: "استبدل هذا النص التجريبي بدراسة الحالة الحقيقية.",
        },
      },
    },
  ];
  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: { translations: p.translations },
      create: p,
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
