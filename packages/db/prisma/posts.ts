import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { brandPosts, type Post } from "./posts-brand";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

// Eleven articles (five here, six more in posts-brand.ts) written to be found on Google by the people who hire you: school
// owners, clinic and hotel managers, and small-business owners who need software.
// Each one answers a question a buyer really types, is honest about when you are
// NOT the right choice (that is what makes people trust the rest), and ends by
// pointing to the matching service and the contact page.
//
//   npm run db:posts
//
// They are saved as DRAFTS. Read each one in Admin -> Blog, correct anything that is
// not true for you, then press Publish. They contain no invented numbers, no client
// names and no quotes. Running this again never overwrites a post that exists, so
// your edits are safe.

const posts: Post[] = [
  // ------------------------------------------------------------------ 1
  {
    slug: "school-management-software-morocco",
    tags: ["Schools", "Morocco", "Software"],
    en: {
      title: "School management software in Morocco: what to check before you pay",
      excerpt: "Attendance, parents, fees and two languages. A practical checklist for school owners choosing software, from someone who builds it.",
      body: `If you run a private school in Morocco, you have probably seen the same problem in every office: attendance on paper, fees in a notebook, parents asking questions on WhatsApp, and results typed twice. School software should end that. Many products promise it, but few fit how a Moroccan school really works.

I build school platforms, and one is in daily use at a school today. This is the checklist I would use if I were the owner.

## 1. Does it work properly in Arabic and French?

Not "has a translation". Ask to see the same screen in Arabic. The text must run right to left, the tables must flip, and names written in Arabic must sort and print correctly. Then check French. Parents read one language, teachers the other, and your report cards may need both.

## 2. Who sees what?

A school has many roles: owner, director, secretary, teacher, supervisor, parent. Each one should see only what they need. A parent sees their own children, never the class list. A teacher sees their classes, not the fees. Ask the seller to show you a teacher account and a parent account side by side.

## 3. How does attendance really get recorded?

Typing attendance by hand is slow and easy to get wrong. Modern options include a card tap or face recognition at the gate. If you want this, ask three things: which terminals work with the software, what happens when the internet is down, and who can see the photos or face data.

Face data is personal data about children. Morocco has a data protection law, overseen by the CNDP. Ask the seller how consent is handled and where the data is stored, and ask a lawyer to confirm what you need to tell parents.

## 4. Can parents follow along without calling the school?

The best result for the secretary is fewer phone calls. A good parent portal shows attendance, results, fees owed and school news in one place, in the parent's language.

## 5. How are fees handled?

Check that it can show who has paid and who owes, and print a clear receipt. Ask about the payment methods you actually use. Some schools take cash, bank transfer or cards, and the software should record all of them without double entry.

## 6. Who owns the data, and where does it live?

This is the question most owners forget. If you stop paying, can you export every student record? Is the server in a country you are comfortable with? Is there a nightly backup, and has anyone tested restoring it?

## 7. What happens after the launch?

Software is not a one-day purchase. Ask who answers the phone when the secretary is stuck, how fast problems get fixed, and what a year of support costs. A cheap system with no support becomes expensive the first time something breaks in September.

## Ready-made or built for you?

A ready-made system is faster to start and cheaper at first. A built-for-you platform costs more at the start, but it fits your way of working: your timetable, your report cards, your attendance rules. If your school is small and standard, a ready-made product may be enough. If you have special rules, several campuses, or you are tired of working around the software, a custom platform is worth discussing.

I will tell you honestly which one fits your case. See the [management platform service](/en/services/management-platform), or [send me a short message](/en/contact) describing your school. I usually reply with a few questions and a clear next step.`,
    },
    fr: {
      title: "Logiciel de gestion scolaire au Maroc : ce qu'il faut vérifier avant de payer",
      excerpt: "Présence, parents, frais et deux langues. Une liste de contrôle pratique pour les directeurs d'école, écrite par quelqu'un qui conçoit ces logiciels.",
      body: `Si vous dirigez une école privée au Maroc, vous avez sans doute vu le même problème dans chaque bureau : la présence sur papier, les frais dans un cahier, les parents qui posent leurs questions sur WhatsApp, et les résultats saisis deux fois. Un logiciel scolaire doit mettre fin à cela. Beaucoup de produits le promettent, mais peu correspondent au fonctionnement réel d'une école marocaine.

Je conçois des plateformes scolaires, et l'une d'elles est utilisée au quotidien dans une école. Voici la liste que j'utiliserais si j'étais le propriétaire.

## 1. Fonctionne-t-il vraiment en arabe et en français ?

Pas simplement « une traduction existe ». Demandez à voir le même écran en arabe. Le texte doit aller de droite à gauche, les tableaux doivent s'inverser, et les noms écrits en arabe doivent être triés et imprimés correctement. Vérifiez ensuite le français. Certains parents lisent une langue, les enseignants l'autre, et vos bulletins peuvent exiger les deux.

## 2. Qui voit quoi ?

Une école a de nombreux rôles : propriétaire, directeur, secrétaire, enseignant, surveillant, parent. Chacun ne doit voir que ce dont il a besoin. Un parent voit ses enfants, jamais la liste de la classe. Un enseignant voit ses classes, pas les frais. Demandez au vendeur de vous montrer côte à côte un compte enseignant et un compte parent.

## 3. Comment la présence est-elle réellement enregistrée ?

Saisir la présence à la main est lent et source d'erreurs. Les solutions modernes incluent le badge ou la reconnaissance faciale à l'entrée. Si vous le souhaitez, posez trois questions : quels terminaux fonctionnent avec le logiciel, que se passe-t-il quand Internet est coupé, et qui peut voir les photos ou les données faciales.

Les données faciales sont des données personnelles concernant des enfants. Le Maroc dispose d'une loi sur la protection des données, supervisée par la CNDP. Demandez au vendeur comment le consentement est géré et où les données sont stockées, et demandez à un juriste ce que vous devez communiquer aux parents.

## 4. Les parents peuvent-ils suivre sans appeler l'école ?

Le meilleur résultat pour la secrétaire, ce sont moins d'appels. Un bon portail parents affiche la présence, les résultats, les frais dus et les actualités de l'école au même endroit, dans la langue du parent.

## 5. Comment les frais sont-ils gérés ?

Vérifiez qu'il montre qui a payé et qui doit encore, et qu'il imprime un reçu clair. Interrogez-le sur les moyens de paiement que vous utilisez réellement. Certaines écoles acceptent espèces, virement ou carte, et le logiciel doit tout enregistrer sans double saisie.

## 6. À qui appartiennent les données, et où sont-elles ?

C'est la question que la plupart des directeurs oublient. Si vous arrêtez de payer, pouvez-vous exporter tous les dossiers élèves ? Le serveur est-il dans un pays qui vous convient ? Y a-t-il une sauvegarde chaque nuit, et quelqu'un a-t-il testé la restauration ?

## 7. Que se passe-t-il après le lancement ?

Un logiciel ne s'achète pas en un jour. Demandez qui répond au téléphone quand la secrétaire est bloquée, avec quelle rapidité les problèmes sont réglés, et combien coûte une année de support. Un système bon marché sans support devient cher la première fois que quelque chose tombe en panne en septembre.

## Prêt à l'emploi ou sur mesure ?

Un système prêt à l'emploi démarre vite et coûte moins cher au début. Une plateforme sur mesure coûte plus cher au départ, mais s'adapte à votre façon de travailler : votre emploi du temps, vos bulletins, vos règles de présence. Si votre école est petite et classique, un produit prêt à l'emploi peut suffire. Si vous avez des règles particulières, plusieurs campus, ou si vous en avez assez de contourner le logiciel, une plateforme sur mesure vaut la discussion.

Je vous dirai honnêtement ce qui convient à votre cas. Découvrez le [service de plateforme de gestion](/fr/services/management-platform), ou [envoyez-moi un court message](/fr/contact) décrivant votre école. Je réponds en général avec quelques questions et une prochaine étape claire.`,
    },
    ar: {
      title: "برنامج إدارة المدارس في المغرب: ما يجب التحقق منه قبل الدفع",
      excerpt: "الحضور وأولياء الأمور والرسوم ولغتان. قائمة عملية لأصحاب المدارس، كتبها شخص يبني هذه الأنظمة.",
      body: `إذا كنت تدير مدرسة خاصة في المغرب فقد رأيت على الأرجح المشكلة نفسها في كل مكتب: الحضور على الورق، والرسوم في دفتر، وأولياء الأمور يسألون عبر واتساب، والنتائج تُدخَل مرتين. يفترض أن ينهي برنامج المدرسة هذا كله. كثير من المنتجات تَعِد بذلك، لكن قليلًا منها يناسب طريقة عمل المدرسة المغربية فعلًا.

أنا أبني منصّات للمدارس، وإحداها قيد الاستخدام اليومي في مدرسة اليوم. هذه القائمة التي كنت سأعتمدها لو كنت صاحب المدرسة.

## 1. هل يعمل فعلًا بالعربية والفرنسية؟

لا يكفي أن توجد «ترجمة». اطلب رؤية الشاشة نفسها بالعربية. يجب أن يتجه النص من اليمين إلى اليسار، وأن تنعكس الجداول، وأن تُرتَّب الأسماء العربية وتُطبَع بشكل صحيح. ثم افحص الفرنسية. بعض أولياء الأمور يقرؤون بلغة والمدرّسون بالأخرى، وقد تحتاج كشوف النقط إلى اللغتين.

## 2. من يرى ماذا؟

في المدرسة أدوار كثيرة: المالك والمدير والكاتبة والمدرّس والمراقب وولي الأمر. يجب أن يرى كل واحد ما يحتاجه فقط. يرى ولي الأمر أبناءه ولا يرى قائمة القسم. ويرى المدرّس أقسامه لا الرسوم. اطلب من البائع أن يعرض لك حساب مدرّس وحساب ولي أمر جنبًا إلى جنب.

## 3. كيف يُسجَّل الحضور فعلًا؟

تسجيل الحضور يدويًا بطيء ويسهل فيه الخطأ. من الخيارات الحديثة البطاقة أو التعرّف على الوجه عند المدخل. إذا أردت ذلك فاسأل عن ثلاثة أشياء: أي الأجهزة تعمل مع البرنامج، وماذا يحدث عند انقطاع الإنترنت، ومن يستطيع رؤية الصور أو بيانات الوجه.

بيانات الوجه بيانات شخصية تخص أطفالًا. في المغرب قانون لحماية المعطيات الشخصية تشرف عليه اللجنة الوطنية (CNDP). اسأل البائع كيف تُدار الموافقة وأين تُخزَّن البيانات، واسأل محاميًا عمّا يجب إبلاغ أولياء الأمور به.

## 4. هل يستطيع الأولياء المتابعة دون الاتصال بالمدرسة؟

أفضل نتيجة للكاتبة هي مكالمات أقل. البوابة الجيدة لأولياء الأمور تعرض الحضور والنتائج والرسوم المستحقة وأخبار المدرسة في مكان واحد وبلغة الولي.

## 5. كيف تُدار الرسوم؟

تأكد أنه يُظهر من دفع ومن عليه دَين، وأنه يطبع وصلًا واضحًا. واسأل عن وسائل الدفع التي تستعملها فعلًا. بعض المدارس تقبل النقد أو التحويل البنكي أو البطاقة، ويجب أن يسجّلها البرنامج كلها دون إدخال مزدوج.

## 6. لمن تعود البيانات وأين توجد؟

هذا السؤال الذي ينساه أغلب أصحاب المدارس. إن توقفت عن الدفع فهل تستطيع تصدير كل ملفات التلاميذ؟ وهل الخادم في بلد ترتاح إليه؟ وهل توجد نسخة احتياطية كل ليلة، وهل جرّب أحد استعادتها؟

## 7. ماذا بعد الإطلاق؟

البرنامج ليس شراء يوم واحد. اسأل من يردّ على الهاتف حين تتعطل الكاتبة، وبأي سرعة تُحلّ المشكلات، وكم يكلّف الدعم لسنة كاملة. النظام الرخيص بلا دعم يصير غاليًا أول مرة يتعطل فيها شيء في شتنبر.

## جاهز أم مبني خصيصًا لك؟

النظام الجاهز أسرع في البدء وأرخص في البداية. المنصّة المبنية خصيصًا أغلى في البداية لكنها تناسب طريقة عملك: جدولك وكشوف نقطك وقواعد الحضور عندك. إذا كانت مدرستك صغيرة ونمطية فقد يكفي منتج جاهز. وإذا كانت لديك قواعد خاصة أو عدّة فروع أو تعبت من التحايل على البرنامج، فالمنصّة المخصّصة تستحق النقاش.

سأقول لك بصدق ما يناسب حالتك. اطّلع على [خدمة منصّة الإدارة](/ar/services/management-platform)، أو [راسلني برسالة قصيرة](/ar/contact) تصف فيها مدرستك. عادةً أردّ بأسئلة قليلة وخطوة تالية واضحة.`,
    },
  },

  // ------------------------------------------------------------------ 2
  {
    slug: "how-much-does-a-custom-web-platform-cost",
    tags: ["Pricing", "Custom software", "Guide"],
    en: {
      title: "How much does a custom web platform cost? What actually moves the price",
      excerpt: "Nobody can quote you honestly from one sentence. Here are the seven things that change the price, and how to get a fair quote.",
      body: `"How much for a website or platform?" is the first question I get, and the honest first answer is "it depends". That answer is useless unless I tell you what it depends on. So here it is.

## The seven things that move the price

**1. How many kinds of users.** A site with one kind of visitor is simple. A platform with owners, staff, parents and clients, each seeing different things, is several products in one.

**2. Accounts and permissions.** Logging in sounds small. Roles, password reset, email confirmation and "who may see this record" are where much of the care goes, because mistakes here leak private data.

**3. Money.** Taking online payments, issuing receipts, handling refunds and keeping the books consistent is careful work. Doing it badly costs you real money.

**4. Languages.** Arabic, French and English together are more than three translations. Right-to-left layout, dates, numbers and sorting all change.

**5. Connections to other things.** A card reader, a face terminal, WhatsApp, an accounting tool, a payment provider. Every connection is its own small project, and each can fail in its own way.

**6. Your data.** If you already have years of records in spreadsheets, bringing them in cleanly takes real time.

**7. How clear you are.** The most expensive thing in any project is a requirement that changes in week six. A clear first conversation saves more than any discount.

## Why a fixed price needs a defined scope

A price per hour rewards slowness and scares clients. A fixed price is fairer, but only when both sides agree exactly what is included. That is why I write the scope down: what is in, what is out, how many rounds of changes, and what you need to provide and when.

For larger platforms I suggest a short paid discovery step first. You pay a small amount to get a written plan, a screen-by-screen outline and a firm price. If you then go ahead, that amount is credited. If you do not, you keep the plan and lose little.

## The costs people forget

- **Hosting and the domain.** Small, but monthly.
- **Changes after launch.** Real use always shows something to improve.
- **Support.** Someone has to answer when the secretary is stuck.
- **Keeping it safe.** Updates, backups and watching for problems.

A system with no plan for these gets abandoned within a year. That is why I offer a monthly care plan rather than leaving you alone after delivery.

## How to get a fair quote from anyone

1. Write one page: who uses it, the five things it must do, what you do today.
2. Ask for the scope in writing, including what is **not** included.
3. Ask what the first version contains and what waits for later.
4. Ask who owns the code and the data. The answer should be you.
5. Ask what happens if you want to stop.

If a quote does not answer these, ask again before you pay a deposit.

## Where my packages fit

I publish my packages with their scope on the [services page](/en/services), so you can see the shape of a project before we speak. If you are not sure which one fits, [tell me what you do today](/en/contact) and I will say which is closest, or if you are better served by a simpler tool.`,
    },
    fr: {
      title: "Combien coûte une plateforme web sur mesure ? Ce qui fait vraiment varier le prix",
      excerpt: "Personne ne peut vous donner un prix honnête à partir d'une phrase. Voici les sept éléments qui font varier le prix, et comment obtenir un devis juste.",
      body: `« Combien pour un site ou une plateforme ? » est la première question que l'on me pose, et la première réponse honnête est « ça dépend ». Cette réponse ne sert à rien si je ne dis pas de quoi cela dépend. Voici donc la réponse.

## Les sept éléments qui font varier le prix

**1. Le nombre de types d'utilisateurs.** Un site avec un seul type de visiteur est simple. Une plateforme avec des propriétaires, du personnel, des parents et des clients, qui voient chacun des choses différentes, c'est plusieurs produits en un.

**2. Les comptes et les droits.** Se connecter paraît simple. Les rôles, la réinitialisation du mot de passe, la confirmation par e-mail et la question « qui peut voir cette fiche » demandent beaucoup de soin, car une erreur ici expose des données privées.

**3. L'argent.** Encaisser en ligne, émettre des reçus, gérer les remboursements et garder les comptes cohérents est un travail minutieux. Mal fait, il vous coûte de l'argent réel.

**4. Les langues.** L'arabe, le français et l'anglais ensemble, c'est plus que trois traductions. La mise en page de droite à gauche, les dates, les chiffres et le tri changent.

**5. Les connexions avec d'autres outils.** Un lecteur de badges, un terminal facial, WhatsApp, un outil de comptabilité, un prestataire de paiement. Chaque connexion est un petit projet à part, avec ses propres pannes possibles.

**6. Vos données.** Si vous avez des années de dossiers dans des tableurs, les importer proprement demande du temps.

**7. Votre clarté.** La chose la plus chère dans un projet, c'est une exigence qui change à la sixième semaine. Une première conversation claire économise plus que n'importe quelle remise.

## Pourquoi un prix fixe suppose un périmètre défini

Un tarif horaire récompense la lenteur et effraie les clients. Un prix fixe est plus juste, mais seulement quand les deux parties s'accordent exactement sur ce qui est inclus. C'est pourquoi je mets le périmètre par écrit : ce qui est inclus, ce qui ne l'est pas, le nombre de séries de modifications, et ce que vous devez fournir et quand.

Pour les plateformes plus importantes, je propose d'abord une courte étape de découverte payante. Vous payez un petit montant pour obtenir un plan écrit, un schéma écran par écran et un prix ferme. Si vous poursuivez, ce montant est déduit. Sinon, vous gardez le plan et perdez peu.

## Les coûts que l'on oublie

- **L'hébergement et le nom de domaine.** Faibles, mais mensuels.
- **Les modifications après le lancement.** L'usage réel révèle toujours quelque chose à améliorer.
- **Le support.** Quelqu'un doit répondre quand la secrétaire est bloquée.
- **La sécurité dans la durée.** Mises à jour, sauvegardes et surveillance des problèmes.

Un système sans plan pour ces points est abandonné en moins d'un an. C'est pourquoi je propose un forfait de suivi mensuel plutôt que de vous laisser seul après la livraison.

## Comment obtenir un devis juste, chez n'importe qui

1. Écrivez une page : qui l'utilise, les cinq choses qu'il doit faire, ce que vous faites aujourd'hui.
2. Demandez le périmètre par écrit, y compris ce qui n'est **pas** inclus.
3. Demandez ce que contient la première version et ce qui attend.
4. Demandez à qui appartiennent le code et les données. La réponse doit être : à vous.
5. Demandez ce qui se passe si vous voulez arrêter.

Si un devis ne répond pas à ces questions, redemandez avant de verser un acompte.

## Où se placent mes forfaits

Je publie mes forfaits avec leur périmètre sur la [page des services](/fr/services), pour que vous voyiez la forme d'un projet avant que nous parlions. Si vous hésitez, [dites-moi ce que vous faites aujourd'hui](/fr/contact) et je vous dirai lequel s'en rapproche le plus, ou si un outil plus simple vous conviendrait mieux.`,
    },
    ar: {
      title: "كم تكلّف منصّة ويب مخصّصة؟ ما الذي يغيّر السعر فعلًا",
      excerpt: "لا أحد يستطيع إعطاءك سعرًا صادقًا من جملة واحدة. هذه سبعة عوامل تغيّر السعر، وكيف تحصل على عرض عادل.",
      body: `«كم يكلّف موقع أو منصّة؟» هو أول سؤال يصلني، والجواب الصادق الأول هو «حسب الحالة». هذا الجواب بلا فائدة إن لم أقل على ماذا يتوقف. فإليك التفصيل.

## سبعة عوامل تغيّر السعر

**1. عدد أنواع المستخدمين.** موقع بنوع واحد من الزوار بسيط. أما منصّة فيها مالكون وموظفون وأولياء أمور وعملاء، يرى كل منهم أشياء مختلفة، فهي عدّة منتجات في منتج واحد.

**2. الحسابات والصلاحيات.** تسجيل الدخول يبدو صغيرًا. لكن الأدوار واستعادة كلمة المرور وتأكيد البريد وسؤال «من يحق له رؤية هذا السجل» تحتاج عناية كبيرة، لأن الخطأ فيها يكشف بيانات خاصة.

**3. المال.** استلام المدفوعات عبر الإنترنت وإصدار الوصولات ومعالجة الاسترداد وإبقاء الحسابات متّسقة عمل دقيق. وإنجازه بشكل سيئ يكلّفك مالًا حقيقيًا.

**4. اللغات.** العربية والفرنسية والإنجليزية معًا أكثر من ثلاث ترجمات. فاتجاه الصفحة من اليمين إلى اليسار والتواريخ والأرقام والترتيب كلها تتغير.

**5. الربط مع أشياء أخرى.** قارئ بطاقات أو جهاز تعرّف على الوجه أو واتساب أو أداة محاسبة أو مزوّد دفع. كل ربط مشروع صغير بذاته، وله أعطاله الخاصة.

**6. بياناتك.** إن كانت لديك سنوات من السجلات في جداول بيانات، فإدخالها بشكل نظيف يتطلب وقتًا حقيقيًا.

**7. وضوح طلبك.** أغلى ما في أي مشروع متطلَّب يتغير في الأسبوع السادس. وأول حديث واضح يوفّر أكثر من أي تخفيض.

## لماذا يحتاج السعر الثابت إلى نطاق محدّد

السعر بالساعة يكافئ البطء ويخيف العملاء. والسعر الثابت أعدل، لكن بشرط أن يتفق الطرفان تمامًا على ما هو مشمول. لهذا أكتب النطاق: ما هو مشمول وما هو غير مشمول وعدد جولات التعديل وما عليك تقديمه ومتى.

وللمنصّات الأكبر أقترح أولًا مرحلة استكشاف قصيرة مدفوعة. تدفع مبلغًا صغيرًا مقابل خطة مكتوبة ومخطط شاشة بشاشة وسعر نهائي. وإن واصلت يُخصم المبلغ. وإن لم تواصل فتحتفظ بالخطة وتخسر القليل.

## تكاليف ينساها الناس

- **الاستضافة واسم النطاق.** صغيرة لكنها شهرية.
- **التعديلات بعد الإطلاق.** الاستعمال الفعلي يُظهر دائمًا ما يمكن تحسينه.
- **الدعم.** يجب أن يردّ أحد حين تتعطل الكاتبة.
- **الحفاظ على الأمان.** تحديثات ونسخ احتياطية ومتابعة المشكلات.

النظام الذي لا خطة له لهذه الأمور يُهجَر في أقل من سنة. لذلك أقدّم اشتراك رعاية شهريًا بدل تركك وحدك بعد التسليم.

## كيف تحصل على عرض عادل من أي جهة

1. اكتب صفحة واحدة: من يستعمله، وأهم خمسة أشياء يجب أن يفعلها، وما تفعله اليوم.
2. اطلب النطاق مكتوبًا، بما في ذلك ما هو **غير** مشمول.
3. اسأل عمّا تتضمنه النسخة الأولى وما سيؤجَّل.
4. اسأل لمن يعود الكود والبيانات. يجب أن يكون الجواب: لك.
5. اسأل عمّا يحدث إن أردت التوقف.

إن لم يجب العرض عن هذه الأسئلة فاسأل مجددًا قبل دفع أي عربون.

## أين تقع باقاتي

أنشر باقاتي مع نطاقها في [صفحة الخدمات](/ar/services)، لترى شكل المشروع قبل أن نتحدث. وإن لم تكن متأكدًا، [أخبرني بما تفعله اليوم](/ar/contact) وسأقول لك أيّها الأقرب، أو إن كانت أداة أبسط أنسب لك.`,
    },
  },

  // ------------------------------------------------------------------ 3
  {
    slug: "face-and-card-attendance-schools-privacy",
    tags: ["Attendance", "Schools", "Privacy"],
    en: {
      title: "Card and face attendance for schools: how it works and what parents will ask",
      excerpt: "Automatic attendance saves hours every week. Before you install it, know how it works, what happens offline, and how to protect children's data.",
      body: `Taking attendance by hand costs a school a surprising amount of time, and the paper trail is easy to lose. Card readers and face terminals at the gate solve that. They also bring questions from parents, and a school owner should be ready for them.

## How it works, in plain words

A terminal at the entrance recognises a student by a card or a face. It records the time. The school software receives that record and marks the student present, late or absent according to your rules. Parents can then see it in their own account.

I connect these terminals to a school platform, and the one I built is in daily use at a school.

## What it gives you

- **Attendance with no typing.** Teachers start the lesson instead of the register.
- **A true time.** Late arrivals are recorded when they happen, not remembered later.
- **Faster follow-up.** An absence can be visible to the office within minutes.
- **A reliable history.** No lost pages, no disputes about "I was here".

## Card or face?

Cards are simple, cheap and familiar. Their weakness is that they can be lent to a friend or forgotten at home. Face recognition cannot be lent, but it handles sensitive data and needs more care. Some schools use cards for most students and add face recognition where they need stronger certainty. The right answer depends on your school, not on what is newest.

## The questions parents will ask

**Where is my child's face data stored?** You should be able to answer this exactly: on which device, on which server, and for how long.

**Who can see it?** Only the people who must. A teacher should not be able to browse photos.

**Did we agree to this?** Write a short, clear notice and collect permission. In Morocco, personal data is covered by a law overseen by the CNDP. Ask a lawyer what your school must declare and say to parents. I am not a lawyer and this article is not legal advice.

**What if the child leaves the school?** You need a rule for deleting their data.

## What must work when things go wrong

- **The internet goes down.** Good terminals keep records and send them later. Ask the installer to prove it by unplugging the network during a test.
- **A power cut.** Know what is lost, if anything.
- **A mistaken match or a missed scan.** The office needs a simple way to correct a record, and the correction should be logged.
- **A new school year.** Adding and removing hundreds of students must be easy.

## A short checklist before you buy

1. Which terminal models are supported, and who installs them?
2. Is the face data stored on the device, on your server, or elsewhere?
3. What is the correction process for a wrong record?
4. What does the parent see, and when?
5. Who is responsible when something fails?

If you want this connected to a full platform with parent accounts and staff roles, see the [management platform](/en/services/management-platform). Or [tell me about your school](/en/contact) and I will say honestly whether cards, faces or a simpler system suits you.`,
    },
    fr: {
      title: "Présence par badge et reconnaissance faciale à l'école : fonctionnement et questions des parents",
      excerpt: "La présence automatique fait gagner des heures chaque semaine. Avant de l'installer, sachez comment elle fonctionne, ce qui se passe hors connexion et comment protéger les données des enfants.",
      body: `Faire l'appel à la main coûte à une école un temps surprenant, et les feuilles se perdent facilement. Des lecteurs de badges et des terminaux faciaux à l'entrée résolvent cela. Ils soulèvent aussi des questions chez les parents, et un directeur doit être prêt à y répondre.

## Comment cela fonctionne, simplement

Un terminal à l'entrée reconnaît un élève par un badge ou par son visage. Il enregistre l'heure. Le logiciel de l'école reçoit cet enregistrement et marque l'élève présent, en retard ou absent selon vos règles. Les parents le voient ensuite dans leur propre compte.

Je connecte ces terminaux à une plateforme scolaire, et celle que j'ai réalisée est utilisée au quotidien dans une école.

## Ce que cela vous apporte

- **Une présence sans saisie.** Les enseignants commencent le cours au lieu du registre.
- **Une heure exacte.** Les retards sont enregistrés quand ils ont lieu, pas reconstitués plus tard.
- **Un suivi plus rapide.** Une absence peut être visible au bureau en quelques minutes.
- **Un historique fiable.** Pas de pages perdues, pas de discussion sur « j'étais là ».

## Badge ou visage ?

Les badges sont simples, peu chers et familiers. Leur faiblesse : on peut les prêter à un ami ou les oublier à la maison. La reconnaissance faciale ne se prête pas, mais elle traite des données sensibles et demande plus de précautions. Certaines écoles utilisent des badges pour la plupart des élèves et ajoutent la reconnaissance faciale là où il faut plus de certitude. La bonne réponse dépend de votre école, pas de ce qui est le plus récent.

## Les questions que les parents poseront

**Où sont stockées les données du visage de mon enfant ?** Vous devez pouvoir répondre précisément : sur quel appareil, sur quel serveur, et pendant combien de temps.

**Qui peut les voir ?** Seulement ceux qui doivent le faire. Un enseignant ne devrait pas pouvoir parcourir les photos.

**Avons-nous donné notre accord ?** Rédigez une note courte et claire et recueillez l'autorisation. Au Maroc, les données personnelles relèvent d'une loi supervisée par la CNDP. Demandez à un juriste ce que votre école doit déclarer et dire aux parents. Je ne suis pas juriste et cet article n'est pas un avis juridique.

**Et si l'enfant quitte l'école ?** Il vous faut une règle pour supprimer ses données.

## Ce qui doit fonctionner quand tout se passe mal

- **Internet tombe.** Les bons terminaux gardent les enregistrements et les envoient plus tard. Demandez à l'installateur de le prouver en débranchant le réseau pendant un test.
- **Une coupure de courant.** Sachez ce qui est perdu, le cas échéant.
- **Une erreur de reconnaissance ou un passage manqué.** Le bureau doit pouvoir corriger simplement un enregistrement, et la correction doit être tracée.
- **Une nouvelle année scolaire.** Ajouter et retirer des centaines d'élèves doit être facile.

## Une courte liste avant d'acheter

1. Quels modèles de terminaux sont pris en charge, et qui les installe ?
2. Les données du visage sont-elles stockées sur l'appareil, sur votre serveur, ou ailleurs ?
3. Quelle est la procédure de correction d'un enregistrement erroné ?
4. Que voit le parent, et quand ?
5. Qui est responsable quand quelque chose tombe en panne ?

Si vous voulez relier cela à une plateforme complète avec comptes parents et rôles du personnel, voyez la [plateforme de gestion](/fr/services/management-platform). Ou [parlez-moi de votre école](/fr/contact) et je vous dirai honnêtement si les badges, le visage ou un système plus simple vous convient.`,
    },
    ar: {
      title: "الحضور بالبطاقة والتعرّف على الوجه في المدارس: كيف يعمل وما سيسأل عنه الأولياء",
      excerpt: "الحضور التلقائي يوفّر ساعات كل أسبوع. قبل تركيبه اعرف كيف يعمل وماذا يحدث دون إنترنت وكيف تحمي بيانات الأطفال.",
      body: `تسجيل الحضور يدويًا يكلّف المدرسة وقتًا أكثر مما نتصور، والأوراق يسهل ضياعها. وقارئات البطاقات وأجهزة التعرّف على الوجه عند المدخل تحلّ هذا. لكنها تثير أيضًا أسئلة من الأولياء، وعلى صاحب المدرسة أن يكون مستعدًا لها.

## كيف يعمل، ببساطة

جهاز عند المدخل يتعرّف على التلميذ من بطاقته أو وجهه ويسجّل الوقت. يتلقى برنامج المدرسة هذا التسجيل ويعلّم التلميذ حاضرًا أو متأخرًا أو غائبًا وفق قواعدك. ثم يراه الأولياء في حسابهم.

أربط هذه الأجهزة بمنصّة مدرسية، والمنصّة التي بنيتها قيد الاستخدام اليومي في مدرسة.

## ما الذي تقدّمه لك

- **حضور دون كتابة.** يبدأ المدرّس الحصة بدل أن يبدأ بالسجل.
- **وقت دقيق.** يُسجَّل التأخر لحظة وقوعه لا من الذاكرة لاحقًا.
- **متابعة أسرع.** قد يظهر الغياب في الإدارة خلال دقائق.
- **سجل موثوق.** لا أوراق ضائعة ولا خلاف حول «كنت حاضرًا».

## بطاقة أم وجه؟

البطاقات بسيطة ورخيصة ومألوفة. ضعفها أنها تُعار لصديق أو تُنسى في البيت. أما التعرّف على الوجه فلا يمكن إعارته، لكنه يتعامل مع بيانات حساسة ويتطلب حذرًا أكبر. بعض المدارس تستعمل البطاقات لمعظم التلاميذ وتضيف الوجه حيث تحتاج يقينًا أكبر. والجواب الصحيح يتوقف على مدرستك لا على ما هو الأحدث.

## أسئلة سيطرحها الأولياء

**أين تُخزَّن بيانات وجه ابني؟** يجب أن تجيب بدقة: على أي جهاز وفي أي خادم ولكم من الوقت.

**من يستطيع رؤيتها؟** من يجب عليهم فقط. ينبغي ألا يتمكن المدرّس من تصفّح الصور.

**هل وافقنا على هذا؟** اكتب إشعارًا قصيرًا واضحًا واجمع الموافقة. في المغرب تخضع المعطيات الشخصية لقانون تشرف عليه اللجنة الوطنية (CNDP). اسأل محاميًا عمّا يجب أن تصرّح به المدرسة وتقوله للأولياء. أنا لست محاميًا وهذا المقال ليس استشارة قانونية.

**وإن غادر الطفل المدرسة؟** تحتاج إلى قاعدة لحذف بياناته.

## ما يجب أن يعمل حين تسوء الأمور

- **انقطاع الإنترنت.** الأجهزة الجيدة تحتفظ بالتسجيلات وترسلها لاحقًا. اطلب من المركِّب أن يثبت ذلك بفصل الشبكة أثناء اختبار.
- **انقطاع الكهرباء.** اعرف ما الذي يضيع، إن ضاع شيء.
- **خطأ في التعرّف أو مسح فائت.** تحتاج الإدارة طريقة بسيطة لتصحيح السجل، ويجب أن يُسجَّل التصحيح.
- **سنة دراسية جديدة.** يجب أن يكون إضافة مئات التلاميذ وحذفهم سهلًا.

## قائمة قصيرة قبل الشراء

1. ما موديلات الأجهزة المدعومة ومن يركّبها؟
2. هل تُخزَّن بيانات الوجه على الجهاز أم على خادمك أم في مكان آخر؟
3. ما إجراء تصحيح سجل خاطئ؟
4. ماذا يرى الولي ومتى؟
5. من المسؤول حين يتعطل شيء؟

وإن أردت ربط هذا بمنصّة كاملة فيها حسابات للأولياء وأدوار للموظفين فاطّلع على [منصّة الإدارة](/ar/services/management-platform). أو [حدّثني عن مدرستك](/ar/contact) وسأقول لك بصدق إن كانت البطاقات أو الوجه أو نظام أبسط هو الأنسب.`,
    },
  },

  // ------------------------------------------------------------------ 4
  {
    slug: "whatsapp-ai-assistant-small-business",
    tags: ["AI", "WhatsApp", "Small business"],
    en: {
      title: "An AI assistant for your small business: what it can safely do on WhatsApp and email",
      excerpt: "An assistant can answer routine messages in seconds. The risk is letting it say things you never approved. Here is a safe way to start.",
      body: `Every small business has the same pile: the same ten questions, again and again, by WhatsApp and email. Opening hours, prices, "do you have a place on Monday", "where is my document". An AI assistant can handle much of this. It can also embarrass you if it is set up badly.

## What an assistant is good at

- **Sorting.** Is this a new client, a complaint, an invoice question, or spam?
- **Drafting.** Writing a clear reply in the customer's language, in your tone.
- **Remembering.** Pulling up what was said last time.
- **Reminding.** Noticing a lead you have not answered in three days.
- **Summarising.** One short digest of what happened today.

## What it should not do alone

Refunds, quotes, contracts, medical or legal advice, and anything about price. A wrong answer here costs money or trust. I do not let an assistant send these by itself. It prepares a draft and you press approve.

## The safe way to start: a human approves every message

This is how the assistant on my own site works. Each incoming message is labelled with a category, an urgency and a language, and a draft reply is written. Nothing is sent until a person approves it. Every action is logged, so you can see exactly what it did and why.

After a few weeks you will notice that some kinds of reply are approved almost every time without a change, such as opening hours or "we received your message". Only those categories can be set to send themselves. You choose, one category at a time.

## Privacy comes first

If the messages contain personal or health information, the assistant must not send them to a cloud service by accident. For a clinic, for example, I design it so that tasks touching personal data run only on a model on your own machine, and if that model is unavailable the task stops instead of leaving. If you handle sensitive data, ask any provider exactly where each message goes.

## What it costs to run

You pay for the setup once, and then a small monthly amount for the AI service, which depends on how many messages you receive. Ask for an estimate based on your own volume, not a general promise.

## When you do not need one

If you get ten messages a week, a few saved replies in WhatsApp Business are enough. An assistant pays off when messages arrive all day, in several languages, and someone spends hours on repeat answers.

## A good first project

Pick one process: for instance "answer new enquiries and book a call". Build only that. Measure how many replies you approve unchanged. Then decide what to add.

That is exactly how my [AI assistant setup](/en/services/ai-assistant) works: one repetitive process, with you in control. If you are not sure whether it fits your business, [describe your daily messages to me](/en/contact) and I will tell you honestly.`,
    },
    fr: {
      title: "Un assistant IA pour votre petite entreprise : ce qu'il peut faire en toute sécurité sur WhatsApp et par e-mail",
      excerpt: "Un assistant peut répondre aux messages courants en quelques secondes. Le risque, c'est de le laisser dire ce que vous n'avez jamais validé. Voici une façon sûre de commencer.",
      body: `Toute petite entreprise a le même tas de messages : les mêmes dix questions, encore et encore, par WhatsApp et par e-mail. Les horaires, les prix, « avez-vous une place lundi », « où est mon document ». Un assistant IA peut en traiter une grande partie. Il peut aussi vous mettre dans l'embarras s'il est mal configuré.

## Ce qu'un assistant fait bien

- **Trier.** Est-ce un nouveau client, une réclamation, une question de facture, ou du spam ?
- **Rédiger.** Écrire une réponse claire dans la langue du client, avec votre ton.
- **Se souvenir.** Retrouver ce qui a été dit la dernière fois.
- **Relancer.** Repérer un contact auquel vous n'avez pas répondu depuis trois jours.
- **Résumer.** Un court récapitulatif de ce qui s'est passé aujourd'hui.

## Ce qu'il ne doit pas faire seul

Remboursements, devis, contrats, conseils médicaux ou juridiques, et tout ce qui touche au prix. Une mauvaise réponse ici coûte de l'argent ou de la confiance. Je ne laisse pas un assistant envoyer cela seul. Il prépare un brouillon et vous appuyez sur approuver.

## La façon sûre de commencer : un humain approuve chaque message

C'est ainsi que fonctionne l'assistant de mon propre site. Chaque message reçu reçoit une catégorie, une urgence et une langue, et un brouillon de réponse est rédigé. Rien n'est envoyé tant qu'une personne ne l'a pas approuvé. Chaque action est consignée, pour que vous voyiez exactement ce qu'il a fait et pourquoi.

Après quelques semaines, vous remarquerez que certaines réponses sont approuvées presque à chaque fois sans modification, comme les horaires ou « nous avons bien reçu votre message ». Seules ces catégories peuvent être réglées pour partir seules. Vous choisissez, une catégorie à la fois.

## La confidentialité d'abord

Si les messages contiennent des informations personnelles ou de santé, l'assistant ne doit pas les envoyer par erreur à un service cloud. Pour un cabinet, par exemple, je conçois le système pour que les tâches touchant des données personnelles s'exécutent uniquement sur un modèle installé sur votre propre machine, et si ce modèle est indisponible, la tâche s'arrête au lieu de sortir. Si vous traitez des données sensibles, demandez à tout prestataire où va exactement chaque message.

## Ce que cela coûte à faire fonctionner

Vous payez la mise en place une fois, puis un petit montant mensuel pour le service d'IA, qui dépend du nombre de messages reçus. Demandez une estimation basée sur votre propre volume, pas une promesse générale.

## Quand vous n'en avez pas besoin

Si vous recevez dix messages par semaine, quelques réponses enregistrées dans WhatsApp Business suffisent. Un assistant devient rentable quand les messages arrivent toute la journée, en plusieurs langues, et que quelqu'un passe des heures à répéter les mêmes réponses.

## Un bon premier projet

Choisissez un processus : par exemple « répondre aux nouvelles demandes et fixer un appel ». Construisez seulement cela. Mesurez combien de réponses vous approuvez sans changement. Puis décidez de ce qu'il faut ajouter.

C'est exactement ainsi que fonctionne ma [mise en place d'assistant IA](/fr/services/ai-assistant) : un processus répétitif, et vous gardez le contrôle. Si vous doutez que cela convienne à votre activité, [décrivez-moi vos messages quotidiens](/fr/contact) et je vous répondrai honnêtement.`,
    },
    ar: {
      title: "مساعد ذكاء اصطناعي لمشروعك الصغير: ما يستطيع فعله بأمان على واتساب والبريد",
      excerpt: "يستطيع المساعد الرد على الرسائل الروتينية في ثوانٍ. الخطر أن تتركه يقول ما لم توافق عليه. هذه طريقة آمنة للبدء.",
      body: `لكل مشروع صغير الكومة نفسها: الأسئلة العشرة نفسها تتكرر عبر واتساب والبريد. ساعات العمل والأسعار و«هل عندكم مكان يوم الاثنين» و«أين وثيقتي». يستطيع مساعد الذكاء الاصطناعي معالجة جزء كبير من هذا. وقد يحرجك إن أُعدّ بشكل سيئ.

## ما يجيده المساعد

- **الفرز.** هل هذا عميل جديد أم شكوى أم سؤال عن فاتورة أم رسالة مزعجة؟
- **الصياغة.** كتابة رد واضح بلغة العميل وبأسلوبك.
- **التذكّر.** استحضار ما قيل في المرة السابقة.
- **التذكير.** ملاحظة عميل محتمل لم تردّ عليه منذ ثلاثة أيام.
- **التلخيص.** ملخص قصير لما حدث اليوم.

## ما لا ينبغي أن يفعله وحده

الاسترداد وعروض الأسعار والعقود والنصائح الطبية أو القانونية وكل ما يخص السعر. الجواب الخاطئ هنا يكلّف مالًا أو ثقة. لا أترك المساعد يرسل هذه بنفسه. يُعدّ مسودة وأنت تضغط موافقة.

## الطريقة الآمنة للبدء: إنسان يوافق على كل رسالة

هكذا يعمل المساعد في موقعي. كل رسالة واردة تُصنَّف بفئة ودرجة استعجال ولغة، وتُكتب لها مسودة رد. لا يُرسَل شيء حتى يوافق شخص. وكل إجراء يُسجَّل، فترى بالضبط ما فعله ولماذا.

بعد أسابيع ستلاحظ أن أنواعًا من الردود تُقبل تقريبًا كل مرة دون تعديل، مثل ساعات العمل أو «وصلتنا رسالتك». هذه الفئات وحدها يمكن ضبطها لتُرسَل تلقائيًا. وأنت تختار، فئة بعد فئة.

## الخصوصية أولًا

إن كانت الرسائل تحوي معلومات شخصية أو صحية فيجب ألا يرسلها المساعد إلى خدمة سحابية بالخطأ. في عيادة مثلًا أصمّم النظام بحيث تعمل المهام التي تمسّ البيانات الشخصية على نموذج في جهازك أنت فقط، وإن لم يكن متاحًا تتوقف المهمة بدل أن تخرج البيانات. وإن كنت تتعامل مع بيانات حساسة فاسأل أي مزوّد إلى أين تذهب كل رسالة بالضبط.

## كم يكلّف التشغيل

تدفع مرة واحدة للإعداد، ثم مبلغًا شهريًا صغيرًا لخدمة الذكاء الاصطناعي يتوقف على عدد الرسائل. اطلب تقديرًا مبنيًا على حجمك أنت، لا وعدًا عامًا.

## متى لا تحتاج إليه

إن كانت تصلك عشر رسائل في الأسبوع فبضع ردود محفوظة في واتساب للأعمال تكفي. يُجدي المساعد حين تصل الرسائل طوال اليوم وبعدّة لغات ويقضي أحدهم ساعات في تكرار الإجابات نفسها.

## مشروع أول جيد

اختر عملية واحدة، مثل «الرد على الاستفسارات الجديدة وحجز مكالمة». ابنِ هذه فقط. وقِس كم ردًّا توافق عليه دون تعديل. ثم قرّر ما تضيفه.

هكذا بالضبط يعمل [إعداد مساعد الذكاء الاصطناعي](/ar/services/ai-assistant) عندي: عملية متكررة واحدة وأنت المتحكم. وإن لم تكن متأكدًا من ملاءمته لنشاطك فـ[صِف لي رسائلك اليومية](/ar/contact) وسأجيبك بصدق.`,
    },
  },

  // ------------------------------------------------------------------ 5
  {
    slug: "custom-platform-or-off-the-shelf-software",
    tags: ["Decision guide", "Custom software", "Small business"],
    en: {
      title: "Custom platform or ready-made software? An honest way to decide",
      excerpt: "Sometimes the right answer is a subscription, not a developer. Five questions that tell you which one you need.",
      body: `A developer who only recommends building something custom is selling, not advising. Often the right answer is a ready-made product. I would rather tell you that now than after you have paid.

Here are the five questions I ask a school, a clinic or a hotel before suggesting anything.

## 1. Do you work the way everyone else works?

If your process is standard, such as invoicing, a simple booking calendar or a basic website, a ready-made tool is almost always better. It is cheaper, tested by thousands of users, and someone else maintains it.

If your way of working is unusual, such as your own timetable rules, your own approval steps, or several roles with strict limits, ready-made software makes you adapt to it. That is when custom starts to make sense.

## 2. How much do you work around your current tool?

Count the workarounds: a spreadsheet next to the software, retyping between two systems, a WhatsApp group to cover what it cannot do. A few are normal. If staff lose hours every week to workarounds, those hours already cost more than you think.

## 3. How many people use it, and how often?

A tool used by two people once a week can be simple and cheap. A platform that dozens of staff and hundreds of parents open every day must be fast, safe, and supported. Daily use is where the difference between a toy and a real system shows.

## 4. What is the cost over three years, not three months?

Ready-made software usually charges per user or per month. Over several years and many users, that total can exceed the cost of a platform built for you. Custom costs more at the start and has its own running costs for hosting and support. Compare the same three-year period for both, honestly.

## 5. How sensitive is your data?

Student records, health information and staff biometrics need special care. With a ready-made product, you accept its rules about where data lives. With a custom platform you can decide, for example, to keep sensitive tasks on your own server. If control of the data is a requirement, say so early.

## A simple way to read your answers

- **Mostly "yes, I'm standard", low use, little sensitivity:** buy ready-made.
- **A mix:** start with a ready-made tool and plan a custom piece only for the part that does not fit.
- **Mostly unusual, heavy daily use, sensitive data, many workarounds:** a custom platform is likely worth discussing.

## A middle path: start small

You do not have to build everything. A short paid discovery step gives you a written plan and a firm price, and you can start with the part that hurts most. Many projects begin with one process and grow.

## If you are unsure

[Write to me](/en/contact) with a few lines about how you work today. I will tell you honestly whether to buy software, build something small, or build a platform. You can see how I work with organisations on the [services page](/en/services).`,
    },
    fr: {
      title: "Plateforme sur mesure ou logiciel prêt à l'emploi ? Une façon honnête de décider",
      excerpt: "Parfois la bonne réponse est un abonnement, pas un développeur. Cinq questions qui vous disent de quoi vous avez besoin.",
      body: `Un développeur qui ne recommande que du sur mesure vend, il ne conseille pas. Souvent, la bonne réponse est un produit prêt à l'emploi. Je préfère vous le dire maintenant plutôt qu'après paiement.

Voici les cinq questions que je pose à une école, une clinique ou un hôtel avant de proposer quoi que ce soit.

## 1. Travaillez-vous comme tout le monde ?

Si votre processus est standard, comme la facturation, un simple calendrier de réservation ou un site de base, un outil prêt à l'emploi est presque toujours meilleur. Il est moins cher, testé par des milliers d'utilisateurs, et quelqu'un d'autre le maintient.

Si votre façon de travailler est particulière, avec vos propres règles d'emploi du temps, vos propres étapes de validation, ou plusieurs rôles aux limites strictes, un logiciel prêt à l'emploi vous force à vous adapter. C'est là que le sur mesure devient pertinent.

## 2. Combien de contournements faites-vous avec votre outil actuel ?

Comptez-les : un tableur à côté du logiciel, des ressaisies entre deux systèmes, un groupe WhatsApp pour couvrir ce qu'il ne fait pas. Quelques-uns sont normaux. Si votre personnel perd des heures chaque semaine en contournements, ces heures coûtent déjà plus que vous ne le pensez.

## 3. Combien de personnes l'utilisent, et à quelle fréquence ?

Un outil utilisé par deux personnes une fois par semaine peut rester simple et peu cher. Une plateforme que des dizaines d'employés et des centaines de parents ouvrent chaque jour doit être rapide, sûre et suivie. L'usage quotidien est ce qui distingue un jouet d'un vrai système.

## 4. Quel est le coût sur trois ans, et non sur trois mois ?

Un logiciel prêt à l'emploi facture généralement par utilisateur ou par mois. Sur plusieurs années et avec de nombreux utilisateurs, ce total peut dépasser le coût d'une plateforme conçue pour vous. Le sur mesure coûte plus au départ et a ses propres coûts de fonctionnement pour l'hébergement et le support. Comparez honnêtement la même période de trois ans pour les deux.

## 5. Vos données sont-elles sensibles ?

Les dossiers d'élèves, les informations de santé et la biométrie du personnel demandent un soin particulier. Avec un produit prêt à l'emploi, vous acceptez ses règles sur l'emplacement des données. Avec une plateforme sur mesure, vous pouvez décider, par exemple, de garder les tâches sensibles sur votre propre serveur. Si le contrôle des données est une exigence, dites-le dès le début.

## Une lecture simple de vos réponses

- **Surtout « oui, je suis standard », peu d'usage, peu de sensibilité :** achetez du prêt à l'emploi.
- **Un mélange :** commencez avec un outil prêt à l'emploi et prévoyez du sur mesure seulement pour la partie qui ne convient pas.
- **Surtout particulier, usage quotidien intense, données sensibles, nombreux contournements :** une plateforme sur mesure mérite probablement la discussion.

## Une voie intermédiaire : commencer petit

Vous n'avez pas à tout construire. Une courte étape de découverte payante vous donne un plan écrit et un prix ferme, et vous pouvez commencer par ce qui fait le plus mal. Beaucoup de projets commencent par un processus et grandissent.

## Si vous hésitez

[Écrivez-moi](/fr/contact) quelques lignes sur votre façon de travailler aujourd'hui. Je vous dirai honnêtement s'il faut acheter un logiciel, construire quelque chose de petit, ou construire une plateforme. Vous pouvez voir comment je travaille avec les organisations sur la [page des services](/fr/services).`,
    },
    ar: {
      title: "منصّة مخصّصة أم برنامج جاهز؟ طريقة صادقة للقرار",
      excerpt: "أحيانًا يكون الجواب الصحيح اشتراكًا لا مطوّرًا. خمسة أسئلة تدلّك على ما تحتاج إليه.",
      body: `المطوّر الذي لا ينصح إلا بالمخصّص يبيع ولا ينصح. وكثيرًا ما يكون الجواب الصحيح منتجًا جاهزًا. أفضّل أن أقول لك هذا الآن لا بعد أن تدفع.

هذه الأسئلة الخمسة التي أطرحها على مدرسة أو عيادة أو فندق قبل أن أقترح أي شيء.

## 1. هل تعمل كما يعمل الجميع؟

إن كانت عمليتك نمطية، مثل الفوترة أو تقويم حجز بسيط أو موقع أساسي، فالأداة الجاهزة أفضل تقريبًا دائمًا. فهي أرخص، وجرّبها آلاف المستخدمين، وغيرك يتولى صيانتها.

وإن كانت طريقة عملك غير معتادة، كقواعد جدول خاصة بك أو خطوات موافقة خاصة أو أدوار كثيرة بحدود صارمة، فالبرنامج الجاهز يجبرك على التكيّف معه. وهنا يصبح المخصّص منطقيًا.

## 2. كم تتحايل على أداتك الحالية؟

عُدّ الحلول الالتفافية: جدول بيانات بجانب البرنامج، وإعادة كتابة بين نظامين، ومجموعة واتساب لتغطية ما لا يفعله. القليل منها عادي. وإن كان الموظفون يخسرون ساعات كل أسبوع في التحايل فهذه الساعات تكلّفك أكثر مما تظن.

## 3. كم شخصًا يستعمله وبأي وتيرة؟

أداة يستعملها شخصان مرة في الأسبوع يمكن أن تبقى بسيطة ورخيصة. أما منصّة يفتحها عشرات الموظفين ومئات الأولياء كل يوم فيجب أن تكون سريعة وآمنة ومدعومة. والاستعمال اليومي هو ما يفرّق بين لعبة ونظام حقيقي.

## 4. كم التكلفة على ثلاث سنوات لا ثلاثة أشهر؟

البرنامج الجاهز يتقاضى عادةً عن كل مستخدم أو كل شهر. وعلى مدى سنوات وعدد كبير من المستخدمين قد يتجاوز المجموع كلفة منصّة مبنية لك. والمخصّص يكلّف أكثر في البداية وله تكاليف تشغيل للاستضافة والدعم. قارن بصدق الفترة نفسها، ثلاث سنوات، للخيارين.

## 5. ما مدى حساسية بياناتك؟

سجلات التلاميذ والمعلومات الصحية والبيانات الحيوية للموظفين تحتاج عناية خاصة. مع المنتج الجاهز تقبل قواعده بشأن مكان البيانات. ومع المنصّة المخصّصة تستطيع مثلًا إبقاء المهام الحساسة على خادمك أنت. وإن كان التحكم في البيانات شرطًا فقُلْ ذلك مبكرًا.

## قراءة بسيطة لإجاباتك

- **أغلبها «نعم أنا نمطي» واستعمال قليل وحساسية قليلة:** اشترِ جاهزًا.
- **خليط:** ابدأ بأداة جاهزة وخطّط لقطعة مخصّصة للجزء الذي لا يناسب فقط.
- **أغلبها غير معتاد واستعمال يومي كثيف وبيانات حساسة وحلول التفافية كثيرة:** المنصّة المخصّصة تستحق النقاش على الأرجح.

## طريق وسط: ابدأ صغيرًا

لا يجب أن تبني كل شيء. مرحلة استكشاف قصيرة مدفوعة تعطيك خطة مكتوبة وسعرًا نهائيًا، ويمكنك البدء بالجزء الأكثر إيلامًا. كثير من المشاريع تبدأ بعملية واحدة ثم تكبر.

## إن كنت غير متأكد

[اكتب لي](/ar/contact) بضعة أسطر عن طريقة عملك اليوم. سأقول لك بصدق إن كان عليك شراء برنامج أو بناء شيء صغير أو بناء منصّة. وتستطيع رؤية كيف أعمل مع المؤسسات في [صفحة الخدمات](/ar/services).`,
    },
  },
  ...brandPosts,
];

async function main() {
  let created = 0;
  for (const p of posts) {
    const existing = await prisma.post.findUnique({ where: { slug: p.slug } });
    if (existing) {
      console.log(`- ${p.slug}: already exists, left as it is`);
      continue;
    }
    await prisma.post.create({
      data: {
        slug: p.slug,
        title: p.en.title,
        excerpt: p.en.excerpt,
        body: p.en.body,
        tags: p.tags,
        translations: { fr: p.fr, ar: p.ar },
        published: false,
      },
    });
    created++;
    console.log(`+ ${p.slug}: saved as a draft`);
  }
  console.log(`\nDone. ${created} draft${created === 1 ? "" : "s"} added. Read them in Admin -> Blog, then publish.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
