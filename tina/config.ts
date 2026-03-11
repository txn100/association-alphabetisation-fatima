import { defineConfig } from "tinacms";

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.CF_PAGES_BRANCH ||
  process.env.HEAD ||
  "tina";

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",

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
      {
        name: "news",
        label: "Actualités",
        path: "src/content/news",
        format: "json",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Titre",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "date",
            label: "Date de publication",
            description: "Format: YYYY-MM-DD (ex: 2026-03-01)",
            required: true,
          },
          {
            type: "string",
            name: "month",
            label: "Mois (abrégé)",
            description: "Ex: Fév, Mar, Avr, Déc",
            required: true,
          },
          {
            type: "string",
            name: "day",
            label: "Jour",
            description: "Ex: 09, 24",
            required: true,
          },
          {
            type: "string",
            name: "year",
            label: "Année",
            description: "Ex: 2026",
            required: true,
          },
          {
            type: "string",
            name: "category",
            label: "Catégorie",
            required: true,
            options: ["Formation", "Culture", "Vie Scolaire", "Environnement"],
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "image",
            name: "image",
            label: "Image",
          },
          {
            type: "string",
            name: "imageAlt",
            label: "Texte alternatif de l'image",
          },
        ],
      },
      {
        name: "gallery",
        label: "Galerie Photos",
        path: "src/content/gallery",
        format: "json",
        fields: [
          {
            type: "image",
            name: "src",
            label: "Image",
            required: true,
          },
          {
            type: "string",
            name: "alt",
            label: "Description de la photo",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "span",
            label: "Taille dans la grille",
            description: "Vide = taille normale",
            options: [
              { value: "", label: "Normale" },
              { value: "col-span-2", label: "Large (2 colonnes)" },
              { value: "row-span-2", label: "Haute (2 lignes)" },
              { value: "col-span-2 row-span-2", label: "Grande (2x2)" },
            ],
          },
          {
            type: "number",
            name: "order",
            label: "Ordre d'affichage",
            required: true,
          },
        ],
      },
      {
        name: "stats",
        label: "Statistiques",
        path: "src/content/stats",
        format: "json",
        fields: [
          {
            type: "string",
            name: "value",
            label: "Valeur",
            isTitle: true,
            required: true,
            description: "Ex: 2 000+, 160+, 15",
          },
          {
            type: "string",
            name: "label",
            label: "Description",
            required: true,
          },
          {
            type: "number",
            name: "order",
            label: "Ordre d'affichage",
            required: true,
          },
        ],
      },
      {
        name: "programs",
        label: "Parcours Scolaire",
        path: "src/content/programs",
        format: "json",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Titre du programme",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "level",
            label: "Niveau",
            description: "Ex: Niveaux 1–2, Filière Vocational",
            required: true,
          },
          {
            type: "string",
            name: "icon",
            label: "Icône FontAwesome",
            description: "Ex: fas fa-book-reader",
            required: true,
          },
          {
            type: "string",
            name: "ages",
            label: "Tranche d'âge",
            description: "Ex: 6 – 10 ans",
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            required: true,
            ui: {
              component: "textarea",
            },
          },
          {
            type: "string",
            name: "color",
            label: "Couleur",
            required: true,
            options: [
              { value: "blue", label: "Bleu" },
              { value: "pink", label: "Rose" },
            ],
          },
          {
            type: "image",
            name: "image",
            label: "Image",
            required: true,
          },
          {
            type: "string",
            name: "imageAlt",
            label: "Texte alternatif de l'image",
            required: true,
          },
          {
            type: "number",
            name: "order",
            label: "Ordre d'affichage",
            required: true,
          },
        ],
      },
      {
        name: "tiers",
        label: "Formules de Parrainage",
        path: "src/content/tiers",
        format: "json",
        fields: [
          {
            type: "number",
            name: "amount",
            label: "Montant (Rs)",
            required: true,
          },
          {
            type: "string",
            name: "label",
            label: "Label",
            isTitle: true,
            required: true,
            description: "Ex: Rs 800",
          },
          {
            type: "string",
            name: "period",
            label: "Période",
            description: "Ex: /mois",
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            description: "Ex: 1 repas par jour pour un élève",
            required: true,
          },
          {
            type: "string",
            name: "icon",
            label: "Icône FontAwesome",
            description: "Ex: fas fa-utensils",
            required: true,
          },
          {
            type: "boolean",
            name: "highlighted",
            label: "Mettre en avant",
          },
          {
            type: "number",
            name: "order",
            label: "Ordre d'affichage",
            required: true,
          },
        ],
      },
    ],
  },
});
