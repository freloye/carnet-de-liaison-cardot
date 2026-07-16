document.addEventListener("DOMContentLoaded", () => {
  afficherDate();
  afficherVersion();
  initialiserChoix();
  initialiserCurseurs();
  initialiserFormulaire();
});

function afficherDate() {
  const date = new Date();
  const texte = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);

  document.getElementById("dateJournee").textContent =
    texte.charAt(0).toUpperCase() + texte.slice(1);
}

function afficherVersion() {
  document.getElementById("versionApp").textContent = CONFIG.VERSION;
}

function initialiserChoix() {
  document.querySelectorAll(".choix").forEach((bouton) => {
    bouton.addEventListener("click", () => {
      const groupe = bouton.dataset.groupe;

      if (bouton.classList.contains("unique")) {
        document
          .querySelectorAll(`.choix[data-groupe="${groupe}"]`)
          .forEach((element) => element.classList.remove("selectionne"));

        bouton.classList.add("selectionne");
        return;
      }

      if (groupe === "activites" && bouton.dataset.valeur === "aucune") {
        document
          .querySelectorAll('.choix[data-groupe="activites"]')
          .forEach((element) => element.classList.remove("selectionne"));

        bouton.classList.add("selectionne");
        return;
      }

      const boutonAucune = document.querySelector(
        '.choix[data-groupe="activites"][data-valeur="aucune"]'
      );

      boutonAucune?.classList.remove("selectionne");
      bouton.classList.toggle("selectionne");
    });
  });
}

function initialiserCurseurs() {
  connecterCurseur("energiePY", "valeurEnergie");
  connecterCurseur("moralPY", "valeurMoral");
}

function connecterCurseur(idCurseur, idValeur) {
  const curseur = document.getElementById(idCurseur);
  const valeur = document.getElementById(idValeur);

  curseur.addEventListener("input", () => {
    valeur.textContent = curseur.value;
  });
}

function initialiserCurseurs() {
  connecterBargraphe("energiePY", "valeurEnergie");
  connecterCurseur("moralPY", "valeurMoral");
}

function connecterBargraphe(idBargraphe, idValeur) {
  const bargraphe = document.getElementById(idBargraphe);
  const valeur = document.getElementById(idValeur);

  bargraphe.querySelectorAll("button").forEach((bouton) => {
    bouton.addEventListener("click", () => {
      bargraphe.querySelectorAll("button").forEach((element) => {
        element.classList.remove("active");
      });

      bouton.classList.add("active");

      const nouvelleValeur = bouton.dataset.value;

      bargraphe.dataset.value = nouvelleValeur;
      valeur.textContent = nouvelleValeur;
    });
  });
}

function connecterCurseur(idCurseur, idValeur) {
  const curseur = document.getElementById(idCurseur);
  const valeur = document.getElementById(idValeur);

  curseur.addEventListener("input", () => {
    valeur.textContent = curseur.value;
  });
}
function construireDonneesJournee() {
  return {
    dateJournee: new Date().toISOString().slice(0, 10),
    activites: valeursSelectionnees("activites"),
    therese: {
      moral: valeurSelectionnee("moralTherese"),
      sante: valeurSelectionnee("santeTherese"),
      mobilite: valeurSelectionnee("mobiliteTherese")
    },
    pierreYves: {
      energie: Number(document.getElementById("energiePY").value),
      moral: Number(document.getElementById("moralPY").value),
      journee: valeurSelectionnee("journeePY")
    },
    remarque: document.getElementById("remarque").value.trim()
  };
}

function valeursSelectionnees(groupe) {
  return Array.from(
    document.querySelectorAll(
      `.choix.selectionne[data-groupe="${groupe}"]`
    )
  ).map((element) => element.dataset.valeur);
}

function valeurSelectionnee(groupe) {
  const element = document.querySelector(
    `.choix.selectionne[data-groupe="${groupe}"]`
  );

  return element ? element.dataset.valeur : "";
}
