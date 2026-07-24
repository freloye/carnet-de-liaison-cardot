/*****************************************************************
 Projet : Carnet de liaison Cardot
 Fichier : app.js
 Version : V1.0 TEST
 Build : 0018
*****************************************************************/

"use strict";

document.addEventListener("DOMContentLoaded", initialiser);

function initialiser() {
  afficherEntete();
  initialiserChoix();
  initialiserCurseurs();
  initialiserCourses();
  initialiserApplicationInstallable();
  initialiserNavigation();
  initialiserSyntheseHebdomadaire();

  const formulaire = document.getElementById("formulaireJournee");

  if (!formulaire) {
    console.error("Formulaire introuvable : formulaireJournee");
    return;
  }

  formulaire.addEventListener("submit", soumettre);
}

function initialiserApplicationInstallable() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("./service-worker.js?v=0018")
      .catch(function (erreur) {
        console.warn("Service worker non enregistré :", erreur);
      });
  });
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

    enregistrerJourneeLocale(payload);

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

  const elementEnergie =
    document.getElementById("energiePY");

  const elementMoral =
    document.getElementById("moralPY");

  const reponses = {
    DEM_DEMARRAGE: valeurUnique("DEM_DEMARRAGE"),

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
    SUI_REMARQUE: remarque
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


function initialiserNavigation() {
  const boutons = document.querySelectorAll("[data-vue]");
  const formulaire = document.getElementById("formulaireJournee");
  const vueSemaine = document.getElementById("vueSemaine");

  if (!boutons.length || !formulaire || !vueSemaine) {
    return;
  }

  boutons.forEach(function (bouton) {
    bouton.addEventListener("click", function () {
      const afficherSemaine = bouton.dataset.vue === "semaine";

      formulaire.hidden = afficherSemaine;
      vueSemaine.hidden = !afficherSemaine;

      boutons.forEach(function (autreBouton) {
        const estActif = autreBouton === bouton;
        autreBouton.classList.toggle("actif", estActif);
        autreBouton.setAttribute("aria-current", estActif ? "page" : "false");
      });

      if (afficherSemaine) {
        actualiserSyntheseHebdomadaire();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });
}

function initialiserSyntheseHebdomadaire() {
  document.querySelectorAll("[data-detail]").forEach(function (bouton) {
    bouton.addEventListener("click", function () {
      afficherDetailHebdomadaire(bouton.dataset.detail);
    });
  });
}

function enregistrerJourneeLocale(payload) {
  try {
    const cle = "carnetCardotJourneesV1";
    const journal = JSON.parse(localStorage.getItem(cle) || "{}");
    journal[payload.dateSaisie] = {
      dateSaisie: payload.dateSaisie,
      reponses: payload.reponses,
      enregistreeLe: new Date().toISOString()
    };
    localStorage.setItem(cle, JSON.stringify(journal));
  } catch (erreur) {
    console.warn("Sauvegarde locale impossible :", erreur);
  }
}

function lireJourneesLocales() {
  try {
    const journal = JSON.parse(localStorage.getItem("carnetCardotJourneesV1") || "{}");
    return journal && typeof journal === "object" ? journal : {};
  } catch (erreur) {
    console.warn("Lecture locale impossible :", erreur);
    return {};
  }
}

function bornesSemaine(dateReference) {
  const date = new Date(dateReference);
  date.setHours(12, 0, 0, 0);
  const numeroJour = date.getDay() || 7;
  const lundi = new Date(date);
  lundi.setDate(date.getDate() - numeroJour + 1);
  const dimanche = new Date(lundi);
  dimanche.setDate(lundi.getDate() + 6);
  return { lundi: lundi, dimanche: dimanche };
}

function dateIsoLocale(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

function joursSemaineCourante() {
  const bornes = bornesSemaine(new Date());
  return Array.from({ length: 7 }, function (_, index) {
    const date = new Date(bornes.lundi);
    date.setDate(bornes.lundi.getDate() + index);
    return date;
  });
}

function actualiserSyntheseHebdomadaire() {
  afficherPeriodeSemaine();

  const journal = lireJourneesLocales();
  const jours = joursSemaineCourante();
  const journees = jours.map(function (date) {
    return journal[dateIsoLocale(date)] || null;
  });
  const renseignees = journees.filter(Boolean);

  const total = document.getElementById("totalJoursRenseignes");
  if (total) total.textContent = String(renseignees.length);

  const zoneJours = document.getElementById("joursSemaine");
  if (zoneJours) {
    zoneJours.innerHTML = jours.map(function (date, index) {
      const journee = journees[index];
      const libelle = new Intl.DateTimeFormat("fr-FR", { weekday: "short" })
        .format(date).replace(".", "");
      const classe = journee ? "renseigne" : "non-renseigne";
      const titre = journee ? "Journée renseignée" : "Journée non renseignée";
      return '<button type="button" class="jour ' + classe + '" data-date-detail="' +
        dateIsoLocale(date) + '" title="' + titre + '">' + libelle + '</button>';
    }).join("");

    zoneJours.querySelectorAll("[data-date-detail]").forEach(function (bouton) {
      bouton.addEventListener("click", function () {
        afficherDetailJournee(bouton.dataset.dateDetail);
      });
    });
  }

  const repas = compterRepas(renseignees);
  affecterTexte("totalPlatsElabores", repas.elabores);
  affecterTexte("totalRestes", repas.restes);
  affecterTexte("totalBarquettes", repas.barquettes);

  const menage = compterMenage(renseignees);
  affecterTexte("totalActionsMenage", menage.total);
  affecterTexte("menageCuisine", menage.CUISINE || 0);
  affecterTexte("menageSalon", menage.SALON || 0);
  affecterTexte("menageChambre", menage.CHAMBRE || 0);
  affecterTexte("menageAutres", menage.autres || 0);

  const moyennes = calculerMoyennes(renseignees);
  affecterTexte("moyenneEnergie", moyennes.energie);
  affecterTexte("moyenneMoral", moyennes.moral);

  const message = document.getElementById("messageDonneesSemaine");
  if (message) {
    message.textContent = renseignees.length
      ? "Synthèse calculée à partir des journées validées sur cet appareil."
      : "Aucune journée de cette semaine n’a encore été validée sur cet appareil.";
  }
}

function affecterTexte(id, valeur) {
  const element = document.getElementById(id);
  if (element) element.textContent = String(valeur);
}

function compterRepas(journees) {
  const resultat = { elabores: 0, restes: 0, barquettes: 0 };
  journees.forEach(function (journee) {
    [journee.reponses.REP_DEJEUNER, journee.reponses.REP_DINER].forEach(function (valeur) {
      if (!valeur) return;
      if (valeur === "PLAT_MIJOTE" || valeur.includes("ELABORE") || valeur.includes("MOI_MEME")) resultat.elabores += 1;
      else if (valeur.includes("RESTE")) resultat.restes += 1;
      else if (valeur === "PLAT_ACHETE" || valeur.includes("BARQUETTE")) resultat.barquettes += 1;
    });
  });
  return resultat;
}

function compterMenage(journees) {
  const resultat = { total: 0, autres: 0 };
  journees.forEach(function (journee) {
    const actions = Array.isArray(journee.reponses.MEN_ACTIVITES)
      ? journee.reponses.MEN_ACTIVITES.filter(function (action) { return action !== "AUCUN"; })
      : [];
    resultat.total += actions.length;
    actions.forEach(function (action) {
      if (action.includes("CUISINE")) resultat.CUISINE = (resultat.CUISINE || 0) + 1;
      else if (action.includes("SALON")) resultat.SALON = (resultat.SALON || 0) + 1;
      else if (action.includes("CHAMBRE")) resultat.CHAMBRE = (resultat.CHAMBRE || 0) + 1;
      else resultat.autres += 1;
    });
  });
  return resultat;
}

function calculerMoyennes(journees) {
  function moyenne(champ) {
    const valeurs = journees.map(function (journee) {
      return Number(journee.reponses[champ]);
    }).filter(Number.isFinite);
    if (!valeurs.length) return "—";
    return (valeurs.reduce(function (a, b) { return a + b; }, 0) / valeurs.length)
      .toFixed(1).replace(".", ",");
  }
  return { energie: moyenne("PY_ENERGIE"), moral: moyenne("PY_MORAL") };
}

function afficherPeriodeSemaine() {
  const element = document.getElementById("periodeSemaine");
  if (!element) return;
  const bornes = bornesSemaine(new Date());
  const formatCourt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long" });
  element.textContent = "Du " + formatCourt.format(bornes.lundi) + " au " + formatCourt.format(bornes.dimanche);
}

function afficherDetailJournee(dateIso) {
  const journal = lireJourneesLocales();
  const journee = journal[dateIso];
  const panneau = document.getElementById("detailSemaine");
  if (!panneau) return;
  const date = new Date(dateIso + "T12:00:00");
  const titre = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" }).format(date);
  if (!journee) {
    panneau.innerHTML = "<h3>" + titre + "</h3><p>Cette journée n’est pas renseignée.</p>";
  } else {
    const r = journee.reponses;
    panneau.innerHTML = "<h3>" + titre + "</h3>" +
      "<p><strong>Déjeuner :</strong> " + libelleValeur(r.REP_DEJEUNER) + "</p>" +
      "<p><strong>Dîner :</strong> " + libelleValeur(r.REP_DINER) + "</p>" +
      "<p><strong>Ménage :</strong> " + libelleListe(r.MEN_ACTIVITES) + "</p>" +
      "<p><strong>Énergie :</strong> " + r.PY_ENERGIE + "/10 — <strong>Moral :</strong> " + r.PY_MORAL + "/10</p>";
  }
  panneau.hidden = false;
  panneau.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function afficherDetailHebdomadaire(type) {
  const journal = lireJourneesLocales();
  const jours = joursSemaineCourante();
  const lignes = [];
  jours.forEach(function (date) {
    const journee = journal[dateIsoLocale(date)];
    if (!journee) return;
    const nom = new Intl.DateTimeFormat("fr-FR", { weekday: "long" }).format(date);
    if (type === "repas") {
      lignes.push("<p><strong>" + nom + " :</strong> déjeuner " +
        libelleValeur(journee.reponses.REP_DEJEUNER) + ", dîner " +
        libelleValeur(journee.reponses.REP_DINER) + ".</p>");
    } else {
      lignes.push("<p><strong>" + nom + " :</strong> " +
        libelleListe(journee.reponses.MEN_ACTIVITES) + ".</p>");
    }
  });
  const panneau = document.getElementById("detailSemaine");
  if (!panneau) return;
  panneau.innerHTML = "<h3>" + (type === "repas" ? "Repas" : "Ménage") +
    " — détail de la semaine</h3>" + (lignes.join("") || "<p>Aucune donnée disponible.</p>");
  panneau.hidden = false;
  panneau.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function libelleListe(valeurs) {
  if (!Array.isArray(valeurs) || !valeurs.length) return "non renseigné";
  return valeurs.map(libelleValeur).join(", ");
}

function libelleValeur(valeur) {
  if (!valeur) return "non renseigné";
  return String(valeur)
    .replace(/^[A-Z]{3}_/, "")
    .replace(/_/g, " ")
    .toLowerCase();
}
