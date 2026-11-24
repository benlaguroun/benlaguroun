import type { Locale } from "./config";

// The text of the legal pages. It lives here, apart from the page dictionaries,
// because it is long. {name}, {email}, {country} and {days} are filled in from
// config/site.ts when the page is shown.
//
// This is a sensible starting point written for how this site really works
// (accounts, card and PayPal payments, a contact form, a newsletter). It is not
// legal advice: have a lawyer read it before you rely on it.

export type LegalKey = "privacy" | "terms" | "refunds";
export type LegalDoc = { title: string; description: string; intro: string; sections: { h: string; p: string[] }[] };

const en: Record<LegalKey, LegalDoc> = {
  privacy: {
    title: "Privacy policy",
    description: "What personal data this site collects, why, and the choices you have.",
    intro:
      "This page explains what personal information {name} collects through this website, why it is needed, and what you can do about it. It is written in plain language on purpose.",
    sections: [
      {
        h: "Who is responsible",
        p: ["{name} runs this website and is responsible for your personal data. You can reach me at {email}."],
      },
      {
        h: "What I collect",
        p: [
          "Account: your name, your email address and your password, which is stored in scrambled (hashed) form and can't be read by anyone, including me.",
          "Purchases: which product you bought, the amount and currency, the date, and which payment method you used. I never see or store your card number. It is entered on the secure page of the payment provider.",
          "Messages: what you write in the contact form, including your name, email, the service you are interested in and your budget range if you choose to give it.",
          "Newsletter: your email address and the language of the page you signed up from, only if you subscribe.",
          "Technical data: when you sign in, your IP address and browser type are stored with your session so I can keep your account secure.",
        ],
      },
      {
        h: "Why I use it",
        p: [
          "To create and run your account, deliver what you bought, and send your receipt.",
          "To answer your messages and, if we work together, to manage the project and invoices.",
          "To send you the newsletter, only if you asked for it. Every email has an unsubscribe link.",
          "To keep the site secure and to meet accounting and legal duties.",
        ],
      },
      {
        h: "Who I share it with",
        p: [
          "I don't sell your data and I don't share it for advertising. I only use trusted providers that are needed to run the site:",
          "Payment providers (Stripe and PayPal) process your payment on their own pages. They have their own privacy policies.",
          "An email delivery provider (Brevo) sends receipts and newsletters on my behalf.",
          "Hosting and database services that store the site's data.",
          "I may also disclose information when the law requires it.",
        ],
      },
      {
        h: "Cookies",
        p: [
          "This site uses only the cookies needed to keep you signed in and to remember your language. It does not use advertising cookies. If I add analytics later, I will choose a privacy-friendly tool and update this page.",
        ],
      },
      {
        h: "How long I keep it",
        p: [
          "Account data is kept while your account exists. Purchase records are kept as long as accounting and legal rules require. Messages are kept as long as they are useful for our conversation or project. Newsletter addresses are kept until you unsubscribe. You can ask me to delete your data at any time.",
        ],
      },
      {
        h: "Your rights",
        p: [
          "You can ask to see the data I hold about you, correct it, delete it, or object to how it is used. Write to {email} and I will answer within a reasonable time.",
          "These rights come from the data protection law that applies to you, including Law 09-08 in {country} and, for visitors in the European Union, the GDPR. If you are not happy with my answer, you can complain to your local data protection authority.",
        ],
      },
      {
        h: "Security",
        p: [
          "Data is sent over encrypted connections and passwords are hashed. No website can promise perfect security, but I take reasonable care and will tell you if something affecting you goes wrong.",
        ],
      },
      {
        h: "Children",
        p: ["This site is meant for adults and young people over 16. It is not designed for younger children."],
      },
      {
        h: "Changes",
        p: ["If I change this policy, the new version appears on this page with a new date at the top."],
      },
    ],
  },
  terms: {
    title: "Terms of sale",
    description: "The rules for buying and using services, templates and courses from this site.",
    intro:
      "These terms apply when you create an account or buy anything on this website. By buying, you agree to them. If something is unclear, write to {email} before you pay.",
    sections: [
      {
        h: "Who you are buying from",
        p: ["{name}, an independent engineer based in {country}. Contact: {email}."],
      },
      {
        h: "Your account",
        p: [
          "You need an account to buy templates and courses. Give accurate details, keep your password private and don't share your account. You are responsible for what happens under it.",
        ],
      },
      {
        h: "What you can buy",
        p: [
          "Templates are digital files. After payment you can download them and use them in as many of your own and your clients' projects as you like. You may not resell, share or publish the template itself, or give your download link to others.",
          "Courses give you personal, lifetime access to the lessons while the course is offered on this site. Access is for you only and may not be shared or recorded for distribution.",
          "Services (websites, platforms, automation) are agreed case by case. The scope, price, timeline and payment schedule are set in a written quote or agreement, which takes priority over these terms where they differ.",
        ],
      },
      {
        h: "Prices and payment",
        p: [
          "The price is shown before you pay and is charged once. There is no subscription unless it says so. Payment is handled by Stripe or PayPal. Their fees, currency conversion and any local taxes shown at checkout apply.",
        ],
      },
      {
        h: "Delivery",
        p: [
          "Digital products are available immediately after the payment is confirmed, usually within seconds. You'll find them in your library and in your receipt email. If something doesn't arrive, write to {email}.",
        ],
      },
      {
        h: "Refunds",
        p: ["Refunds are covered in the refund policy, which is part of these terms."],
      },
      {
        h: "Ownership",
        p: [
          "Everything on this site, including the code, text, lessons, designs and templates, belongs to {name} or is used with permission. Buying gives you the right to use it as described above, not to own it.",
        ],
      },
      {
        h: "Fair use of the site",
        p: [
          "Please don't try to break the site, access other people's accounts, copy paid content or use it for anything unlawful. I may close accounts that do.",
        ],
      },
      {
        h: "Limits of responsibility",
        p: [
          "I work carefully, but the courses and templates are provided as they are. I can't promise a particular business result, because that depends on your own work and market. To the extent the law allows, my responsibility for any claim is limited to the amount you paid for the product concerned.",
        ],
      },
      {
        h: "Governing law",
        p: ["These terms are governed by the laws of {country}. Where the law gives you consumer rights that can't be waived, those rights still apply."],
      },
      {
        h: "Changes",
        p: ["I may update these terms. Changes apply to purchases made after the date at the top of this page."],
      },
    ],
  },
  refunds: {
    title: "Refund policy",
    description: "When and how you can get your money back.",
    intro: "I want you to be happy with what you buy. This is how refunds work.",
    sections: [
      {
        h: "Templates and courses",
        p: [
          "You can ask for a full refund within {days} days of buying if the product isn't what you expected or doesn't work as described. No long explanation needed.",
        ],
      },
      {
        h: "How to ask",
        p: [
          "Email {email} from the address you used to buy, with your order number or the product name. I usually reply within two working days.",
        ],
      },
      {
        h: "When a refund isn't possible",
        p: [
          "After {days} days.",
          "If there is clear evidence the product was shared, resold or redistributed.",
          "Services that are already delivered or under way: these follow the written quote or agreement, which sets out deposits and the work that has been done.",
        ],
      },
      {
        h: "How you get the money back",
        p: [
          "Refunds go back to the original payment method through Stripe or PayPal. It usually takes 5 to 10 business days to appear, depending on your bank. When a refund is issued, access to the product is removed.",
        ],
      },
      {
        h: "Charged by mistake",
        p: ["If you were charged twice or the payment went through but you got no access, write to me and I'll fix it or refund you straight away."],
      },
    ],
  },
};

const fr: Record<LegalKey, LegalDoc> = {
  privacy: {
    title: "Politique de confidentialité",
    description: "Les données personnelles collectées par ce site, pourquoi, et vos choix.",
    intro:
      "Cette page explique quelles informations personnelles {name} collecte via ce site, pourquoi elles sont nécessaires et ce que vous pouvez faire à ce sujet. Elle est rédigée en langage simple volontairement.",
    sections: [
      {
        h: "Qui est responsable",
        p: ["{name} gère ce site et est responsable de vos données personnelles. Vous pouvez me joindre à {email}."],
      },
      {
        h: "Ce que je collecte",
        p: [
          "Compte : votre nom, votre adresse e-mail et votre mot de passe, conservé sous forme brouillée (hachée) que personne ne peut lire, moi compris.",
          "Achats : le produit acheté, le montant et la devise, la date et le moyen de paiement utilisé. Je ne vois ni ne conserve jamais votre numéro de carte : il est saisi sur la page sécurisée du prestataire de paiement.",
          "Messages : ce que vous écrivez dans le formulaire de contact, y compris votre nom, votre e-mail, le service qui vous intéresse et votre budget si vous choisissez de l'indiquer.",
          "Newsletter : votre adresse e-mail et la langue de la page d'inscription, uniquement si vous vous abonnez.",
          "Données techniques : à la connexion, votre adresse IP et votre navigateur sont enregistrés avec votre session pour sécuriser votre compte.",
        ],
      },
      {
        h: "Pourquoi je les utilise",
        p: [
          "Pour créer et gérer votre compte, livrer ce que vous avez acheté et envoyer votre reçu.",
          "Pour répondre à vos messages et, si nous travaillons ensemble, gérer le projet et les factures.",
          "Pour vous envoyer la newsletter, uniquement si vous l'avez demandée. Chaque e-mail contient un lien de désinscription.",
          "Pour assurer la sécurité du site et respecter les obligations comptables et légales.",
        ],
      },
      {
        h: "Avec qui je les partage",
        p: [
          "Je ne vends pas vos données et je ne les partage pas à des fins publicitaires. J'utilise seulement des prestataires de confiance nécessaires au fonctionnement du site :",
          "Les prestataires de paiement (Stripe et PayPal) traitent votre paiement sur leurs propres pages. Ils ont leur propre politique de confidentialité.",
          "Un prestataire d'envoi d'e-mails (Brevo) envoie les reçus et la newsletter pour mon compte.",
          "Des services d'hébergement et de base de données qui stockent les données du site.",
          "Je peux aussi communiquer des informations lorsque la loi l'exige.",
        ],
      },
      {
        h: "Cookies",
        p: [
          "Ce site utilise uniquement les cookies nécessaires pour vous garder connecté et mémoriser votre langue. Il n'utilise pas de cookies publicitaires. Si j'ajoute plus tard un outil de statistiques, je choisirai un outil respectueux de la vie privée et je mettrai cette page à jour.",
        ],
      },
      {
        h: "Durée de conservation",
        p: [
          "Les données du compte sont conservées tant que votre compte existe. Les achats sont conservés aussi longtemps que l'exigent les règles comptables et légales. Les messages sont conservés tant qu'ils sont utiles à notre échange ou à notre projet. Les adresses de la newsletter sont conservées jusqu'à votre désinscription. Vous pouvez me demander de supprimer vos données à tout moment.",
        ],
      },
      {
        h: "Vos droits",
        p: [
          "Vous pouvez demander à consulter les données que je détiens sur vous, les corriger, les supprimer ou vous opposer à leur utilisation. Écrivez à {email} et je répondrai dans un délai raisonnable.",
          "Ces droits découlent de la loi de protection des données qui s'applique à vous, notamment la loi 09-08 au {country} et, pour les visiteurs de l'Union européenne, le RGPD. Si ma réponse ne vous satisfait pas, vous pouvez saisir l'autorité de protection des données de votre pays.",
        ],
      },
      {
        h: "Sécurité",
        p: [
          "Les données transitent par des connexions chiffrées et les mots de passe sont hachés. Aucun site ne peut promettre une sécurité parfaite, mais j'y apporte un soin raisonnable et je vous préviendrai en cas de problème vous concernant.",
        ],
      },
      {
        h: "Enfants",
        p: ["Ce site s'adresse aux adultes et aux jeunes de plus de 16 ans. Il n'est pas conçu pour de plus jeunes enfants."],
      },
      {
        h: "Modifications",
        p: ["Si je modifie cette politique, la nouvelle version apparaît sur cette page avec une nouvelle date en haut."],
      },
    ],
  },
  terms: {
    title: "Conditions de vente",
    description: "Les règles pour acheter et utiliser les services, modèles et formations de ce site.",
    intro:
      "Ces conditions s'appliquent lorsque vous créez un compte ou achetez quoi que ce soit sur ce site. En achetant, vous les acceptez. Si quelque chose n'est pas clair, écrivez à {email} avant de payer.",
    sections: [
      {
        h: "Votre vendeur",
        p: ["{name}, ingénieur indépendant basé au {country}. Contact : {email}."],
      },
      {
        h: "Votre compte",
        p: [
          "Un compte est nécessaire pour acheter des modèles et des formations. Donnez des informations exactes, gardez votre mot de passe secret et ne partagez pas votre compte. Vous êtes responsable de ce qui s'y passe.",
        ],
      },
      {
        h: "Ce que vous pouvez acheter",
        p: [
          "Les modèles sont des fichiers numériques. Après paiement, vous pouvez les télécharger et les utiliser dans autant de vos projets et de ceux de vos clients que vous voulez. Vous ne pouvez pas revendre, partager ou publier le modèle lui-même, ni donner votre lien de téléchargement à d'autres.",
          "Les formations vous donnent un accès personnel et à vie aux leçons, tant que la formation est proposée sur ce site. L'accès est strictement personnel et ne peut être partagé ni enregistré pour être diffusé.",
          "Les services (sites, plateformes, automatisation) sont convenus au cas par cas. Le périmètre, le prix, le calendrier et l'échéancier de paiement figurent dans un devis ou un contrat écrit, qui prévaut sur ces conditions en cas de différence.",
        ],
      },
      {
        h: "Prix et paiement",
        p: [
          "Le prix est affiché avant le paiement et est débité une seule fois. Il n'y a pas d'abonnement sauf mention contraire. Le paiement est traité par Stripe ou PayPal. Leurs frais, la conversion de devise et les taxes locales indiquées au paiement s'appliquent.",
        ],
      },
      {
        h: "Livraison",
        p: [
          "Les produits numériques sont disponibles dès la confirmation du paiement, généralement en quelques secondes. Vous les retrouvez dans votre bibliothèque et dans votre e-mail de reçu. Si quelque chose n'arrive pas, écrivez à {email}.",
        ],
      },
      {
        h: "Remboursements",
        p: ["Les remboursements sont décrits dans la politique de remboursement, qui fait partie de ces conditions."],
      },
      {
        h: "Propriété",
        p: [
          "Tout le contenu de ce site, y compris le code, les textes, les leçons, les designs et les modèles, appartient à {name} ou est utilisé avec autorisation. Votre achat vous donne le droit de l'utiliser comme décrit ci-dessus, pas d'en devenir propriétaire.",
        ],
      },
      {
        h: "Utilisation correcte du site",
        p: [
          "Merci de ne pas tenter de perturber le site, d'accéder aux comptes d'autres personnes, de copier du contenu payant ou de l'utiliser à des fins illégales. Je peux fermer les comptes qui le font.",
        ],
      },
      {
        h: "Limites de responsabilité",
        p: [
          "Je travaille avec soin, mais les formations et les modèles sont fournis tels quels. Je ne peux pas promettre un résultat commercial précis, car il dépend de votre travail et de votre marché. Dans la mesure permise par la loi, ma responsabilité pour toute réclamation est limitée au montant que vous avez payé pour le produit concerné.",
        ],
      },
      {
        h: "Droit applicable",
        p: ["Ces conditions sont régies par les lois du {country}. Lorsque la loi vous donne des droits de consommateur auxquels on ne peut pas renoncer, ces droits continuent de s'appliquer."],
      },
      {
        h: "Modifications",
        p: ["Je peux mettre à jour ces conditions. Les changements s'appliquent aux achats effectués après la date indiquée en haut de cette page."],
      },
    ],
  },
  refunds: {
    title: "Politique de remboursement",
    description: "Quand et comment récupérer votre argent.",
    intro: "Je veux que vous soyez satisfait de ce que vous achetez. Voici comment fonctionnent les remboursements.",
    sections: [
      {
        h: "Modèles et formations",
        p: [
          "Vous pouvez demander un remboursement intégral dans les {days} jours suivant l'achat si le produit n'est pas ce que vous attendiez ou ne fonctionne pas comme décrit. Pas besoin de longues explications.",
        ],
      },
      {
        h: "Comment faire la demande",
        p: [
          "Écrivez à {email} depuis l'adresse utilisée pour l'achat, avec votre numéro de commande ou le nom du produit. Je réponds généralement sous deux jours ouvrés.",
        ],
      },
      {
        h: "Quand un remboursement n'est pas possible",
        p: [
          "Passé le délai de {days} jours.",
          "S'il existe des preuves claires que le produit a été partagé, revendu ou redistribué.",
          "Les services déjà livrés ou en cours : ils suivent le devis ou le contrat écrit, qui précise les acomptes et le travail déjà réalisé.",
        ],
      },
      {
        h: "Comment l'argent vous est rendu",
        p: [
          "Les remboursements sont renvoyés sur le moyen de paiement d'origine via Stripe ou PayPal. Comptez généralement 5 à 10 jours ouvrés selon votre banque. Lorsqu'un remboursement est effectué, l'accès au produit est retiré.",
        ],
      },
      {
        h: "Débit par erreur",
        p: ["Si vous avez été débité deux fois, ou si le paiement est passé sans que vous obteniez l'accès, écrivez-moi et je corrigerai le problème ou vous rembourserai immédiatement."],
      },
    ],
  },
};

const ar: Record<LegalKey, LegalDoc> = {
  privacy: {
    title: "سياسة الخصوصية",
    description: "ما البيانات الشخصية التي يجمعها هذا الموقع، ولماذا، وما هي خياراتك.",
    intro:
      "توضّح هذه الصفحة ما المعلومات الشخصية التي يجمعها {name} عبر هذا الموقع، ولماذا نحتاجها، وما الذي يمكنك فعله بشأنها. كُتبت بلغة بسيطة عن قصد.",
    sections: [
      {
        h: "من المسؤول",
        p: ["{name} يدير هذا الموقع وهو المسؤول عن بياناتك الشخصية. يمكنك التواصل معي عبر {email}."],
      },
      {
        h: "ما الذي أجمعه",
        p: [
          "الحساب: اسمك وبريدك الإلكتروني وكلمة مرورك، وتُحفظ كلمة المرور بصيغة مشفّرة لا يستطيع أحد قراءتها، بمن فيهم أنا.",
          "المشتريات: المنتج الذي اشتريته، والمبلغ والعملة، والتاريخ، وطريقة الدفع المستخدمة. لا أرى رقم بطاقتك ولا أحفظه أبدًا، فهو يُدخل في صفحة مزوّد الدفع الآمنة.",
          "الرسائل: ما تكتبه في نموذج التواصل، ويشمل اسمك وبريدك والخدمة التي تهمّك ونطاق ميزانيتك إن اخترت ذكره.",
          "النشرة البريدية: بريدك الإلكتروني ولغة الصفحة التي اشتركت منها، وذلك فقط إذا اشتركت.",
          "بيانات تقنية: عند تسجيل الدخول يُحفظ عنوان IP ونوع المتصفح مع جلستك لحماية حسابك.",
        ],
      },
      {
        h: "لماذا أستخدمها",
        p: [
          "لإنشاء حسابك وتشغيله، وتسليم ما اشتريته، وإرسال إيصالك.",
          "للرد على رسائلك، وإذا عملنا معًا فلإدارة المشروع والفواتير.",
          "لإرسال النشرة البريدية إليك، فقط إذا طلبتها. وكل رسالة تحتوي على رابط لإلغاء الاشتراك.",
          "لحماية الموقع والوفاء بالالتزامات المحاسبية والقانونية.",
        ],
      },
      {
        h: "مع من أشاركها",
        p: [
          "لا أبيع بياناتك ولا أشاركها لأغراض إعلانية. أستعين فقط بمزوّدين موثوقين لازمين لتشغيل الموقع:",
          "مزوّدو الدفع (Stripe وPayPal) يعالجون دفعتك في صفحاتهم الخاصة، ولكل منهم سياسة خصوصية خاصة به.",
          "مزوّد إرسال البريد (Brevo) يرسل الإيصالات والنشرة نيابةً عني.",
          "خدمات الاستضافة وقواعد البيانات التي تخزّن بيانات الموقع.",
          "وقد أكشف معلومات عندما يوجب القانون ذلك.",
        ],
      },
      {
        h: "ملفات تعريف الارتباط",
        p: [
          "يستخدم هذا الموقع فقط ملفات تعريف الارتباط اللازمة لإبقائك مسجّل الدخول وتذكّر لغتك. ولا يستخدم ملفات إعلانية. وإذا أضفت أدوات إحصاء لاحقًا فسأختار أداة تحترم الخصوصية وأحدّث هذه الصفحة.",
        ],
      },
      {
        h: "مدة الاحتفاظ",
        p: [
          "تُحفظ بيانات الحساب ما دام حسابك قائمًا. وتُحفظ سجلات المشتريات للمدة التي تفرضها القواعد المحاسبية والقانونية. وتُحفظ الرسائل ما دامت مفيدة لمحادثتنا أو مشروعنا. وتُحفظ عناوين النشرة حتى تلغي اشتراكك. ويمكنك أن تطلب مني حذف بياناتك في أي وقت.",
        ],
      },
      {
        h: "حقوقك",
        p: [
          "يمكنك أن تطلب الاطلاع على البيانات التي أحتفظ بها عنك، أو تصحيحها، أو حذفها، أو الاعتراض على استخدامها. راسلني على {email} وسأرد خلال مدة معقولة.",
          "تنبع هذه الحقوق من قانون حماية البيانات المطبّق عليك، ومنه القانون 09-08 في {country} واللائحة الأوروبية العامة لحماية البيانات (GDPR) للزوار من الاتحاد الأوروبي. وإن لم ترضَ بردّي فيمكنك التقدّم بشكوى إلى هيئة حماية البيانات في بلدك.",
        ],
      },
      {
        h: "الأمان",
        p: [
          "تُنقل البيانات عبر اتصالات مشفّرة وتُحفظ كلمات المرور بصيغة مشفّرة. لا يستطيع أي موقع أن يعد بأمان مطلق، لكنني أعتني بذلك بما يلزم وسأخبرك إذا حدث ما يمسّك.",
        ],
      },
      {
        h: "الأطفال",
        p: ["هذا الموقع موجّه للبالغين والشباب فوق 16 عامًا، وليس مصممًا للأطفال الأصغر."],
      },
      {
        h: "التغييرات",
        p: ["إذا غيّرت هذه السياسة فستظهر النسخة الجديدة في هذه الصفحة مع تاريخ جديد في أعلاها."],
      },
    ],
  },
  terms: {
    title: "شروط البيع",
    description: "قواعد شراء واستخدام الخدمات والقوالب والدورات من هذا الموقع.",
    intro:
      "تسري هذه الشروط عندما تنشئ حسابًا أو تشتري أي شيء من هذا الموقع، وبالشراء فإنك توافق عليها. وإن لم يكن شيء واضحًا فراسلني على {email} قبل الدفع.",
    sections: [
      {
        h: "من تشتري منه",
        p: ["{name}، مهندس مستقل مقيم في {country}. للتواصل: {email}."],
      },
      {
        h: "حسابك",
        p: [
          "تحتاج إلى حساب لشراء القوالب والدورات. قدّم بيانات صحيحة، واحتفظ بكلمة مرورك سرية، ولا تشارك حسابك مع غيرك. أنت مسؤول عما يحدث تحته.",
        ],
      },
      {
        h: "ما الذي يمكنك شراؤه",
        p: [
          "القوالب ملفات رقمية. بعد الدفع يمكنك تنزيلها واستخدامها في عدد غير محدود من مشاريعك ومشاريع عملائك. ولا يجوز لك إعادة بيع القالب نفسه أو مشاركته أو نشره، ولا إعطاء رابط التنزيل لغيرك.",
          "تمنحك الدورات وصولًا شخصيًا مدى الحياة إلى الدروس ما دامت الدورة معروضة في هذا الموقع. الوصول لك وحدك، ولا يجوز مشاركته أو تسجيله لإعادة توزيعه.",
          "الخدمات (المواقع والمنصات والأتمتة) يُتفق عليها حالةً بحالة. ويُحدَّد النطاق والسعر والجدول الزمني وجدول الدفعات في عرض سعر أو اتفاق مكتوب، وتكون له الأولوية على هذه الشروط عند التعارض.",
        ],
      },
      {
        h: "الأسعار والدفع",
        p: [
          "يظهر السعر قبل الدفع ويُخصم مرة واحدة. لا يوجد اشتراك ما لم يُذكر ذلك صراحةً. تتم معالجة الدفع عبر Stripe أو PayPal، وتسري رسومهما وتحويل العملة وأي ضرائب محلية تظهر عند الدفع.",
        ],
      },
      {
        h: "التسليم",
        p: [
          "تتوفر المنتجات الرقمية فور تأكيد الدفع، وغالبًا خلال ثوانٍ. ستجدها في مكتبتك وفي رسالة الإيصال. وإن لم يصلك شيء فراسلني على {email}.",
        ],
      },
      {
        h: "الاسترداد",
        p: ["تُحدَّد أحكام الاسترداد في سياسة الاسترداد، وهي جزء من هذه الشروط."],
      },
      {
        h: "الملكية",
        p: [
          "كل ما في هذا الموقع، من شفرة ونصوص ودروس وتصاميم وقوالب، يخص {name} أو يُستخدم بإذن. ويمنحك الشراء حق الاستخدام كما هو موضح أعلاه، لا حق الملكية.",
        ],
      },
      {
        h: "الاستخدام المنصف للموقع",
        p: [
          "أرجو ألا تحاول تعطيل الموقع أو الدخول إلى حسابات الآخرين أو نسخ المحتوى المدفوع أو استخدامه في أي أمر غير قانوني. ويحق لي إغلاق الحسابات المخالفة.",
        ],
      },
      {
        h: "حدود المسؤولية",
        p: [
          "أعمل بعناية، لكن الدورات والقوالب تُقدَّم كما هي. ولا أستطيع أن أعد بنتيجة تجارية معينة لأنها تعتمد على عملك وسوقك. وبالقدر الذي يسمح به القانون، تقتصر مسؤوليتي عن أي مطالبة على المبلغ الذي دفعته مقابل المنتج المعني.",
        ],
      },
      {
        h: "القانون الواجب التطبيق",
        p: ["تخضع هذه الشروط لقوانين {country}. وحيثما يمنحك القانون حقوقًا للمستهلك لا يجوز التنازل عنها فإنها تظل سارية."],
      },
      {
        h: "التغييرات",
        p: ["قد أحدّث هذه الشروط. وتسري التغييرات على المشتريات التي تتم بعد التاريخ المذكور في أعلى هذه الصفحة."],
      },
    ],
  },
  refunds: {
    title: "سياسة الاسترداد",
    description: "متى وكيف يمكنك استرجاع أموالك.",
    intro: "أريدك أن تكون راضيًا عما تشتريه. وهكذا يعمل الاسترداد.",
    sections: [
      {
        h: "القوالب والدورات",
        p: [
          "يمكنك طلب استرداد كامل خلال {days} يومًا من الشراء إذا لم يكن المنتج كما توقعت أو لم يعمل كما هو موصوف. ولا حاجة إلى شرح طويل.",
        ],
      },
      {
        h: "كيف تطلب الاسترداد",
        p: [
          "راسلني على {email} من البريد الذي اشتريت به، مع رقم الطلب أو اسم المنتج. أرد عادةً خلال يومي عمل.",
        ],
      },
      {
        h: "متى لا يكون الاسترداد ممكنًا",
        p: [
          "بعد انقضاء {days} يومًا.",
          "إذا وُجد دليل واضح على أن المنتج شُورك أو أُعيد بيعه أو توزيعه.",
          "الخدمات التي سُلّمت أو التي قيد التنفيذ: تخضع لعرض السعر أو الاتفاق المكتوب الذي يحدد الدفعات المقدمة والعمل المنجز.",
        ],
      },
      {
        h: "كيف تستعيد أموالك",
        p: [
          "تُعاد الأموال إلى وسيلة الدفع الأصلية عبر Stripe أو PayPal، وتستغرق عادةً من 5 إلى 10 أيام عمل حسب مصرفك. وعند الاسترداد يُسحب الوصول إلى المنتج.",
        ],
      },
      {
        h: "الخصم بالخطأ",
        p: ["إذا خُصم منك المبلغ مرتين، أو تمّ الدفع دون أن تحصل على الوصول، فراسلني وسأصلح الأمر أو أردّ إليك المبلغ فورًا."],
      },
    ],
  },
};

export const legalDocs: Record<Locale, Record<LegalKey, LegalDoc>> = { en, fr, ar };
