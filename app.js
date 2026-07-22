/*****************************************************************
 Projet : Carnet de liaison Cardot
 Fichier : app.js
 Version : V0.9 TEST
 Build : 0006
 Environnement : TEST
*****************************************************************/

"use strict";

document.addEventListener("DOMContentLoaded", initialiserApplication);

function initialiserApplication() {
  afficherVersionEtDate();
  initialiserChoixMultiples();
  initialiserChoixUniques();
  initialiserEnergie();
  initialiserMoral();
  initialiserEnvoi();
}

function afficherVersionEtDate() {
  const version = document.getElementById("versionApp");
  const dateJournee = document.getElementById("dateJournee");

  if (version && typeof CONFIG !== "undefined" && CONFIG.VERSION) {
    version.textContent = CONFIG.VERSION;
  }

  if (dateJournee) {
    dateJournee.textContent = new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(new Date());
  }
}

function initialiserChoixMultiples() {
  document.querySelectorAll(".choix.multiple").forEach(function (bouton) {
    bouton.setAttribute("aria-pressed", "false");

    bouton.addEventListener("click", function () {
      const valeur = bouton.dataset.valeur;

      if (valeur === "aucune") {
        const selectionner =
          !bouton.classList.contains("selectionne");

        document
          .querySelectorAll('.choix.multiple[data-groupe="activites"]')
          .forEach(function (autreBouton) {
            autreBouton.classList.remove("selectionne");
            autreBouton.setAttribute("aria-pressed", "false");
          });

        if (selectionner) {
          bouton.classList.add("selectionne");
          bouton.setAttribute("aria-pressed", "true");
        }

        return;
      }

      const boutonAucune = document.querySelector(
        '.choix.multiple[data-valeur="aucune"]'
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

function initialiserChoixUniques() {
  document.querySelectorAll(".choix.unique").forEach(function (bouton) {
    bouton.setAttribute("aria-pressed", "false");

    bouton.addEventListener("click", function () {
      const groupe = bouton.dataset.groupe;

      document
        .querySelectorAll(
          '.choix.unique[data-groupe="' + groupe + '"]'
        )
        .forEach(function (autreBouton) {
          autreBouton.classList.remove("selectionne");
          autreBouton.setAttribute("aria-pressed", "false");
        });

      bouton.classList.add("selectionne");
      bouton.setAttribute("aria-pressed", "true");
    });
  });
}

function initialiserEnergie() {
  const bargraph = document.getElementById("energiePY");
  const affichage = document.getElementById("valeurEnergie");

  if (!bargraph || !affichage) {
    return;
  }

  bargraph.querySelectorAll("button").forEach(function (bouton) {
    bouton.setAttribute(
      "aria-pressed",
      bouton.classList.contains("active") ? "true" : "false"
    );

    bouton.addEventListener("click", function () {
      const valeur = bouton.dataset.value;

      bargraph.dataset.value = valeur;
      affichage.textContent = valeur;

      bargraph.querySelectorAll("button").forEach(function (autreBouton) {
        autreBouton.classList.remove("active");
        autreBouton.setAttribute("aria-pressed", "false");
      });

      bouton.classList.add("active");
      bouton.setAttribute("aria-pressed", "true");
    });
  });
}

function initialiserMoral() {
  const curseur = document.getElementById("moralPY");
  const affichage = document.getElementById("valeurMoral");

  if (!curseur || !affichage) {
    return;
  }

  affichage.textContent = curseur.value;

  curseur.addEventListener("input", function () {
    affichage.textContent = curseur.value;
  });
}

function initialiserEnvoi() {
  const formulaire = document.getElementById("formulaireJournee");

  if (formulaire) {
    formulaire.addEventListener("submit", envoyerJournee);
  }
}

async function envoyerJournee(evenement) {
  evenement.preventDefault();

  const bouton = document.getElementById("boutonValider");
  const message = document.getElementById("messageEtat");

  try {
    verifierConfiguration();

    const payload = construirePayload();

    afficherEtat(
      bouton,
      message,
      true,
      "Envoi en cours…",
      "information"
    );

    const reponse = await fetch(CONFIG.API_URL, {
      method: "POST",
      redirect: "follow",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    const texte = await reponse.text();

    let resultat;

    try {
      resultat = JSON.parse(texte);
    } catch (erreur) {
      throw new Error(
        "La réponse du serveur n’est pas exploitable."
      );
    }

    if (!reponse.ok || !resultat || resultat.ok !== true) {
      throw new Error(
        resultat && (resultat.message || resultat.code)
          ? resultat.message || resultat.code
          : "Erreur HTTP " + reponse.status
      );
    }

    const identifiant =
      resultat.idSession ||
      (
        resultat.creation &&
        resultat.creation.idSession
      ) ||
      "";

    afficherEtat(
      bouton,
      message,
      false,
      identifiant
        ? "Journée enregistrée. Référence : " + identifiant
        : "Journée enregistrée avec succès.",
      "succes"
    );
  } catch (erreur) {
    console.error("Échec de l’envoi :", erreur);

    afficherEtat(
      bouton,
      message,
      false,
      "Envoi impossible : " + erreur.message,
      "erreur"
    );
  }
}

function construirePayload() {
  const activites = valeursSelectionnees("activites");

  const moralTherese = valeurUnique("moralTherese");
  const santeTherese = valeurUnique("santeTherese");
  const mobiliteTherese = valeurUnique("mobiliteTherese");
  const journeePY = valeurUnique("journeePY");

  if (!moralTherese) {
    throw new Error("Sélectionne le moral de Thérèse.");
  }

  if (!santeTherese) {
    throw new Error(
      "Sélectionne l’état de santé de Thérèse."
    );
  }

  if (!mobiliteTherese) {
    throw new Error(
      "Sélectionne la mobilité de Thérèse."
    );
  }

  if (!journeePY) {
    throw new Error(
      "Indique comment s’est passée ta journée."
    );
  }

  const reponses = {
    "REP-004": activites.includes("courses")
      ? "OUI"
      : "NON",

    "REP-005": activites.includes("courses_rangees")
      ? "OUI"
      : "NON",

    "REP-006": determinerTypeRepas(activites),

    "MEN-001": menageRealise(activites)
      ? "OUI"
      : "NON",

    "EXT-001": activites.includes("entretien_exterieur")
      ? "OUI"
      : "NON",

    "THE-001": convertirTendance(moralTherese),
    "THE-002": convertirTendance(santeTherese),
    "THE-003": convertirTendance(mobiliteTherese),

    "PY-001": Number(
      document.getElementById("energiePY").dataset.value
    ),

    "PY-002": Number(
      document.getElementById("moralPY").value
    ),

    "PY-003": convertirJournee(journeePY),

    "SUI-001": "NON",
    "SUI-003": "NON",
    "SUI-005": construireRemarque(activites),

    "CLO-001": true
  };

  const zonesMenage = construireZonesMenage(activites);

  if (zonesMenage.length > 0) {
    reponses["MEN-002"] = zonesMenage;
  }

  if (activites.includes("entretien_exterieur")) {
    reponses["EXT-002"] = ["PETIT_ENTRETIEN"];
  }

  return {
    action: "CREER_SESSION",
    applicationId: "APP_CARNET_CARDOT",
    dateSaisie: dateLocaleIso(),
    auteur: "PIERRE_YVES",
    idRequete: genererIdRequete(),

    contexte: {
      origine: "GITHUB_PAGES",
      interface: "CARNET_CARDOT",
      environnement: CONFIG.MODE_TEST ? "TEST" : "PROD"
    },

    reponses: reponses
  };
}

function determinerTypeRepas(activites) {
  if (activites.includes("repas_mijote")) {
    return "CUISINE";
  }

  if (activites.includes("repas_rechauffe")) {
    return "RESTE";
  }

  if (activites.includes("repas_achete")) {
    return "BARQUETTE";
  }

  return "AUCUN";
}

function menageRealise(activites) {
  return activites.some(function (activite) {
    return (
      activite.startsWith("menage_") ||
      activite.startsWith("linge_")
    );
  });
}

function construireZonesMenage(activites) {
  const correspondances = {
    menage_cuisine: "CUISINE",
    menage_salle_de_bain: "SALLE_DE_BAIN",
    menage_wc: "WC",
    menage_salon: "SALON",
    menage_couloir: "COULOIR",
    menage_chambre: "CHAMBRE"
  };

  const zones = [];

  activites.forEach(function (activite) {
    const zone = correspondances[activite];

    if (zone && !zones.includes(zone)) {
      zones.push(zone);
    }
  });

  return zones;
}

function construireRemarque(activites) {
  const remarque = document
    .getElementById("remarque")
    .value
    .trim();

  const complements = [];

  if (
    activites.includes(
      "demarches_administratives_medicales"
    )
  ) {
    complements.push(
      "Démarches administratives ou médicales"
    );
  }

  if (activites.includes("gestion_courrier")) {
    complements.push("Gestion du courrier");
  }

  if (activites.includes("autre")) {
    complements.push("Autre activité");
  }

  return [remarque].concat(complements)
    .filter(Boolean)
    .join(" — ");
}

function valeursSelectionnees(groupe) {
  return Array.from(
    document.querySelectorAll(
      '.choix.selectionne[data-groupe="' +
      groupe +
      '"]'
    )
  ).map(function (bouton) {
    return bouton.dataset.valeur;
  });
}

function valeurUnique(groupe) {
  const bouton = document.querySelector(
    '.choix.selectionne[data-groupe="' +
    groupe +
    '"]'
  );

  return bouton ? bouton.dataset.valeur : "";
}

function convertirTendance(valeur) {
  const correspondances = {
    moins_bien: "MOINS_BIEN",
    comme_habitude: "HABITUEL",
    mieux: "MIEUX"
  };

  return correspondances[valeur] || "";
}

function convertirJournee(valeur) {
  const correspondances = {
    difficile: "DIFFICILE",
    normalement: "MOYEN",
    bien: "BIEN"
  };

  return correspondances[valeur] || "";
}

function verifierConfiguration() {
  if (typeof CONFIG === "undefined") {
    throw new Error(
      "Le fichier config.js n’est pas chargé."
    );
  }

  if (
    !CONFIG.API_URL ||
    !CONFIG.API_URL.startsWith("https://")
  ) {
    throw new Error(
      "L’adresse de l’API est absente ou incorrecte."
    );
  }
}

function afficherEtat(
  bouton,
  message,
  enCours,
  texte,
  type
) {
  if (bouton) {
    bouton.disabled = enCours;

    bouton.textContent = enCours
      ? "Envoi en cours…"
      : "Valider la journée";
  }

  if (message) {
    message.textContent = texte;
    message.dataset.type = type;
  }
}

function dateLocaleIso() {
  const date = new Date();

  const annee = date.getFullYear();

  const mois = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const jour = String(
    date.getDate()
  ).padStart(2, "0");

  return annee + "-" + mois + "-" + jour;
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
