// Real projects and the solutions clients ask for. Used by seed.ts.
// English lives in the normal columns; French and Arabic in `translations`.
// Status words (Live, Built, In pilot, In development) are the first tag.

export const projects = [
  {
    slug: "aios-platform",
    title: "AIOS: AI Business Operating System",
    client: "Own product",
    summary: "A white-label platform where nine AI agents run support, orders, sales, marketing and more for any business.",
    body:
      "Small businesses can't afford a person for every inbox, order, review and booking. AIOS gives each business a team of AI agents that do that work, with a human approving anything important.\n\nNine agents cover support (reads the inbox and drafts replies), orders, social media, marketing campaigns, analytics reports, sales lead qualification, reviews, daily operations and bookings. Anything risky lands in an approval queue instead of being sent automatically.\n\nIt is multi-tenant from the ground up: every record, cache key, background job and live feed is scoped to one business, so clients never see each other's data. An agency console lets me approve new clients, watch their health score and track recurring revenue. Nine industry templates set a business up in one click.\n\nA privacy-aware router decides where each AI task runs: anything with personal data stays on a local model and never goes to the cloud, long or complex tasks can use a cloud model, and a daily budget caps spend per client.\n\nBuilt with Next.js, Fastify, TypeScript, PostgreSQL with pgvector, Redis and BullMQ, Clerk, Stripe and Cloudflare Workers.",
    liveUrl: "https://aios-platform-web.vercel.app" as string | null,
    tags: ["Live", "AI agents", "Multi-tenant", "TypeScript", "PostgreSQL"],
    featured: true,
    position: 1,
    translations: {
      fr: {
        title: "AIOS : système d'exploitation métier par IA",
        client: "Produit propre",
        summary: "Une plateforme en marque blanche où neuf agents IA gèrent support, commandes, ventes, marketing et plus pour n'importe quelle entreprise.",
        body:
          "Les petites entreprises n'ont pas les moyens d'avoir quelqu'un pour chaque boîte mail, commande, avis et réservation. AIOS donne à chaque entreprise une équipe d'agents IA qui font ce travail, avec un humain qui valide tout ce qui est important.\n\nNeuf agents couvrent le support (lit la boîte mail et rédige des réponses), les commandes, les réseaux sociaux, les campagnes marketing, les rapports d'analyse, la qualification des prospects, les avis, les opérations quotidiennes et les réservations. Tout ce qui est risqué arrive dans une file de validation au lieu d'être envoyé automatiquement.\n\nLa plateforme est multi-tenant dès la conception : chaque enregistrement, clé de cache, tâche de fond et flux en direct est limité à une seule entreprise, donc les clients ne voient jamais les données des autres. Une console d'agence me permet d'approuver les nouveaux clients, de suivre leur score de santé et leurs revenus récurrents. Neuf modèles sectoriels configurent une entreprise en un clic.\n\nUn routeur sensible à la confidentialité décide où chaque tâche IA s'exécute : tout ce qui contient des données personnelles reste sur un modèle local et ne part jamais dans le cloud, les tâches longues ou complexes peuvent utiliser un modèle cloud, et un budget quotidien plafonne les dépenses par client.\n\nConstruit avec Next.js, Fastify, TypeScript, PostgreSQL avec pgvector, Redis et BullMQ, Clerk, Stripe et Cloudflare Workers.",
      },
      ar: {
        title: "AIOS: نظام تشغيل الأعمال بالذكاء الاصطناعي",
        client: "منتج خاص",
        summary: "منصّة بعلامة بيضاء يدير فيها تسعة وكلاء ذكاء اصطناعي الدعم والطلبات والمبيعات والتسويق وغيرها لأي نشاط تجاري.",
        body:
          "لا تستطيع الشركات الصغيرة توظيف شخص لكل بريد وطلب ومراجعة وحجز. يمنح AIOS كل نشاط فريقًا من وكلاء الذكاء الاصطناعي ينجز هذا العمل، مع إنسان يوافق على كل ما هو مهم.\n\nيغطي تسعة وكلاء الدعم (يقرأ البريد ويصيغ الردود) والطلبات ووسائل التواصل والحملات التسويقية وتقارير التحليل وتأهيل العملاء المحتملين والمراجعات والعمليات اليومية والحجوزات. وكل ما فيه مخاطرة يذهب إلى قائمة موافقة بدل أن يُرسل تلقائيًا.\n\nالنظام متعدد المستأجرين من الأساس: كل سجل ومفتاح ذاكرة مؤقتة ومهمة خلفية وبث مباشر مرتبط بنشاط واحد، فلا يرى العملاء بيانات بعضهم. وتتيح لوحة الوكالة الموافقة على العملاء الجدد ومتابعة مؤشر صحتهم والإيرادات المتكررة. وتهيّئ تسعة قوالب قطاعية أي نشاط بنقرة واحدة.\n\nيقرر موجّه واعٍ بالخصوصية أين تُنفَّذ كل مهمة ذكاء اصطناعي: ما يحتوي بيانات شخصية يبقى على نموذج محلي ولا يخرج إلى السحابة، والمهام الطويلة أو المعقدة قد تستخدم نموذجًا سحابيًا، وتحدّد ميزانية يومية سقف الإنفاق لكل عميل.\n\nمبني بـ Next.js وFastify وTypeScript وPostgreSQL مع pgvector وRedis وBullMQ وClerk وStripe وCloudflare Workers.",
      },
    },
  },
  {
    slug: "school-platform",
    title: "School Platform with Card and Face Attendance",
    client: "Private school",
    summary: "One platform for owners, teachers, students and parents, with automatic attendance from card and face terminals.",
    body:
      "A school has many people who need different things: the owner and president want an overview, the secretary and staff run daily work, teachers take classes, students follow schedules, and parents want to know their child is safe and on time.\n\nThis platform connects all of them. Students and staff sign in and out with a card or face terminal and attendance is recorded automatically. Students get schedules with alarm reminders, parents have their own accounts, and a social-style feed keeps the school community in one place. An AI layer helps with questions and reporting.\n\nI wrote the documentation before the code, so the roles, rules and screens were agreed with the school first.\n\nBuilt as a Turborepo with Next.js and PostgreSQL, integrated with Hikvision attendance terminals over the school's local network.",
    tags: ["In development", "Attendance hardware", "Parent portal", "AI", "Next.js"],
    featured: true,
    position: 2,
    translations: {
      fr: {
        title: "Plateforme scolaire avec présence par carte et visage",
        client: "École privée",
        summary: "Une plateforme pour propriétaires, enseignants, élèves et parents, avec présence automatique depuis des bornes à carte et reconnaissance faciale.",
        body:
          "Une école compte beaucoup de personnes avec des besoins différents : le propriétaire et le président veulent une vue d'ensemble, le secrétariat et le personnel gèrent le quotidien, les enseignants donnent cours, les élèves suivent leurs emplois du temps, et les parents veulent savoir que leur enfant est en sécurité et à l'heure.\n\nCette plateforme les relie tous. Élèves et personnel pointent à l'entrée et à la sortie avec une carte ou une borne de reconnaissance faciale, et la présence est enregistrée automatiquement. Les élèves ont des emplois du temps avec rappels sonores, les parents ont leurs propres comptes, et un fil de type réseau social réunit la communauté de l'école. Une couche IA aide pour les questions et les rapports.\n\nJ'ai rédigé la documentation avant le code : les rôles, les règles et les écrans ont donc été validés avec l'école au préalable.\n\nConstruit en Turborepo avec Next.js et PostgreSQL, intégré aux terminaux de présence Hikvision via le réseau local de l'école.",
      },
      ar: {
        title: "منصّة مدرسية بحضور عبر البطاقة والوجه",
        client: "مدرسة خاصة",
        summary: "منصّة واحدة للمالكين والمعلمين والطلاب وأولياء الأمور، مع تسجيل حضور تلقائي من أجهزة البطاقة والتعرّف على الوجه.",
        body:
          "في المدرسة أشخاص كثيرون بحاجات مختلفة: المالك والرئيس يريدان نظرة شاملة، والسكرتارية والموظفون يديرون العمل اليومي، والمعلمون يقدّمون الدروس، والطلاب يتبعون جداولهم، وأولياء الأمور يريدون الاطمئنان على أبنائهم وانضباطهم.\n\nتربط هذه المنصّة بينهم جميعًا. يسجّل الطلاب والموظفون الدخول والخروج ببطاقة أو بجهاز تعرّف على الوجه ويُسجَّل الحضور تلقائيًا. يحصل الطلاب على جداول مع منبّهات تذكير، ولأولياء الأمور حساباتهم الخاصة، وتجمع خلاصة بأسلوب شبكات التواصل مجتمع المدرسة في مكان واحد. وتساعد طبقة ذكاء اصطناعي في الأسئلة والتقارير.\n\nكتبت التوثيق قبل الكود، فاتُّفق مع المدرسة مسبقًا على الأدوار والقواعد والشاشات.\n\nمبنية بـ Turborepo وNext.js وPostgreSQL، ومدمجة مع أجهزة الحضور Hikvision عبر الشبكة المحلية للمدرسة.",
      },
    },
  },
  {
    slug: "elysian-hospitality",
    title: "Elysian: Hospitality Management Platform",
    client: null as string | null,
    summary: "A multi-tenant suite for restaurants, hotels and snack bars, with staff dashboards, security and biometric attendance.",
    body:
      "Hospitality businesses juggle menus, bookings, orders, staff and security, often in separate tools. Elysian puts them in one platform that several businesses can share without seeing each other's data.\n\nIt is a monorepo of six apps: an admin console, restaurant, hotel and snack-bar apps, a public website and a security app. Staff only see the dashboards their role allows. A shared AI engine powers assistant features, images are uploaded to a media service, and attendance comes from a Hikvision biometric terminal.\n\nThe whole interface works in English, French and Arabic, including right-to-left layouts.\n\nBuilt with Turborepo, Next.js 15, Prisma and PostgreSQL, with Groq for AI.",
    tags: ["Built", "Multi-tenant", "Biometric attendance", "EN / FR / AR", "Next.js"],
    featured: true,
    position: 3,
    translations: {
      fr: {
        title: "Elysian : plateforme de gestion hôtelière",
        client: null,
        summary: "Une suite multi-tenant pour restaurants, hôtels et snacks, avec tableaux de bord du personnel, sécurité et présence biométrique.",
        body:
          "Les établissements d'hôtellerie-restauration jonglent entre menus, réservations, commandes, personnel et sécurité, souvent dans des outils séparés. Elysian réunit tout dans une plateforme que plusieurs établissements peuvent partager sans voir les données des autres.\n\nC'est un monorepo de six applications : une console d'administration, des applications restaurant, hôtel et snack, un site public et une application de sécurité. Le personnel ne voit que les tableaux de bord autorisés pour son rôle. Un moteur IA partagé alimente les fonctions d'assistance, les images sont envoyées vers un service média, et la présence provient d'un terminal biométrique Hikvision.\n\nToute l'interface fonctionne en anglais, en français et en arabe, y compris les mises en page de droite à gauche.\n\nConstruit avec Turborepo, Next.js 15, Prisma et PostgreSQL, avec Groq pour l'IA.",
      },
      ar: {
        title: "Elysian: منصّة إدارة الضيافة",
        client: null,
        summary: "مجموعة متعددة المستأجرين للمطاعم والفنادق ومحلات الوجبات السريعة، بلوحات للموظفين وأمن وحضور بيومتري.",
        body:
          "تتنقل أنشطة الضيافة بين القوائم والحجوزات والطلبات والموظفين والأمن، غالبًا في أدوات منفصلة. تجمعها Elysian في منصّة واحدة يمكن لعدة منشآت مشاركتها دون أن ترى بيانات بعضها.\n\nهي مستودع واحد من ستة تطبيقات: لوحة إدارة، وتطبيقات للمطعم والفندق ومحل الوجبات السريعة، وموقع عام، وتطبيق للأمن. لا يرى الموظف إلا اللوحات التي يسمح بها دوره. يشغّل محرك ذكاء اصطناعي مشترك ميزات المساعدة، وتُرفع الصور إلى خدمة وسائط، ويأتي الحضور من جهاز بيومتري Hikvision.\n\nتعمل الواجهة كلها بالإنجليزية والفرنسية والعربية، بما في ذلك التخطيط من اليمين إلى اليسار.\n\nمبنية بـ Turborepo وNext.js 15 وPrisma وPostgreSQL، مع Groq للذكاء الاصطناعي.",
      },
    },
  },
  {
    slug: "midwife-care-platform",
    title: "Privacy-First Platform for Midwives",
    client: null as string | null,
    summary: "Four apps for a midwife practice, with AI that keeps patient data on local models.",
    body:
      "Health data is the most sensitive data a business holds. This platform gives a midwife practice a public homepage, an admin app, a staff app and a client app, with detailed records that handle patients with more than one pregnancy.\n\nThe key design choice is the AI router. Every AI task is labelled by how sensitive it is. Tasks that touch personal data can only run on a local model, and if no local model is available they fail instead of quietly falling back to the cloud. Speed-sensitive and specialised tasks go to other providers.\n\nBuilt with Turborepo, Next.js, Prisma and shadcn/ui, with Ollama for local models and Groq, Anthropic and OpenAI for the rest.",
    tags: ["Built", "Privacy-first AI", "Healthcare", "Local LLM", "Prisma"],
    featured: false,
    position: 4,
    translations: {
      fr: {
        title: "Plateforme confidentielle pour sages-femmes",
        client: null,
        summary: "Quatre applications pour un cabinet de sage-femme, avec une IA qui garde les données des patientes sur des modèles locaux.",
        body:
          "Les données de santé sont les plus sensibles qu'une entreprise détienne. Cette plateforme offre à un cabinet de sage-femme une page d'accueil publique, une application d'administration, une application pour le personnel et une application pour les patientes, avec des dossiers détaillés qui gèrent les patientes ayant plusieurs grossesses.\n\nLe choix de conception clé est le routeur IA. Chaque tâche IA est étiquetée selon sa sensibilité. Les tâches qui touchent des données personnelles ne peuvent s'exécuter que sur un modèle local, et si aucun modèle local n'est disponible elles échouent au lieu de basculer discrètement vers le cloud. Les tâches sensibles à la vitesse et les tâches spécialisées vont vers d'autres fournisseurs.\n\nConstruit avec Turborepo, Next.js, Prisma et shadcn/ui, avec Ollama pour les modèles locaux et Groq, Anthropic et OpenAI pour le reste.",
      },
      ar: {
        title: "منصّة تحافظ على الخصوصية للقابلات",
        client: null,
        summary: "أربعة تطبيقات لعيادة قابلة، مع ذكاء اصطناعي يُبقي بيانات المريضات على نماذج محلية.",
        body:
          "البيانات الصحية هي الأكثر حساسية لدى أي نشاط. تمنح هذه المنصّة عيادة القابلة صفحة رئيسية عامة وتطبيق إدارة وتطبيقًا للموظفين وتطبيقًا للمريضات، مع سجلات مفصّلة تتعامل مع المريضات اللواتي مررن بأكثر من حمل.\n\nالقرار التصميمي الأهم هو موجّه الذكاء الاصطناعي. توسَم كل مهمة بدرجة حساسيتها. المهام التي تمس بيانات شخصية لا تعمل إلا على نموذج محلي، وإن لم يتوفر نموذج محلي فإنها تفشل بدل أن تتحول بصمت إلى السحابة. أما المهام الحساسة للسرعة والمتخصصة فتذهب إلى مزودين آخرين.\n\nمبنية بـ Turborepo وNext.js وPrisma وshadcn/ui، مع Ollama للنماذج المحلية وGroq وAnthropic وOpenAI لبقية المهام.",
      },
    },
  },
  {
    slug: "itqan-quran-school",
    title: "Itqan: AI Online Quran School",
    client: "Own product",
    summary: "An online platform for Quran and Islamic studies, with live classes, learner progress and an AI guide.",
    body:
      "Itqan lets learners of all ages study the Quran online with teachers, track their progress, and get guidance from an AI assistant, in a platform that states its commitment to religious trust.\n\nParents, adult learners and teachers sign up as their own type of user, and teachers are approved by an admin. Live classes can be recorded. Subscriptions are confirmed manually at first (bank transfer or cash), with card payments added through CMI in Morocco and Stripe for academies abroad.\n\nAn admin can switch the AI between local and API models, with the models pre-configured. Tasks for children run on a local model, and tasks for adults can use an API model. It works as an installable app on any device, and the plan is to run it from mosque to mosque with a manager for each one.\n\nBuilt solo with Next.js, better-auth and PostgreSQL. Currently in pilot.",
    tags: ["In pilot", "AI assistant", "PWA", "Live classes", "Payments"],
    featured: false,
    position: 5,
    translations: {
      fr: {
        title: "Itqan : école coranique en ligne avec IA",
        client: "Produit propre",
        summary: "Une plateforme en ligne pour le Coran et les études islamiques, avec cours en direct, suivi de progression et guide IA.",
        body:
          "Itqan permet aux apprenants de tous âges d'étudier le Coran en ligne avec des enseignants, de suivre leur progression et d'être guidés par un assistant IA, dans une plateforme qui affirme son engagement envers la confiance religieuse.\n\nParents, adultes apprenants et enseignants s'inscrivent chacun avec son propre type de profil, et les enseignants sont validés par un administrateur. Les cours en direct peuvent être enregistrés. Les abonnements sont d'abord confirmés manuellement (virement ou espèces), avec le paiement par carte ajouté via CMI au Maroc et Stripe pour les académies à l'étranger.\n\nUn administrateur peut basculer l'IA entre modèles locaux et modèles API, avec des modèles préconfigurés. Les tâches destinées aux enfants s'exécutent sur un modèle local, celles des adultes peuvent utiliser un modèle API. L'application s'installe sur tous les appareils, et l'objectif est de la déployer de mosquée en mosquée avec un responsable pour chacune.\n\nConstruit seul avec Next.js, better-auth et PostgreSQL. Actuellement en phase pilote.",
      },
      ar: {
        title: "إتقان: مدرسة قرآنية على الإنترنت بالذكاء الاصطناعي",
        client: "منتج خاص",
        summary: "منصّة على الإنترنت للقرآن والدراسات الإسلامية، بحصص مباشرة وتتبّع للتقدّم ومرشد ذكاء اصطناعي.",
        body:
          "تتيح إتقان للمتعلمين من جميع الأعمار دراسة القرآن عبر الإنترنت مع معلمين، وتتبّع تقدّمهم، والاستفادة من مساعد ذكاء اصطناعي، في منصّة تعلن التزامها بالأمانة الدينية.\n\nيسجّل أولياء الأمور والمتعلمون البالغون والمعلمون كلٌّ بنوع حسابه، ويوافق مشرف على المعلمين. يمكن تسجيل الحصص المباشرة. تُؤكَّد الاشتراكات يدويًا في البداية (تحويل بنكي أو نقدًا)، مع إضافة الدفع بالبطاقة عبر CMI في المغرب وStripe للأكاديميات في الخارج.\n\nيستطيع المشرف التبديل بين النماذج المحلية ونماذج API مع نماذج مهيأة مسبقًا. تعمل مهام الأطفال على نموذج محلي، ويمكن لمهام البالغين استخدام نموذج API. يعمل كتطبيق قابل للتثبيت على أي جهاز، والخطة تشغيله من مسجد إلى مسجد بمسؤول لكل مسجد.\n\nبُني منفردًا بـ Next.js وbetter-auth وPostgreSQL. في مرحلة تجريبية حاليًا.",
      },
    },
  },
  {
    slug: "pxlkid-store",
    title: "PXLKID: Character Print-on-Demand Store",
    client: "Own brand",
    summary: "A branded storefront selling kids' apparel with original characters, automatic fulfilment and a reusable template.",
    body:
      "PXLKID sells tees, hoodies and sweatshirts featuring original characters called Pixel Pals. The hook is a quiz: which Pixel Pal is your kid?\n\nOrders are paid through Stripe and fulfilled automatically through Printify, so there is no stock to hold. The store works as an installable app, keeps the cart between visits, and reports shopping events to AIOS so abandoned-cart and thank-you messages can run on their own.\n\nIt was built as a template: someone who isn't a developer can restyle it with a few colour settings, a store name and their own Printify key.\n\nBuilt with Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Zustand, Printify and Stripe.",
    tags: ["Built", "E-commerce", "Stripe", "Printify", "PWA"],
    featured: false,
    position: 6,
    translations: {
      fr: {
        title: "PXLKID : boutique d'impression à la demande à personnages",
        client: "Marque propre",
        summary: "Une boutique de marque de vêtements enfants avec des personnages originaux, exécution automatique et modèle réutilisable.",
        body:
          "PXLKID vend des t-shirts, hoodies et sweats avec des personnages originaux appelés Pixel Pals. L'accroche est un quiz : quel Pixel Pal est votre enfant ?\n\nLes commandes sont payées via Stripe et exécutées automatiquement via Printify, donc aucun stock à gérer. La boutique s'installe comme une application, garde le panier entre les visites et envoie les événements d'achat à AIOS pour que les messages de panier abandonné et de remerciement partent tout seuls.\n\nElle a été conçue comme un modèle : quelqu'un qui n'est pas développeur peut la personnaliser avec quelques réglages de couleurs, un nom de boutique et sa propre clé Printify.\n\nConstruit avec Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Zustand, Printify et Stripe.",
      },
      ar: {
        title: "PXLKID: متجر طباعة عند الطلب بشخصيات أصلية",
        client: "علامة خاصة",
        summary: "متجر بهوية خاصة لملابس الأطفال بشخصيات أصلية، مع تنفيذ تلقائي للطلبات وقالب قابل لإعادة الاستخدام.",
        body:
          "يبيع PXLKID قمصانًا وهوديات وسترات بشخصيات أصلية تسمى Pixel Pals. والفكرة اختبار: أي Pixel Pal هو طفلك؟\n\nيُدفع للطلبات عبر Stripe وتُنفَّذ تلقائيًا عبر Printify، فلا مخزون تحتفظ به. يعمل المتجر كتطبيق قابل للتثبيت، ويحفظ السلة بين الزيارات، ويرسل أحداث التسوق إلى AIOS لتعمل رسائل السلة المتروكة والشكر تلقائيًا.\n\nصُمّم كقالب: يستطيع من ليس مطورًا تغيير مظهره بإعدادات ألوان قليلة واسم متجر ومفتاح Printify الخاص به.\n\nمبني بـ Next.js 15 وTypeScript وTailwind CSS وshadcn/ui وZustand وPrintify وStripe.",
      },
    },
  },
  {
    slug: "restaurantos-ai",
    title: "RestaurantOS AI: Multi-Agent Restaurant Assistant",
    client: "Kaggle capstone",
    summary: "A team of AI agents for restaurants, built for Kaggle's 5-Day AI Agents Intensive.",
    body:
      "RestaurantOS AI was my capstone for the Kaggle 5-Day AI Agents Intensive, in the Agents for Business track.\n\nA router sends each request to the right specialist agent. The agents use tools through a custom MCP server built on JSON-RPC 2.0, and an evaluation suite measures how accurately requests are routed and how good the answers are, using another model as the judge.\n\nIt started on Google's ADK with Gemini and moved to Groq's Llama 3.3 70B when quotas got in the way.\n\nBuilt with Next.js 16, Auth.js, Prisma and PostgreSQL on Neon.",
    tags: ["Live", "AI agents", "MCP", "Kaggle", "Next.js"],
    featured: false,
    position: 7,
    translations: {
      fr: {
        title: "RestaurantOS AI : assistant multi-agents pour restaurants",
        client: "Projet final Kaggle",
        summary: "Une équipe d'agents IA pour restaurants, conçue pour le Kaggle 5-Day AI Agents Intensive.",
        body:
          "RestaurantOS AI était mon projet final du Kaggle 5-Day AI Agents Intensive, dans la catégorie Agents for Business.\n\nUn routeur envoie chaque demande à l'agent spécialisé adapté. Les agents utilisent des outils via un serveur MCP sur mesure basé sur JSON-RPC 2.0, et une suite d'évaluation mesure la précision du routage et la qualité des réponses, avec un autre modèle comme juge.\n\nIl a commencé sur l'ADK de Google avec Gemini avant de passer à Llama 3.3 70B sur Groq quand les quotas sont devenus un obstacle.\n\nConstruit avec Next.js 16, Auth.js, Prisma et PostgreSQL sur Neon.",
      },
      ar: {
        title: "RestaurantOS AI: مساعد مطاعم متعدد الوكلاء",
        client: "مشروع تخرّج Kaggle",
        summary: "فريق من وكلاء الذكاء الاصطناعي للمطاعم، بُني لبرنامج Kaggle 5-Day AI Agents Intensive.",
        body:
          "كان RestaurantOS AI مشروع تخرّجي في برنامج Kaggle 5-Day AI Agents Intensive ضمن مسار Agents for Business.\n\nيوجّه موجّه كل طلب إلى الوكيل المتخصص المناسب. تستخدم الوكلاء الأدوات عبر خادم MCP مخصص مبني على JSON-RPC 2.0، وتقيس مجموعة تقييم دقة التوجيه وجودة الإجابات باستخدام نموذج آخر كحَكَم.\n\nبدأ على ADK من Google مع Gemini ثم انتقل إلى Llama 3.3 70B على Groq عندما أصبحت الحصص عائقًا.\n\nمبني بـ Next.js 16 وAuth.js وPrisma وPostgreSQL على Neon.",
      },
    },
  },
];

/** Old placeholder projects from the first seed. They are removed. */
export const sampleProjectSlugs = ["school-management-platform", "hospitality-suite", "print-on-demand-store"];

export const solutions = [
  {
    slug: "ai-business-agents",
    name: "AI Business Agents",
    tagline: "A team of AI agents handling support, orders, sales and bookings, with you approving the important parts.",
    description:
      "Based on the platform I built for my own agency. I connect agents to your inbox, store and calendar, teach them your business with your documents and website, and set up an approval queue so nothing important goes out without you.\n\nGood for shops, restaurants, clinics, agencies and any business drowning in repetitive messages.",
    features: ["Support, orders, sales, booking and review agents", "Learns from your website and documents", "Approval queue for anything risky", "Reports on what the agents did", "Runs on private or cloud AI"],
    position: 4,
    translations: {
      fr: {
        name: "Agents IA pour votre entreprise",
        tagline: "Une équipe d'agents IA pour le support, les commandes, les ventes et les réservations, avec votre validation pour l'important.",
        description:
          "Basé sur la plateforme que j'ai construite pour ma propre agence. Je connecte les agents à votre messagerie, votre boutique et votre agenda, je leur apprends votre activité avec vos documents et votre site, et je mets en place une file de validation pour que rien d'important ne parte sans vous.\n\nIdéal pour les boutiques, restaurants, cabinets, agences et toute entreprise noyée sous les messages répétitifs.",
        features: ["Agents support, commandes, ventes, réservation et avis", "Apprend de votre site et de vos documents", "File de validation pour tout ce qui est risqué", "Rapports sur le travail des agents", "Fonctionne sur IA privée ou cloud"],
      },
      ar: {
        name: "وكلاء ذكاء اصطناعي لنشاطك",
        tagline: "فريق وكلاء ذكاء اصطناعي للدعم والطلبات والمبيعات والحجوزات، وتوافق أنت على الأمور المهمة.",
        description:
          "مبني على المنصّة التي طوّرتها لوكالتي الخاصة. أربط الوكلاء ببريدك ومتجرك وتقويمك، وأعلّمهم نشاطك من مستنداتك وموقعك، وأُعدّ قائمة موافقة حتى لا يخرج أي شيء مهم دون علمك.\n\nمناسب للمتاجر والمطاعم والعيادات والوكالات وكل نشاط يغرق في الرسائل المتكررة.",
        features: ["وكلاء للدعم والطلبات والمبيعات والحجز والمراجعات", "يتعلم من موقعك ومستنداتك", "قائمة موافقة لكل ما فيه مخاطرة", "تقارير عمّا أنجزه الوكلاء", "يعمل على ذكاء اصطناعي خاص أو سحابي"],
      },
    },
  },
  {
    slug: "school-platform-build",
    name: "School and Academy Platform",
    tagline: "Attendance, schedules, parent access and a school community in one system.",
    description:
      "A complete platform for schools, academies and training centres: roles for owners, staff, teachers, students and parents, automatic attendance from card or face terminals, schedules with reminders, parent accounts and a community feed.\n\nI agree the roles and rules with you in writing first, then build and install it, including the attendance hardware on your network.",
    features: ["Roles for owner, staff, teachers, students and parents", "Card and face attendance terminals", "Schedules with reminders", "Parent portal and community feed", "AI help for questions and reports"],
    position: 5,
    translations: {
      fr: {
        name: "Plateforme pour écoles et académies",
        tagline: "Présence, emplois du temps, accès parents et vie de l'école dans un seul système.",
        description:
          "Une plateforme complète pour écoles, académies et centres de formation : rôles pour propriétaires, personnel, enseignants, élèves et parents, présence automatique par bornes à carte ou reconnaissance faciale, emplois du temps avec rappels, comptes parents et fil communautaire.\n\nJe valide d'abord les rôles et les règles avec vous par écrit, puis je construis et j'installe le tout, y compris le matériel de présence sur votre réseau.",
        features: ["Rôles propriétaire, personnel, enseignants, élèves et parents", "Bornes de présence par carte et visage", "Emplois du temps avec rappels", "Portail parents et fil communautaire", "Aide IA pour les questions et les rapports"],
      },
      ar: {
        name: "منصّة للمدارس والأكاديميات",
        tagline: "الحضور والجداول ووصول أولياء الأمور ومجتمع المدرسة في نظام واحد.",
        description:
          "منصّة متكاملة للمدارس والأكاديميات ومراكز التكوين: أدوار للمالكين والموظفين والمعلمين والطلاب وأولياء الأمور، وحضور تلقائي من أجهزة البطاقة أو التعرّف على الوجه، وجداول مع تذكيرات، وحسابات لأولياء الأمور، وخلاصة للمجتمع.\n\nأتفق معك أولًا كتابيًا على الأدوار والقواعد، ثم أبني وأركّب النظام، بما في ذلك أجهزة الحضور على شبكتك.",
        features: ["أدوار للمالك والموظفين والمعلمين والطلاب وأولياء الأمور", "أجهزة حضور بالبطاقة والوجه", "جداول مع تذكيرات", "بوابة أولياء الأمور وخلاصة المجتمع", "مساعدة بالذكاء الاصطناعي للأسئلة والتقارير"],
      },
    },
  },
  {
    slug: "hospitality-platform-build",
    name: "Restaurant and Hotel Platform",
    tagline: "Menus, bookings, orders and staff in one trilingual system.",
    description:
      "For restaurants, hotels, cafés and snack bars, single site or several branches: menu and booking management, online ordering with real card payments, staff dashboards by role, and an admin area you can use from your phone.\n\nThe public site and the admin work in English, French and Arabic, including right-to-left.",
    features: ["Menu, reservations and online ordering", "Card payments with Stripe", "Staff dashboards by role", "Multi-branch ready", "English, French and Arabic"],
    position: 6,
    translations: {
      fr: {
        name: "Plateforme restaurant et hôtel",
        tagline: "Menus, réservations, commandes et personnel dans un système trilingue.",
        description:
          "Pour restaurants, hôtels, cafés et snacks, sur un site ou plusieurs établissements : gestion du menu et des réservations, commande en ligne avec vrais paiements par carte, tableaux de bord du personnel par rôle, et une administration utilisable depuis votre téléphone.\n\nLe site public et l'administration fonctionnent en anglais, en français et en arabe, y compris de droite à gauche.",
        features: ["Menu, réservations et commande en ligne", "Paiement par carte avec Stripe", "Tableaux de bord du personnel par rôle", "Prêt pour plusieurs établissements", "Anglais, français et arabe"],
      },
      ar: {
        name: "منصّة للمطاعم والفنادق",
        tagline: "القوائم والحجوزات والطلبات والموظفون في نظام واحد بثلاث لغات.",
        description:
          "للمطاعم والفنادق والمقاهي ومحلات الوجبات السريعة، في موقع واحد أو عدة فروع: إدارة القائمة والحجوزات، وطلب عبر الإنترنت بدفع حقيقي بالبطاقة، ولوحات للموظفين حسب الدور، ولوحة إدارة يمكنك استخدامها من هاتفك.\n\nيعمل الموقع العام ولوحة الإدارة بالإنجليزية والفرنسية والعربية، بما في ذلك من اليمين إلى اليسار.",
        features: ["القائمة والحجوزات والطلب عبر الإنترنت", "الدفع بالبطاقة عبر Stripe", "لوحات للموظفين حسب الدور", "جاهز لتعدد الفروع", "الإنجليزية والفرنسية والعربية"],
      },
    },
  },
  {
    slug: "online-store-build",
    name: "Online Store",
    tagline: "A branded shop with payments and automatic fulfilment.",
    description:
      "A fast, installable online store with your branding, secure card payments and a cart that remembers your customers. For print-on-demand, I connect Printify so orders are produced and shipped without you holding stock.\n\nYou can restyle it yourself with a few settings.",
    features: ["Branded storefront", "Stripe card payments", "Print-on-demand fulfilment with Printify", "Installable on phones", "Abandoned-cart and thank-you messages"],
    position: 7,
    translations: {
      fr: {
        name: "Boutique en ligne",
        tagline: "Une boutique à votre image, avec paiement et exécution automatique.",
        description:
          "Une boutique en ligne rapide et installable, à vos couleurs, avec paiement sécurisé par carte et un panier qui se souvient de vos clients. Pour l'impression à la demande, je connecte Printify afin que les commandes soient produites et expédiées sans que vous gardiez de stock.\n\nVous pouvez la restyler vous-même avec quelques réglages.",
        features: ["Boutique à votre image", "Paiement par carte avec Stripe", "Impression à la demande avec Printify", "Installable sur téléphone", "Messages de panier abandonné et de remerciement"],
      },
      ar: {
        name: "متجر إلكتروني",
        tagline: "متجر بهويتك مع الدفع والتنفيذ التلقائي للطلبات.",
        description:
          "متجر إلكتروني سريع وقابل للتثبيت بهويتك، مع دفع آمن بالبطاقة وسلة تتذكر عملاءك. وللطباعة عند الطلب أربط Printify لتُنتَج الطلبات وتُشحن دون أن تحتفظ بمخزون.\n\nيمكنك تغيير مظهره بنفسك بإعدادات قليلة.",
        features: ["واجهة متجر بهويتك", "الدفع بالبطاقة عبر Stripe", "طباعة عند الطلب مع Printify", "قابل للتثبيت على الهواتف", "رسائل السلة المتروكة والشكر"],
      },
    },
  },
  {
    slug: "learning-platform-build",
    name: "Online Learning Platform",
    tagline: "Live classes, learner progress and an AI guide, under your brand.",
    description:
      "A platform for academies, schools and trainers who teach online: learner profiles with progress tracking, live classes that can be recorded, teacher approval, subscriptions you can confirm manually or by card, and an AI assistant that guides learners.\n\nBuilt from the same foundation as my own online school.",
    features: ["Learner profiles and progress", "Live classes with recording", "Teacher approval and manager roles", "Manual or card subscriptions", "AI assistant for learners"],
    position: 8,
    translations: {
      fr: {
        name: "Plateforme d'apprentissage en ligne",
        tagline: "Cours en direct, suivi des apprenants et guide IA, à votre marque.",
        description:
          "Une plateforme pour académies, écoles et formateurs qui enseignent en ligne : profils d'apprenants avec suivi de progression, cours en direct enregistrables, validation des enseignants, abonnements confirmés manuellement ou par carte, et un assistant IA qui guide les apprenants.\n\nConstruite sur la même base que ma propre école en ligne.",
        features: ["Profils et progression des apprenants", "Cours en direct avec enregistrement", "Validation des enseignants et rôles de responsables", "Abonnements manuels ou par carte", "Assistant IA pour les apprenants"],
      },
      ar: {
        name: "منصّة تعلّم عبر الإنترنت",
        tagline: "حصص مباشرة وتتبّع للمتعلمين ومرشد ذكاء اصطناعي بعلامتك.",
        description:
          "منصّة للأكاديميات والمدارس والمدرّبين الذين يعلّمون عبر الإنترنت: ملفات للمتعلمين مع تتبّع التقدّم، وحصص مباشرة قابلة للتسجيل، وموافقة على المعلمين، واشتراكات تؤكدها يدويًا أو بالبطاقة، ومساعد ذكاء اصطناعي يرشد المتعلمين.\n\nمبنية على الأساس نفسه الذي بُنيت عليه مدرستي الخاصة على الإنترنت.",
        features: ["ملفات المتعلمين والتقدّم", "حصص مباشرة مع تسجيل", "موافقة على المعلمين وأدوار المسؤولين", "اشتراكات يدوية أو بالبطاقة", "مساعد ذكاء اصطناعي للمتعلمين"],
      },
    },
  },
  {
    slug: "private-ai-build",
    name: "Private AI for Sensitive Data",
    tagline: "AI features for clinics, law firms and schools, with data that never leaves your control.",
    description:
      "When the data is confidential, the AI has to be too. I design the system so tasks that touch personal data run only on a local model on hardware you control, and fail safely instead of falling back to a public cloud service.\n\nFor clinics, law practices, schools and anyone handling private records.",
    features: ["Local models for sensitive tasks", "No silent fallback to the cloud", "Optional hosting on hardware I manage", "Clear rules for what may leave the building"],
    position: 9,
    translations: {
      fr: {
        name: "IA privée pour données sensibles",
        tagline: "Des fonctions IA pour cabinets, études et écoles, avec des données qui ne quittent jamais votre contrôle.",
        description:
          "Quand les données sont confidentielles, l'IA doit l'être aussi. Je conçois le système pour que les tâches qui touchent des données personnelles s'exécutent uniquement sur un modèle local, sur du matériel que vous contrôlez, et échouent en sécurité au lieu de basculer vers un service cloud public.\n\nPour cliniques, cabinets juridiques, écoles et toute organisation qui manipule des dossiers privés.",
        features: ["Modèles locaux pour les tâches sensibles", "Aucun repli silencieux vers le cloud", "Hébergement optionnel sur du matériel que je gère", "Règles claires sur ce qui peut sortir de vos locaux"],
      },
      ar: {
        name: "ذكاء اصطناعي خاص للبيانات الحساسة",
        tagline: "ميزات ذكاء اصطناعي للعيادات ومكاتب المحاماة والمدارس، وبيانات لا تخرج عن سيطرتك.",
        description:
          "حين تكون البيانات سرية يجب أن يكون الذكاء الاصطناعي كذلك. أصمّم النظام بحيث تعمل المهام التي تمس بيانات شخصية على نموذج محلي فقط، على أجهزة تتحكم بها، وتفشل بأمان بدل التحول إلى خدمة سحابية عامة.\n\nللعيادات ومكاتب المحاماة والمدارس وكل جهة تتعامل مع سجلات خاصة.",
        features: ["نماذج محلية للمهام الحساسة", "لا تحويل صامت إلى السحابة", "استضافة اختيارية على أجهزة أديرها", "قواعد واضحة لما يجوز أن يخرج من المكان"],
      },
    },
  },
];
