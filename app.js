/*****************************************************************
 Projet : Carnet de liaison Cardot
 Fichier : app.js
 Version : V1.0 TEST
 Build : 0007
*****************************************************************/
"use strict";

document.addEventListener("DOMContentLoaded", initialiser);

function initialiser() {
  afficherEntete();
  initialiserChoix();
  initialiserCurseurs();
  initialiserCourses();
  document.getElementById("formulaireJournee").addEventListener("submit", soumettre);
}

function afficherEntete() {
  const date = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  }).format(new Date());
  document.getElementById("dateJournee").textContent =
    date.charAt(0).toUpperCase() + date.slice(1);

  if (typeof CONFIG !== "undefined" && CONFIG.VERSION) {
    document.getElementById("versionApp").textContent = CONFIG.VERSION;
  }
}

function initialiserChoix() {
  document.querySelectorAll(".choix, .case-tache").forEach((bouton) => {
    bouton.setAttribute("aria-pressed", "false");
    bouton.addEventListener("click", () => traiterChoix(bouton));
  });
}

function traiterChoix(bouton) {
  const groupe = bouton.dataset.groupe;
  const estUnique = bouton.classList.contains("unique");
  const estExclusif = bouton.dataset.exclusif === "true";

  if (estUnique) {
    boutonsDuGroupe(groupe).forEach(deselectionner);
    selectionner(bouton);
  } else if (estExclusif) {
    const activer = !bouton.classList.contains("selectionne");
    boutonsDuGroupe(groupe).forEach(deselectionner);
    if (activer) selectionner(bouton);
  } else {
    boutonsDuGroupe(groupe)
      .filter((element) => element.dataset.exclusif === "true")
      .forEach(deselectionner);
    bouton.classList.contains("selectionne") ? deselectionner(bouton) : selectionner(bouton);
  }

  if (groupe === "REP_COURSES") actualiserMontantCourses();
}

function boutonsDuGroupe(groupe) {
  return Array.from(document.querySelectorAll(`[data-groupe="${groupe}"]`));
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
  valeur.textContent = curseur.value;
  curseur.addEventListener("input", () => { valeur.textContent = curseur.value; });
}

function initialiserCourses() {
  actualiserMontantCourses();
}

function actualiserMontantCourses() {
  const courses = valeurUnique("REP_COURSES");
  const zone = document.getElementById("zoneMontantCourses");
  const montant = document.getElementById("montantCourses");
  const visible = courses === "OUI";
  zone.hidden = !visible;
  montant.required = visible;
  if (!visible) montant.value = "";
}

async function soumettre(evenement) {
  evenement.preventDefault();

  const bouton = document.getElementById("boutonValider");
  const message = document.getElementById("messageEtat");

  try {
    verifierConfiguration();
    const payload = construirePayload();
    validerPayload(payload);

    definirEtat(true, "Envoi en cours…", "information");

    const reponse = await fetch(CONFIG.API_URL, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
     body: JSON.stringify({
  action: "CREER_SESSION",

  donnees: {
    payload: payload
  },

  options: {
    auteur: "PIERRE_YVES"
  },

  idRequeteApi: genererIdRequeteApi()
})
    });

    const texte = await reponse.text();
    let resultat;
    try {
      resultat = JSON.parse(texte);
    } catch {
      throw new Error("La réponse du serveur n’est pas exploitable.");
    }

   if (!reponse.ok || !resultat || resultat.ok !== true) {
  console.error("Réponse complète du serveur :", resultat);

  const erreurs =
    resultat?.erreurs ||
    resultat?.resultat?.erreurs ||
    resultat?.donnees?.erreurs ||
    resultat?.details?.erreurs ||
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
    resultat?.message ||
    resultat?.resultat?.message ||
    resultat?.code ||
    "VALIDATION_ECHOUEE"
  );
}

    definirEtat(false, "Journée enregistrée avec succès.", "succes");
  } catch (erreur) {
    console.error(erreur);
    definirEtat(false, `Envoi impossible : ${erreur.message}`, "erreur");
  }

  function definirEtat(enCours, texte, type) {
    bouton.disabled = enCours;
    bouton.textContent = enCours ? "Envoi en cours…" : "Valider la journée";
    message.textContent = texte;
    message.dataset.type = type;
  }
}

function construirePayload() {
  const remarque = construireRemarqueComplete();

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

    PY_ENERGIE: Number(document.getElementById("energiePY").value),
    PY_MORAL: Number(document.getElementById("moralPY").value),
    PY_JOURNEE: valeurUnique("PY_JOURNEE"),

    SUI_PROBLEME: valeurUnique("SUI_PROBLEME"),
    SUI_BESOIN: valeurUnique("SUI_BESOIN"),
    SUI_REMARQUE: remarque,

    CLO_VALIDEE: document.getElementById("clotureValidee").checked
  };

  if (reponses.REP_COURSES === "OUI") {
    reponses.REP_MONTANT_COURSES = Number(
      String(document.getElementById("montantCourses").value).replace(",", ".")
    );
  }

  return {
    action: "CREER_SESSION",
    applicationId: "APP_CARNET_CARDOT",
    dateSaisie: dateLocaleIso(),
    reponses,
    contexte: {
      origine: "GITHUB_PAGES",
      interface: "CARNET_CARDOT_V1",
      modeTest: Boolean(CONFIG.MODE_TEST),
      url: window.location.href
    },
    auteur: "PIERRE_YVES",
    idRequete: genererIdRequete()
  };
}

function construireRemarqueComplete() {
  const lignes = [];
  const appetit = valeurUnique("OBS_APPETIT");
  const sommeil = valeurUnique("OBS_SOMMEIL");
  const remarque = document.getElementById("remarque").value.trim();

  if (appetit) lignes.push(`Appétit de Thérèse : ${appetit}`);
  if (sommeil) lignes.push(`Sommeil de Thérèse : ${sommeil}`);
  if (remarque) lignes.push(remarque);

  return lignes.join(" — ");
}

function validerPayload(payload) {
  const r = payload.reponses;
  const obligatoires = [
    ["THE_MORAL", "Sélectionne le moral de Thérèse."],
    ["THE_SANTE", "Sélectionne la santé de Thérèse."],
    ["THE_MOBILITE", "Sélectionne la mobilité de Thérèse."],
    ["REP_DEJEUNER", "Sélectionne le déjeuner."],
    ["REP_DINER", "Sélectionne le dîner."],
    ["REP_COURSES", "Indique si des courses ont été effectuées."],
    ["MEN_ACTIVITES", "Renseigne le ménage, même si aucun ménage n’a été fait."],
    ["LIN_ACTIVITES", "Renseigne le linge, même si aucune activité n’a été faite."],
    ["EXT_ACTIVITES", "Renseigne l’extérieur, même si aucun entretien n’a été fait."],
    ["AUT_ACTIVITES", "Renseigne les autres activités, même si aucune n’a été faite."],
    ["PY_JOURNEE", "Indique comment s’est passée ta journée."],
    ["SUI_PROBLEME", "Indique s’il y a un problème."],
    ["SUI_BESOIN", "Indique s’il y a un besoin."]
  ];

  for (const [id, texte] of obligatoires) {
    if (Array.isArray(r[id]) ? r[id].length === 0 : !r[id]) {
      throw new Error(texte);
    }
  }

  if (r.REP_COURSES === "OUI") {
    if (!Number.isFinite(r.REP_MONTANT_COURSES) || r.REP_MONTANT_COURSES < 0) {
      throw new Error("Indique le montant des courses.");
    }
  }

  if (r.CLO_VALIDEE !== true) {
    throw new Error("Confirme que la journée est terminée.");
  }
}

function valeurUnique(groupe) {
  return document.querySelector(`[data-groupe="${groupe}"].selectionne`)?.dataset.valeur || "";
}

function valeursMultiples(groupe) {
  return Array.from(
    document.querySelectorAll(`[data-groupe="${groupe}"].selectionne`)
  ).map((element) => element.dataset.valeur);
}

function verifierConfiguration() {
  if (typeof CONFIG === "undefined") {
    throw new Error("Le fichier config.js n’est pas chargé.");
  }
  if (!CONFIG.API_URL || !CONFIG.API_URL.startsWith("https://")) {
    throw new Error("L’adresse de l’API est absente ou incorrecte.");
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

function genererIdRequete() {
  const horodatage = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
  const aleatoire = Math.random().toString(16).slice(2, 10).toUpperCase().padEnd(8, "0");
  return `REQ-CARNET-${horodatage}-${aleatoire}`;
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
