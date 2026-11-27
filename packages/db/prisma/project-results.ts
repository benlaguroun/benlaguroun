import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

// Adds a short "Result" paragraph to your three headline projects (school, hotel, clinic),
// in English, French and Arabic, and marks them "Live". Run it once:
//   npm run db:results
//
// It only states what the platforms do and that they are in daily use. It contains no
// numbers, because I do not have your real ones. Add them yourself in Admin -> Projects,
// for example "serves 400 students" or "saves the secretary two hours a day", but only
// figures you can stand behind. Running this again changes nothing.

const results = [
  {
    slug: "school-platform",
    en: "Result: the platform is in daily use at the school. Attendance is recorded automatically from the card and face terminals, parents have their own accounts, and the owner and staff see the whole school in one place.",
    fr: "Résultat : la plateforme est utilisée au quotidien à l'école. La présence est enregistrée automatiquement depuis les bornes à carte et à reconnaissance faciale, les parents ont leur propre compte, et la direction et le personnel voient toute l'école au même endroit.",
    ar: "النتيجة: المنصّة قيد الاستخدام اليومي في المدرسة. يُسجَّل الحضور تلقائيًا من أجهزة البطاقة والتعرّف على الوجه، ولأولياء الأمور حساباتهم الخاصة، ويرى المالك والموظفون المدرسة كلها في مكان واحد.",
  },
  {
    slug: "elysian-hospitality",
    en: "Result: the platform is in daily use by a hospitality business. Each member of staff sees only the dashboards their role allows, attendance comes from the biometric terminal, and the whole interface works in English, French and Arabic.",
    fr: "Résultat : la plateforme est utilisée au quotidien par une entreprise d'hôtellerie. Chaque membre du personnel ne voit que les tableaux de bord autorisés par son rôle, la présence provient du terminal biométrique, et toute l'interface fonctionne en anglais, en français et en arabe.",
    ar: "النتيجة: المنصّة قيد الاستخدام اليومي لدى نشاط في قطاع الضيافة. يرى كل موظف لوحات التحكم التي يسمح بها دوره فقط، ويأتي الحضور من جهاز البصمة الحيوية، وتعمل الواجهة كلها بالإنجليزية والفرنسية والعربية.",
  },
  {
    slug: "midwife-care-platform",
    en: "Result: the platform is in daily use at a midwife practice. Tasks that touch personal data run only on a local model, and when that model is unavailable they stop instead of sending anything to the cloud.",
    fr: "Résultat : la plateforme est utilisée au quotidien dans un cabinet de sage-femme. Les tâches qui touchent des données personnelles s'exécutent uniquement sur un modèle local, et lorsqu'il est indisponible elles s'arrêtent au lieu d'envoyer quoi que ce soit dans le cloud.",
    ar: "النتيجة: المنصّة قيد الاستخدام اليومي في عيادة قابلة. تعمل المهام التي تمسّ البيانات الشخصية على نموذج محلي فقط، وعندما لا يكون متاحًا تتوقف بدل إرسال أي شيء إلى السحابة.",
  },
];

const statusWords = ["In development", "Built", "In pilot", "Live"];

async function main() {
  for (const r of results) {
    const project = await prisma.project.findUnique({ where: { slug: r.slug } });
    if (!project) {
      console.log(`- ${r.slug}: not found, skipped (run npm run db:seed first)`);
      continue;
    }

    const translations = ((project.translations ?? {}) as Record<string, Record<string, string>>);
    const add = (text: string, paragraph: string) => (text.includes(paragraph) ? text : `${text}\n\n${paragraph}`);

    const body = add(project.body, r.en);
    const fr = { ...(translations.fr ?? {}) };
    const ar = { ...(translations.ar ?? {}) };
    if (fr.body) fr.body = add(fr.body, r.fr);
    if (ar.body) ar.body = add(ar.body, r.ar);

    // The first tag is the status word shown on the card.
    const tags = [...project.tags];
    if (tags.length > 0 && statusWords.includes(tags[0])) tags[0] = "Live";
    else if (!tags.includes("Live")) tags.unshift("Live");

    const unchanged = body === project.body && tags.join("|") === project.tags.join("|") && add(translations.fr?.body ?? "", r.fr) === (translations.fr?.body ?? "");
    if (unchanged) {
      console.log(`- ${r.slug}: already has its result, left as it is`);
      continue;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await prisma.project.update({ where: { slug: r.slug }, data: { body, tags, translations: { ...translations, fr, ar } as any } });
    console.log(`+ ${r.slug}: result added, marked Live`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
