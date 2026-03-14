/**
 * Bilingual support (FR / EN).
 * Phase 1: manual English JSON files — no TinaCMS editing for EN yet.
 */

export type Locale = "fr" | "en";

/** Static UI strings that are hardcoded in React components or vanilla JS. */
export interface UIStrings {
  // Navbar
  navAriaLabel: string;
  menuAriaLabel: string;

  // Footer
  presidentLabel: string;
  directorLabel: string;
  accreditationsLabel: string;
  copyrightSuffix: string;

  // Projects — status labels
  statusCompleted: string;
  statusInProgress: string;
  statusPlanned: string;

  // Donate — banking labels
  bankLabel: string;
  accountLabel: string;
  accountPrivateLabel: string;
  accountCSRLabel: string;
  holderLabel: string;

  // Donate — CSR
  csrCodeLabel: string;
  csrContactLabel: string;

  // Parrain form — WhatsApp/email message templates
  formGreeting: string;
  formIntro: string;
  formNameLabel: string;
  formEmailLabel: string;
  formPhoneLabel: string;
  formFormulaLabel: string;
  formMessageLabel: string;
  formClosing: string;
  formSubjectPrefix: string;
  formPhoneNotProvided: string;
  formMessageEmpty: string;

  // Donate — tablist and form sr-only labels
  tablistLabel: string;
  srLabelFullName: string;
  srLabelPhone: string;
  srLabelEmail: string;
  srLabelFormula: string;
  srLabelMessage: string;

  // Donate page — wizard steps
  donateStepAmount: string;
  donateStepDetails: string;
  donateStepPayment: string;
  donateContinue: string;
  donateBack: string;
  donateCompleted: string;
  donateMcbJuice: string;
  donateBankTransfer: string;
  donateYourDonation: string;
  donateReference: string;
  donateShareWhatsapp: string;
  donateCopyRef: string;
  donateConfirmation: string;
  donateCopied: string;
  donateMinAmount: string;
  donateRequiredFields: string;
  donateNicRequired: string;

  // Programs
  learnMore: string;

  // News categories
  catFormation: string;
  catCulture: string;
  catVieScolaire: string;
  catEnvironnement: string;
  readMore: string;

  // Project categories
  catEcoResponsable: string;
  catInfrastructure: string;
  catCommunautaire: string;

  // Language switcher
  langSwitchLabel: string;
  langSwitchHref: string;
}

export const uiStrings: Record<Locale, UIStrings> = {
  fr: {
    navAriaLabel: "Navigation principale",
    menuAriaLabel: "Ouvrir le menu",

    presidentLabel: "Présidente",
    directorLabel: "Directrice",
    accreditationsLabel: "Accréditations Officielles",
    copyrightSuffix: "Tous droits réservés.",

    statusCompleted: "Terminé",
    statusInProgress: "En cours",
    statusPlanned: "Planifié",

    bankLabel: "Banque",
    accountLabel: "N° de compte",
    accountPrivateLabel: "Particulier",
    accountCSRLabel: "Entreprise (CSR)",
    holderLabel: "Titulaire",

    csrCodeLabel: "Code CSR",
    csrContactLabel: "Contactez",

    formGreeting: "Bonjour,",
    formIntro: "Je souhaite devenir parrain.",
    formNameLabel: "Nom",
    formEmailLabel: "Email",
    formPhoneLabel: "Téléphone",
    formFormulaLabel: "Formule",
    formMessageLabel: "Message",
    formClosing: "Cordialement",
    formSubjectPrefix: "Demande de Parrainage",
    formPhoneNotProvided: "Non renseigné",
    formMessageEmpty: "(aucun)",

    tablistLabel: "Type de contribution",
    srLabelFullName: "Nom complet",
    srLabelPhone: "Téléphone",
    srLabelEmail: "Email",
    srLabelFormula: "Formule de parrainage",
    srLabelMessage: "Message",

    donateStepAmount: "Montant",
    donateStepDetails: "Coordonnées",
    donateStepPayment: "Paiement",
    donateContinue: "Continuer",
    donateBack: "Retour",
    donateCompleted: "J'ai effectué mon paiement",
    donateMcbJuice: "MCB Juice",
    donateBankTransfer: "Virement bancaire",
    donateYourDonation: "Vous faites un don de",
    donateReference: "Référence",
    donateShareWhatsapp: "Partager via WhatsApp",
    donateCopyRef: "Copier la référence",
    donateConfirmation: "Confirmation sous 24-48h",
    donateCopied: "Copié !",
    donateMinAmount: "Veuillez choisir un montant (minimum Rs 50)",
    donateRequiredFields: "Veuillez remplir votre nom et email",
    donateNicRequired: "Veuillez indiquer votre NIC ou passeport pour le reçu fiscal",

    learnMore: "En savoir plus",

    catFormation: "Formation",
    catCulture: "Culture",
    catVieScolaire: "Vie Scolaire",
    catEnvironnement: "Environnement",
    readMore: "Lire la suite",

    catEcoResponsable: "Éco-responsable",
    catInfrastructure: "Infrastructure",
    catCommunautaire: "Communautaire",

    langSwitchLabel: "EN",
    langSwitchHref: "/en/",
  },
  en: {
    navAriaLabel: "Main navigation",
    menuAriaLabel: "Open menu",

    presidentLabel: "President",
    directorLabel: "Director",
    accreditationsLabel: "Official Accreditations",
    copyrightSuffix: "All rights reserved.",

    statusCompleted: "Completed",
    statusInProgress: "In Progress",
    statusPlanned: "Planned",

    bankLabel: "Bank",
    accountLabel: "Account No.",
    accountPrivateLabel: "Individual",
    accountCSRLabel: "Company (CSR)",
    holderLabel: "Account Holder",

    csrCodeLabel: "CSR Code",
    csrContactLabel: "Contact",

    formGreeting: "Hello,",
    formIntro: "I would like to become a sponsor.",
    formNameLabel: "Name",
    formEmailLabel: "Email",
    formPhoneLabel: "Phone",
    formFormulaLabel: "Plan",
    formMessageLabel: "Message",
    formClosing: "Kind regards",
    formSubjectPrefix: "Sponsorship Request",
    formPhoneNotProvided: "Not provided",
    formMessageEmpty: "(none)",

    tablistLabel: "Contribution type",
    srLabelFullName: "Full name",
    srLabelPhone: "Phone",
    srLabelEmail: "Email",
    srLabelFormula: "Sponsorship plan",
    srLabelMessage: "Message",

    donateStepAmount: "Amount",
    donateStepDetails: "Details",
    donateStepPayment: "Payment",
    donateContinue: "Continue",
    donateBack: "Back",
    donateCompleted: "I have completed my payment",
    donateMcbJuice: "MCB Juice",
    donateBankTransfer: "Bank Transfer",
    donateYourDonation: "You are donating",
    donateReference: "Reference",
    donateShareWhatsapp: "Share via WhatsApp",
    donateCopyRef: "Copy reference",
    donateConfirmation: "Confirmation within 24-48h",
    donateCopied: "Copied!",
    donateMinAmount: "Please choose an amount (minimum Rs 50)",
    donateRequiredFields: "Please fill in your name and email",
    donateNicRequired: "Please provide your NIC or passport for the tax receipt",

    learnMore: "Learn more",

    catFormation: "Training",
    catCulture: "Culture",
    catVieScolaire: "School Life",
    catEnvironnement: "Environment",
    readMore: "Read more",

    catEcoResponsable: "Eco-friendly",
    catInfrastructure: "Infrastructure",
    catCommunautaire: "Community",

    langSwitchLabel: "FR",
    langSwitchHref: "/",
  },
};

/** Get locale config helpers */
export function getLocaleConfig(locale: Locale) {
  return {
    lang: locale,
    ui: uiStrings[locale],
    ogLocale: locale === "fr" ? "fr_FR" : "en_US",
    hreflang: { fr: "/", en: "/en/" },
  };
}

/**
 * Route equivalents between FR and EN URL paths.
 * Used for hreflang generation and language switcher links on sub-pages.
 */
export const routeEquivalents: { fr: string; en: string }[] = [
  { fr: "/", en: "/en/" },
  { fr: "/contact/", en: "/en/contact/" },
  { fr: "/faire-un-don/", en: "/en/donate/" },
  { fr: "/notre-histoire/", en: "/en/our-story/" },
  { fr: "/impact-et-transparence/", en: "/en/impact-transparency/" },
  { fr: "/actualites/", en: "/en/news/" },
  { fr: "/programmes/", en: "/en/programs/" },
];

/**
 * Given a URL path in one language, returns the equivalent path in the target language.
 * Handles exact matches (static pages) and prefix matches (dynamic slug pages).
 */
export function getAltLangPath(
  currentPath: string,
  currentLang: Locale,
  targetLang: Locale
): string {
  if (currentLang === targetLang) return currentPath;
  for (const route of routeEquivalents) {
    const src = currentLang === "fr" ? route.fr : route.en;
    const tgt = currentLang === "fr" ? route.en : route.fr;
    if (currentPath === src) return tgt;
    if (src !== "/" && currentPath.startsWith(src)) {
      return tgt + currentPath.slice(src.length);
    }
  }
  // Fallback: simple prefix swap
  return targetLang === "en"
    ? "/en" + currentPath
    : currentPath.replace(/^\/en/, "") || "/";
}
