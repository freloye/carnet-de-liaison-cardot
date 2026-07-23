/*****************************************************************
 Projet : Carnet de liaison Cardot
 Fichier : app.js
 Version : V1.0 TEST
 Build : 0011
*****************************************************************/

"use strict";

document.addEventListener("DOMContentLoaded", initialiser);

function initialiser() {
  afficherEntete();
  initialiserChoix();
  initialiserCurseurs();
  initialiserCourses();

  const formulaire = document.getElementById("formulaireJournee");

  if (!formulaire) {
    console.error("Formulaire introuvable : formulaireJournee");
    return;
  }

  formulaire.addEventListener("submit", soumettre);
}

function afficherEntete() {
  const elementDate = document.getElementById("dateJournee");

  if (elementDate) {
    const date = new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(new Date());

    elementDate.textContent =
      date.charAt(0).toUpperCase() + date.slice(1);
  }

  const elementVersion = document.getElementById("versionApp");

  if (
    elementVersion &&
    typeof CONFIG !== "undefined" &&
    CONFIG.VERSION
  ) {
    elementVersion.textContent = CONFIG.VERSION;
  }
}

function initialiserChoix() {
  document
    .querySelectorAll(".choix, .case-tache")
    .forEach(function (bouton) {
      bouton.setAttribute("aria-pressed", "false");

      bouton.addEventListener("click", function () {
        traiterChoix(bouton);
      });
    });
}

function traiterChoix(bouton) {
  const groupe = bouton.dataset.groupe;
  const estUnique = bouton.classList.contains("unique");
  const estExclusif = bouton.dataset.exclusif === "true";

  if (!groupe) {
    return;
  }

  if (estUnique) {
    boutonsDuGroupe(groupe).forEach(deselectionner);
    selectionner(bouton);
  } else if (estExclusif) {
    const activer = !bouton.classList.contains("selectionne");

    boutonsDuGroupe(groupe).forEach(deselectionner);

    if (activer) {
      selectionner(bouton);
    }
  } else {
    boutonsDuGroupe(groupe)
      .filter(function (element) {
        return element.dataset.exclusif === "true";
      })
      .forEach(deselectionner);

    if (bouton.classList.contains("selectionne")) {
      deselectionner(bouton);
    } else {
      selectionner(bouton);
    }
  }

  if (groupe === "REP_COURSES") {
    actualiserMontantCourses();
  }
}

function boutonsDuGroupe(groupe) {
  return Array.from(
    document.querySelectorAll(
      '[data-groupe="' + groupe + '"]'
    )
  );
}

function selectionner(element) {
  element.classList.add("selectionne");
  element.setAttribute("aria-pressed", "true");
}

function deselectionner(element) {
  element.classList.remove("selectionne");
  element.setAttribute("aria-pressed", "false");
}

function initialiserCurseurs() {
  connecterCurseur("energiePY", "valeurEnergie");
  connecterCurseur("moralPY", "valeurMoral");
}

function connecterCurseur(idCurseur, idValeur) {
  const curseur = document.getElementById(idCurseur);
  const valeur = document.getElementById(idValeur);

  if (!curseur || !valeur) {
    return;
  }

  valeur.textContent = curseur.value;

  curseur.addEventListener("input", function () {
    valeur.textContent = curseur.value;
  });
}

function initialiserCourses() {
  actualiserMontantCourses();
}

function actualiserMontantCourses() {
  const zone = document.getElementById("zoneMontantCourses");
  const montant = document.getElementById("montantCourses");

  if (!zone || !montant) {
    return;
  }

  const courses = valeurUnique("REP_COURSES");
  const visible = courses === "OUI";

  zone.hidden = !visible;
  montant.required = visible;

  if (!visible) {
    montant.value = "";
  }
}

async function soumettre(evenement) {
  evenement.preventDefault();

  const bouton = document.getElementById("boutonValider");
  const message = document.getElementById("messageEtat");

  if (!bouton || !message) {
    console.error("Zone de validation introuvable.");
    return;
  }

  try {
    verifierConfiguration();

    const payload = construirePayload();

    validerPayload(payload);

    definirEtat(
      true,
      "Envoi en cours…",
      "information"
    );

  const requeteApi = {
  action: "CREER_SESSION",

  donnees: {
    payload: {
      applicationId: "APP_CARNET_CARDOT",
      versionReferentiel: "V1.0.0",
      buildReferentiel: "0001",
      environnement: "TEST",
      dateSaisie: payload.dateSaisie,
      idRequete: payload.idRequete,
      contexte: payload.contexte,
      reponses: payload.reponses
    }
  },

  options: {
    auteur: "PIERRE_YVES"
  },

  idRequeteApi: genererIdRequeteApi()
};

    console.log(
      "Requête envoyée au Framework :",
      JSON.stringify(requeteApi, null, 2)
    );

    const reponse = await fetch(CONFIG.API_URL, {
      method: "POST",
      redirect: "follow",

      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },

      body: JSON.stringify(requeteApi)
    });

    const texte = await reponse.text();

    console.log("Réponse brute du serveur :", texte);

    let resultat;

    try {
      resultat = JSON.parse(texte);
    } catch (erreurJson) {
      throw new Error(
        "La réponse du serveur n’est pas exploitable."
      );
    }

    if (
      !reponse.ok ||
      !resultat ||
      resultat.ok !== true
    ) {
      console.error(
        "Réponse complète du serveur :",
        resultat
      );

      const erreurs =
        resultat.erreurs ||
        resultat.resultat?.erreurs ||
        resultat.donnees?.erreurs ||
        resultat.details?.erreurs ||
        [];

      const detailErreurs = Array.isArray(erreurs)
        ? erreurs
            .map(function (erreur) {
              if (typeof erreur === "string") {
                return erreur;
              }

              return [
                erreur.code,
                erreur.chemin || erreur.champ,
                erreur.message
              ]
                .filter(Boolean)
                .join(" — ");
            })
            .filter(Boolean)
            .join(" | ")
        : "";

      throw new Error(
        detailErreurs ||
        resultat.message ||
        resultat.resultat?.message ||
        resultat.code ||
        "VALIDATION_ECHOUEE"
      );
    }

    definirEtat(
      false,
      "Journée enregistrée avec succès.",
      "succes"
    );
  } catch (erreur) {
    console.error(erreur);

    definirEtat(
      false,
      "Envoi impossible : " + erreur.message,
      "erreur"
    );
  }

  function definirEtat(enCours, texte, type) {
    bouton.disabled = enCours;

    bouton.textContent = enCours
      ? "Envoi en cours…"
      : "Valider la journée";

    message.textContent = texte;
    message.dataset.type = type;
  }
}

function construirePayload() {
  const remarque = construireRemarqueComplete();

 DEM_DEMARRAGE: valeurUnique("DEM_DEMARRAGE"),
  
  const elementEnergie =
    document.getElementById("energiePY");

  const elementMoral =
    document.getElementById("moralPY");


  const reponses = {
    THE_MORAL: valeurUnique("THE_MORAL"),
    THE_SANTE: valeurUnique("THE_SANTE"),
    THE_MOBILITE: valeurUnique("THE_MOBILITE"),

    REP_DEJEUNER: valeurUnique("REP_DEJEUNER"),
    REP_DINER: valeurUnique("REP_DINER"),
    REP_COURSES: valeurUnique("REP_COURSES"),

    MEN_ACTIVITES: valeursMultiples("MEN_ACTIVITES"),
    LIN_ACTIVITES: valeursMultiples("LIN_ACTIVITES"),
    EXT_ACTIVITES: valeursMultiples("EXT_ACTIVITES"),
    AUT_ACTIVITES: valeursMultiples("AUT_ACTIVITES"),

    PY_ENERGIE: elementEnergie
      ? Number(elementEnergie.value)
      : 0,

    PY_MORAL: elementMoral
      ? Number(elementMoral.value)
      : 0,

    PY_JOURNEE: valeurUnique("PY_JOURNEE"),

    SUI_PROBLEME: valeurUnique("SUI_PROBLEME"),
    SUI_BESOIN: valeurUnique("SUI_BESOIN"),
    SUI_REMARQUE: remarque,

  
    )
  };
   if (reponses.REP_COURSES === "OUI") {
    const elementMontant =
      document.getElementById("montantCourses");

    reponses.REP_MONTANT_COURSES = Number(
      String(
        elementMontant
          ? elementMontant.value
          : ""
      ).replace(",", ".")
    );
  }

  return {
    idRequete: genererIdRequete(),
    dateSaisie: dateLocaleIso(),
    reponses: reponses,

    contexte: {
      origine: "GITHUB_PAGES",
      interface: "CARNET_CARDOT_V1",
      modeTest: Boolean(CONFIG.MODE_TEST)
    }
  };
}

function construireRemarqueComplete() {
  const lignes = [];

  const appetit =
    valeurUnique("OBS_APPETIT");

  const sommeil =
    valeurUnique("OBS_SOMMEIL");

  const elementRemarque =
    document.getElementById("remarque");

  const remarque = elementRemarque
    ? elementRemarque.value.trim()
    : "";

  if (appetit) {
    lignes.push(
      "Appétit de Thérèse : " + appetit
    );
  }

  if (sommeil) {
    lignes.push(
      "Sommeil de Thérèse : " + sommeil
    );
  }

  if (remarque) {
    lignes.push(remarque);
  }

  return lignes.join(" — ");
}

function validerPayload(payload) {
  if (
    !payload ||
    typeof payload !== "object" ||
    Array.isArray(payload)
  ) {
    throw new Error(
      "Le contenu de la journée est invalide."
    );
  }

  const reponses = payload.reponses;

  if (
    !reponses ||
    typeof reponses !== "object" ||
    Array.isArray(reponses)
  ) {
    throw new Error(
      "Les réponses de la journée sont invalides."
    );
  }

  const obligatoires = [
 [
  "DEM_DEMARRAGE",
  "Sélectionne l'heure de début de journée."
],  

[
      "THE_MORAL",
      "Sélectionne le moral de Thérèse."
    ],
    [
      "THE_SANTE",
      "Sélectionne la santé de Thérèse."
    ],
    [
      "THE_MOBILITE",
      "Sélectionne la mobilité de Thérèse."
    ],
    [
      "REP_DEJEUNER",
      "Sélectionne le déjeuner."
    ],
    [
      "REP_DINER",
      "Sélectionne le dîner."
    ],
    [
      "REP_COURSES",
      "Indique si des courses ont été effectuées."
    ],
    [
      "MEN_ACTIVITES",
      "Renseigne le ménage, même si aucun ménage n’a été fait."
    ],
    [
      "LIN_ACTIVITES",
      "Renseigne le linge, même si aucune activité n’a été faite."
    ],
    [
      "EXT_ACTIVITES",
      "Renseigne l’extérieur, même si aucun entretien n’a été fait."
    ],
    [
      "AUT_ACTIVITES",
      "Renseigne les autres activités, même si aucune n’a été faite."
    ],
    [
      "PY_JOURNEE",
      "Indique comment s’est passée ta journée."
    ],
    [
      "SUI_PROBLEME",
      "Indique s’il y a un problème."
    ],
    [
      "SUI_BESOIN",
      "Indique s’il y a un besoin."
    ]
  ];

  for (const obligatoire of obligatoires) {
    const id = obligatoire[0];
    const texte = obligatoire[1];
    const valeur = reponses[id];

    if (
      Array.isArray(valeur)
        ? valeur.length === 0
        : valeur === "" ||
          valeur === null ||
          typeof valeur === "undefined"
    ) {
      throw new Error(texte);
    }
  }

  if (reponses.REP_COURSES === "OUI") {
    if (
      !Number.isFinite(
        reponses.REP_MONTANT_COURSES
      ) ||
      reponses.REP_MONTANT_COURSES < 0
    ) {
      throw new Error(
        "Indique le montant des courses."
      );
    }
  }

  if (reponses.CLO_VALIDEE !== true) {
    throw new Error(
      "Confirme que la journée est terminée."
    );
  }
}

function valeurUnique(groupe) {
  const element = document.querySelector(
    '[data-groupe="' +
      groupe +
      '"].selectionne'
  );

  return element
    ? element.dataset.valeur || ""
    : "";
}

function valeursMultiples(groupe) {
  return Array.from(
    document.querySelectorAll(
      '[data-groupe="' +
        groupe +
        '"].selectionne'
    )
  ).map(function (element) {
    return element.dataset.valeur;
  });
}

function verifierConfiguration() {
  if (typeof CONFIG === "undefined") {
    throw new Error(
      "Le fichier config.js n’est pas chargé."
    );
  }

  if (
    !CONFIG.API_URL ||
    typeof CONFIG.API_URL !== "string" ||
    !CONFIG.API_URL.startsWith("https://")
  ) {
    throw new Error(
      "L’adresse de l’API est absente ou incorrecte."
    );
  }
}

function dateLocaleIso() {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

function genererIdRequeteApi() {
  const horodatage = new Date()
    .toISOString()
    .replace(/\D/g, "")
    .slice(0, 14);

  const aleatoire = Math.random()
    .toString(16)
    .slice(2, 10)
    .toUpperCase()
    .padEnd(8, "0");

  return (
    "API-CARNET-" +
    horodatage +
    "-" +
    aleatoire
  );
}

function genererIdRequete() {
  const horodatage = new Date()
    .toISOString()
    .replace(/\D/g, "")
    .slice(0, 14);

  const aleatoire = Math.random()
    .toString(16)
    .slice(2, 10)
    .toUpperCase()
    .padEnd(8, "0");

  return (
    "REQ-CARNET-" +
    horodatage +
    "-" +
    aleatoire
  );
}
