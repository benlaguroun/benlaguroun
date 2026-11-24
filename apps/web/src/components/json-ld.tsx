/** Adds structured data (schema.org) that search engines read. */
export function JsonLd({ data }: { data: object | object[] }) {
  // "<" is escaped so nothing in the data can close the script tag early.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
