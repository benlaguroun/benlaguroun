import { site } from "@/config/site";

const c = site.company;

/** True once a legal company name is set in config/site.ts. */
export const hasCompany = !!c.legalName.trim();

/** Who the customer is buying from: the company if there is one, otherwise the brand. */
export const sellerName = hasCompany ? c.legalName.trim() : site.name;

/** Where the business is based, for the legal pages. */
export const jurisdiction = c.jurisdiction.trim() || site.legal.country;
export const governingLaw = c.governingLaw.trim() || jurisdiction;

/** One line for the bottom of emails: name, registration and address (marketing emails often need a postal address). */
export function companyFooter() {
  return [sellerName, hasCompany ? c.registrationNumber.trim() : "", c.address.trim()].filter(Boolean).join(" · ");
}
