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

  // Donate — tablist and form sr-only labels
  tablistLabel: string;
  srLabelFullName: string;
  srLabelPhone: string;
  srLabelEmail: string;
  srLabelFormula: string;
  srLabelMessage: string;

  // Language switcher
  langSwitchLabel: string;
  langSwitchHref: string;

  // Donate page
  donateOnlineCta: string;
  donatePageTitle: string;
  donateOneTime: string;
  donateMonthly: string;
  donatePayNow: string;
  donateProcessing: string;
  donateAmount: string;
  donateCustomAmount: string;
  donateDonorName: string;
  donateDonorEmail: string;
  donateDonorPhone: string;
  donateTaxReceipt: string;
  donateDonorNic: string;
  donateNicHelp: string;
  donateSuccessTitle: string;
  donateFailedTitle: string;
  donateRetry: string;
  donateBackHome: string;
  donateBackToDonate: string;
  donateSecurityNote: string;
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

    tablistLabel: "Type de contribution",
    srLabelFullName: "Nom complet",
    srLabelPhone: "Téléphone",
    srLabelEmail: "Email",
    srLabelFormula: "Formule de parrainage",
    srLabelMessage: "Message",

    langSwitchLabel: "EN",
    langSwitchHref: "/en/",

    donateOnlineCta: "Faire un don en ligne",
    donatePageTitle: "Faire un don",
    donateOneTime: "Don ponctuel",
    donateMonthly: "Parrainage mensuel",
    donatePayNow: "Payer maintenant",
    donateProcessing: "Traitement en cours...",
    donateAmount: "Montant",
    donateCustomAmount: "Autre montant (Rs)",
    donateDonorName: "Nom complet",
    donateDonorEmail: "Adresse email",
    donateDonorPhone: "Téléphone (optionnel)",
    donateTaxReceipt: "Je souhaite un reçu fiscal (NSIF)",
    donateDonorNic: "NIC ou passeport",
    donateNicHelp: "Requis par la MRA pour la déduction fiscale (jusqu'à Rs 100 000/an)",
    donateSuccessTitle: "Merci pour votre don !",
    donateFailedTitle: "Le paiement n'a pas abouti",
    donateRetry: "Réessayer",
    donateBackHome: "Retour à l'accueil",
    donateBackToDonate: "Retour aux dons",
    donateSecurityNote: "Paiement sécurisé par Peach Payments",
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

    tablistLabel: "Contribution type",
    srLabelFullName: "Full name",
    srLabelPhone: "Phone",
    srLabelEmail: "Email",
    srLabelFormula: "Sponsorship plan",
    srLabelMessage: "Message",

    langSwitchLabel: "FR",
    langSwitchHref: "/",

    donateOnlineCta: "Donate online",
    donatePageTitle: "Make a Donation",
    donateOneTime: "One-time donation",
    donateMonthly: "Monthly sponsorship",
    donatePayNow: "Pay now",
    donateProcessing: "Processing...",
    donateAmount: "Amount",
    donateCustomAmount: "Other amount (Rs)",
    donateDonorName: "Full name",
    donateDonorEmail: "Email address",
    donateDonorPhone: "Phone (optional)",
    donateTaxReceipt: "I want a tax receipt (NSIF)",
    donateDonorNic: "NIC or passport number",
    donateNicHelp: "Required by MRA for donation tax deduction (up to Rs 100,000/year)",
    donateSuccessTitle: "Thank you for your donation!",
    donateFailedTitle: "Payment could not be completed",
    donateRetry: "Try again",
    donateBackHome: "Back to home",
    donateBackToDonate: "Back to donate",
    donateSecurityNote: "Secure payment by Peach Payments",
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
