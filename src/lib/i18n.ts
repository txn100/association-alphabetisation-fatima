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
