import type { Locale } from "./config";

// The text of the legal pages. It lives here, apart from the page dictionaries,
// because it is long. These placeholders are filled in from config/site.ts
// (the `company` and `legal` blocks) when a page is shown:
//   {brand} the brand name          {seller} who you buy from (the company, or you)
//   {email} contact email           {jurisdiction} where the company is registered
//   {governing} governing law       {days} refund window in days
//   {sellerLine} the full "who you are buying from" sentence
//
// This is a sensible starting point written for how this site really works
// (accounts, card and PayPal payments, a contact form, a newsletter). It is not
// legal advice: have a lawyer read it before you rely on it.

export type LegalKey = "privacy" | "terms" | "refunds";
export type LegalDoc = { title: string; description: string; intro: string; sections: { h: string; p: string[] }[] };

/** "Who you are buying from", with and without a company. {entityType} comes from config. */
export const identity: Record<Locale, { company: string; person: string }> = {
  en: {
    company: "{seller}, a {entityType} registered in {jurisdiction}, which operates the {brand} brand.",
    person: "{seller}, an independent engineer based in {jurisdiction}.",
  },
  fr: {
    company: "{seller}, société de type {entityType} immatriculée en {jurisdiction}, qui exploite la marque {brand}.",
    person: "{seller}, ingénieur indépendant basé en {jurisdiction}.",
  },
  ar: {
    company: "{seller}، شركة من نوع {entityType} مسجّلة في {jurisdiction}، وتدير العلامة {brand}.",
    person: "{seller}، مهندس مستقل مقيم في {jurisdiction}.",
  },
};

/** Labels for the company details box at the bottom of each legal page. */
export const companyLabels: Record<
  Locale,
  { heading: string; legalName: string; type: string; registeredIn: string; number: string; vat: string; address: string; contact: string }
> = {
  en: {
    heading: "Company details",
    legalName: "Legal name",
    type: "Company type",
    registeredIn: "Registered in",
    number: "Registration number",
    vat: "Tax / VAT number",
    address: "Registered address",
    contact: "Contact",
  },
  fr: {
    heading: "Informations sur la société",
    legalName: "Dénomination sociale",
    type: "Forme juridique",
    registeredIn: "Immatriculée en",
    number: "Numéro d'immatriculation",
    vat: "Numéro fiscal / TVA",
    address: "Adresse du siège",
    contact: "Contact",
  },
  ar: {
    heading: "بيانات الشركة",
    legalName: "الاسم القانوني",
    type: "نوع الشركة",
    registeredIn: "مكان التسجيل",
    number: "رقم التسجيل",
    vat: "الرقم الضريبي",
    address: "العنوان المسجّل",
    contact: "التواصل",
  },
};

const en: Record<LegalKey, LegalDoc> = {
  privacy: {
    title: "Privacy policy",
    description: "What personal data this site collects, why, and the choices you have.",
    intro:
      "This page explains what personal information {seller} collects through this website, why it is needed, and what you can do about it. It is written in plain language on purpose.",
    sections: [
      {
        h: "Who is responsible",
        p: ["{sellerLine} We run this website and are responsible for your personal data. You can reach us at {email}."],
      },
      {
        h: "What we collect",
        p: [
          "Account: your name, your email address and your password, which is stored in scrambled (hashed) form and can't be read by anyone, including us.",
          "Purchases: which product you bought, the amount and currency, the date, and which payment method you used. We never see or store your card number. It is entered on the secure page of the payment provider.",
          "Messages: what you write in the contact form, including your name, email, the service you are interested in and your budget range if you choose to give it.",
          "Newsletter: your email address and the language of the page you signed up from, only if you subscribe.",
          "Technical data: when you sign in, your IP address and browser type are stored with your session so we can keep your account secure.",
          "Visit statistics: for each page opened we record the page, your language, the website you came from, your country and whether you use a phone, tablet or computer. We do not store your IP address and we set no cookie for this. A code that changes every day lets us count visitors without being able to recognise anyone from one day to the next. If your browser sends a \"Do Not Track\" signal, nothing is recorded.",
        ],
      },
      {
        h: "Why we use it",
        p: [
          "To create and run your account, deliver what you bought, and send your receipt.",
          "To answer your messages and, if we work together, to manage the project and invoices.",
          "To send you the newsletter, only if you asked for it. Every email has an unsubscribe link.",
          "To keep the site secure, to prevent fraud and abuse, and to meet accounting, tax and legal duties.",
        ],
      },
      {
        h: "Who we share it with",
        p: [
          "We don't sell your data and we don't share it for advertising. We only use trusted providers that are needed to run the site:",
          "Payment providers (Stripe and PayPal) process your payment on their own pages. They have their own privacy policies.",
          "An email delivery provider (Brevo) sends receipts and newsletters on our behalf.",
          "AI services (Anthropic, OpenAI and Groq) read the messages you send through the contact form to help us prepare a reply. A person reviews and approves every reply before it is sent, and these services are not used to advertise to you.",
          "Hosting and database services that store the site's data.",
          "We may also disclose information when the law requires it.",
        ],
      },
      {
        h: "International transfers",
        p: [
          "We sell to people in many countries, and our providers may process data in countries other than yours. When personal data is moved across borders, we rely on providers that protect it with recognised safeguards, such as standard contractual clauses.",
        ],
      },
      {
        h: "Cookies",
        p: [
          "This site uses only the cookies needed to keep you signed in and to remember your language. It does not use advertising or tracking cookies, and the visit statistics described above work without any cookie.",
        ],
      },
      {
        h: "How long we keep it",
        p: [
          "Account data is kept while your account exists. Purchase records are kept as long as accounting, tax and legal rules require. Messages are kept as long as they are useful for our conversation or project. Newsletter addresses are kept until you unsubscribe. You can ask us to delete your data at any time.",
        ],
      },
      {
        h: "Your rights",
        p: [
          "You can ask to see the data we hold about you, correct it, delete it, ask for a copy, or object to how it is used. Write to {email} and we will answer within a reasonable time, and within one month where the GDPR applies.",
          "These rights come from the data protection law that applies to you, such as the GDPR for visitors in the European Union and the UK GDPR for visitors in the United Kingdom. If you are not happy with our answer, you can complain to your local data protection authority.",
        ],
      },
      {
        h: "Security",
        p: [
          "Data is sent over encrypted connections and passwords are hashed. No website can promise perfect security, but we take reasonable care and will tell you if something affecting you goes wrong.",
        ],
      },
      {
        h: "Children",
        p: ["This site is meant for adults and young people over 16. It is not designed for younger children."],
      },
      {
        h: "Changes",
        p: ["If we change this policy, the new version appears on this page with a new date at the top."],
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
        p: ["{sellerLine} Contact: {email}."],
      },
      {
        h: "Your account",
        p: [
          "You need an account to buy templates and courses, and you need to confirm your email address before you pay. Give accurate details, keep your password private and don't share your account. You are responsible for what happens under it.",
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
        h: "Taxes",
        p: [
          "Prices are shown before any sales tax, VAT or similar tax that applies where you live, unless the checkout page says otherwise. Where we are required to collect a tax, it is added at checkout and shown on your receipt. You are responsible for any import duties or taxes that apply to you and are not collected by us.",
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
          "Everything on this site, including the code, text, lessons, designs and templates, belongs to {seller} or is used with permission. Buying gives you the right to use it as described above, not to own it.",
        ],
      },
      {
        h: "Fair use of the site",
        p: [
          "Please don't try to break the site, access other people's accounts, copy paid content or use it for anything unlawful. We may close accounts that do.",
        ],
      },
      {
        h: "Limits of responsibility",
        p: [
          "We work carefully, but the courses and templates are provided as they are. We can't promise a particular business result, because that depends on your own work and market. To the extent the law allows, our responsibility for any claim is limited to the amount you paid for the product concerned.",
        ],
      },
      {
        h: "Governing law",
        p: ["These terms are governed by the laws of {governing}. Where the law gives you consumer rights that can't be waived, those rights still apply."],
      },
      {
        h: "Changes",
        p: ["We may update these terms. Changes apply to purchases made after the date at the top of this page."],
      },
    ],
  },
  refunds: {
    title: "Refund policy",
    description: "When and how you can get your money back.",
    intro: "We want you to be happy with what you buy. This is how refunds work.",
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
          "Email {email} from the address you used to buy, with your order number or the product name. We usually reply within two working days.",
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
        p: ["If you were charged twice or the payment went through but you got no access, write to us and we'll fix it or refund you straight away."],
      },
    ],
  },
};

const fr: Record<LegalKey, LegalDoc> = {
  privacy: {
    title: "Politique de confidentialité",
    description: "Les données personnelles collectées par ce site, pourquoi, et vos choix.",
    intro:
      "Cette page explique quelles informations personnelles {seller} collecte via ce site, pourquoi elles sont nécessaires et ce que vous pouvez faire à ce sujet. Elle est rédigée en langage simple volontairement.",
    sections: [
      {
        h: "Qui est responsable",
        p: ["{sellerLine} Nous exploitons ce site et sommes responsables de vos données personnelles. Vous pouvez nous joindre à {email}."],
      },
      {
        h: "Ce que nous collectons",
        p: [
          "Compte : votre nom, votre adresse e-mail et votre mot de passe, conservé sous forme brouillée (hachée) que personne ne peut lire, nous y compris.",
          "Achats : le produit acheté, le montant et la devise, la date et le moyen de paiement utilisé. Nous ne voyons ni ne conservons jamais votre numéro de carte : il est saisi sur la page sécurisée du prestataire de paiement.",
          "Messages : ce que vous écrivez dans le formulaire de contact, y compris votre nom, votre e-mail, le service qui vous intéresse et votre budget si vous choisissez de l'indiquer.",
          "Newsletter : votre adresse e-mail et la langue de la page depuis laquelle vous vous êtes inscrit, uniquement si vous vous abonnez.",
          "Données techniques : lorsque vous vous connectez, votre adresse IP et le type de navigateur sont enregistrés avec votre session afin de sécuriser votre compte.",
          "Statistiques de visite : pour chaque page ouverte, nous enregistrons la page, votre langue, le site d'où vous venez, votre pays et le type d'appareil (téléphone, tablette ou ordinateur). Nous ne conservons pas votre adresse IP et ne déposons aucun cookie pour cela. Un code qui change chaque jour nous permet de compter les visiteurs sans pouvoir reconnaître quelqu'un d'un jour à l'autre. Si votre navigateur envoie un signal « Do Not Track », rien n'est enregistré.",
        ],
      },
      {
        h: "Pourquoi nous les utilisons",
        p: [
          "Pour créer et gérer votre compte, livrer ce que vous avez acheté et vous envoyer votre reçu.",
          "Pour répondre à vos messages et, si nous travaillons ensemble, gérer le projet et les factures.",
          "Pour vous envoyer la newsletter, uniquement si vous l'avez demandée. Chaque e-mail contient un lien de désinscription.",
          "Pour sécuriser le site, prévenir la fraude et les abus, et respecter nos obligations comptables, fiscales et légales.",
        ],
      },
      {
        h: "Avec qui nous les partageons",
        p: [
          "Nous ne vendons pas vos données et ne les partageons pas à des fins publicitaires. Nous faisons seulement appel à des prestataires de confiance, nécessaires au fonctionnement du site :",
          "Les prestataires de paiement (Stripe et PayPal) traitent votre paiement sur leurs propres pages. Ils ont leur propre politique de confidentialité.",
          "Un prestataire d'envoi d'e-mails (Brevo) envoie les reçus et les newsletters en notre nom.",
          "Des services d'IA (Anthropic, OpenAI et Groq) lisent les messages envoyés via le formulaire de contact pour nous aider à préparer une réponse. Une personne relit et approuve chaque réponse avant son envoi, et ces services ne sont pas utilisés pour vous faire de la publicité.",
          "Des services d'hébergement et de base de données qui stockent les données du site.",
          "Nous pouvons aussi communiquer des informations lorsque la loi l'exige.",
        ],
      },
      {
        h: "Transferts internationaux",
        p: [
          "Nous vendons à des personnes dans de nombreux pays, et nos prestataires peuvent traiter des données dans d'autres pays que le vôtre. Lorsque des données personnelles circulent d'un pays à l'autre, nous faisons appel à des prestataires qui les protègent par des garanties reconnues, comme les clauses contractuelles types.",
        ],
      },
      {
        h: "Cookies",
        p: [
          "Ce site utilise uniquement les cookies nécessaires pour vous garder connecté et mémoriser votre langue. Il n'utilise ni cookies publicitaires ni cookies de suivi, et les statistiques de visite décrites plus haut fonctionnent sans aucun cookie.",
        ],
      },
      {
        h: "Durée de conservation",
        p: [
          "Les données du compte sont conservées tant que votre compte existe. Les justificatifs d'achat sont conservés aussi longtemps que l'exigent les règles comptables, fiscales et légales. Les messages sont conservés tant qu'ils sont utiles à notre échange ou au projet. Les adresses de la newsletter sont conservées jusqu'à votre désinscription. Vous pouvez nous demander de supprimer vos données à tout moment.",
        ],
      },
      {
        h: "Vos droits",
        p: [
          "Vous pouvez demander à consulter les données que nous détenons sur vous, les corriger, les supprimer, en obtenir une copie ou vous opposer à leur utilisation. Écrivez à {email} et nous répondrons dans un délai raisonnable, et sous un mois lorsque le RGPD s'applique.",
          "Ces droits découlent de la loi de protection des données qui s'applique à vous, comme le RGPD pour les visiteurs de l'Union européenne et le UK GDPR pour ceux du Royaume-Uni. Si notre réponse ne vous satisfait pas, vous pouvez saisir l'autorité de protection des données de votre pays.",
        ],
      },
      {
        h: "Sécurité",
        p: [
          "Les données transitent par des connexions chiffrées et les mots de passe sont hachés. Aucun site ne peut promettre une sécurité parfaite, mais nous y apportons un soin raisonnable et nous vous préviendrons en cas de problème vous concernant.",
        ],
      },
      {
        h: "Enfants",
        p: ["Ce site s'adresse aux adultes et aux jeunes de plus de 16 ans. Il n'est pas conçu pour les enfants plus jeunes."],
      },
      {
        h: "Modifications",
        p: ["Si nous modifions cette politique, la nouvelle version apparaît sur cette page avec une nouvelle date en haut."],
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
        h: "À qui vous achetez",
        p: ["{sellerLine} Contact : {email}."],
      },
      {
        h: "Votre compte",
        p: [
          "Vous avez besoin d'un compte pour acheter des modèles et des formations, et vous devez confirmer votre adresse e-mail avant de payer. Donnez des informations exactes, gardez votre mot de passe secret et ne partagez pas votre compte. Vous êtes responsable de ce qui s'y passe.",
        ],
      },
      {
        h: "Ce que vous pouvez acheter",
        p: [
          "Les modèles sont des fichiers numériques. Après paiement, vous pouvez les télécharger et les utiliser dans autant de vos projets et de ceux de vos clients que vous le souhaitez. Vous ne pouvez pas revendre, partager ou publier le modèle lui-même, ni donner votre lien de téléchargement à d'autres.",
          "Les formations vous donnent un accès personnel et à vie aux leçons tant que la formation est proposée sur ce site. L'accès est strictement personnel et ne peut être partagé ni enregistré pour être diffusé.",
          "Les services (sites web, plateformes, automatisation) sont convenus au cas par cas. Le périmètre, le prix, le calendrier et l'échéancier de paiement figurent dans un devis ou un accord écrit, qui prévaut sur ces conditions en cas de différence.",
        ],
      },
      {
        h: "Prix et paiement",
        p: [
          "Le prix est affiché avant le paiement et n'est débité qu'une fois. Il n'y a pas d'abonnement sauf mention contraire. Le paiement est géré par Stripe ou PayPal. Leurs frais, la conversion de devise et les taxes locales affichées au paiement s'appliquent.",
        ],
      },
      {
        h: "Taxes",
        p: [
          "Les prix sont affichés avant toute taxe de vente, TVA ou taxe similaire applicable là où vous vivez, sauf indication contraire sur la page de paiement. Lorsque nous devons percevoir une taxe, elle est ajoutée au paiement et figure sur votre reçu. Vous êtes responsable des droits de douane ou taxes qui s'appliquent à vous et que nous ne percevons pas.",
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
        p: ["Les remboursements sont couverts par la politique de remboursement, qui fait partie de ces conditions."],
      },
      {
        h: "Propriété",
        p: [
          "Tout ce qui figure sur ce site, y compris le code, les textes, les leçons, les designs et les modèles, appartient à {seller} ou est utilisé avec autorisation. Votre achat vous donne le droit de l'utiliser comme décrit ci-dessus, pas d'en devenir propriétaire.",
        ],
      },
      {
        h: "Utilisation correcte du site",
        p: [
          "Merci de ne pas chercher à perturber le site, accéder aux comptes d'autrui, copier du contenu payant ou l'utiliser à des fins illégales. Nous pouvons fermer les comptes qui le font.",
        ],
      },
      {
        h: "Limites de responsabilité",
        p: [
          "Nous travaillons avec soin, mais les formations et les modèles sont fournis tels quels. Nous ne pouvons pas promettre un résultat commercial précis, car il dépend de votre propre travail et de votre marché. Dans la mesure permise par la loi, notre responsabilité pour toute réclamation est limitée au montant que vous avez payé pour le produit concerné.",
        ],
      },
      {
        h: "Droit applicable",
        p: ["Ces conditions sont régies par le droit de {governing}. Lorsque la loi vous accorde des droits de consommateur auxquels il est impossible de renoncer, ces droits continuent de s'appliquer."],
      },
      {
        h: "Modifications",
        p: ["Nous pouvons mettre à jour ces conditions. Les changements s'appliquent aux achats effectués après la date indiquée en haut de cette page."],
      },
    ],
  },
  refunds: {
    title: "Politique de remboursement",
    description: "Quand et comment récupérer votre argent.",
    intro: "Nous voulons que vous soyez satisfait de ce que vous achetez. Voici comment fonctionnent les remboursements.",
    sections: [
      {
        h: "Modèles et formations",
        p: [
          "Vous pouvez demander un remboursement intégral dans les {days} jours suivant l'achat si le produit ne correspond pas à vos attentes ou ne fonctionne pas comme décrit. Pas besoin de longue explication.",
        ],
      },
      {
        h: "Comment le demander",
        p: [
          "Écrivez à {email} depuis l'adresse utilisée pour l'achat, avec votre numéro de commande ou le nom du produit. Nous répondons généralement sous deux jours ouvrés.",
        ],
      },
      {
        h: "Quand un remboursement n'est pas possible",
        p: [
          "Après {days} jours.",
          "S'il existe des preuves claires que le produit a été partagé, revendu ou redistribué.",
          "Les services déjà livrés ou en cours : ils suivent le devis ou l'accord écrit, qui précise les acomptes et le travail réalisé.",
        ],
      },
      {
        h: "Comment vous récupérez l'argent",
        p: [
          "Les remboursements sont effectués sur le moyen de paiement d'origine via Stripe ou PayPal. Il faut généralement 5 à 10 jours ouvrés pour qu'ils apparaissent, selon votre banque. Lorsqu'un remboursement est effectué, l'accès au produit est retiré.",
        ],
      },
      {
        h: "Débité par erreur",
        p: ["Si vous avez été débité deux fois ou si le paiement est passé sans que vous ayez accès au produit, écrivez-nous et nous corrigerons le problème ou vous rembourserons immédiatement."],
      },
    ],
  },
};

const ar: Record<LegalKey, LegalDoc> = {
  privacy: {
    title: "سياسة الخصوصية",
    description: "البيانات الشخصية التي يجمعها هذا الموقع، ولماذا، وما الخيارات المتاحة لك.",
    intro:
      "توضّح هذه الصفحة المعلومات الشخصية التي تجمعها {seller} عبر هذا الموقع، ولماذا نحتاج إليها، وما الذي يمكنك فعله حيالها. كُتبت بلغة بسيطة عن قصد.",
    sections: [
      {
        h: "الجهة المسؤولة",
        p: ["{sellerLine} نحن نُدير هذا الموقع ونتحمل مسؤولية بياناتك الشخصية. يمكنك التواصل معنا عبر {email}."],
      },
      {
        h: "ما الذي نجمعه",
        p: [
          "الحساب: اسمك وبريدك الإلكتروني وكلمة مرورك، وتُحفظ كلمة المرور بصيغة مشفّرة (مُجزّأة) لا يستطيع أحد قراءتها، بمن فيهم نحن.",
          "المشتريات: المنتج الذي اشتريته والمبلغ والعملة والتاريخ ووسيلة الدفع. لا نرى رقم بطاقتك ولا نخزّنه أبدًا، فهو يُدخل في صفحة الدفع الآمنة الخاصة بمزوّد الدفع.",
          "الرسائل: ما تكتبه في نموذج التواصل، ويشمل اسمك وبريدك والخدمة التي تهمّك ونطاق ميزانيتك إن اخترت ذكره.",
          "النشرة البريدية: بريدك الإلكتروني ولغة الصفحة التي اشتركت منها، وذلك فقط إذا اشتركت.",
          "بيانات تقنية: عند تسجيل الدخول يُحفظ عنوان IP ونوع المتصفح مع جلستك لنحافظ على أمان حسابك.",
          "إحصاءات الزيارة: عن كل صفحة تُفتح نسجّل الصفحة ولغتك والموقع الذي جئت منه وبلدك ونوع جهازك (هاتف أو لوحي أو حاسوب). لا نخزّن عنوان IP الخاص بك ولا نضع أي ملف تعريف ارتباط لذلك. ويتيح لنا رمز يتغير كل يوم عدّ الزوار دون القدرة على التعرف على أي شخص من يوم لآخر. وإذا أرسل متصفحك إشارة «عدم التتبع» فلا يُسجَّل شيء.",
        ],
      },
      {
        h: "لماذا نستخدمها",
        p: [
          "لإنشاء حسابك وإدارته وتسليم ما اشتريته وإرسال إيصالك.",
          "للرد على رسائلك، وإذا عملنا معًا فلإدارة المشروع والفواتير.",
          "لإرسال النشرة البريدية إليك، فقط إذا طلبتها. وفي كل رسالة رابط لإلغاء الاشتراك.",
          "للحفاظ على أمان الموقع ومنع الاحتيال وإساءة الاستخدام، والوفاء بالتزاماتنا المحاسبية والضريبية والقانونية.",
        ],
      },
      {
        h: "مع من نشاركها",
        p: [
          "لا نبيع بياناتك ولا نشاركها لأغراض إعلانية. نستخدم فقط مزوّدين موثوقين يلزم وجودهم لتشغيل الموقع:",
          "مزوّدو الدفع (Stripe وPayPal) يعالجون دفعتك في صفحاتهم الخاصة، ولكلٍّ منهم سياسة خصوصية خاصة به.",
          "مزوّد إرسال البريد الإلكتروني (Brevo) يرسل الإيصالات والنشرات نيابةً عنا.",
          "خدمات ذكاء اصطناعي (Anthropic وOpenAI وGroq) تقرأ الرسائل التي ترسلها عبر نموذج التواصل لتساعدنا في إعداد الرد. يراجع شخص كل ردّ ويوافق عليه قبل إرساله، ولا تُستخدم هذه الخدمات للإعلان لك.",
          "خدمات الاستضافة وقواعد البيانات التي تخزّن بيانات الموقع.",
          "وقد نكشف عن معلومات عندما يوجب القانون ذلك.",
        ],
      },
      {
        h: "النقل الدولي للبيانات",
        p: [
          "نبيع لأشخاص في بلدان كثيرة، وقد يعالج مزوّدونا البيانات في بلدان غير بلدك. وعند نقل البيانات الشخصية عبر الحدود نعتمد على مزوّدين يحمونها بضمانات معترف بها، مثل البنود التعاقدية النموذجية.",
        ],
      },
      {
        h: "ملفات تعريف الارتباط",
        p: [
          "يستخدم هذا الموقع فقط ملفات تعريف الارتباط اللازمة لإبقائك مسجّلًا الدخول وتذكّر لغتك. ولا يستخدم ملفات إعلانية أو تتبّعية، وتعمل إحصاءات الزيارة الموصوفة أعلاه دون أي ملف تعريف ارتباط.",
        ],
      },
      {
        h: "مدة الاحتفاظ بها",
        p: [
          "نحتفظ ببيانات الحساب ما دام حسابك قائمًا. ونحتفظ بسجلات الشراء طالما تطلبت القواعد المحاسبية والضريبية والقانونية ذلك. ونحتفظ بالرسائل ما دامت مفيدة لحوارنا أو لمشروعنا. وتبقى عناوين النشرة حتى تلغي اشتراكك. ويمكنك أن تطلب منا حذف بياناتك في أي وقت.",
        ],
      },
      {
        h: "حقوقك",
        p: [
          "يمكنك أن تطلب الاطلاع على البيانات التي نحتفظ بها عنك أو تصحيحها أو حذفها أو الحصول على نسخة منها أو الاعتراض على استخدامها. راسلنا على {email} وسنردّ خلال مدة معقولة، وخلال شهر واحد حيث تنطبق اللائحة العامة لحماية البيانات (GDPR).",
          "تنبع هذه الحقوق من قانون حماية البيانات المنطبق عليك، مثل اللائحة العامة لحماية البيانات للزوار في الاتحاد الأوروبي وUK GDPR للزوار في المملكة المتحدة. وإذا لم يُرضِك ردّنا فيمكنك تقديم شكوى إلى هيئة حماية البيانات في بلدك.",
        ],
      },
      {
        h: "الأمان",
        p: [
          "تُرسل البيانات عبر اتصالات مشفّرة وتُجزَّأ كلمات المرور. لا يستطيع أي موقع أن يعد بأمان مثالي، لكننا نبذل العناية المعقولة وسنخبرك إذا حدث ما يمسّك.",
        ],
      },
      {
        h: "الأطفال",
        p: ["هذا الموقع موجّه للبالغين والشباب فوق 16 عامًا، وليس مصمَّمًا للأطفال الأصغر سنًا."],
      },
      {
        h: "التغييرات",
        p: ["إذا غيّرنا هذه السياسة، فستظهر النسخة الجديدة في هذه الصفحة مع تاريخ جديد في أعلاها."],
      },
    ],
  },
  terms: {
    title: "شروط البيع",
    description: "قواعد شراء واستخدام الخدمات والقوالب والدورات من هذا الموقع.",
    intro:
      "تسري هذه الشروط عند إنشاء حساب أو شراء أي شيء من هذا الموقع. وبالشراء فإنك توافق عليها. وإذا كان أمر ما غير واضح فراسلنا على {email} قبل الدفع.",
    sections: [
      {
        h: "ممّن تشتري",
        p: ["{sellerLine} للتواصل: {email}."],
      },
      {
        h: "حسابك",
        p: [
          "تحتاج إلى حساب لشراء القوالب والدورات، وعليك تأكيد بريدك الإلكتروني قبل الدفع. قدّم بيانات صحيحة، وحافظ على سرية كلمة مرورك، ولا تشارك حسابك. أنت مسؤول عمّا يحدث من خلاله.",
        ],
      },
      {
        h: "ما يمكنك شراؤه",
        p: [
          "القوالب ملفات رقمية. بعد الدفع يمكنك تنزيلها واستخدامها في أي عدد تشاء من مشاريعك ومشاريع عملائك. ولا يجوز لك إعادة بيع القالب نفسه أو مشاركته أو نشره، ولا إعطاء رابط التنزيل لغيرك.",
          "تمنحك الدورات وصولًا شخصيًا مدى الحياة إلى الدروس ما دامت الدورة معروضة على هذا الموقع. والوصول لك وحدك ولا يجوز مشاركته أو تسجيله لإعادة توزيعه.",
          "الخدمات (المواقع والمنصات والأتمتة) يُتفق عليها حالة بحالة. ويُحدَّد النطاق والسعر والمدة وجدول الدفع في عرض سعر أو اتفاق مكتوب، وله الأولوية على هذه الشروط عند الاختلاف.",
        ],
      },
      {
        h: "الأسعار والدفع",
        p: [
          "يظهر السعر قبل الدفع ويُخصم مرة واحدة. لا يوجد اشتراك ما لم يُذكر ذلك صراحةً. تتولى Stripe أو PayPal معالجة الدفع، وتنطبق رسومهما وتحويل العملة وأي ضرائب محلية تظهر عند الدفع.",
        ],
      },
      {
        h: "الضرائب",
        p: [
          "تظهر الأسعار قبل أي ضريبة مبيعات أو قيمة مضافة أو ضريبة مشابهة تنطبق في بلد إقامتك، ما لم تذكر صفحة الدفع غير ذلك. وحيث يُلزمنا القانون بتحصيل ضريبة فإنها تُضاف عند الدفع وتظهر في إيصالك. وأنت مسؤول عن أي رسوم جمركية أو ضرائب تنطبق عليك ولا نحصّلها نحن.",
        ],
      },
      {
        h: "التسليم",
        p: [
          "تتوفر المنتجات الرقمية فور تأكيد الدفع، وغالبًا خلال ثوانٍ. ستجدها في مكتبتك وفي بريد الإيصال. وإذا لم يصلك شيء فراسلنا على {email}.",
        ],
      },
      {
        h: "الاسترداد",
        p: ["يغطي الاسترداد سياسة الاسترداد، وهي جزء من هذه الشروط."],
      },
      {
        h: "الملكية",
        p: [
          "كل ما في هذا الموقع، بما في ذلك الشيفرة والنصوص والدروس والتصاميم والقوالب، ملك لـ {seller} أو مستخدم بإذن. والشراء يمنحك حق الاستخدام كما هو موضح أعلاه، لا حق الملكية.",
        ],
      },
      {
        h: "الاستخدام العادل للموقع",
        p: [
          "نرجو ألا تحاول تعطيل الموقع أو الدخول إلى حسابات الآخرين أو نسخ المحتوى المدفوع أو استخدامه في أي أمر غير قانوني. وقد نغلق الحسابات التي تفعل ذلك.",
        ],
      },
      {
        h: "حدود المسؤولية",
        p: [
          "نعمل بعناية، لكن الدورات والقوالب تُقدَّم كما هي. ولا نستطيع وعدك بنتيجة تجارية محددة لأنها تعتمد على عملك وسوقك. وبالقدر الذي يسمح به القانون تقتصر مسؤوليتنا عن أي مطالبة على المبلغ الذي دفعته مقابل المنتج المعني.",
        ],
      },
      {
        h: "القانون الواجب التطبيق",
        p: ["تخضع هذه الشروط لقوانين {governing}. وحيث يمنحك القانون حقوق مستهلك لا يمكن التنازل عنها فتبقى هذه الحقوق سارية."],
      },
      {
        h: "التغييرات",
        p: ["قد نحدّث هذه الشروط. وتسري التغييرات على المشتريات التي تتم بعد التاريخ المذكور في أعلى هذه الصفحة."],
      },
    ],
  },
  refunds: {
    title: "سياسة الاسترداد",
    description: "متى وكيف يمكنك استرجاع أموالك.",
    intro: "نريدك أن تكون راضيًا عمّا تشتريه. وهكذا يعمل الاسترداد.",
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
          "راسلنا على {email} من البريد الذي اشتريت به، مع رقم الطلب أو اسم المنتج. نردّ عادةً خلال يومي عمل.",
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
        p: ["إذا خُصم منك المبلغ مرتين، أو تمّ الدفع دون أن تحصل على الوصول، فراسلنا وسنصلح الأمر أو نردّ إليك المبلغ فورًا."],
      },
    ],
  },
};

export const legalDocs: Record<Locale, Record<LegalKey, LegalDoc>> = { en, fr, ar };
