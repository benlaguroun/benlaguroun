// Six more articles that build trust and authority: how you work with clients, where
// a platform should live, what to ask before buying hotel or clinic software, and two
// engineering articles that attract developers and lead to your templates and courses.
// They are added by `npm run db:posts` (see posts.ts) as drafts.

export type Lang = { title: string; excerpt: string; body: string };
export type Post = { slug: string; tags: string[]; en: Lang; fr: Lang; ar: Lang };

export const brandPosts: Post[] = [
  // ------------------------------------------------------------------ 6
  {
    slug: "how-i-build-a-platform-for-your-organisation",
    tags: ["Process", "Working with me", "Platforms"],
    en: {
      title: "How I build a platform for your organisation, step by step",
      excerpt: "No surprises: what happens from the first message to the day your staff log in, and what I need from you at each step.",
      body: `Hiring someone to build software is stressful when you cannot see the road ahead. So here is exactly how I work, from the first message to the day your team starts using the platform.

## Step 1: a short conversation

You tell me how you work today: who does what, which papers and spreadsheets you use, and what hurts most. I ask questions. At the end I tell you honestly whether you need a custom platform, a smaller tool, or no software at all. If I am not the right choice, I say so.

## Step 2: a discovery sprint, for larger projects

For anything bigger than a simple website, I suggest a short paid discovery step. I interview the people who will use the system, map the daily work, and produce three things in writing: the list of features for version one, a screen-by-screen outline, and a firm price with dates. If you go ahead, the cost of this step is credited against the project. If you do not, you keep the plan and can use it with anyone.

## Step 3: a written scope and agreement

Before I write code, we agree on one page that states what is included, what is not, how many rounds of changes are included, what you provide and by when, and how payment is split. Written scope protects both of us. Most bad projects fail on unwritten assumptions.

## Step 4: building in small, visible pieces

I build in short cycles and show you working screens, not slides. You click through real pages with sample data, tell me what is wrong, and I adjust. Your staff should see the system early, because they will notice things that managers miss.

## Step 5: your real data and a real trial

Before launch, we load your real records and let a few staff use the platform for a few days. This is where the surprises show up, and it is far better to find them with five people than with the whole organisation.

## Step 6: launch and training

On launch day I am available. I train staff in short sessions, and I write simple instructions in the languages your team uses. Parents, clients or guests, if they have accounts, get clear emails explaining how to log in.

## Step 7: the care plan

Real use always reveals improvements, and software needs updates, backups and someone to answer the phone. I offer a monthly care plan so that you never have to chase a developer. It is optional, but I recommend it for any system your staff use every day.

## What I need from you

- One person with the authority to decide, available for short questions during the week.
- Your real documents and examples early, not at the end.
- Honest feedback. "It is fine" helps nobody.

## What you get at the end

Working software that your staff use, access to your data at all times, and clear documentation. You should never be locked in. If you ever want to work with someone else, you can.

If this sounds like how you want to work, look at the [services](/en/services), or [send me a short message](/en/contact) about your organisation.`,
    },
    fr: {
      title: "Comment je construis une plateforme pour votre organisation, étape par étape",
      excerpt: "Sans surprise : ce qui se passe entre le premier message et le jour où votre personnel se connecte, et ce dont j'ai besoin de vous à chaque étape.",
      body: `Faire appel à quelqu'un pour construire un logiciel est stressant quand on ne voit pas la route. Voici donc exactement comment je travaille, du premier message jusqu'au jour où votre équipe commence à utiliser la plateforme.

## Étape 1 : une courte conversation

Vous me dites comment vous travaillez aujourd'hui : qui fait quoi, quels papiers et quels tableurs vous utilisez, et ce qui vous gêne le plus. Je pose des questions. À la fin, je vous dis honnêtement si vous avez besoin d'une plateforme sur mesure, d'un outil plus petit, ou d'aucun logiciel. Si je ne suis pas le bon choix, je le dis.

## Étape 2 : un sprint de découverte, pour les projets plus importants

Pour tout ce qui dépasse un simple site, je propose une courte étape de découverte payante. J'interroge les personnes qui utiliseront le système, je cartographie le travail quotidien et je produis trois documents écrits : la liste des fonctions de la version un, un schéma écran par écran, et un prix ferme avec des dates. Si vous poursuivez, le coût de cette étape est déduit du projet. Sinon, vous gardez le plan et pouvez l'utiliser avec n'importe qui.

## Étape 3 : un périmètre et un accord écrits

Avant d'écrire du code, nous nous mettons d'accord sur une page qui indique ce qui est inclus, ce qui ne l'est pas, combien de séries de modifications sont comprises, ce que vous fournissez et pour quand, et comment le paiement est réparti. Un périmètre écrit nous protège tous les deux. La plupart des mauvais projets échouent sur des hypothèses non écrites.

## Étape 4 : construire par petites parties visibles

Je travaille en cycles courts et je vous montre des écrans qui fonctionnent, pas des diapositives. Vous naviguez dans de vraies pages avec des données d'exemple, vous me dites ce qui ne va pas, et j'ajuste. Votre personnel doit voir le système tôt, car il remarque des choses que les dirigeants ne voient pas.

## Étape 5 : vos vraies données et un vrai essai

Avant le lancement, nous chargeons vos vrais dossiers et quelques membres du personnel utilisent la plateforme pendant quelques jours. C'est là que les surprises apparaissent, et il vaut bien mieux les trouver avec cinq personnes qu'avec toute l'organisation.

## Étape 6 : lancement et formation

Le jour du lancement, je suis disponible. Je forme le personnel en courtes séances et j'écris des instructions simples dans les langues de votre équipe. Les parents, clients ou invités qui ont un compte reçoivent des e-mails clairs expliquant comment se connecter.

## Étape 7 : le forfait de suivi

L'usage réel révèle toujours des améliorations, et un logiciel a besoin de mises à jour, de sauvegardes et de quelqu'un qui répond au téléphone. Je propose un forfait de suivi mensuel pour que vous n'ayez jamais à courir après un développeur. Il est facultatif, mais je le recommande pour tout système que votre personnel utilise chaque jour.

## Ce dont j'ai besoin de vous

- Une personne ayant le pouvoir de décider, disponible pour de courtes questions pendant la semaine.
- Vos vrais documents et exemples tôt, pas à la fin.
- Des retours honnêtes. « C'est bien » n'aide personne.

## Ce que vous obtenez à la fin

Un logiciel qui fonctionne et que votre personnel utilise, un accès à vos données à tout moment et une documentation claire. Vous ne devez jamais être enfermé. Si vous voulez un jour travailler avec quelqu'un d'autre, vous le pouvez.

Si c'est ainsi que vous voulez travailler, consultez les [services](/fr/services), ou [envoyez-moi un court message](/fr/contact) sur votre organisation.`,
    },
    ar: {
      title: "كيف أبني منصّة لمؤسستك، خطوة بخطوة",
      excerpt: "بلا مفاجآت: ما يحدث من أول رسالة إلى يوم دخول موظفيك، وما أحتاجه منك في كل خطوة.",
      body: `التعاقد مع شخص لبناء برنامج أمر مقلق حين لا ترى الطريق أمامك. لذا هذه طريقة عملي بالضبط، من أول رسالة إلى اليوم الذي يبدأ فيه فريقك باستعمال المنصّة.

## الخطوة 1: حديث قصير

تخبرني كيف تعمل اليوم: من يفعل ماذا، وما الأوراق والجداول التي تستعملها، وما الذي يؤلمك أكثر. أطرح أسئلة. وفي النهاية أقول لك بصدق إن كنت تحتاج منصّة مخصّصة أو أداة أصغر أو لا برنامجًا أصلًا. وإن لم أكن الخيار المناسب فأقول ذلك.

## الخطوة 2: مرحلة استكشاف للمشاريع الأكبر

لأي مشروع أكبر من موقع بسيط أقترح خطوة استكشاف قصيرة مدفوعة. أحاور من سيستعملون النظام وأرسم خريطة العمل اليومي وأنتج ثلاث وثائق مكتوبة: قائمة مزايا النسخة الأولى ومخططًا شاشة بشاشة وسعرًا نهائيًا بمواعيد. إن واصلت يُخصم كلفة هذه الخطوة من المشروع. وإن لم تواصل فتحتفظ بالخطة وتستعملها مع أي شخص.

## الخطوة 3: نطاق واتفاق مكتوبان

قبل كتابة أي كود نتفق على صفحة واحدة تذكر ما هو مشمول وما ليس مشمولًا وعدد جولات التعديل المشمولة وما عليك تقديمه ومتى وكيف يُقسَّم الدفع. النطاق المكتوب يحمينا معًا. فأغلب المشاريع السيئة تفشل بسبب افتراضات غير مكتوبة.

## الخطوة 4: البناء بقطع صغيرة ظاهرة

أعمل بدورات قصيرة وأريك شاشات تعمل لا شرائح عرض. تتصفح صفحات حقيقية ببيانات تجريبية وتخبرني بما هو خطأ وأعدّل. يجب أن يرى موظفوك النظام مبكرًا، فهم يلاحظون أشياء يفوت المديرين.

## الخطوة 5: بياناتك الحقيقية وتجربة حقيقية

قبل الإطلاق نُدخل سجلاتك الحقيقية ويستعمل بعض الموظفين المنصّة لبضعة أيام. هنا تظهر المفاجآت، ومن الأفضل كثيرًا اكتشافها مع خمسة أشخاص لا مع المؤسسة كلها.

## الخطوة 6: الإطلاق والتدريب

في يوم الإطلاق أكون متاحًا. أدرّب الموظفين في جلسات قصيرة وأكتب تعليمات بسيطة باللغات التي يستعملها فريقك. ومن لهم حسابات من أولياء أو عملاء أو ضيوف يتلقون رسائل واضحة تشرح كيفية الدخول.

## الخطوة 7: خطة الرعاية

الاستعمال الفعلي يكشف دائمًا تحسينات، والبرنامج يحتاج تحديثات ونسخًا احتياطية وشخصًا يردّ على الهاتف. أقدّم خطة رعاية شهرية كي لا تضطر إلى ملاحقة مطوّر. هي اختيارية لكنني أنصح بها لأي نظام يستعمله موظفوك كل يوم.

## ما أحتاجه منك

- شخص واحد له صلاحية القرار ومتاح لأسئلة قصيرة خلال الأسبوع.
- وثائقك وأمثلتك الحقيقية مبكرًا لا في النهاية.
- ملاحظات صادقة. «لا بأس» لا تفيد أحدًا.

## ما تحصل عليه في النهاية

برنامج يعمل ويستعمله موظفوك، ووصول إلى بياناتك في أي وقت، ووثائق واضحة. يجب ألا تكون مقيّدًا أبدًا. وإن أردت يومًا العمل مع غيري فيمكنك ذلك.

إن كانت هذه الطريقة التي تريد العمل بها فاطّلع على [الخدمات](/ar/services)، أو [راسلني برسالة قصيرة](/ar/contact) عن مؤسستك.`,
    },
  },

  // ------------------------------------------------------------------ 7
  {
    slug: "where-should-your-platform-be-hosted",
    tags: ["Hosting", "Security", "Guide"],
    en: {
      title: "Where should your platform be hosted? Cloud, your own server, or mine",
      excerpt: "Hosting decides who can read your data, how fast problems get fixed, and what happens if you want to leave. A plain guide for non-technical owners.",
      body: `When a developer says "we will host it", ask: where, and who is responsible? Hosting is where your platform lives, and the answer affects security, cost and your freedom to change provider.

## Three common options

**1. A cloud service.** Large providers run your platform on their machines. It is fast to start, scales well, and the provider handles hardware. Costs usually grow with use. Your data lives in a data centre you choose, often abroad.

**2. A rented server (VPS).** You rent one machine from a hosting company. It costs a small fixed amount per month and gives you more control. Someone must keep it updated and backed up.

**3. Your own server, on your premises.** Your data never leaves the building. This suits places with strict control needs, but you are responsible for power, internet, hardware failure and security, and it needs real planning.

I can host a platform for you, or set it up in an account that you own so that you hold the keys. Both are fine, as long as the answers below are clear.

## Seven questions to ask anyone who hosts your system

1. **Who owns the account and the data?** It should be you.
2. **Where is the data stored, in which country?** Matters for personal data and for your own comfort.
3. **How often are backups made, and where are they kept?** A backup on the same machine is not a backup.
4. **Has a restore ever been tested?** An untested backup is a hope, not a plan.
5. **What happens when the server or internet fails?** How long until it is back?
6. **Who is notified, and how fast?** Good hosting includes monitoring that alerts a person before you notice.
7. **How do I leave?** You should be able to take your data and your code and move.

## Common mistakes

- **One machine, no backup copy elsewhere.** Disks fail. Power cuts corrupt files.
- **No monitoring.** You discover the outage from an angry parent or guest.
- **Passwords shared in WhatsApp.** Use separate accounts for each person.
- **No update plan.** Old software is how most systems get broken into.
- **Files stored only on the server.** Uploaded documents must be in the backup too.

## How to choose

- **Small organisation, standard needs:** a managed cloud or a well-run rented server, with automatic backups.
- **Sensitive data, such as health or children's records:** think carefully about where it lives, who can access it, and whether some tasks should stay on a machine you control.
- **No one technical on your team:** pay for a care plan that includes updates, backups and monitoring. This matters more than which provider you pick.

## The honest summary

The cheapest option is not the safest, and the most expensive is not automatically better. What counts is that someone is clearly responsible, backups exist and have been tested, and you can leave.

If you would like me to review how a system you already have is hosted, or plan hosting for a new one, [write to me](/en/contact). My [care plan](/en/services/care-plan) covers updates and monitoring for the platforms I build.`,
    },
    fr: {
      title: "Où héberger votre plateforme ? Cloud, votre propre serveur, ou le mien",
      excerpt: "L'hébergement décide qui peut lire vos données, à quelle vitesse les problèmes sont réglés et ce qui se passe si vous voulez partir. Un guide simple pour les non-techniciens.",
      body: `Quand un développeur dit « nous l'hébergerons », demandez : où, et qui est responsable ? L'hébergement, c'est l'endroit où vit votre plateforme, et la réponse influence la sécurité, le coût et votre liberté de changer de prestataire.

## Trois options courantes

**1. Un service cloud.** De grands fournisseurs font fonctionner votre plateforme sur leurs machines. C'est rapide à démarrer, cela s'adapte bien et le fournisseur gère le matériel. Les coûts augmentent généralement avec l'usage. Vos données vivent dans un centre de données que vous choisissez, souvent à l'étranger.

**2. Un serveur loué (VPS).** Vous louez une machine à une société d'hébergement. Cela coûte un petit montant fixe par mois et vous donne plus de contrôle. Quelqu'un doit le tenir à jour et le sauvegarder.

**3. Votre propre serveur, dans vos locaux.** Vos données ne quittent jamais le bâtiment. Cela convient aux lieux aux exigences strictes de contrôle, mais vous êtes responsable de l'électricité, d'Internet, des pannes matérielles et de la sécurité, et cela demande une vraie préparation.

Je peux héberger une plateforme pour vous, ou l'installer dans un compte dont vous êtes propriétaire afin que vous déteniez les clés. Les deux conviennent, tant que les réponses ci-dessous sont claires.

## Sept questions à poser à quiconque héberge votre système

1. **À qui appartiennent le compte et les données ?** À vous.
2. **Où les données sont-elles stockées, dans quel pays ?** Cela compte pour les données personnelles et pour votre tranquillité.
3. **À quelle fréquence les sauvegardes sont-elles faites, et où sont-elles conservées ?** Une sauvegarde sur la même machine n'est pas une sauvegarde.
4. **Une restauration a-t-elle déjà été testée ?** Une sauvegarde non testée est un espoir, pas un plan.
5. **Que se passe-t-il si le serveur ou Internet tombe ?** Combien de temps avant le retour ?
6. **Qui est prévenu, et à quelle vitesse ?** Un bon hébergement inclut une surveillance qui alerte une personne avant que vous ne le remarquiez.
7. **Comment partir ?** Vous devez pouvoir emporter vos données et votre code et déménager.

## Erreurs courantes

- **Une seule machine, aucune copie de sauvegarde ailleurs.** Les disques tombent en panne. Les coupures de courant corrompent les fichiers.
- **Aucune surveillance.** Vous découvrez la panne par un parent ou un client mécontent.
- **Mots de passe partagés sur WhatsApp.** Utilisez des comptes séparés pour chaque personne.
- **Aucun plan de mise à jour.** Les vieux logiciels sont la porte d'entrée de la plupart des intrusions.
- **Fichiers stockés uniquement sur le serveur.** Les documents téléversés doivent aussi être dans la sauvegarde.

## Comment choisir

- **Petite organisation, besoins standard :** un cloud géré ou un serveur loué bien exploité, avec sauvegardes automatiques.
- **Données sensibles, comme des dossiers de santé ou d'enfants :** réfléchissez bien à l'endroit où elles vivent, à qui peut y accéder, et à la possibilité de garder certaines tâches sur une machine que vous contrôlez.
- **Personne de technique dans votre équipe :** payez un forfait de suivi incluant mises à jour, sauvegardes et surveillance. C'est plus important que le choix du prestataire.

## Le résumé honnête

L'option la moins chère n'est pas la plus sûre, et la plus chère n'est pas automatiquement meilleure. Ce qui compte, c'est que quelqu'un soit clairement responsable, que des sauvegardes existent et aient été testées, et que vous puissiez partir.

Si vous voulez que je vérifie l'hébergement d'un système existant ou que je planifie celui d'un nouveau, [écrivez-moi](/fr/contact). Mon [forfait de suivi](/fr/services/care-plan) couvre les mises à jour et la surveillance des plateformes que je construis.`,
    },
    ar: {
      title: "أين تُستضاف منصّتك؟ السحابة أم خادمك الخاص أم خادمي",
      excerpt: "الاستضافة تقرّر من يستطيع قراءة بياناتك وسرعة إصلاح المشكلات وما يحدث إن أردت المغادرة. دليل بسيط لأصحاب المشاريع غير التقنيين.",
      body: `حين يقول المطوّر «سنستضيفه»، اسأل: أين ومن المسؤول؟ الاستضافة هي المكان الذي تعيش فيه منصّتك، وجوابها يؤثر في الأمان والتكلفة وحرّيتك في تغيير المزوّد.

## ثلاثة خيارات شائعة

**1. خدمة سحابية.** مزوّدون كبار يشغّلون منصّتك على أجهزتهم. البدء سريع والتوسّع سهل والمزوّد يتولى العتاد. وتزداد التكلفة عادةً مع الاستعمال. وتعيش بياناتك في مركز بيانات تختاره، وكثيرًا ما يكون في الخارج.

**2. خادم مستأجَر (VPS).** تستأجر جهازًا من شركة استضافة. كلفته مبلغ شهري ثابت صغير ويمنحك تحكمًا أكبر. ويجب أن يتولى أحد تحديثه ونسخه احتياطيًا.

**3. خادمك الخاص في مقرّك.** بياناتك لا تغادر المبنى. يناسب الأماكن ذات متطلبات التحكم الصارمة، لكنك تتحمل مسؤولية الكهرباء والإنترنت وأعطال العتاد والأمان، ويحتاج تخطيطًا حقيقيًا.

أستطيع استضافة منصّة لك، أو إعدادها في حساب تملكه أنت فتحتفظ بالمفاتيح. كلاهما مقبول ما دامت الإجابات أدناه واضحة.

## سبعة أسئلة لمن يستضيف نظامك

1. **لمن يعود الحساب والبيانات؟** يجب أن يكون لك.
2. **أين تُخزَّن البيانات وفي أي بلد؟** يهم للبيانات الشخصية ولراحتك.
3. **كم مرة تُؤخذ النسخ الاحتياطية وأين تُحفَظ؟** نسخة على الجهاز نفسه ليست نسخة احتياطية.
4. **هل جُرِّبت الاستعادة يومًا؟** نسخة غير مجرَّبة أمل لا خطة.
5. **ماذا يحدث حين يتعطل الخادم أو الإنترنت؟** وكم يستغرق الرجوع؟
6. **من يُبلَّغ وبأي سرعة؟** الاستضافة الجيدة تتضمن مراقبة تنبّه شخصًا قبل أن تلاحظ أنت.
7. **كيف أغادر؟** يجب أن تستطيع أخذ بياناتك وكودك والانتقال.

## أخطاء شائعة

- **جهاز واحد بلا نسخة احتياطية في مكان آخر.** الأقراص تتعطل وانقطاع الكهرباء يتلف الملفات.
- **لا مراقبة.** فتكتشف العطل من ولي أمر أو ضيف غاضب.
- **كلمات مرور تُشارَك في واتساب.** استعمل حسابًا منفصلًا لكل شخص.
- **لا خطة تحديث.** البرامج القديمة هي ثغرة أغلب الاختراقات.
- **ملفات مخزّنة على الخادم فقط.** يجب أن تكون الوثائق المرفوعة ضمن النسخة الاحتياطية أيضًا.

## كيف تختار

- **مؤسسة صغيرة باحتياجات معيارية:** سحابة مُدارة أو خادم مستأجَر حسن التشغيل مع نسخ احتياطية تلقائية.
- **بيانات حساسة كسجلات صحية أو سجلات أطفال:** فكّر بعناية في مكانها ومن يصل إليها وهل تبقى بعض المهام على جهاز تتحكم فيه.
- **لا أحد تقنيًا في فريقك:** ادفع لخطة رعاية تشمل التحديثات والنسخ الاحتياطية والمراقبة. هذا أهم من اختيار المزوّد.

## الخلاصة الصادقة

الخيار الأرخص ليس الأكثر أمانًا، والأغلى ليس الأفضل تلقائيًا. المهم أن يكون أحد مسؤولًا بوضوح، وأن توجد نسخ احتياطية مجرَّبة، وأن تستطيع المغادرة.

إن أردت أن أراجع استضافة نظام قائم أو أخطّط لاستضافة نظام جديد فـ[راسلني](/ar/contact). و[خطة الرعاية](/ar/services/care-plan) عندي تغطي التحديثات والمراقبة للمنصّات التي أبنيها.`,
    },
  },

  // ------------------------------------------------------------------ 8
  {
    slug: "hotel-and-restaurant-software-what-to-ask",
    tags: ["Hospitality", "Hotels", "Software"],
    en: {
      title: "Hotel and restaurant software: what to ask before you buy",
      excerpt: "Reservations, staff, shifts and reports. A buyer's checklist for hotel and restaurant owners, and the traps to avoid.",
      body: `A hotel or restaurant runs on timing: rooms and tables to fill, staff on the right shift, and guests who judge you in minutes. The right software removes friction. The wrong one adds another screen for everyone to fight with.

I have built a platform for a hospitality business, and this is the checklist I use when someone asks me what to look for.

## 1. Start with the daily routine, not the feature list

Ask the manager, the receptionist and the housekeeper to describe one ordinary day. Where do they lose time? Where do mistakes happen? Software should be judged against those moments, not against a brochure.

## 2. Does each person see only their part?

An owner needs reports. A receptionist needs bookings and room status. Housekeeping needs a list of rooms to clean. Kitchen staff need orders. If everyone sees everything, mistakes and leaks follow. Insist on roles, and test them with real accounts.

## 3. Rooms, tables and bookings

- Can you see availability at a glance, on a phone?
- What happens when a booking changes at the last minute?
- Does it prevent double bookings?
- If you sell through booking websites, does it connect to them, or will you update each one by hand?

## 4. Staff, shifts and attendance

Labour is usually your largest cost. Check how the system records who arrived and when. Some businesses connect a biometric terminal so that attendance is recorded automatically and cannot be shared. If you consider this, ask how staff data is protected and what staff are told, and ask a lawyer about your obligations.

## 5. Languages

Guests may speak one language and staff another. A system that works in Arabic, French and English, with right-to-left done correctly, avoids a lot of confusion. Test every screen, not just the home page.

## 6. Money

- Which payment methods does it support, and which do you actually use?
- Does it ever store card details? It should not. Cards should be handled by a payment provider.
- Can you export what your accountant needs without retyping?

## 7. Reports you will actually read

A useful report answers a question you ask every week: occupancy, revenue by day, busiest hours, staff hours. Ask to see a real report, on a phone, with sample data.

## 8. What happens when the internet fails?

Hospitality does not stop when the connection drops. Ask what keeps working, what waits, and how it catches up.

## 9. Your data and your exit

Can you export your bookings and guest records at any time? If you stop paying or change provider, do you keep everything?

## Ready-made or built for you?

Many hotels are well served by a ready-made system, especially small ones with standard needs. A custom platform makes sense when you have several properties, unusual roles, special reporting, or you are tired of paying monthly for features you do not use.

If you want to talk it through, see the [management platform service](/en/services/management-platform) or [describe your hotel or restaurant to me](/en/contact). I will tell you honestly whether you need me at all.`,
    },
    fr: {
      title: "Logiciel pour hôtel et restaurant : ce qu'il faut demander avant d'acheter",
      excerpt: "Réservations, personnel, plannings et rapports. Une liste de contrôle pour les propriétaires d'hôtels et de restaurants, et les pièges à éviter.",
      body: `Un hôtel ou un restaurant vit de timing : des chambres et des tables à remplir, du personnel au bon poste, et des clients qui vous jugent en quelques minutes. Le bon logiciel supprime les frictions. Le mauvais ajoute un écran de plus contre lequel tout le monde se bat.

J'ai construit une plateforme pour une entreprise d'hôtellerie, et voici la liste que j'utilise quand on me demande quoi chercher.

## 1. Partez de la routine quotidienne, pas de la liste de fonctions

Demandez au gérant, à la réceptionniste et à la gouvernante de décrire une journée ordinaire. Où perdent-ils du temps ? Où se produisent les erreurs ? Un logiciel doit être jugé sur ces moments, pas sur une brochure.

## 2. Chacun ne voit-il que sa partie ?

Un propriétaire a besoin de rapports. Une réceptionniste a besoin des réservations et de l'état des chambres. Le service d'étage a besoin d'une liste de chambres à nettoyer. La cuisine a besoin des commandes. Si chacun voit tout, les erreurs et les fuites suivent. Exigez des rôles, et testez-les avec de vrais comptes.

## 3. Chambres, tables et réservations

- Voyez-vous la disponibilité d'un coup d'œil, sur un téléphone ?
- Que se passe-t-il quand une réservation change à la dernière minute ?
- Le logiciel évite-t-il les doubles réservations ?
- Si vous vendez via des sites de réservation, se connecte-t-il à eux, ou devrez-vous mettre chacun à jour à la main ?

## 4. Personnel, plannings et présence

La main-d'œuvre est généralement votre plus gros coût. Vérifiez comment le système enregistre qui est arrivé et quand. Certaines entreprises relient un terminal biométrique pour que la présence soit enregistrée automatiquement et ne puisse pas être partagée. Si vous y pensez, demandez comment les données du personnel sont protégées et ce qu'on dit aux employés, et interrogez un juriste sur vos obligations.

## 5. Langues

Les clients parlent une langue et le personnel une autre. Un système qui fonctionne en arabe, en français et en anglais, avec la mise en page de droite à gauche correcte, évite beaucoup de confusion. Testez chaque écran, pas seulement la page d'accueil.

## 6. L'argent

- Quels moyens de paiement sont pris en charge, et lesquels utilisez-vous vraiment ?
- Stocke-t-il des données de carte ? Il ne le devrait pas. Les cartes doivent être gérées par un prestataire de paiement.
- Pouvez-vous exporter ce dont votre comptable a besoin sans ressaisir ?

## 7. Des rapports que vous lirez vraiment

Un rapport utile répond à une question que vous posez chaque semaine : taux d'occupation, revenus par jour, heures de pointe, heures du personnel. Demandez à voir un vrai rapport, sur un téléphone, avec des données d'exemple.

## 8. Que se passe-t-il quand Internet tombe ?

L'hôtellerie ne s'arrête pas quand la connexion coupe. Demandez ce qui continue de fonctionner, ce qui attend et comment le système rattrape.

## 9. Vos données et votre sortie

Pouvez-vous exporter vos réservations et fiches clients à tout moment ? Si vous cessez de payer ou changez de prestataire, gardez-vous tout ?

## Prêt à l'emploi ou sur mesure ?

Beaucoup d'hôtels sont bien servis par un système prêt à l'emploi, surtout les petits aux besoins standard. Une plateforme sur mesure se justifie quand vous avez plusieurs établissements, des rôles particuliers, des rapports spécifiques, ou que vous en avez assez de payer chaque mois des fonctions que vous n'utilisez pas.

Si vous voulez en discuter, voyez le [service de plateforme de gestion](/fr/services/management-platform) ou [décrivez-moi votre hôtel ou restaurant](/fr/contact). Je vous dirai honnêtement si vous avez besoin de moi.`,
    },
    ar: {
      title: "برنامج للفنادق والمطاعم: ما يجب أن تسأل عنه قبل الشراء",
      excerpt: "الحجوزات والموظفون والمناوبات والتقارير. قائمة تحقق لأصحاب الفنادق والمطاعم، وأفخاخ يجب تفاديها.",
      body: `الفندق أو المطعم يقوم على التوقيت: غرف وطاولات تُملأ وموظفون في المناوبة الصحيحة وضيوف يحكمون عليك في دقائق. البرنامج الجيد يزيل الاحتكاك، والسيئ يضيف شاشة أخرى يتصارع معها الجميع.

بنيتُ منصّة لنشاط في الضيافة، وهذه القائمة التي أعتمدها حين يسألني أحد عمّا يبحث عنه.

## 1. ابدأ من الروتين اليومي لا من قائمة المزايا

اطلب من المسيّر وموظفة الاستقبال وعاملة النظافة أن يصفوا يومًا عاديًا. أين يضيع الوقت؟ وأين تقع الأخطاء؟ احكم على البرنامج بهذه اللحظات لا بالنشرة الدعائية.

## 2. هل يرى كل شخص جزءه فقط؟

المالك يحتاج تقارير. والاستقبال يحتاج الحجوزات وحالة الغرف. وعاملات النظافة يحتجن قائمة الغرف المطلوب تنظيفها. والمطبخ يحتاج الطلبات. إن رأى الجميع كل شيء فالأخطاء والتسريبات قادمة. أصرّ على الأدوار وجرّبها بحسابات حقيقية.

## 3. الغرف والطاولات والحجوزات

- هل ترى التوفّر بنظرة واحدة على الهاتف؟
- ماذا يحدث حين يتغير حجز في اللحظة الأخيرة؟
- هل يمنع الحجز المزدوج؟
- إن كنت تبيع عبر مواقع الحجز فهل يرتبط بها أم ستحدّث كل موقع يدويًا؟

## 4. الموظفون والمناوبات والحضور

اليد العاملة عادةً أكبر تكلفة عندك. تحقق من كيفية تسجيل النظام لمن حضر ومتى. بعض الأنشطة تربط جهازًا بيومتريًا ليُسجَّل الحضور تلقائيًا ولا يمكن تقاسمه. إن فكرت في هذا فاسأل كيف تُحمى بيانات الموظفين وماذا يُقال لهم، واسأل محاميًا عن التزاماتك.

## 5. اللغات

قد يتكلم الضيوف لغة والموظفون أخرى. نظام يعمل بالعربية والفرنسية والإنجليزية مع اتجاه يمين لليسار صحيح يجنّب كثيرًا من الالتباس. جرّب كل شاشة لا الصفحة الرئيسية فقط.

## 6. المال

- ما وسائل الدفع المدعومة، وأيها تستعمل فعلًا؟
- هل يخزّن بيانات البطاقات؟ يجب ألا يفعل. ينبغي أن يتولى مزوّد الدفع البطاقات.
- هل تستطيع تصدير ما يحتاجه محاسبك دون إعادة كتابة؟

## 7. تقارير ستقرؤها فعلًا

التقرير المفيد يجيب عن سؤال تطرحه كل أسبوع: نسبة الإشغال والإيراد حسب اليوم وساعات الذروة وساعات الموظفين. اطلب رؤية تقرير حقيقي على الهاتف ببيانات تجريبية.

## 8. ماذا يحدث حين ينقطع الإنترنت؟

الضيافة لا تتوقف حين تنقطع الشبكة. اسأل ما الذي يستمر وما الذي ينتظر وكيف يلحق النظام.

## 9. بياناتك ومخرجك

هل تستطيع تصدير حجوزاتك وسجلات ضيوفك في أي وقت؟ وإن توقفت عن الدفع أو غيّرت المزوّد فهل تحتفظ بكل شيء؟

## جاهز أم مبني خصيصًا لك؟

كثير من الفنادق يكفيها نظام جاهز، خاصة الصغيرة باحتياجات معيارية. والمنصّة المخصّصة تنفع حين تكون لك عدة منشآت أو أدوار غير معتادة أو تقارير خاصة، أو حين تتعب من دفع اشتراك شهري لمزايا لا تستعملها.

إن أردت أن نتحدث فاطّلع على [خدمة منصّة الإدارة](/ar/services/management-platform) أو [صِف لي فندقك أو مطعمك](/ar/contact). سأقول لك بصدق إن كنت تحتاجني أصلًا.`,
    },
  },

  // ------------------------------------------------------------------ 9
  {
    slug: "clinic-software-privacy-checklist",
    tags: ["Clinics", "Privacy", "Healthcare"],
    en: {
      title: "Clinic and midwife software: a privacy checklist before you choose",
      excerpt: "Patient records are among the most sensitive data a small business holds. Questions to ask any software provider, including me.",
      body: `A clinic keeps records that people would never want to see in the wrong hands. When you choose booking and records software, privacy is not a bonus feature. It is the main question.

I have built a platform for a midwife practice, where privacy shaped every decision. This article is not legal or medical advice. For your obligations, ask a lawyer who knows health data in your country. Here are the questions I would ask any provider.

## 1. Who can see a patient's record?

List every role in your clinic. For each one, decide what they may see. A receptionist may need a name and an appointment, not a diagnosis. Then check that the software enforces this, and does not merely hide buttons.

## 2. Is there a log of who opened what?

If a record is read by someone who should not have, you need to know. A good system keeps an audit log that shows who viewed or changed a record, and when. Ask to see one.

## 3. Where is the data stored?

Ask the country and the type of server. Ask whether the provider's own staff can read your records. Ask what happens to data when you leave.

## 4. What about AI features?

Many tools now offer AI to summarise notes or draft messages. Ask exactly where the text goes. If patient information is sent to an outside cloud service, you must know, and your patients may need to be told. The safest design keeps tasks that touch personal data on a model running on a machine you control, and stops the task if that model is unavailable, rather than quietly sending the data elsewhere. This is how I built the midwife platform.

## 5. Consent and information for patients

Patients should know what is stored and why. Ask whether the software can record consent and show patients clear information. In Morocco, personal data is covered by a law overseen by the CNDP, and health data is especially sensitive, so check with a lawyer what you must declare.

## 6. Appointment reminders without leaking details

Reminders by message are useful. Make sure they do not reveal the reason for the visit. "You have an appointment on Tuesday at 10:00" is enough.

## 7. Backups and recovery

Records must survive a broken computer. Ask how often backups are made, where they live, whether they are encrypted, and whether a restore has been tested.

## 8. Accounts and passwords

Every staff member needs their own login. Shared passwords make a log meaningless. Ask about password reset, extra verification for staff, and what happens when someone leaves your clinic.

## 9. Leaving

You should be able to export your records in a usable format, and delete what you must.

## Questions I would ask me

- Who has access to the servers that hold the data?
- How are backups protected?
- What do you log, and for how long?
- What happens to the data if we stop working together?

A provider who answers these clearly is worth considering. One who cannot should worry you.

If you run a clinic or practice and want to talk about a privacy-first platform, see the [management platform](/en/services/management-platform) or [write to me](/en/contact). I will explain what I can do and what you should check with a lawyer.`,
    },
    fr: {
      title: "Logiciel pour cabinet et sage-femme : une liste de contrôle de confidentialité avant de choisir",
      excerpt: "Les dossiers de patients comptent parmi les données les plus sensibles qu'une petite structure détient. Les questions à poser à tout fournisseur de logiciel, moi compris.",
      body: `Un cabinet conserve des dossiers que personne ne voudrait voir entre de mauvaises mains. Quand vous choisissez un logiciel de rendez-vous et de dossiers, la confidentialité n'est pas une option. C'est la question principale.

J'ai construit une plateforme pour un cabinet de sage-femme, où la confidentialité a façonné chaque décision. Cet article n'est ni un avis juridique ni un avis médical. Pour vos obligations, demandez à un juriste qui connaît les données de santé dans votre pays. Voici les questions que je poserais à tout fournisseur.

## 1. Qui peut voir le dossier d'un patient ?

Listez chaque rôle de votre cabinet. Pour chacun, décidez ce qu'il peut voir. Une secrétaire peut avoir besoin d'un nom et d'un rendez-vous, pas d'un diagnostic. Vérifiez ensuite que le logiciel l'impose, et ne se contente pas de masquer des boutons.

## 2. Existe-t-il un journal de qui a ouvert quoi ?

Si un dossier est lu par quelqu'un qui n'aurait pas dû, vous devez le savoir. Un bon système tient un journal d'audit montrant qui a consulté ou modifié un dossier, et quand. Demandez à en voir un.

## 3. Où les données sont-elles stockées ?

Demandez le pays et le type de serveur. Demandez si le personnel du fournisseur peut lire vos dossiers. Demandez ce qu'il advient des données quand vous partez.

## 4. Et les fonctions d'IA ?

Beaucoup d'outils proposent maintenant de l'IA pour résumer des notes ou rédiger des messages. Demandez exactement où va le texte. Si des informations de patients sont envoyées à un service cloud externe, vous devez le savoir, et vos patients devront peut-être en être informés. La conception la plus sûre garde les tâches touchant des données personnelles sur un modèle qui tourne sur une machine que vous contrôlez, et arrête la tâche si ce modèle est indisponible, plutôt que d'envoyer discrètement les données ailleurs. C'est ainsi que j'ai construit la plateforme de la sage-femme.

## 5. Consentement et information des patients

Les patients doivent savoir ce qui est conservé et pourquoi. Demandez si le logiciel peut enregistrer le consentement et présenter une information claire. Au Maroc, les données personnelles relèvent d'une loi supervisée par la CNDP, et les données de santé sont particulièrement sensibles ; vérifiez avec un juriste ce que vous devez déclarer.

## 6. Des rappels de rendez-vous sans fuite de détails

Les rappels par message sont utiles. Assurez-vous qu'ils ne révèlent pas le motif de la visite. « Vous avez rendez-vous mardi à 10 h » suffit.

## 7. Sauvegardes et reprise

Les dossiers doivent survivre à un ordinateur en panne. Demandez à quelle fréquence les sauvegardes sont faites, où elles se trouvent, si elles sont chiffrées, et si une restauration a été testée.

## 8. Comptes et mots de passe

Chaque membre du personnel a besoin de son propre identifiant. Des mots de passe partagés rendent un journal inutile. Interrogez sur la réinitialisation des mots de passe, la vérification supplémentaire pour le personnel, et ce qui se passe quand quelqu'un quitte votre cabinet.

## 9. Partir

Vous devez pouvoir exporter vos dossiers dans un format utilisable, et supprimer ce que vous devez supprimer.

## Les questions que je me poserais à moi-même

- Qui a accès aux serveurs qui contiennent les données ?
- Comment les sauvegardes sont-elles protégées ?
- Que journalisez-vous, et pendant combien de temps ?
- Que deviennent les données si nous cessons de travailler ensemble ?

Un fournisseur qui répond clairement à ces questions mérite d'être considéré. Celui qui ne le peut pas doit vous inquiéter.

Si vous dirigez un cabinet et souhaitez parler d'une plateforme axée sur la confidentialité, voyez la [plateforme de gestion](/fr/services/management-platform) ou [écrivez-moi](/fr/contact). J'expliquerai ce que je peux faire et ce que vous devez vérifier avec un juriste.`,
    },
    ar: {
      title: "برنامج للعيادات والقابلات: قائمة خصوصية قبل أن تختار",
      excerpt: "سجلات المرضى من أكثر البيانات حساسية التي يحتفظ بها مشروع صغير. أسئلة تطرحها على أي مزوّد برنامج، بما فيهم أنا.",
      body: `تحتفظ العيادة بسجلات لا يريد أحد أن تقع في أيدٍ خاطئة. وحين تختار برنامج مواعيد وسجلات فالخصوصية ليست ميزة إضافية. إنها السؤال الأول.

بنيتُ منصّة لعيادة قابلة، حيث شكّلت الخصوصية كل قرار. هذا المقال ليس استشارة قانونية أو طبية. وبشأن التزاماتك اسأل محاميًا يعرف قانون البيانات الصحية في بلدك. هذه الأسئلة التي أطرحها على أي مزوّد.

## 1. من يستطيع رؤية سجل المريضة؟

اذكر كل دور في عيادتك. وحدّد لكل دور ما يحق له رؤيته. قد تحتاج الكاتبة اسمًا وموعدًا لا تشخيصًا. ثم تأكد أن البرنامج يفرض ذلك فعلًا ولا يكتفي بإخفاء أزرار.

## 2. هل يوجد سجل بمن فتح ماذا؟

إن قرأ سجلًّا شخص لا يحق له فيجب أن تعرف. النظام الجيد يحتفظ بسجل تدقيق يبيّن من اطلع على السجل أو عدّله ومتى. اطلب رؤية واحد.

## 3. أين تُخزَّن البيانات؟

اسأل عن البلد ونوع الخادم. واسأل هل يستطيع موظفو المزوّد قراءة سجلاتك. واسأل ماذا يحدث للبيانات إذا غادرت.

## 4. ماذا عن مزايا الذكاء الاصطناعي؟

كثير من الأدوات تقدّم اليوم ذكاءً اصطناعيًا لتلخيص الملاحظات أو صياغة الرسائل. اسأل إلى أين يذهب النص بالضبط. إن أُرسلت معلومات المريضات إلى خدمة سحابية خارجية فيجب أن تعرف، وقد يلزم إعلام مريضاتك. التصميم الأكثر أمانًا يُبقي المهام التي تمسّ البيانات الشخصية على نموذج يعمل على جهاز تتحكم فيه، ويوقف المهمة إن لم يتوفر النموذج بدل إرسال البيانات إلى مكان آخر بصمت. هكذا بنيتُ منصّة القابلة.

## 5. الموافقة وإعلام المريضات

يجب أن تعرف المريضات ما الذي يُحفَظ ولماذا. اسأل هل يستطيع البرنامج تسجيل الموافقة وعرض معلومات واضحة. في المغرب تخضع المعطيات الشخصية لقانون تشرف عليه اللجنة الوطنية (CNDP)، والمعطيات الصحية حساسة جدًا، فاسأل محاميًا عمّا يجب أن تصرّح به.

## 6. تذكيرات المواعيد دون تسريب التفاصيل

التذكير برسالة مفيد. تأكد ألا يكشف سبب الزيارة. «لديك موعد الثلاثاء الساعة 10:00» يكفي.

## 7. النسخ الاحتياطية والاستعادة

يجب أن تنجو السجلات من تعطل حاسوب. اسأل كم مرة تُؤخذ النسخ وأين توجد وهل هي مشفّرة وهل جُرِّبت الاستعادة.

## 8. الحسابات وكلمات المرور

كل موظف يحتاج حسابه الخاص. كلمات المرور المشتركة تجعل السجل بلا معنى. اسأل عن استعادة كلمة المرور والتحقق الإضافي للموظفين وما يحدث حين يغادر شخص عيادتك.

## 9. المغادرة

يجب أن تستطيع تصدير سجلاتك بصيغة قابلة للاستعمال وحذف ما يجب حذفه.

## أسئلة كنت سأطرحها على نفسي

- من يصل إلى الخوادم التي تحمل البيانات؟
- كيف تُحمى النسخ الاحتياطية؟
- ماذا تسجّلون ولكم من الوقت؟
- ماذا يحدث للبيانات إن توقفنا عن العمل معًا؟

مزوّد يجيب عن هذه الأسئلة بوضوح يستحق النظر. ومن لا يستطيع ذلك يجب أن يقلقك.

إن كنت تدير عيادة وتريد الحديث عن منصّة تضع الخصوصية أولًا فاطّلع على [منصّة الإدارة](/ar/services/management-platform) أو [راسلني](/ar/contact). سأشرح ما أستطيع فعله وما عليك التحقق منه مع محامٍ.`,
    },
  },

  // ------------------------------------------------------------------ 10
  {
    slug: "arabic-rtl-web-app-mistakes",
    tags: ["Arabic", "RTL", "Next.js", "Developers"],
    en: {
      title: "Arabic and right-to-left in a web app: 9 mistakes that make it feel broken",
      excerpt: "Flipping the page direction is the easy part. These are the details that make Arabic users think a product was not made for them.",
      body: `Many web apps "support Arabic" by adding translations and a direction switch. Arabic readers can still tell within seconds that the product was not designed for them. After building apps in Arabic, French and English, these are the mistakes I see most.

## 1. Setting the direction on the page, but not thinking in logical terms

Writing \`margin-left\` and \`padding-right\` bakes in a direction. Use logical properties instead: \`margin-inline-start\`, \`padding-inline-end\`, \`text-align: start\`. In Tailwind, use \`ms-*\`, \`pe-*\`, \`start-0\` and \`text-start\`. The layout then flips by itself.

## 2. Letter-spacing and uppercase styling

Arabic letters join. Adding letter-spacing breaks the joins and makes words look torn apart. Uppercase has no meaning in Arabic. Apply tracking and uppercase only to Latin text, or turn them off for Arabic.

## 3. Mixed text jumping around

A sentence in Arabic containing a number, an email, a URL or a brand name in Latin letters can reorder in confusing ways. Wrap the foreign part in an element with \`dir="ltr"\`, or use the \`<bdi>\` element, and give text inputs \`dir="auto"\` so the direction follows what the user types.

## 4. Flipping everything, including what must not flip

Arrows that mean "next" or "back" should flip. A play button, a clock, a checkmark, a logo and a phone number should not. Check each icon on purpose, rather than flipping a whole container.

## 5. A font that was never tested

Arabic needs a font designed for it, with enough weights, and often a larger size and more line height than Latin text to feel comfortable. A fallback font that looks fine in Latin can make Arabic cramped or ugly. Choose an Arabic font deliberately and test long paragraphs.

## 6. Building sentences by joining pieces

\`"Welcome " + name + ", you have " + count + " messages"\` cannot be translated. Word order differs, and Arabic has special plural forms for one, two, few and many. Translate whole sentences with placeholders, and use proper plural rules, not "add an s".

## 7. Numbers, dates and currency

Choose on purpose between Western digits (0 to 9) and Eastern Arabic-Indic digits. In Morocco, Western digits are the norm. Format with \`Intl.NumberFormat\` and \`Intl.DateTimeFormat\` using the locale, instead of formatting by hand. Remember that the Hijri calendar matters to some users.

## 8. Tables, charts and truncation

Tables must flip, including the column order and the position of the actions. Charts with a time axis are a design choice: many products keep time left-to-right even in Arabic. Whatever you pick, apply it consistently. Truncated text with an ellipsis must cut at the correct end.

## 9. Testing with lorem ipsum

Placeholder Latin text hides the problems. Test with real Arabic, with long names, with mixed numbers, and ideally with someone who reads Arabic every day. A native reader will find in five minutes what you missed in five hours.

## A small checklist

- Logical CSS properties everywhere
- A tested Arabic font and a comfortable line height
- No letter-spacing on Arabic text
- \`dir="auto"\` on inputs, \`dir="ltr"\` on emails, numbers and URLs
- Whole-sentence translations with plural rules
- A native reader on your review team

I built my own platform in English, French and Arabic from the first line, and I am packaging that work as a [trilingual SaaS starter](/en/templates/trilingual-saas-starter) and a [course on building Arabic RTL apps](/en/courses/trilingual-rtl-app). Join the list on those pages to hear when they are ready, or [contact me](/en/contact) if you need an app built this way.`,
    },
    fr: {
      title: "Arabe et droite-à-gauche dans une application web : 9 erreurs qui donnent l'impression qu'elle est cassée",
      excerpt: "Inverser la direction de la page, c'est la partie facile. Ce sont les détails qui font croire aux utilisateurs arabophones que le produit n'a pas été pensé pour eux.",
      body: `Beaucoup d'applications web « prennent en charge l'arabe » en ajoutant des traductions et un bouton de direction. Les lecteurs arabes voient pourtant en quelques secondes que le produit n'a pas été conçu pour eux. Après avoir construit des applications en arabe, en français et en anglais, voici les erreurs que je vois le plus.

## 1. Définir la direction de la page sans penser en termes logiques

Écrire \`margin-left\` et \`padding-right\` fige une direction. Utilisez plutôt les propriétés logiques : \`margin-inline-start\`, \`padding-inline-end\`, \`text-align: start\`. Dans Tailwind, utilisez \`ms-*\`, \`pe-*\`, \`start-0\` et \`text-start\`. La mise en page s'inverse alors toute seule.

## 2. L'espacement des lettres et les majuscules

Les lettres arabes se lient. Ajouter de l'espacement entre les lettres casse les liaisons et fait paraître les mots déchirés. Les majuscules n'ont aucun sens en arabe. Appliquez l'espacement et les majuscules seulement au texte latin, ou désactivez-les pour l'arabe.

## 3. Du texte mixte qui saute

Une phrase en arabe contenant un nombre, un e-mail, une URL ou un nom de marque en lettres latines peut se réordonner de façon confuse. Entourez la partie étrangère d'un élément avec \`dir="ltr"\`, ou utilisez l'élément \`<bdi>\`, et donnez aux champs de texte \`dir="auto"\` pour que la direction suive ce que l'utilisateur saisit.

## 4. Tout inverser, y compris ce qui ne doit pas l'être

Les flèches qui signifient « suivant » ou « retour » doivent s'inverser. Un bouton de lecture, une horloge, une coche, un logo et un numéro de téléphone ne le doivent pas. Vérifiez chaque icône volontairement, plutôt que d'inverser un conteneur entier.

## 5. Une police jamais testée

L'arabe a besoin d'une police conçue pour lui, avec assez de graisses, et souvent d'une taille plus grande et d'un interligne plus ample que le texte latin pour être confortable. Une police de secours qui paraît correcte en latin peut rendre l'arabe serré ou laid. Choisissez une police arabe délibérément et testez de longs paragraphes.

## 6. Construire des phrases en assemblant des morceaux

\`"Bienvenue " + nom + ", vous avez " + n + " messages"\` ne peut pas être traduit. L'ordre des mots diffère, et l'arabe a des formes de pluriel spéciales pour un, deux, quelques et beaucoup. Traduisez des phrases entières avec des variables, et utilisez de vraies règles de pluriel, pas « ajouter un s ».

## 7. Nombres, dates et monnaie

Choisissez délibérément entre les chiffres occidentaux (0 à 9) et les chiffres arabes orientaux. Au Maroc, les chiffres occidentaux sont la norme. Formatez avec \`Intl.NumberFormat\` et \`Intl.DateTimeFormat\` en utilisant la locale, au lieu de formater à la main. N'oubliez pas que le calendrier hégirien compte pour certains utilisateurs.

## 8. Tableaux, graphiques et troncature

Les tableaux doivent s'inverser, y compris l'ordre des colonnes et la position des actions. Les graphiques avec un axe du temps sont un choix de conception : beaucoup de produits gardent le temps de gauche à droite même en arabe. Quel que soit votre choix, appliquez-le de façon cohérente. Un texte tronqué avec des points de suspension doit être coupé du bon côté.

## 9. Tester avec du lorem ipsum

Un texte latin d'exemple cache les problèmes. Testez avec de vrai arabe, avec de longs noms, avec des nombres mélangés, et idéalement avec quelqu'un qui lit l'arabe tous les jours. Un lecteur natif trouvera en cinq minutes ce que vous avez manqué en cinq heures.

## Une petite liste de contrôle

- Des propriétés CSS logiques partout
- Une police arabe testée et un interligne confortable
- Pas d'espacement des lettres sur le texte arabe
- \`dir="auto"\` sur les champs, \`dir="ltr"\` sur les e-mails, nombres et URL
- Des traductions de phrases entières avec règles de pluriel
- Un lecteur natif dans votre équipe de relecture

J'ai construit ma propre plateforme en anglais, en français et en arabe dès la première ligne, et je prépare ce travail sous forme de [starter SaaS trilingue](/fr/templates/trilingual-saas-starter) et de [cours sur la création d'applications arabes RTL](/fr/courses/trilingual-rtl-app). Inscrivez-vous sur ces pages pour être prévenu de leur sortie, ou [contactez-moi](/fr/contact) si vous avez besoin d'une application construite ainsi.`,
    },
    ar: {
      title: "العربية والاتجاه من اليمين إلى اليسار في تطبيق ويب: 9 أخطاء تجعله يبدو معطوبًا",
      excerpt: "قلب اتجاه الصفحة هو الجزء السهل. هذه التفاصيل هي ما يجعل المستخدم العربي يشعر أن المنتج لم يُصمَّم له.",
      body: `كثير من تطبيقات الويب «تدعم العربية» بإضافة ترجمات وزر اتجاه. ومع ذلك يدرك القارئ العربي خلال ثوانٍ أن المنتج لم يُصمَّم له. بعد بناء تطبيقات بالعربية والفرنسية والإنجليزية هذه أكثر الأخطاء التي أراها.

## 1. ضبط اتجاه الصفحة دون التفكير بمنطق الاتجاه

كتابة \`margin-left\` و\`padding-right\` تثبّت اتجاهًا. استعمل بدلًا منها الخصائص المنطقية: \`margin-inline-start\` و\`padding-inline-end\` و\`text-align: start\`. وفي Tailwind استعمل \`ms-*\` و\`pe-*\` و\`start-0\` و\`text-start\`. فينقلب التخطيط من تلقاء نفسه.

## 2. تباعد الحروف والأحرف الكبيرة

الحروف العربية تتصل. إضافة تباعد بين الحروف يقطع الاتصال ويجعل الكلمات تبدو ممزّقة. والأحرف الكبيرة لا معنى لها في العربية. طبّق التباعد والأحرف الكبيرة على النص اللاتيني فقط أو عطّلهما للعربية.

## 3. نص مختلط يقفز

جملة عربية فيها رقم أو بريد إلكتروني أو رابط أو اسم علامة بحروف لاتينية قد يُعاد ترتيبها بشكل مربك. غلّف الجزء الأجنبي بعنصر فيه \`dir="ltr"\` أو استعمل عنصر \`<bdi>\`، وأعطِ حقول الإدخال \`dir="auto"\` ليتبع الاتجاه ما يكتبه المستخدم.

## 4. قلب كل شيء، حتى ما لا يجب قلبه

الأسهم التي تعني «التالي» أو «رجوع» يجب أن تنقلب. أما زر التشغيل والساعة وعلامة الصح والشعار ورقم الهاتف فلا. افحص كل أيقونة عن قصد بدل قلب حاوية كاملة.

## 5. خط لم يُختبر أبدًا

تحتاج العربية إلى خط مصمَّم لها وبأوزان كافية، وغالبًا إلى حجم أكبر وتباعد أسطر أوسع من اللاتينية لتكون مريحة. خط احتياطي يبدو جيدًا باللاتينية قد يجعل العربية مزدحمة أو قبيحة. اختر خطًا عربيًا عن قصد واختبر فقرات طويلة.

## 6. بناء الجمل بتجميع القطع

\`"مرحبًا " + الاسم + "، لديك " + العدد + " رسائل"\` لا يمكن ترجمتها. ترتيب الكلمات يختلف، وللعربية صيغ جمع خاصة للواحد والاثنين والقليل والكثير. ترجم جملًا كاملة بمتغيّرات واستعمل قواعد الجمع الصحيحة لا «أضف حرفًا».

## 7. الأرقام والتواريخ والعملة

اختر عن قصد بين الأرقام الغربية (0 إلى 9) والأرقام العربية الشرقية. في المغرب الأرقام الغربية هي المعتادة. نسّق باستعمال \`Intl.NumberFormat\` و\`Intl.DateTimeFormat\` مع اللغة المحلية بدل التنسيق اليدوي. وتذكّر أن التقويم الهجري مهم لبعض المستخدمين.

## 8. الجداول والرسوم والاقتطاع

يجب أن تنقلب الجداول، بما في ذلك ترتيب الأعمدة وموضع الإجراءات. والرسوم التي فيها محور زمني اختيار تصميمي: كثير من المنتجات تُبقي الزمن من اليسار إلى اليمين حتى بالعربية. أيًّا كان اختيارك فطبّقه باتساق. والنص المقتطع بنقاط يجب أن يُقطع من الجهة الصحيحة.

## 9. الاختبار بنص «لوريم إيبسوم»

النص اللاتيني التجريبي يخفي المشكلات. اختبر بعربية حقيقية وأسماء طويلة وأرقام مختلطة، ويفضّل مع من يقرأ العربية كل يوم. القارئ الأصلي يجد في خمس دقائق ما فاتك في خمس ساعات.

## قائمة صغيرة

- خصائص CSS منطقية في كل مكان
- خط عربي مُختبَر وتباعد أسطر مريح
- لا تباعد بين الحروف في النص العربي
- \`dir="auto"\` للحقول و\`dir="ltr"\` للبريد والأرقام والروابط
- ترجمة جمل كاملة مع قواعد الجمع
- قارئ أصلي في فريق المراجعة

بنيتُ منصّتي بالإنجليزية والفرنسية والعربية منذ السطر الأول، وأجهّز هذا العمل في صورة [قالب SaaS ثلاثي اللغات](/ar/templates/trilingual-saas-starter) و[دورة في بناء تطبيقات عربية من اليمين إلى اليسار](/ar/courses/trilingual-rtl-app). سجّل بريدك في هاتين الصفحتين لتعرف متى تصدران، أو [تواصل معي](/ar/contact) إن احتجت تطبيقًا مبنيًا بهذه الطريقة.`,
    },
  },

  // ------------------------------------------------------------------ 11
  {
    slug: "multi-tenant-saas-data-leak-mistakes",
    tags: ["SaaS", "Multi-tenant", "Security", "Developers"],
    en: {
      title: "Multi-tenant SaaS: the mistakes that leak one customer's data to another",
      excerpt: "In a multi-tenant app, one missing filter can show a customer someone else's records. Where it goes wrong and how to make it hard to get wrong.",
      body: `A multi-tenant app serves many customers, such as schools or clinics, from one codebase and one database. It is efficient. It also has one failure that ends businesses: showing customer A the data of customer B. I build multi-tenant platforms, and these are the mistakes worth designing against from day one.

## What "tenant" means here

A tenant is one customer organisation. Every row that belongs to it carries a tenant identifier. The rule is simple: **no query should ever return a row from another tenant.** The difficulty is that this rule must hold in every query, forever, written by every developer, including you in six months.

## Mistake 1: trusting a tenant ID from the browser

If the request says \`tenantId=123\` and your code believes it, anyone can change the number. The tenant must come from the signed-in user's session on the server, never from a form field or URL.

## Mistake 2: a query that forgot the filter

\`findMany({ where: { status: "OPEN" } })\` returns open records for every tenant. One forgotten \`tenantId\` in a hundred queries is enough. The fix is structural: a single data-access layer that adds the tenant filter automatically, so that writing an unfiltered query takes effort.

## Mistake 3: looking up by ID alone

\`findUnique({ where: { id } })\` returns the record if the ID exists, whoever owns it. Anyone who guesses or obtains an ID reads another customer's record. Look up by ID **and** tenant, and return "not found" otherwise, not "forbidden", so you do not confirm that it exists.

## Mistake 4: background jobs and caches without a tenant

A cache key like \`dashboard-stats\` is shared by everyone. A job that sends daily emails may loop over all tenants and mix data. Include the tenant in every cache key and make jobs run per tenant.

## Mistake 5: files and search

Uploaded files stored under a guessable path can be fetched by anyone who knows the URL. Search indexes and exports are another common leak. Check authorisation on every file download and in every search result.

## Mistake 6: admin and support shortcuts

Internal tools that "see everything" are useful and dangerous. Restrict them to named staff, require extra authentication, and log every use.

## How to make it hard to get wrong

1. **Take the tenant from the session on the server.** Never from input.
2. **One data layer.** All reads and writes pass through code that applies the tenant.
3. **Database-level protection.** PostgreSQL row-level security enforces the rule even when application code forgets it.
4. **Composite constraints.** Unique values such as an invoice number should be unique per tenant, and foreign keys should not cross tenants.
5. **Tests that attack.** Create two tenants, then write tests that try to read, change and delete tenant B's data while signed in as tenant A. Run them on every change.
6. **Audit logs.** If something goes wrong you can say exactly who saw what.

## Is multi-tenant always the right choice?

No. If you have a few large customers with strict isolation needs, separate deployments may be safer and simpler. Multi-tenant shines when you have many small customers with similar needs and want one place to improve the product.

I am preparing a [multi-tenant business starter](/en/templates/multi-tenant-business-starter) and a [course on multi-tenant SaaS with Next.js and Prisma](/en/courses/multi-tenant-saas-nextjs) built around these rules. Join the list on those pages to be told when they are ready. If you need a multi-tenant platform for your own organisation or product, [write to me](/en/contact).`,
    },
    fr: {
      title: "SaaS multi-locataire : les erreurs qui exposent les données d'un client à un autre",
      excerpt: "Dans une application multi-locataire, un seul filtre oublié peut montrer à un client les dossiers d'un autre. Où cela se passe mal et comment rendre l'erreur difficile.",
      body: `Une application multi-locataire sert de nombreux clients, comme des écoles ou des cabinets, avec un seul code et une seule base de données. C'est efficace. Elle présente aussi une faille qui peut ruiner une entreprise : montrer au client A les données du client B. Je construis des plateformes multi-locataires, et voici les erreurs contre lesquelles il faut concevoir dès le premier jour.

## Ce que « locataire » veut dire ici

Un locataire est une organisation cliente. Chaque ligne qui lui appartient porte un identifiant de locataire. La règle est simple : **aucune requête ne doit jamais renvoyer une ligne d'un autre locataire.** La difficulté est que cette règle doit tenir dans chaque requête, pour toujours, écrite par chaque développeur, y compris vous dans six mois.

## Erreur 1 : faire confiance à un identifiant de locataire venant du navigateur

Si la requête dit \`tenantId=123\` et que votre code le croit, n'importe qui peut changer le nombre. Le locataire doit venir de la session de l'utilisateur connecté côté serveur, jamais d'un champ de formulaire ou d'une URL.

## Erreur 2 : une requête qui a oublié le filtre

\`findMany({ where: { status: "OPEN" } })\` renvoie les dossiers ouverts de tous les locataires. Un seul \`tenantId\` oublié sur cent requêtes suffit. La solution est structurelle : une couche d'accès aux données unique qui ajoute le filtre automatiquement, de sorte qu'écrire une requête sans filtre demande un effort.

## Erreur 3 : chercher par identifiant seul

\`findUnique({ where: { id } })\` renvoie l'enregistrement si l'identifiant existe, quel que soit son propriétaire. Quiconque devine ou obtient un identifiant lit le dossier d'un autre client. Cherchez par identifiant **et** locataire, et répondez « introuvable » sinon, pas « interdit », pour ne pas confirmer son existence.

## Erreur 4 : les tâches de fond et les caches sans locataire

Une clé de cache comme \`dashboard-stats\` est partagée par tous. Une tâche qui envoie des e-mails quotidiens peut boucler sur tous les locataires et mélanger les données. Incluez le locataire dans chaque clé de cache et faites tourner les tâches par locataire.

## Erreur 5 : fichiers et recherche

Des fichiers téléversés stockés sous un chemin devinable peuvent être récupérés par quiconque connaît l'URL. Les index de recherche et les exports sont une autre fuite courante. Vérifiez l'autorisation à chaque téléchargement de fichier et dans chaque résultat de recherche.

## Erreur 6 : les raccourcis d'administration et de support

Les outils internes qui « voient tout » sont utiles et dangereux. Limitez-les à des personnes nommées, exigez une authentification supplémentaire et journalisez chaque usage.

## Comment rendre l'erreur difficile

1. **Prenez le locataire dans la session côté serveur.** Jamais dans les données saisies.
2. **Une seule couche de données.** Toutes les lectures et écritures passent par du code qui applique le locataire.
3. **Une protection au niveau de la base.** La sécurité au niveau des lignes de PostgreSQL applique la règle même quand le code applicatif l'oublie.
4. **Des contraintes composées.** Les valeurs uniques comme un numéro de facture doivent être uniques par locataire, et les clés étrangères ne doivent pas traverser les locataires.
5. **Des tests qui attaquent.** Créez deux locataires, puis écrivez des tests qui tentent de lire, modifier et supprimer les données du locataire B en étant connecté comme locataire A. Lancez-les à chaque changement.
6. **Des journaux d'audit.** Si quelque chose tourne mal, vous pouvez dire exactement qui a vu quoi.

## Le multi-locataire est-il toujours le bon choix ?

Non. Si vous avez quelques gros clients aux exigences strictes d'isolation, des déploiements séparés peuvent être plus sûrs et plus simples. Le multi-locataire brille quand vous avez de nombreux petits clients aux besoins similaires et voulez un seul endroit pour améliorer le produit.

Je prépare un [starter d'entreprise multi-locataire](/fr/templates/multi-tenant-business-starter) et un [cours sur le SaaS multi-locataire avec Next.js et Prisma](/fr/courses/multi-tenant-saas-nextjs) construits autour de ces règles. Inscrivez-vous sur ces pages pour être prévenu de leur sortie. Si vous avez besoin d'une plateforme multi-locataire pour votre organisation ou votre produit, [écrivez-moi](/fr/contact).`,
    },
    ar: {
      title: "SaaS متعدد المستأجرين: أخطاء تكشف بيانات عميل لعميل آخر",
      excerpt: "في تطبيق متعدد المستأجرين قد يكفي مرشّح واحد منسيّ لإظهار سجلات غيرك لعميل. أين يقع الخطأ وكيف تجعله صعب الحدوث.",
      body: `التطبيق متعدد المستأجرين يخدم عملاء كثيرين، كمدارس أو عيادات، بكود واحد وقاعدة بيانات واحدة. وهو فعّال. لكن له عيبًا واحدًا قد ينهي أعمالًا: أن ترى العميلة «أ» بيانات العميل «ب». أبني منصّات متعددة المستأجرين، وهذه أخطاء تستحق أن تُصمَّم ضدها من اليوم الأول.

## ماذا يعني «المستأجر» هنا

المستأجر هو مؤسسة عميلة واحدة. كل سجل يخصها يحمل معرّف المستأجر. والقاعدة بسيطة: **لا ينبغي أن يُرجع أي استعلام سجلًا من مستأجر آخر.** الصعوبة أن هذه القاعدة يجب أن تصح في كل استعلام وإلى الأبد وبيد كل مطوّر، بمن فيهم أنت بعد ستة أشهر.

## الخطأ 1: الوثوق بمعرّف المستأجر القادم من المتصفح

إن قال الطلب \`tenantId=123\` وصدّقه كودك فيستطيع أي شخص تغيير الرقم. يجب أن يأتي المستأجر من جلسة المستخدم المسجَّل على الخادم، لا من حقل نموذج أو رابط.

## الخطأ 2: استعلام نسي المرشّح

\`findMany({ where: { status: "OPEN" } })\` يُرجع السجلات المفتوحة لكل المستأجرين. يكفي \`tenantId\` منسيّ واحد في مئة استعلام. الحل هيكلي: طبقة وصول بيانات واحدة تضيف المرشّح تلقائيًا، فتصبح كتابة استعلام بلا مرشّح تتطلب جهدًا.

## الخطأ 3: البحث بالمعرّف وحده

\`findUnique({ where: { id } })\` يُرجع السجل إن وُجد المعرّف أيًّا كان مالكه. ومن يخمّن معرّفًا أو يحصل عليه يقرأ سجل عميل آخر. ابحث بالمعرّف **والمستأجر** معًا، وأجب «غير موجود» عند عدم التطابق لا «ممنوع»، كي لا تؤكد وجوده.

## الخطأ 4: المهام الخلفية والذاكرة المؤقتة بلا مستأجر

مفتاح ذاكرة مؤقتة مثل \`dashboard-stats\` يشترك فيه الجميع. ومهمة ترسل رسائل يومية قد تدور على كل المستأجرين وتخلط البيانات. ضمّن المستأجر في كل مفتاح ذاكرة مؤقتة وشغّل المهام لكل مستأجر على حدة.

## الخطأ 5: الملفات والبحث

الملفات المرفوعة المخزَّنة في مسار يمكن تخمينه يستطيع جلبها كل من يعرف الرابط. وفهارس البحث والتصدير تسريب شائع آخر. تحقق من الصلاحية عند كل تنزيل ملف وفي كل نتيجة بحث.

## الخطأ 6: اختصارات الإدارة والدعم

الأدوات الداخلية التي «ترى كل شيء» مفيدة وخطرة. حصرها في أشخاص مسمّين واشترط توثيقًا إضافيًا وسجّل كل استعمال.

## كيف تجعل الخطأ صعب الحدوث

1. **خذ المستأجر من الجلسة على الخادم.** لا من المدخلات أبدًا.
2. **طبقة بيانات واحدة.** كل قراءة وكتابة تمر عبر كود يطبّق المستأجر.
3. **حماية على مستوى قاعدة البيانات.** أمان مستوى الصفوف في PostgreSQL يفرض القاعدة حتى لو نسيها كود التطبيق.
4. **قيود مركّبة.** القيم الفريدة كرقم الفاتورة يجب أن تكون فريدة لكل مستأجر، والمفاتيح الأجنبية يجب ألا تعبر بين المستأجرين.
5. **اختبارات تهاجم.** أنشئ مستأجرين ثم اكتب اختبارات تحاول قراءة بيانات المستأجر «ب» وتعديلها وحذفها وأنت مسجَّل كالمستأجر «أ». شغّلها مع كل تغيير.
6. **سجلات تدقيق.** إن حدث خطأ تستطيع أن تقول بالضبط من رأى ماذا.

## هل متعدد المستأجرين هو الخيار الصحيح دائمًا؟

لا. إن كان لديك عدد قليل من العملاء الكبار ذوي متطلبات عزل صارمة فقد تكون النشرات المنفصلة أكثر أمانًا وأبسط. ويتألق متعدد المستأجرين حين يكون لك عملاء كثيرون صغار باحتياجات متشابهة وتريد مكانًا واحدًا لتحسين المنتج.

أجهّز [قالب أعمال متعدد المستأجرين](/ar/templates/multi-tenant-business-starter) و[دورة SaaS متعدد المستأجرين بـ Next.js وPrisma](/ar/courses/multi-tenant-saas-nextjs) مبنيين على هذه القواعد. سجّل بريدك في هاتين الصفحتين لتعرف متى تصدران. وإن احتجت منصّة متعددة المستأجرين لمؤسستك أو منتجك فـ[راسلني](/ar/contact).`,
    },
  },
];
