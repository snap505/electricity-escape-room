const colors = ["green", "red", "blue","yellow","purple","pink","cyan"];

document.querySelectorAll(".color-btn").forEach(btn => {
    let index = 0;

    btn.addEventListener("click", () => {
    index = (index + 1) % colors.length;
    btn.style.background = colors[index];
    });
});
