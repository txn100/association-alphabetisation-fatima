import { defineConfig } from "tinacms";

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.CF_PAGES_BRANCH ||
  process.env.HEAD ||
  "tina";

const singletonUI = {
  allowedActions: { create: false, delete: false },
  router: () => "/",
};

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "9bff4b70-8364-4205-b688-7c79939891bf",
  token: process.env.TINA_TOKEN || "df0d4de26bb81e822baf560320e818282cff16e9",

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      // ── Multi-document collections ──
      {
        name: "news",
        label: "Actualités",
        path: "src/content/news",
        format: "json",
        ui: { router: () => "/" },
        fields: [
          { type: "string", name: "title", label: "Titre", isTitle: true, required: true },
          { type: "string", name: "date", label: "Date de publication", description: "Format: YYYY-MM-DD (ex: 2026-03-01)", required: true },
          { type: "string", name: "month", label: "Mois (abrégé)", description: "Ex: Fév, Mar, Avr, Déc", required: true },
          { type: "string", name: "day", label: "Jour", description: "Ex: 09, 24", required: true },
          { type: "string", name: "year", label: "Année", description: "Ex: 2026", required: true },
          { type: "string", name: "category", label: "Catégorie", required: true, options: ["Formation", "Culture", "Vie Scolaire", "Environnement"] },
          { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
          { type: "image", name: "image", label: "Image" },
          { type: "string", name: "imageAlt", label: "Texte alternatif de l'image" },
        ],
      },
      {
        name: "gallery",
        label: "Galerie Photos",
        path: "src/content/gallery",
        format: "json",
        ui: { router: () => "/" },
        fields: [
          { type: "image", name: "src", label: "Image", required: true },
          { type: "string", name: "alt", label: "Description de la photo", isTitle: true, required: true },
          {
            type: "string", name: "span", label: "Taille dans la grille", description: "Vide = taille normale",
            options: [
              { value: "", label: "Normale" },
              { value: "col-span-2", label: "Large (2 colonnes)" },
              { value: "row-span-2", label: "Haute (2 lignes)" },
              { value: "col-span-2 row-span-2", label: "Grande (2x2)" },
            ],
          },
          { type: "number", name: "order", label: "Ordre d'affichage", required: true },
        ],
      },
      {
        name: "stats",
        label: "Statistiques",
        path: "src/content/stats",
        format: "json",
        ui: { router: () => "/" },
        fields: [
          { type: "string", name: "value", label: "Valeur", isTitle: true, required: true, description: "Ex: 2 000+, 160+, 15" },
          { type: "string", name: "label", label: "Description", required: true },
          { type: "number", name: "order", label: "Ordre d'affichage", required: true },
        ],
      },
      {
        name: "programs",
        label: "Parcours Scolaire",
        path: "src/content/programs",
        format: "json",
        ui: { router: () => "/" },
        fields: [
          { type: "string", name: "title", label: "Titre du programme", isTitle: true, required: true },
          { type: "string", name: "level", label: "Niveau", description: "Ex: Niveaux 1–2, Filière Vocational", required: true },
          { type: "string", name: "icon", label: "Icône FontAwesome", description: "Ex: fas fa-book-reader", required: true },
          { type: "string", name: "ages", label: "Tranche d'âge", description: "Ex: 6 – 10 ans", required: true },
          { type: "string", name: "description", label: "Description", required: true, ui: { component: "textarea" } },
          { type: "string", name: "color", label: "Couleur", required: true, options: [{ value: "blue", label: "Bleu" }, { value: "pink", label: "Rose" }] },
          { type: "image", name: "image", label: "Image", required: true },
          { type: "string", name: "imageAlt", label: "Texte alternatif de l'image", required: true },
          { type: "number", name: "order", label: "Ordre d'affichage", required: true },
        ],
      },
      {
        name: "tiers",
        label: "Formules de Parrainage",
        path: "src/content/tiers",
        format: "json",
        ui: { router: () => "/" },
        fields: [
          { type: "number", name: "amount", label: "Montant (Rs)", required: true },
          { type: "string", name: "label", label: "Label", isTitle: true, required: true, description: "Ex: Rs 800" },
          { type: "string", name: "period", label: "Période", description: "Ex: /mois", required: true },
          { type: "string", name: "description", label: "Description", description: "Ex: 1 repas par jour pour un élève", required: true },
          { type: "string", name: "icon", label: "Icône FontAwesome", description: "Ex: fas fa-utensils", required: true },
          { type: "boolean", name: "highlighted", label: "Mettre en avant" },
          { type: "number", name: "order", label: "Ordre d'affichage", required: true },
        ],
      },

      // ── Singleton collections (one file each in src/data/) ──
      {
        name: "hero",
        label: "Hero (Accueil)",
        path: "src/data",
        format: "json",
        ui: singletonUI,
        match: { include: "hero" },
        fields: [
          { type: "string", name: "tagline", label: "Titre principal", isTitle: true, required: true },
          { type: "string", name: "subtitle", label: "Sous-titre", ui: { component: "textarea" } },
          { type: "string", name: "primaryButton", label: "Bouton principal" },
          { type: "string", name: "secondaryButton", label: "Bouton secondaire" },
        ],
      },
      {
        name: "about",
        label: "Notre Histoire",
        path: "src/data",
        format: "json",
        ui: singletonUI,
        match: { include: "about" },
        fields: [
          { type: "string", name: "heading", label: "Titre", isTitle: true, required: true },
          { type: "string", name: "paragraph1", label: "Paragraphe 1", ui: { component: "textarea" } },
          { type: "string", name: "paragraph2", label: "Paragraphe 2", ui: { component: "textarea" } },
          { type: "string", name: "paragraph3", label: "Paragraphe 3", ui: { component: "textarea" } },
          { type: "string", name: "quote", label: "Citation", ui: { component: "textarea" } },
          { type: "image", name: "mainImage", label: "Image principale" },
          { type: "string", name: "mainImageAlt", label: "Alt image principale" },
          {
            type: "object", name: "photos", label: "Photos", list: true,
            fields: [
              { type: "image", name: "src", label: "Image", required: true },
              { type: "string", name: "alt", label: "Description", required: true },
            ],
          },
        ],
      },
      {
        name: "footer",
        label: "Pied de page",
        path: "src/data",
        format: "json",
        ui: singletonUI,
        match: { include: "footer" },
        fields: [
          { type: "string", name: "orgDescription", label: "Description de l'ONG", isTitle: true, required: true, ui: { component: "textarea" } },
          { type: "string", name: "president", label: "Présidente" },
          { type: "string", name: "director", label: "Directrice" },
          { type: "string", name: "contactHeading", label: "Titre contact" },
          { type: "string", name: "address", label: "Adresse", ui: { component: "textarea" } },
          { type: "string", name: "phone1", label: "Téléphone 1" },
          { type: "string", name: "phone1Link", label: "Lien tel 1" },
          { type: "string", name: "phone2", label: "Téléphone 2" },
          { type: "string", name: "phone2Link", label: "Lien tel 2" },
          { type: "string", name: "email", label: "Email" },
          { type: "string", name: "whatsappNumber", label: "Numéro WhatsApp" },
          { type: "string", name: "transparencyHeading", label: "Titre transparence" },
          { type: "string", name: "ngoRegistered", label: "ONG enregistrée" },
          { type: "string", name: "nsifCode", label: "Code NSIF" },
          { type: "string", name: "csrCode", label: "Code CSR" },
          { type: "string", name: "copyright", label: "Copyright" },
        ],
      },
      {
        name: "navigation",
        label: "Navigation",
        path: "src/data",
        format: "json",
        ui: singletonUI,
        match: { include: "navigation" },
        fields: [
          {
            type: "object", name: "links", label: "Liens de navigation", list: true,
            fields: [
              { type: "string", name: "label", label: "Texte du lien", required: true },
            ],
          },
          { type: "string", name: "navbarTitle", label: "Titre à côté du logo", required: true },
          { type: "string", name: "ctaText", label: "Texte du bouton CTA", isTitle: true, required: true },
        ],
      },
      {
        name: "impact",
        label: "Bannière Impact",
        path: "src/data",
        format: "json",
        ui: singletonUI,
        match: { include: "impact" },
        fields: [
          { type: "string", name: "sinceLabel", label: "Label (Depuis...)", isTitle: true, required: true },
          { type: "string", name: "headline", label: "Titre principal" },
          { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
          {
            type: "object", name: "images", label: "Images de fond", list: true,
            fields: [
              { type: "image", name: "src", label: "Image", required: true },
              { type: "string", name: "alt", label: "Description", required: true },
            ],
          },
        ],
      },
      {
        name: "pedagogy",
        label: "Pédagogie",
        path: "src/data",
        format: "json",
        ui: singletonUI,
        match: { include: "pedagogy" },
        fields: [
          { type: "string", name: "heading", label: "Titre", isTitle: true, required: true },
          { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
          {
            type: "object", name: "features", label: "Points forts", list: true,
            fields: [
              { type: "string", name: "title", label: "Titre", required: true },
              { type: "string", name: "description", label: "Description", required: true },
            ],
          },
          { type: "string", name: "newsHeading", label: "Titre actualités" },
          {
            type: "object", name: "photos", label: "Photos", list: true,
            fields: [
              { type: "image", name: "src", label: "Image", required: true },
              { type: "string", name: "alt", label: "Description", required: true },
            ],
          },
        ],
      },
      {
        name: "donate",
        label: "Section Don",
        path: "src/data",
        format: "json",
        ui: singletonUI,
        match: { include: "donate" },
        fields: [
          {
            type: "object", name: "emotionalHeader", label: "En-tête émotionnel",
            fields: [
              { type: "string", name: "badge", label: "Badge" },
              { type: "string", name: "heading", label: "Titre" },
              { type: "string", name: "headingHighlight", label: "Mot en surbrillance" },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
            ],
          },
          {
            type: "object", name: "socialProof", label: "Preuves sociales", list: true,
            fields: [
              { type: "string", name: "value", label: "Valeur", required: true },
              { type: "string", name: "label", label: "Label", required: true },
            ],
          },
          {
            type: "object", name: "tabs", label: "Onglets",
            fields: [
              { type: "string", name: "donLabel", label: "Label Don" },
              { type: "string", name: "parrainLabel", label: "Label Parrainage" },
            ],
          },
          {
            type: "object", name: "donPonctuel", label: "Don Ponctuel",
            fields: [
              { type: "string", name: "heading", label: "Titre" },
              { type: "string", name: "subtitle", label: "Sous-titre" },
              {
                type: "object", name: "steps", label: "Étapes", list: true,
                fields: [
                  { type: "string", name: "title", label: "Titre", required: true },
                  { type: "string", name: "detail", label: "Détail" },
                ],
              },
              { type: "string", name: "referenceFormat", label: "Format référence" },
              { type: "string", name: "bankName", label: "Nom banque" },
              { type: "string", name: "accountNumber", label: "Numéro de compte" },
              { type: "string", name: "accountHolder", label: "Titulaire du compte" },
              { type: "string", name: "trustSignal", label: "Message de confiance" },
              { type: "string", name: "receiptNote", label: "Note reçu fiscal" },
            ],
          },
          {
            type: "object", name: "parrainSection", label: "Section Parrainage",
            fields: [
              { type: "string", name: "heading", label: "Titre" },
              { type: "string", name: "subtitle", label: "Sous-titre" },
              { type: "string", name: "chooseLabel", label: "Label choix formule" },
              { type: "string", name: "highlightedBadge", label: "Badge mis en avant" },
              { type: "string", name: "freeAmountOption", label: "Option montant libre" },
              { type: "string", name: "formHeading", label: "Titre formulaire" },
              { type: "string", name: "namePlaceholder", label: "Placeholder nom" },
              { type: "string", name: "phonePlaceholder", label: "Placeholder téléphone" },
              { type: "string", name: "emailPlaceholder", label: "Placeholder email" },
              { type: "string", name: "messagePlaceholder", label: "Placeholder message" },
              { type: "string", name: "whatsappButton", label: "Bouton WhatsApp" },
              { type: "string", name: "emailButton", label: "Bouton Email" },
              { type: "string", name: "responseTime", label: "Temps de réponse" },
              { type: "string", name: "receiptLabel", label: "Label reçu fiscal" },
            ],
          },
          {
            type: "object", name: "donEnAction", label: "Don en Action",
            fields: [
              { type: "string", name: "heading", label: "Titre" },
              {
                type: "object", name: "items", label: "Éléments", list: true,
                fields: [
                  { type: "string", name: "icon", label: "Icône FontAwesome", required: true },
                  { type: "string", name: "title", label: "Titre", required: true },
                  { type: "string", name: "subtitle", label: "Sous-titre", required: true },
                ],
              },
            ],
          },
          {
            type: "object", name: "csr", label: "Section CSR",
            fields: [
              { type: "string", name: "heading", label: "Titre" },
              { type: "string", name: "text", label: "Texte", ui: { component: "textarea" } },
              { type: "string", name: "csrCode", label: "Code CSR" },
              { type: "string", name: "contactName", label: "Nom du contact" },
              { type: "string", name: "contactRole", label: "Rôle du contact" },
            ],
          },
        ],
      },
      {
        name: "site",
        label: "Paramètres du site",
        path: "src/data",
        format: "json",
        ui: singletonUI,
        match: { include: "site" },
        fields: [
          { type: "string", name: "title", label: "Titre du site", isTitle: true, required: true },
          { type: "string", name: "description", label: "Description SEO", ui: { component: "textarea" } },
          { type: "string", name: "organizationName", label: "Nom de l'organisation" },
        ],
      },
      {
        name: "statsSection",
        label: "Section Statistiques",
        path: "src/data",
        format: "json",
        ui: singletonUI,
        match: { include: "stats-section" },
        fields: [
          {
            type: "object", name: "badges", label: "Badges d'accréditation", list: true,
            fields: [
              { type: "string", name: "label", label: "Texte du badge", required: true },
            ],
          },
        ],
      },
      {
        name: "programsSection",
        label: "Section Parcours",
        path: "src/data",
        format: "json",
        ui: singletonUI,
        match: { include: "programs-section" },
        fields: [
          { type: "string", name: "heading", label: "Titre", isTitle: true, required: true },
          { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
          { type: "string", name: "mobileIndicator", label: "Texte indicateur mobile" },
        ],
      },
      {
        name: "gallerySection",
        label: "Section Galerie",
        path: "src/data",
        format: "json",
        ui: singletonUI,
        match: { include: "gallery-section" },
        fields: [
          { type: "string", name: "heading", label: "Titre", isTitle: true, required: true },
          { type: "string", name: "headingHighlight", label: "Mot en surbrillance" },
          { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
        ],
      },
    ],
  },
});
