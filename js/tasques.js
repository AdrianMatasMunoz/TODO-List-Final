import { Categoria, Tasca } from "./models.js";

document.addEventListener("DOMContentLoaded", (ev) => {
    let categories = localStorage.getItem("categories");
    if(categories === null) return;
    categories = JSON.parse(categories);

    let categoriesSelect = document.getElementById("categoria-tasca");
    
    categories.forEach(v => {
        categoriesSelect.innerHTML += `<option value="${v.nom}" style="background-color: ${v.color}">${v.nom}</option>`;
    });
});

document.addEventListener("submit", (ev) => {
    let tasques = localStorage.getItem("tasques");
    if(tasques !== null)
        tasques = JSON.parse(tasques);
    else
        tasques = [];

    let categories = JSON.parse(localStorage.getItem("categories"));
    let categoria;
    categories.forEach((c) => {
        if(document.getElementById("categoria-tasca").value === c.nom)
            categoria = new Categoria(c.nom, c.color);
    });

    let tasca = new Tasca(
        document.getElementById("titol-tasca").value,
        document.getElementById("descripcio-tasca").value,
        document.getElementById("data-tasca").value,
        categoria,
        document.getElementById("prioritat-tasca").value
    );
    tasques.push(tasca.toJSON());
    localStorage.setItem("tasques", JSON.stringify(tasques));
});