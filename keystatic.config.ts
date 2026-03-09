import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: process.env.NODE_ENV === 'production' ? 'cloud' : 'local',
  },
  cloud: {
    project: 'editeur-association/association',
  },
  collections: {
    news: collection({
      label: 'Actualités',
      slugField: 'title',
      path: 'src/content/news/*',
      format: { data: 'json' },
      schema: {
        title: fields.slug({ name: { label: 'Titre' } }),
        date: fields.date({ label: 'Date de publication' }),
        month: fields.text({ label: 'Mois (abrégé)', description: 'Ex: Fév, Mar, Avr, Déc' }),
        day: fields.text({ label: 'Jour', description: 'Ex: 09, 24' }),
        year: fields.text({ label: 'Année', description: 'Ex: 2026' }),
        category: fields.text({ label: 'Catégorie', description: 'Ex: Formation, Culture, Vie Scolaire, Environnement' }),
        description: fields.text({ label: 'Description', multiline: true }),
        image: fields.text({ label: 'Chemin de l\'image', description: 'Ex: /images/photo.webp' }),
        imageAlt: fields.text({ label: 'Texte alternatif de l\'image' }),
      },
    }),
    gallery: collection({
      label: 'Galerie Photos',
      slugField: 'alt',
      path: 'src/content/gallery/*',
      format: { data: 'json' },
      schema: {
        src: fields.text({ label: 'Chemin de l\'image', description: 'Ex: /images/photo.jpg' }),
        alt: fields.slug({ name: { label: 'Description de la photo' } }),
        span: fields.text({ label: 'Classes CSS grille', description: 'Ex: col-span-2 row-span-2 (vide si taille normale)' }),
        order: fields.integer({ label: 'Ordre d\'affichage', description: '1 = première photo' }),
      },
    }),
    stats: collection({
      label: 'Statistiques',
      slugField: 'label',
      path: 'src/content/stats/*',
      format: { data: 'json' },
      schema: {
        value: fields.text({ label: 'Valeur', description: 'Ex: 2 000+, 160+, 15' }),
        label: fields.slug({ name: { label: 'Description' } }),
        order: fields.integer({ label: 'Ordre d\'affichage' }),
      },
    }),
    tiers: collection({
      label: 'Formules de Parrainage',
      slugField: 'label',
      path: 'src/content/tiers/*',
      format: { data: 'json' },
      schema: {
        amount: fields.integer({ label: 'Montant (Rs)' }),
        label: fields.slug({ name: { label: 'Label' }, description: 'Ex: Rs 800' }),
        period: fields.text({ label: 'Période', description: 'Ex: /mois' }),
        description: fields.text({ label: 'Description', description: 'Ex: 1 repas par jour pour un élève' }),
        icon: fields.text({ label: 'Icône FontAwesome', description: 'Ex: fas fa-utensils' }),
        highlighted: fields.checkbox({ label: 'Mettre en avant ("Le plus choisi")' }),
        order: fields.integer({ label: 'Ordre d\'affichage' }),
      },
    }),
  },
});
