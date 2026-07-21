/*****************************************************************
 Projet : Pierre-Yves — Carnet de liaison numérique
 Fichier : referentiel.gs
 Version : MVP 0.9.0
 Build : 0001
 Environnement : TEST

 Rôle :
 - définir les catégories du formulaire ;
 - définir les items et leurs règles ;
 - définir les valeurs autorisées ;
 - servir de source unique pour l'installation, la validation,
   la synthèse et, plus tard, l'interface GitHub Pages.
*****************************************************************/

const REFERENTIEL = Object.freeze({

  categories: Object.freeze([
    {
      id: 'CAT-REP',
      ordre: 10,
      nomTechnique: 'repas',
      libelle: 'Repas et cuisine',
      description: 'Activités liées aux repas, aux courses et à la cuisine.',
      actif: true
    },
    {
      id: 'CAT-MEN',
      ordre: 20,
      nomTechnique: 'menage',
      libelle: 'Ménage',
      description: 'Travaux de ménage réalisés dans la maison.',
      actif: true
    },
    {
      id: 'CAT-EXT',
      ordre: 30,
      nomTechnique: 'entretien_exterieur',
      libelle: 'Entretien extérieur',
      description: 'Travaux réalisés à l’extérieur de la maison.',
      actif: true
    },
    {
      id: 'CAT-ACC',
      ordre: 40,
      nomTechnique: 'accompagnement_therese',
      libelle: 'Accompagnement de Thérèse',
      description: 'Aides apportées à Thérèse dans la vie quotidienne.',
      actif: true
    },
    {
      id: 'CAT-THE',
      ordre: 50,
      nomTechnique: 'tendance_therese',
      libelle: 'Comment va Thérèse ?',
      description: 'Tendances observées par rapport à son état habituel ou à la veille.',
      actif: true
    },
    {
      id: 'CAT-PY',
      ordre: 60,
      nomTechnique: 'tendance_pierre_yves',
      libelle: 'Comment va Pierre-Yves ?',
      description: 'Autoévaluation simple de Pierre-Yves sur sa journée.',
      actif: true
    },
    {
      id: 'CAT-SUI',
      ordre: 70,
      nomTechnique: 'suivi',
      libelle: 'Besoins, problèmes et remarques',
      description: 'Informations nécessitant une attention ou une action.',
      actif: true
    },
    {
      id: 'CAT-CLO',
      ordre: 80,
      nomTechnique: 'cloture',
      libelle: 'Clôture de la journée',
      description: 'Validation globale avant envoi.',
      actif: true
    }
  ]),

  jeuxValeurs: Object.freeze({

    'VAL-OUI-NON': Object.freeze([
      { code: 'OUI', ordre: 10, libelle: 'Oui', valeur: 'OUI', severite: 0 },
      { code: 'NON', ordre: 20, libelle: 'Non', valeur: 'NON', severite: 0 }
    ]),

    'VAL-OUI-NON-NA': Object.freeze([
      { code: 'OUI', ordre: 10, libelle: 'Oui', valeur: 'OUI', severite: 0 },
      { code: 'NON', ordre: 20, libelle: 'Non', valeur: 'NON', severite: 0 },
      { code: 'NA', ordre: 30, libelle: 'Non concerné', valeur: 'NA', severite: 0 }
    ]),

    'VAL-REPAS': Object.freeze([
      { code: 'CUISINE', ordre: 10, libelle: 'J’ai cuisiné le repas', valeur: 'CUISINE', severite: 0 },
      { code: 'PREPARE', ordre: 20, libelle: 'J’ai préparé quelque chose de simple', valeur: 'PREPARE', severite: 0 },
      { code: 'TOUT_PRET', ordre: 30, libelle: 'Le repas était déjà prêt', valeur: 'TOUT_PRET', severite: 0 },
      { code: 'AUTRE', ordre: 40, libelle: 'Autre situation', valeur: 'AUTRE', severite: 0 }
    ]),

    'VAL-MENAGE': Object.freeze([
      { code: 'OUI', ordre: 10, libelle: 'Oui, du ménage a été fait', valeur: 'OUI', severite: 0 },
      { code: 'NON', ordre: 20, libelle: 'Il n’y a pas eu de ménage aujourd’hui', valeur: 'NON', severite: 0 }
    ]),

    'VAL-ZONES-MENAGE': Object.freeze([
      { code: 'CUISINE', ordre: 10, libelle: 'Cuisine', valeur: 'CUISINE', severite: 0 },
      { code: 'SALON', ordre: 20, libelle: 'Salon / séjour', valeur: 'SALON', severite: 0 },
      { code: 'CHAMBRE', ordre: 30, libelle: 'Chambre', valeur: 'CHAMBRE', severite: 0 },
      { code: 'SALLE_EAU', ordre: 40, libelle: 'Salle d’eau / toilettes', valeur: 'SALLE_EAU', severite: 0 },
      { code: 'SOLS', ordre: 50, libelle: 'Sols', valeur: 'SOLS', severite: 0 },
      { code: 'LINGE', ordre: 60, libelle: 'Linge', valeur: 'LINGE', severite: 0 },
      { code: 'RANGEMENT', ordre: 70, libelle: 'Rangement', valeur: 'RANGEMENT', severite: 0 },
      { code: 'AUTRE', ordre: 80, libelle: 'Autre', valeur: 'AUTRE', severite: 0 }
    ]),

    'VAL-EXT': Object.freeze([
      { code: 'COUR', ordre: 10, libelle: 'Cour / terrasse', valeur: 'COUR', severite: 0 },
      { code: 'JARDIN', ordre: 20, libelle: 'Jardin', valeur: 'JARDIN', severite: 0 },
      { code: 'POUBELLES', ordre: 30, libelle: 'Poubelles / tri', valeur: 'POUBELLES', severite: 0 },
      { code: 'PETIT_ENTRETIEN', ordre: 40, libelle: 'Petit entretien', valeur: 'PETIT_ENTRETIEN', severite: 0 },
      { code: 'AUTRE', ordre: 50, libelle: 'Autre activité', valeur: 'AUTRE', severite: 0 }
    ]),

    'VAL-TENDANCE': Object.freeze([
      { code: 'MIEUX', ordre: 10, libelle: 'Mieux que d’habitude / qu’hier', valeur: 'MIEUX', severite: 0 },
      { code: 'HABITUEL', ordre: 20, libelle: 'Comme d’habitude', valeur: 'HABITUEL', severite: 0 },
      { code: 'MOINS_BIEN', ordre: 30, libelle: 'Moins bien que d’habitude / qu’hier', valeur: 'MOINS_BIEN', severite: 1 }
    ]),

    'VAL-JOURNEE-PY': Object.freeze([
      { code: 'BIEN', ordre: 10, libelle: 'Bien', valeur: 'BIEN', severite: 0 },
      { code: 'MOYEN', ordre: 20, libelle: 'Moyennement', valeur: 'MOYEN', severite: 0 },
      { code: 'DIFFICILE', ordre: 30, libelle: 'Difficilement', valeur: 'DIFFICILE', severite: 1 }
    ])
  }),

  items: Object.freeze([

    {
      id: 'REP-001',
      categorie: 'CAT-REP',
      ordre: 10,
      nomTechnique: 'menu_elabore',
      libelle: 'Menu élaboré',
      typeReponse: 'CHOIX',
      jeuValeurs: 'VAL-OUI-NON',
      obligatoire: false,
      multiple: false,
      usage: 'Synthèse des activités',
      destinataire: 'Florence et David',
      actif: true
    },
    {
      id: 'REP-002',
      categorie: 'CAT-REP',
      ordre: 20,
      nomTechnique: 'refrigerateur_verifie',
      libelle: 'Réfrigérateur vérifié',
      typeReponse: 'CHOIX',
      jeuValeurs: 'VAL-OUI-NON',
      obligatoire: false,
      multiple: false,
      usage: 'Synthèse des activités',
      destinataire: 'Florence et David',
      actif: true
    },
    {
      id: 'REP-003',
      categorie: 'CAT-REP',
      ordre: 30,
      nomTechnique: 'liste_courses_preparee',
      libelle: 'Liste de courses préparée',
      typeReponse: 'CHOIX',
      jeuValeurs: 'VAL-OUI-NON',
      obligatoire: false,
      multiple: false,
      usage: 'Synthèse des activités',
      destinataire: 'Florence et David',
      actif: true
    },
    {
      id: 'REP-004',
      categorie: 'CAT-REP',
      ordre: 40,
      nomTechnique: 'courses_effectuees',
      libelle: 'Courses effectuées',
      typeReponse: 'CHOIX',
      jeuValeurs: 'VAL-OUI-NON',
      obligatoire: false,
      multiple: false,
      usage: 'Synthèse des activités',
      destinataire: 'Florence et David',
      actif: true
    },
    {
      id: 'REP-005',
      categorie: 'CAT-REP',
      ordre: 50,
      nomTechnique: 'courses_rangees',
      libelle: 'Courses rangées',
      typeReponse: 'CHOIX',
      jeuValeurs: 'VAL-OUI-NON',
      obligatoire: false,
      multiple: false,
      usage: 'Synthèse des activités',
      destinataire: 'Florence et David',
      actif: true
    },
    {
      id: 'REP-006',
      categorie: 'CAT-REP',
      ordre: 60,
      nomTechnique: 'repas_prepare',
      libelle: 'Repas du jour',
      typeReponse: 'CHOIX',
      jeuValeurs: 'VAL-REPAS',
      obligatoire: true,
      multiple: false,
      usage: 'Synthèse des activités',
      destinataire: 'Florence et David',
      actif: true
    },
    {
      id: 'REP-007',
      categorie: 'CAT-REP',
      ordre: 70,
      nomTechnique: 'autre_activite_cuisine',
      libelle: 'Autre activité liée aux repas',
      typeReponse: 'TEXTE_COURT',
      obligatoire: false,
      multiple: false,
      longueurMax: 160,
      usage: 'Synthèse des activités',
      destinataire: 'Florence et David',
      actif: true
    },

    {
      id: 'MEN-001',
      categorie: 'CAT-MEN',
      ordre: 10,
      nomTechnique: 'menage_realise',
      libelle: 'Ménage aujourd’hui',
      typeReponse: 'CHOIX',
      jeuValeurs: 'VAL-MENAGE',
      obligatoire: true,
      multiple: false,
      usage: 'Synthèse des activités',
      destinataire: 'Florence et David',
      actif: true
    },
    {
      id: 'MEN-002',
      categorie: 'CAT-MEN',
      ordre: 20,
      nomTechnique: 'zones_menage',
      libelle: 'Zones entretenues',
      typeReponse: 'CHOIX_MULTIPLE',
      jeuValeurs: 'VAL-ZONES-MENAGE',
      obligatoire: false,
      multiple: true,
      nombreMaxChoix: 8,
      usage: 'Synthèse des activités',
      destinataire: 'Florence et David',
      actif: true
    },
    {
      id: 'MEN-003',
      categorie: 'CAT-MEN',
      ordre: 30,
      nomTechnique: 'autre_activite_menage',
      libelle: 'Autre activité de ménage',
      typeReponse: 'TEXTE_COURT',
      obligatoire: false,
      multiple: false,
      longueurMax: 160,
      usage: 'Synthèse des activités',
      destinataire: 'Florence et David',
      actif: true
    },

    {
      id: 'EXT-001',
      categorie: 'CAT-EXT',
      ordre: 10,
      nomTechnique: 'entretien_exterieur_realise',
      libelle: 'Entretien extérieur aujourd’hui',
      typeReponse: 'CHOIX',
      jeuValeurs: 'VAL-OUI-NON',
      obligatoire: true,
      multiple: false,
      usage: 'Synthèse des activités',
      destinataire: 'Florence et David',
      actif: true
    },
    {
      id: 'EXT-002',
      categorie: 'CAT-EXT',
      ordre: 20,
      nomTechnique: 'activites_exterieures',
      libelle: 'Activités extérieures réalisées',
      typeReponse: 'CHOIX_MULTIPLE',
      jeuValeurs: 'VAL-EXT',
      obligatoire: false,
      multiple: true,
      nombreMaxChoix: 5,
      usage: 'Synthèse des activités',
      destinataire: 'Florence et David',
      actif: true
    },
    {
      id: 'EXT-003',
      categorie: 'CAT-EXT',
      ordre: 30,
      nomTechnique: 'autre_activite_exterieure',
      libelle: 'Autre activité extérieure',
      typeReponse: 'TEXTE_COURT',
      obligatoire: false,
      multiple: false,
      longueurMax: 160,
      usage: 'Synthèse des activités',
      destinataire: 'Florence et David',
      actif: true
    },

    {
      id: 'ACC-001',
      categorie: 'CAT-ACC',
      ordre: 10,
      nomTechnique: 'installation_repas',
      libelle: 'Thérèse installée pour le repas',
      typeReponse: 'CHOIX',
      jeuValeurs: 'VAL-OUI-NON-NA',
      obligatoire: false,
      multiple: false,
      usage: 'Synthèse des activités',
      destinataire: 'Florence et David',
      actif: true
    },
    {
      id: 'ACC-002',
      categorie: 'CAT-ACC',
      ordre: 20,
      nomTechnique: 'installation_nuit',
      libelle: 'Thérèse installée pour la nuit',
      typeReponse: 'CHOIX',
      jeuValeurs: 'VAL-OUI-NON-NA',
      obligatoire: false,
      multiple: false,
      usage: 'Synthèse des activités',
      destinataire: 'Florence et David',
      actif: true
    },
    {
      id: 'ACC-003',
      categorie: 'CAT-ACC',
      ordre: 30,
      nomTechnique: 'autre_accompagnement',
      libelle: 'Autre accompagnement réalisé',
      typeReponse: 'TEXTE_COURT',
      obligatoire: false,
      multiple: false,
      longueurMax: 160,
      usage: 'Synthèse des activités',
      destinataire: 'Florence et David',
      actif: true
    },

    {
      id: 'THE-001',
      categorie: 'CAT-THE',
      ordre: 10,
      nomTechnique: 'tendance_moral_therese',
      libelle: 'Moral de Thérèse',
      typeReponse: 'CHOIX',
      jeuValeurs: 'VAL-TENDANCE',
      obligatoire: true,
      multiple: false,
      usage: 'Tendance quotidienne et hebdomadaire',
      destinataire: 'Florence et David',
      actif: true
    },
    {
      id: 'THE-002',
      categorie: 'CAT-THE',
      ordre: 20,
      nomTechnique: 'tendance_sante_therese',
      libelle: 'État de santé général',
      typeReponse: 'CHOIX',
      jeuValeurs: 'VAL-TENDANCE',
      obligatoire: true,
      multiple: false,
      usage: 'Tendance quotidienne et hebdomadaire',
      destinataire: 'Florence et David',
      actif: true
    },
    {
      id: 'THE-003',
      categorie: 'CAT-THE',
      ordre: 30,
      nomTechnique: 'tendance_mobilite_therese',
      libelle: 'Mobilité avec le déambulateur',
      typeReponse: 'CHOIX',
      jeuValeurs: 'VAL-TENDANCE',
      obligatoire: true,
      multiple: false,
      usage: 'Tendance quotidienne et hebdomadaire',
      destinataire: 'Florence et David',
      actif: true
    },

    {
      id: 'PY-001',
      categorie: 'CAT-PY',
      ordre: 10,
      nomTechnique: 'energie_pierre_yves',
      libelle: 'Mon énergie aujourd’hui',
      typeReponse: 'ECHELLE',
      obligatoire: true,
      multiple: false,
      valeurMin: 0,
      valeurMax: 10,
      usage: 'Tendance quotidienne et hebdomadaire',
      destinataire: 'Florence et David',
      actif: true
    },
    {
      id: 'PY-002',
      categorie: 'CAT-PY',
      ordre: 20,
      nomTechnique: 'moral_pierre_yves',
      libelle: 'Mon moral aujourd’hui',
      typeReponse: 'ECHELLE',
      obligatoire: true,
      multiple: false,
      valeurMin: 0,
      valeurMax: 10,
      usage: 'Tendance quotidienne et hebdomadaire',
      destinataire: 'Florence et David',
      actif: true
    },
    {
      id: 'PY-003',
      categorie: 'CAT-PY',
      ordre: 30,
      nomTechnique: 'sentiment_journee',
      libelle: 'Ma journée s’est passée',
      typeReponse: 'CHOIX',
      jeuValeurs: 'VAL-JOURNEE-PY',
      obligatoire: true,
      multiple: false,
      usage: 'Tendance quotidienne et hebdomadaire',
      destinataire: 'Florence et David',
      actif: true
    },

    {
      id: 'SUI-001',
      categorie: 'CAT-SUI',
      ordre: 10,
      nomTechnique: 'besoin_identifie',
      libelle: 'J’ai besoin de quelque chose',
      typeReponse: 'CHOIX',
      jeuValeurs: 'VAL-OUI-NON',
      obligatoire: true,
      multiple: false,
      usage: 'Déclenchement d’une action',
      destinataire: 'Florence et David',
      actif: true
    },
    {
      id: 'SUI-002',
      categorie: 'CAT-SUI',
      ordre: 20,
      nomTechnique: 'description_besoin',
      libelle: 'Préciser le besoin',
      typeReponse: 'TEXTE_LONG',
      obligatoire: false,
      obligatoireSi: Object.freeze({
        item: 'SUI-001',
        valeur: 'OUI'
      }),
      multiple: false,
      longueurMinConditionnelle: 5,
      longueurMax: 500,
      usage: 'Action ou réponse familiale',
      destinataire: 'Florence et David',
      actif: true
    },
    {
      id: 'SUI-003',
      categorie: 'CAT-SUI',
      ordre: 30,
      nomTechnique: 'probleme_identifie',
      libelle: 'Un problème est à signaler',
      typeReponse: 'CHOIX',
      jeuValeurs: 'VAL-OUI-NON',
      obligatoire: true,
      multiple: false,
      usage: 'Déclenchement d’une attention ou action',
      destinataire: 'Florence et David',
      actif: true
    },
    {
      id: 'SUI-004',
      categorie: 'CAT-SUI',
      ordre: 40,
      nomTechnique: 'description_probleme',
      libelle: 'Préciser le problème',
      typeReponse: 'TEXTE_LONG',
      obligatoire: false,
      obligatoireSi: Object.freeze({
        item: 'SUI-003',
        valeur: 'OUI'
      }),
      multiple: false,
      longueurMinConditionnelle: 5,
      longueurMax: 500,
      usage: 'Action ou réponse familiale',
      destinataire: 'Florence et David',
      actif: true
    },
    {
      id: 'SUI-005',
      categorie: 'CAT-SUI',
      ordre: 50,
      nomTechnique: 'remarque_libre',
      libelle: 'Une remarque pour Florence et David',
      typeReponse: 'TEXTE_LONG',
      obligatoire: false,
      multiple: false,
      longueurMax: 500,
      usage: 'Information complémentaire',
      destinataire: 'Florence et David',
      actif: true
    },

    {
      id: 'CLO-001',
      categorie: 'CAT-CLO',
      ordre: 10,
      nomTechnique: 'journee_complete',
      libelle: 'J’ai terminé le compte rendu de la journée',
      typeReponse: 'CASE_A_COCHER',
      obligatoire: true,
      multiple: false,
      valeurAttendue: true,
      usage: 'Autorise l’envoi',
      destinataire: 'Système',
      actif: true
    }
  ]),

  notifications: Object.freeze([
    {
      id: 'NOT-001',
      nomTechnique: 'confirmation_journee',
      declencheur: 'Après création ou modification réussie',
      destinataires: 'Florence et David',
      canal: 'EMAIL',
      bloqueEnregistrement: false,
      actifMvp: true
    },
    {
      id: 'NOT-002',
      nomTechnique: 'alerte_besoin',
      declencheur: 'SUI-001 = OUI',
      destinataires: 'Florence et David',
      canal: 'EMAIL',
      bloqueEnregistrement: false,
      actifMvp: true
    },
    {
      id: 'NOT-003',
      nomTechnique: 'alerte_probleme',
      declencheur: 'SUI-003 = OUI',
      destinataires: 'Florence et David',
      canal: 'EMAIL',
      bloqueEnregistrement: false,
      actifMvp: true
    },
    {
      id: 'NOT-004',
      nomTechnique: 'alerte_tendance_therese',
      declencheur: 'Au moins une valeur THE = MOINS_BIEN',
      destinataires: 'Florence et David',
      canal: 'EMAIL',
      bloqueEnregistrement: false,
      actifMvp: true
    },
    {
      id: 'NOT-005',
      nomTechnique: 'alerte_pierre_yves',
      declencheur: 'PY-003 = DIFFICILE ou énergie / moral <= 2',
      destinataires: 'Florence et David',
      canal: 'EMAIL',
      bloqueEnregistrement: false,
      actifMvp: true
    },
    {
      id: 'NOT-006',
      nomTechnique: 'synthese_hebdomadaire',
      declencheur: 'Déclenchement planifié hebdomadaire',
      destinataires: 'Florence et David',
      canal: 'EMAIL',
      bloqueEnregistrement: false,
      actifMvp: false
    }
  ]),

  syntheses: Object.freeze([
    {
      id: 'SYN-001',
      nomTechnique: 'synthese_journaliere',
      periode: 'JOUR',
      destinataires: 'Florence et David',
      sections: Object.freeze([
        'Activités réalisées',
        'Tendances concernant Thérèse',
        'Tendances concernant Pierre-Yves',
        'Besoins',
        'Problèmes',
        'Remarques'
      ]),
      actifMvp: true
    },
    {
      id: 'SYN-002',
      nomTechnique: 'synthese_hebdomadaire',
      periode: 'SEMAINE',
      destinataires: 'Florence et David',
      sections: Object.freeze([
        'Fréquence des activités',
        'Tendances concernant Thérèse',
        'Tendances concernant Pierre-Yves',
        'Besoins',
        'Problèmes',
        'Points d’attention'
      ]),
      actifMvp: true
    }
  ])
});


/**
 * Retourne les catégories actives triées par ordre.
 */
function getCategoriesActives() {
  return REFERENTIEL.categories
    .filter(function(categorie) {
      return categorie.actif === true;
    })
    .slice()
    .sort(function(a, b) {
      return a.ordre - b.ordre;
    });
}


/**
 * Retourne les items actifs triés par catégorie puis par ordre.
 */
function getItemsActifs() {
  return REFERENTIEL.items
    .filter(function(item) {
      return item.actif === true;
    })
    .slice()
    .sort(function(a, b) {
      if (a.categorie === b.categorie) {
        return a.ordre - b.ordre;
      }
      return a.categorie.localeCompare(b.categorie);
    });
}


/**
 * Retourne un item à partir de son identifiant.
 */
function getItemParId(idItem) {
  return REFERENTIEL.items.find(function(item) {
    return item.id === idItem;
  }) || null;
}


/**
 * Retourne une catégorie à partir de son identifiant.
 */
function getCategorieParId(idCategorie) {
  return REFERENTIEL.categories.find(function(categorie) {
    return categorie.id === idCategorie;
  }) || null;
}


/**
 * Retourne les valeurs autorisées d'un jeu de valeurs.
 */
function getValeursAutorisees(idJeuValeurs) {
  if (!idJeuValeurs || !REFERENTIEL.jeuxValeurs[idJeuValeurs]) {
    return [];
  }

  return REFERENTIEL.jeuxValeurs[idJeuValeurs]
    .slice()
    .sort(function(a, b) {
      return a.ordre - b.ordre;
    });
}


/**
 * Vérifie la cohérence minimale du référentiel.
 *
 * Cette fonction sera utilisée lors de l'installation TEST.
 */
function verifierReferentiel() {
  const erreurs = [];
  const categoriesConnues = {};
  const itemsConnus = {};

  REFERENTIEL.categories.forEach(function(categorie) {
    if (categoriesConnues[categorie.id]) {
      erreurs.push('Catégorie dupliquée : ' + categorie.id);
    }
    categoriesConnues[categorie.id] = true;
  });

  REFERENTIEL.items.forEach(function(item) {
    if (itemsConnus[item.id]) {
      erreurs.push('Item dupliqué : ' + item.id);
    }
    itemsConnus[item.id] = true;

    if (!categoriesConnues[item.categorie]) {
      erreurs.push(
        'Catégorie inconnue pour l’item ' +
        item.id +
        ' : ' +
        item.categorie
      );
    }

    if (
      item.jeuValeurs &&
      !REFERENTIEL.jeuxValeurs[item.jeuValeurs]
    ) {
      erreurs.push(
        'Jeu de valeurs inconnu pour l’item ' +
        item.id +
        ' : ' +
        item.jeuValeurs
      );
    }

    if (
      item.obligatoireSi &&
      !REFERENTIEL.items.some(function(itemCible) {
        return itemCible.id === item.obligatoireSi.item;
      })
    ) {
      erreurs.push(
        'Condition obligatoire invalide pour l’item ' +
        item.id
      );
    }
  });

  return {
    ok: erreurs.length === 0,
    erreurs: erreurs,
    nombreCategories: REFERENTIEL.categories.length,
    nombreItems: REFERENTIEL.items.length,
    nombreNotifications: REFERENTIEL.notifications.length,
    nombreSyntheses: REFERENTIEL.syntheses.length
  };
}
