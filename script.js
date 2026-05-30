const colors = ["green", "red", "blue", "yellow", "purple", "pink", "cyan"];

document.querySelectorAll(".color-btn").forEach(btn => {
  let index = 0;

  btn.addEventListener("click", () => {
    index = (index + 1) % colors.length;
    btn.style.background = colors[index];
  });
});

function resizePhysicsCanvas() {
  const wrapper = document.querySelector(".exercise-wrapper");

  if (!wrapper) return;

  const canvasW = 1600;
  const canvasH = 700;

  const availableW = wrapper.clientWidth;
  const availableH = wrapper.clientHeight;

  const scale = Math.min(
    availableW / canvasW,
    availableH / canvasH
  );

  document.documentElement.style.setProperty("--scale", scale);
}

window.addEventListener("resize", resizePhysicsCanvas);
window.addEventListener("load", resizePhysicsCanvas);

// -------------------- DRAG SYSTEM --------------------

const displayNames = {
  resistor: "Weerstand",
  lamp: "Lamp",
  volt: "V",
  ampere: "A",
  batterij: "Batterij"
};

document.addEventListener("DOMContentLoaded", () => {
  initDrag();

  if (document.body.classList.contains("fysica-page")) {
    createCheckButton();
  }

  if (document.body.classList.contains("chemie-page")) {
    createChemistryButton();
  }
});

function initDrag() {
  const components = document.querySelectorAll(".component");

  components.forEach(comp => {
    comp.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", comp.dataset.type);
    });
  });

  const drops = document.querySelectorAll(".drop");

  drops.forEach(drop => {

    drop.addEventListener("dragover", (e) => {
      if (drop.dataset.locked === "true") return;
      e.preventDefault();
    });

    drop.addEventListener("drop", (e) => {
      e.preventDefault();

      if (drop.dataset.locked === "true") return;
      if (drop.dataset.filled === "true") return;

      const type = e.dataTransfer.getData("text/plain");

      const clone = document.createElement("div");
      clone.classList.add("component", "placed");
      clone.textContent = displayNames[type] || type;
      clone.dataset.type = type;

      drop.innerHTML = "";
      drop.appendChild(clone);

      drop.dataset.filled = "true";
      drop.dataset.placedType = type;
    });
  });
}

// -------------------- CHECK SYSTEM --------------------

function createCheckButton() {
  const btn = document.createElement("button");

  btn.innerText = "Controleer";
  btn.classList.add("check-btn");

  document.querySelector(".fysica-page .screen").appendChild(btn);

  btn.addEventListener("click", checkAnswers);
}

function checkAnswers() {
  const drops = document.querySelectorAll(".drop");

  drops.forEach(drop => {

    const expected = drop.dataset.accept;
    const placed = drop.dataset.placedType;

    // EMPTY RULE
    if (expected === "empty") {
      if (placed) {
        drop.innerHTML = "";
        drop.dataset.filled = "false";
        drop.dataset.placedType = "";
        drop.classList.add("wrong");

        setTimeout(() => drop.classList.remove("wrong"), 500);
      } else {
        drop.classList.add("correct");
        drop.dataset.locked = "true";
      }
      return;
    }

    // CORRECT
    if (placed === expected) {
      drop.classList.add("correct");
      drop.dataset.locked = "true";

      const comp = drop.querySelector(".component");
      if (comp) {
        comp.style.background = "#39ff14";
        comp.style.boxShadow = "0 0 15px #39ff14";
      }

    } else {
      drop.classList.add("wrong");

      setTimeout(() => {
        drop.classList.remove("wrong");
        drop.innerHTML = "";
        drop.dataset.filled = "false";
        drop.dataset.placedType = "";
      }, 400);
    }
  });
}

function createChemistryButton() {
  const btn = document.createElement("button");

  btn.innerText = "Verbeter";
  btn.classList.add("check-btn");

  document.querySelector(".chemie-page .screen").appendChild(btn);

  btn.addEventListener("click", checkChemistry);
}

function checkChemistry() {
  const activeCard = document.querySelector(".chemie-page .exercise-card.active");
  if (!activeCard) return;

  const input = activeCard.querySelector("input");
  const correct = activeCard.dataset.answer;

  const value = input.value.trim();

  if (value === correct) {
    activeCard.style.border = "3px solid #39ff14";
    activeCard.style.boxShadow = "0 0 20px #39ff14";

    setTimeout(() => {
      goToNextChemistry(activeCard);
    }, 600);

  } else {
    input.style.border = "2px solid red";

    setTimeout(() => {
      input.style.border = "none";
    }, 500);
  }
}

function goToNextChemistry(currentCard) {
  const cards = Array.from(document.querySelectorAll(".chemie-page .exercise-card"));
  const index = cards.indexOf(currentCard);

  currentCard.classList.remove("active");

  const next = cards[index + 1];
  if (next) {
    next.classList.add("active");
  } else {
    alert("Alle oefeningen voltooid!");
  }
}

document.addEventListener("DOMContentLoaded", () => {

  if (document.querySelector(".biologie-page")) {
    createBiologyButton();
  }

});

function createBiologyButton() {

  const btn = document.createElement("button");

  btn.innerText = "Verbeter";
  btn.classList.add("check-btn");

  document.querySelector(".biologie-page .screen").appendChild(btn);

  btn.addEventListener("click", checkBiology);

}

function checkBiology() {

  const activeCard =
    document.querySelector(".biologie-page .question-card.active");

  if (!activeCard) return;

  const select = activeCard.querySelector("select");

  const correct =
    activeCard.dataset.answer.toLowerCase().trim();

  const answer =
    select.value.toLowerCase().trim();

  if (answer === correct) {

    activeCard.style.border = "3px solid #39ff14";
    activeCard.style.boxShadow = "0 0 20px #39ff14";

    setTimeout(() => {
      goToNextBiology(activeCard);
    }, 500);

  } else {

    select.style.border = "2px solid red";

    setTimeout(() => {
      select.style.border = "";
    }, 500);

  }

}

function goToNextBiology(currentCard) {

  const cards = Array.from(
    document.querySelectorAll(".biologie-page .question-card")
  );

  const index = cards.indexOf(currentCard);

  currentCard.classList.remove("active");

  const next = cards[index + 1];

  if (next) {

    next.classList.add("active");

  } else {

    alert("Biologie voltooid!");

    const code =
      document.getElementById("biology-code");

    if (code) {
      alert("Code: " + code.textContent.trim());
    }

  }

}
