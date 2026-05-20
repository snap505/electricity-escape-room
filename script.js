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
  createCheckButton();
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
