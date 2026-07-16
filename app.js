/*****************************************************************
 Projet : Pierre-Yves — Carnet de liaison numérique
 Fichier : app.js
 Version : MVP 0.9.0
 Build : 0003
 Environnement : TEST

 Rôle :
 - gérer les interactions de l’interface ;
 - construire un payload conforme au référentiel métier ;
 - envoyer directement l’objet reponses à Apps Script.

 Lot :
 - suppression de l’ancien payload activites / therese / pierreYves ;
 - création directe du payload dateJournee / idRequete / reponses ;
 - conservation provisoire de la structure HTML existante.
*****************************************************************/

document.addEventListener("DOMContentLoaded", () => {
  afficherDate();
  afficherVersion();
  initialiserChoix();
  initialiserIndicateurs();
  initialiserFormulaire();
});


/*****************************************************************
 AFFICHAGE
*****************************************************************/

function afficherDate() {
  const date = new Date();

  const texte = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);

  const elementDate = document.getElementById("dateJournee");

  if (elementDate) {
    elementDate.textContent =
      texte.charAt(0).toUpperCase() + texte.slice(1);
  }
}


function afficherVersion() {
  const elementVersion = document.getElementById("versionApp");

  if (elementVersion && typeof CONFIG !== "undefined") {
    elementVersion.textContent = CONFIG.VERSION || "";
  }
}


/*****************************************************************
 CHOIX PAR BOUTONS
*****************************************************************/

function initialiserChoix() {
  document.querySelectorAll(".choix").forEach((bouton) => {
    bouton.addEventListener("click", () => {
      const groupe = bouton.dataset.groupe;

      if (!groupe) {
        return;
      }

      if (bouton.classList.contains("unique")) {
        document
          .querySelectorAll(`.choix[data-groupe="${groupe}"]`)
          .forEach((element) => {
            element.classList.remove("selectionne");
            element.setAttribute("aria-pressed", "false");
          });

        bouton.classList.add("selectionne");
        bouton.setAttribute("aria-pressed", "true");
        return;
      }

      if (
        groupe === "activites" &&
        normaliserValeur(bouton.dataset.valeur) === "AUCUNE"
      ) {
        document
          .querySelectorAll('.choix[data-groupe="activites"]')
          .forEach((element) => {
            element.classList.remove("selectionne");
            element.setAttribute("aria-pressed", "false");
          });

        bouton.classList.add("selectionne");
        bouton.setAttribute("aria-pressed", "true");
        return;
      }

      const boutonAucune = document.querySelector(
        '.choix[data-groupe="activites"][data-valeur="aucune"]'
      );

      if (boutonAucune) {
        boutonAucune.classList.remove("selectionne");
        boutonAucune.setAttribute("aria-pressed", "false");
      }

      bouton.classList.toggle("selectionne");

      bouton.setAttribute(
        "aria-pressed",
        bouton.classList.contains("selectionne")
          ? "true"
          : "false"
      );
    });
  });
}


/*****************************************************************
 INDICATEURS PIERRE-YVES
*****************************************************************/

function initialiserIndicateurs() {
  connecterBargraphe("energiePY", "valeurEnergie");
  connecterCurseur("moralPY", "valeurMoral");
}


function connecterBargraphe(idBargraphe, idValeur) {
  const bargraphe = document.getElementById(idBargraphe);
  const valeurAffichee = document.getElementById(idValeur);

  if (!bargraphe || !valeurAffichee) {
    return;
  }

  bargraphe.querySelectorAll("button").forEach((bouton) => {
    bouton.addEventListener("click", () => {
      bargraphe.querySelectorAll("button").forEach((element) => {
        element.classList.remove("active");
        element.setAttribute("aria-pressed", "false");
      });

      bouton.classList.add("active");
      bouton.setAttribute("aria-pressed", "true");

      const nouvelleValeur = bouton.dataset.value;

      bargraphe.dataset.value = nouvelleValeur;
      valeurAffichee.textContent = nouvelleValeur;
    });
  });

  const boutonActif = bargraphe.querySelector("button.active");

  if (boutonActif) {
    boutonActif.setAttribute("aria-pressed", "true");
    bargraphe.dataset.value = boutonActif.dataset.value;
    valeurAffichee.textContent = boutonActif.dataset.value;
  }
}


function connecterCurseur(idCurseur, idValeur) {
  const curseur = document.getElementById(idCurseur);
  const valeurAffichee = document.getElementById(idValeur);

  if (!curseur || !valeurAffichee) {
    return;
  }

  valeurAffichee.textContent = curseur.value;

  curseur.addEventListener("input", () => {
    valeurAffichee.textContent = curseur.value;
  });
}


/*****************************************************************
 FORMULAIRE
*****************************************************************/

function initialiserFormulaire() {
  const formulaire = document.getElementById("formulaireJournee");
  const boutonValider = document.getElementById("boutonValider");
  const message = document.getElementById("messageEtat");

  if (!formulaire || !boutonValider || !message) {
    console.error(
      "Impossible d’initialiser le formulaire : élément HTML absent."
    );
    return;
  }

  formulaire.addEventListener("submit", async (evenement) => {
    evenement.preventDefault();

    message.textContent = "";

    try {
      const donnees = construireDonneesJournee();

      console.log(
        "Payload métier envoyé :",
        JSON.stringify(donnees, null, 2)
      );

      boutonValider.disabled = true;
      boutonValider.textContent = "Enregistrement…";
      message.textContent = "Envoi de la journée en cours…";

      const resultat = await envoyerJournee(donnees);

      console.log("Réponse du serveur :", resultat);

      if (!resultat || resultat.ok !== true) {
        throw creerErreurServeur(resultat);
      }

      boutonValider.textContent = "Journée enregistrée";
      message.textContent = "La journée a bien été enregistrée.";

      setTimeout(() => {
        boutonValider.disabled = false;
        boutonValider.textContent = "Valider la journée";
      }, 2500);

    } catch (erreur) {
      console.error("Erreur d’enregistrement :", erreur);

      message.textContent =
        erreur.message ||
        "Échec de l’enregistrement. Vérifiez les réponses.";

      boutonValider.disabled = false;
      boutonValider.textContent = "Valider la journée";
    }
  });
}


function creerErreurServeur(resultat) {
  if (!resultat) {
    return new Error("Le serveur n’a renvoyé aucun résultat.");
  }

  if (
    Array.isArray(resultat.erreurs) &&
    resultat.erreurs.length > 0
  ) {
    return new Error(resultat.erreurs.join(" — "));
  }

  if (resultat.message) {
    return new Error(resultat.message);
  }

  if (resultat.code) {
    return new Error(`Erreur du serveur : ${resultat.code}`);
  }

  return new Error(
    "Le serveur n’a pas pu enregistrer la journée."
  );
}


/*****************************************************************
 COMMUNICATION APPS SCRIPT
*****************************************************************/

async function envoyerJournee(donnees) {
  if (
    typeof CONFIG === "undefined" ||
    !CONFIG.API_URL
  ) {
    throw new Error(
      "L’adresse Apps Script n’est pas configurée."
    );
  }

  const reponse = await fetch(CONFIG.API_URL, {
    method: "POST",
    redirect: "follow",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(donnees)
  });

  if (!reponse.ok) {
    throw new Error(`Erreur HTTP ${reponse.status}`);
  }

  const texteReponse = await reponse.text();

  if (!texteReponse) {
    throw new Error(
      "Le serveur a renvoyé une réponse vide."
    );
  }

  try {
    return JSON.parse(texteReponse);
  } catch (erreur) {
    console.error("Réponse non JSON :", texteReponse);

    throw new Error(
      "La réponse du serveur n’est pas exploitable."
    );
  }
}


/*****************************************************************
 CONSTRUCTION DU PAYLOAD MÉTIER
*****************************************************************/

function construireDonneesJournee() {
  const reponses = {};

  ajouterReponsesActivites(reponses);
  ajouterReponsesTherese(reponses);
  ajouterReponsesPierreYves(reponses);
  ajouterReponsesSuivi(reponses);

  reponses["CLO-001"] = true;

  verifierReponsesObligatoires(reponses);

  return {
    dateJournee: obtenirDateLocale(),
    idRequete: genererIdRequete(),
    reponses: reponses
  };
}


/*****************************************************************
 ACTIVITÉS
*****************************************************************/

function ajouterReponsesActivites(reponses) {
  const activites = valeursSelectionnees("activites")
    .map(normaliserValeur);

  const repas = trouverValeurRepas(activites);

  if (repas) {
    reponses["REP-006"] = repas;
  }

  if (contientUneValeur(activites, [
    "MENU",
    "MENU_ELABORE"
  ])) {
    reponses["REP-001"] = "OUI";
  }

  if (contientUneValeur(activites, [
    "REFRIGERATEUR",
    "FRIGO",
    "REFRIGERATEUR_VERIFIE"
  ])) {
    reponses["REP-002"] = "OUI";
  }

  if (contientUneValeur(activites, [
    "LISTE_COURSES",
    "LISTE_DE_COURSES"
  ])) {
    reponses["REP-003"] = "OUI";
  }

  if (contientUneValeur(activites, [
    "COURSES",
    "COURSES_EFFECTUEES"
  ])) {
    reponses["REP-004"] = "OUI";
  }

  if (contientUneValeur(activites, [
    "COURSES_RANGEES",
    "RANGER_COURSES"
  ])) {
    reponses["REP-005"] = "OUI";
  }

  const zonesMenage = construireZonesMenage(activites);

  reponses["MEN-001"] =
    zonesMenage.length > 0 ? "OUI" : "NON";

  if (zonesMenage.length > 0) {
    reponses["MEN-002"] = zonesMenage;
  }

  const activitesExterieures =
    construireActivitesExterieures(activites);

  reponses["EXT-001"] =
    activitesExterieures.length > 0 ? "OUI" : "NON";

  if (activitesExterieures.length > 0) {
    reponses["EXT-002"] = activitesExterieures;
  }

  if (contientUneValeur(activites, [
    "INSTALLATION_REPAS",
    "INSTALLER_THERESE_REPAS"
  ])) {
    reponses["ACC-001"] = "OUI";
  }

  if (contientUneValeur(activites, [
    "INSTALLATION_NUIT",
    "INSTALLER_THERESE_NUIT"
  ])) {
    reponses["ACC-002"] = "OUI";
  }
}


function trouverValeurRepas(activites) {
  const correspondances = {
    CUISINE: "CUISINE",
    REPAS_CUISINE: "CUISINE",
    REPAS_CUISINE: "CUISINE",
    CUISINER: "CUISINE",
    REPAS_PREPARE: "PREPARE",
    PREPARE: "PREPARE",
    PREPARATION_SIMPLE: "PREPARE",
    REPAS_SIMPLE: "PREPARE",
    TOUT_PRET: "TOUT_PRET",
    REPAS_PRET: "TOUT_PRET",
    DEJA_PRET: "TOUT_PRET",
    AUTRE_REPAS: "AUTRE"
  };

  for (const activite of activites) {
    if (correspondances[activite]) {
      return correspondances[activite];
    }
  }

  return "";
}


function construireZonesMenage(activites) {
  const correspondances = {
    MENAGE_CUISINE: "CUISINE",
    CUISINE_MENAGE: "CUISINE",
    MENAGE_SALON: "SALON",
    SALON: "SALON",
    SEJOUR: "SALON",
    MENAGE_CHAMBRE: "CHAMBRE",
    CHAMBRE: "CHAMBRE",
    SALLE_EAU: "SALLE_EAU",
    TOILETTES: "SALLE_EAU",
    SOLS: "SOLS",
    LINGE: "LINGE",
    RANGEMENT: "RANGEMENT",
    AUTRE_MENAGE: "AUTRE"
  };

  return extraireValeursCorrespondantes(
    activites,
    correspondances
  );
}


function construireActivitesExterieures(activites) {
  const correspondances = {
    COUR: "COUR",
    TERRASSE: "COUR",
    JARDIN: "JARDIN",
    POUBELLES: "POUBELLES",
    TRI: "POUBELLES",
    PETIT_ENTRETIEN: "PETIT_ENTRETIEN",
    ENTRETIEN_EXTERIEUR: "PETIT_ENTRETIEN",
    AUTRE_EXTERIEUR: "AUTRE"
  };

  return extraireValeursCorrespondantes(
    activites,
    correspondances
  );
}


/*****************************************************************
 THÉRÈSE
*****************************************************************/

function ajouterReponsesTherese(reponses) {
  reponses["THE-001"] = convertirTendance(
    valeurSelectionnee("moralTherese")
  );

  reponses["THE-002"] = convertirTendance(
    valeurSelectionnee("santeTherese")
  );

  reponses["THE-003"] = convertirTendance(
    valeurSelectionnee("mobiliteTherese")
  );
}


function convertirTendance(valeur) {
  const valeurNormalisee = normaliserValeur(valeur);

  const correspondances = {
    MIEUX: "MIEUX",
    MIEUX_QU_HIER: "MIEUX",
    MEILLEUR: "MIEUX",

    HABITUEL: "HABITUEL",
    NORMAL: "HABITUEL",
    COMME_D_HABITUDE: "HABITUEL",
    COMME_HABITUDE: "HABITUEL",

    MOINS_BIEN: "MOINS_BIEN",
    MOINS_BIEN_QU_HIER: "MOINS_BIEN",
    DIFFICILE: "MOINS_BIEN"
  };

  return correspondances[valeurNormalisee] || "";
}


/*****************************************************************
 PIERRE-YVES
*****************************************************************/

function ajouterReponsesPierreYves(reponses) {
  const energie = obtenirValeurNumerique(
    document.getElementById("energiePY")?.dataset.value
  );

  const moral = obtenirValeurNumerique(
    document.getElementById("moralPY")?.value
  );

  reponses["PY-001"] = energie;
  reponses["PY-002"] = moral;

  reponses["PY-003"] = convertirJourneePierreYves(
    valeurSelectionnee("journeePY")
  );
}


function convertirJourneePierreYves(valeur) {
  const valeurNormalisee = normaliserValeur(valeur);

  const correspondances = {
    BIEN: "BIEN",
    BONNE: "BIEN",

    MOYEN: "MOYEN",
    MOYENNEMENT: "MOYEN",
    MOYENNE: "MOYEN",

    DIFFICILE: "DIFFICILE",
    DIFFICILEMENT: "DIFFICILE",
    MAUVAISE: "DIFFICILE"
  };

  return correspondances[valeurNormalisee] || "";
}


function obtenirValeurNumerique(valeur) {
  const nombre = Number(valeur);

  if (!Number.isFinite(nombre)) {
    return null;
  }

  return nombre;
}


/*****************************************************************
 SUIVI
*****************************************************************/

function ajouterReponsesSuivi(reponses) {
  /*
   * L’interface actuelle ne possède pas encore de questions
   * distinctes concernant les besoins et les problèmes.
   *
   * Ces deux réponses obligatoires sont donc positionnées à NON.
   * Elles seront reliées à des contrôles dédiés lors du prochain lot HTML.
   */

  reponses["SUI-001"] = "NON";
  reponses["SUI-003"] = "NON";

  const remarque = document
    .getElementById("remarque")
    ?.value
    .trim();

  if (remarque) {
    reponses["SUI-005"] = remarque;
  }
}


/*****************************************************************
 VALIDATION LOCALE
*****************************************************************/

function verifierReponsesObligatoires(reponses) {
  const erreurs = [];

  if (!reponses["REP-006"]) {
    erreurs.push(
      "Sélectionnez la situation correspondant au repas du jour."
    );
  }

  if (!["OUI", "NON"].includes(reponses["MEN-001"])) {
    erreurs.push(
      "La réponse concernant le ménage est invalide."
    );
  }

  if (!["OUI", "NON"].includes(reponses["EXT-001"])) {
    erreurs.push(
      "La réponse concernant l’entretien extérieur est invalide."
    );
  }

  ["THE-001", "THE-002", "THE-003"].forEach((idItem) => {
    if (
      !["MIEUX", "HABITUEL", "MOINS_BIEN"]
        .includes(reponses[idItem])
    ) {
      erreurs.push(
        `Une réponse concernant Thérèse est manquante : ${idItem}.`
      );
    }
  });

  if (
    !Number.isInteger(reponses["PY-001"]) ||
    reponses["PY-001"] < 0 ||
    reponses["PY-001"] > 10
  ) {
    erreurs.push(
      "La valeur d’énergie de Pierre-Yves doit être comprise entre 0 et 10."
    );
  }

  if (
    !Number.isInteger(reponses["PY-002"]) ||
    reponses["PY-002"] < 0 ||
    reponses["PY-002"] > 10
  ) {
    erreurs.push(
      "La valeur de moral de Pierre-Yves doit être comprise entre 0 et 10."
    );
  }

  if (
    !["BIEN", "MOYEN", "DIFFICILE"]
      .includes(reponses["PY-003"])
  ) {
    erreurs.push(
      "Sélectionnez comment la journée de Pierre-Yves s’est passée."
    );
  }

  if (reponses["CLO-001"] !== true) {
    erreurs.push(
      "La journée n’est pas clôturée."
    );
  }

  if (erreurs.length > 0) {
    throw new Error(erreurs.join(" "));
  }
}


/*****************************************************************
 OUTILS
*****************************************************************/

function obtenirDateLocale() {
  const date = new Date();

  const annee = date.getFullYear();
  const mois = String(date.getMonth() + 1).padStart(2, "0");
  const jour = String(date.getDate()).padStart(2, "0");

  return `${annee}-${mois}-${jour}`;
}


function genererIdRequete() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return [
    "REQ",
    Date.now(),
    Math.random().toString(16).slice(2)
  ].join("-");
}


function valeursSelectionnees(groupe) {
  return Array.from(
    document.querySelectorAll(
      `.choix.selectionne[data-groupe="${groupe}"]`
    )
  )
    .map((element) => element.dataset.valeur || "")
    .filter((valeur) => valeur !== "");
}


function valeurSelectionnee(groupe) {
  const element = document.querySelector(
    `.choix.selectionne[data-groupe="${groupe}"]`
  );

  return element
    ? element.dataset.valeur || ""
    : "";
}


function normaliserValeur(valeur) {
  return String(valeur || "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "_")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toUpperCase();
}


function contientUneValeur(valeurs, valeursRecherchees) {
  return valeursRecherchees.some((valeur) =>
    valeurs.includes(valeur)
  );
}


function extraireValeursCorrespondantes(
  valeurs,
  correspondances
) {
  const resultat = [];

  valeurs.forEach((valeur) => {
    const valeurMetier = correspondances[valeur];

    if (
      valeurMetier &&
      !resultat.includes(valeurMetier)
    ) {
      resultat.push(valeurMetier);
    }
  });

  return resultat;
}
