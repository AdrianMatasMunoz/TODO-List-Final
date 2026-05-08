import { Categoria, Tasca, Util } from "./models.js";

const ctx = document.getElementById('tasques-chart');

let chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Septembre', 'Octubre', 'Novembre', 'Desembre'],
        datasets: [{
        label: 'Tasques realitzades',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        borderWidth: 1
        }]
    },
    options: {
        scales: {
        y: {
            beginAtZero: true
        }
        }
    }
});

let tasques = [];
let curFileContent = null;

const UNFINISH_BUTTON = `<button class="mark-unfinished"><svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z" fill="#FFFFFF"/></svg></button>`;
const FINISH_BUTTON = `<button class="mark-finished"><svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></button>`;

document.addEventListener("DOMContentLoaded", (ev) => {
    let tasquesJSON = localStorage.getItem("tasques");
    if(tasquesJSON === null) {
        document.getElementById("no-unfinished-tasks").classList.remove("hide");
        document.getElementById("no-finished-tasks").classList.remove("hide");
        return;
    }

    tasques = JSON.parse(tasquesJSON);

    if(Util.countTaskDoneState(tasques, false) === 0)
        document.getElementById("no-unfinished-tasks").classList.remove("hide");
    if(Util.countTaskDoneState(tasques, true) === 0)
        document.getElementById("no-finished-tasks").classList.remove("hide");

    tasques.forEach((v) => {
        document.getElementById(v.feta ? "finished-tasks" : "unfinished-tasks").innerHTML += 
        `<section id="${v.id}" class="menu-app tasca" style="background-color: ${v.prioritat === "Alta" ? "#F24949" : (v.prioritat === "Mitjana" ? "#F2DC49" : "#5CF249")};">
            <p class="mini-txt">Prioritat ${v.prioritat}</p>
            <p><b>${v.feta ? "<del>" : ""}${Util.adaptForHTML(v.titol)}${v.feta ? "</del>" : ""}</b></p>
            <div class="mini-txt categoria-tasca" style="background-color: ${v.categoria.color};">${v.categoria.nom}</div>
            <p class="mini-txt">${v.data}</p>
            <p class="mini-txt separation">${Util.adaptForHTML(v.descripcio)}</p>
            <div class="task-buttons">
                <button class="trash">
                    <svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 456 511.82"><path fill="#FFFFFF" d="M48.42 140.13h361.99c17.36 0 29.82 9.78 28.08 28.17l-30.73 317.1c-1.23 13.36-8.99 26.42-25.3 26.42H76.34c-13.63-.73-23.74-9.75-25.09-24.14L20.79 168.99c-1.74-18.38 9.75-28.86 27.63-28.86zM24.49 38.15h136.47V28.1c0-15.94 10.2-28.1 27.02-28.1h81.28c17.3 0 27.65 11.77 27.65 28.01v10.14h138.66c.57 0 1.11.07 1.68.13 10.23.93 18.15 9.02 18.69 19.22.03.79.06 1.39.06 2.17v42.76c0 5.99-4.73 10.89-10.62 11.19-.54 0-1.09.03-1.63.03H11.22c-5.92 0-10.77-4.6-11.19-10.38 0-.72-.03-1.47-.03-2.23v-39.5c0-10.93 4.21-20.71 16.82-23.02 2.53-.45 5.09-.37 7.67-.37zm83.78 208.38c-.51-10.17 8.21-18.83 19.53-19.31 11.31-.49 20.94 7.4 21.45 17.57l8.7 160.62c.51 10.18-8.22 18.84-19.53 19.32-11.32.48-20.94-7.4-21.46-17.57l-8.69-160.63zm201.7-1.74c.51-10.17 10.14-18.06 21.45-17.57 11.32.48 20.04 9.14 19.53 19.31l-8.66 160.63c-.52 10.17-10.14 18.05-21.46 17.57-11.31-.48-20.04-9.14-19.53-19.32l8.67-160.62zm-102.94.87c0-10.23 9.23-18.53 20.58-18.53 11.34 0 20.58 8.3 20.58 18.53v160.63c0 10.23-9.24 18.53-20.58 18.53-11.35 0-20.58-8.3-20.58-18.53V245.66z"/></svg>
                </button>
                ${v.feta ? UNFINISH_BUTTON : FINISH_BUTTON}
            </div>
        </section>`;

        if(v.feta) {
            chart.data.datasets[0].data[new Date(v.data).getMonth()]++;
        }
    });

    document.querySelectorAll(".trash").forEach((v) => {
        v.addEventListener("click", (ev) => {
            tasques = tasques.filter((tasca) => {
                return tasca.id !== v.parentElement.parentElement.id;
            });

            localStorage.setItem("tasques", JSON.stringify(tasques));
            window.location.reload();
        });
    });

    document.querySelectorAll(".mark-finished").forEach((v) => {
        v.addEventListener("click", (ev) => {
            tasques.forEach((tasca, i) => {
                if(tasca.id === v.parentElement.parentElement.id)
                    tasques[i].feta = true;
            });

            localStorage.setItem("tasques", JSON.stringify(tasques));
            window.location.reload();
        });
    });

    document.querySelectorAll(".mark-unfinished").forEach((v) => {
        v.addEventListener("click", (ev) => {
            tasques.forEach((tasca, i) => {
                if(tasca.id === v.parentElement.parentElement.id)
                    tasques[i].feta = false;
            });

            localStorage.setItem("tasques", JSON.stringify(tasques));
            window.location.reload();
        });
    });
});

document.getElementById("file-input").addEventListener("change", (ev) => {
    try {
        let reader = new FileReader();
        reader.onload = function() {
            curFileContent = this.result;
        };
        reader.readAsText(ev.target.files[0]);
    } catch(e) {
        // L'accio s'ha cancellat
        curFileContent = null;
    }
});

document.addEventListener("submit", (ev) => {
    let tasquesImportades;
    try {
        tasquesImportades = JSON.parse(curFileContent);
    } catch(e) {
        alert("ERROR: El format de l'arxiu no es correcte.");
        ev.preventDefault();
        return;
    }
    console.log(tasquesImportades);

    let categories = localStorage.getItem("categories");
    if(categories !== null)
        categories = JSON.parse(categories);
    else
        categories = [];

    tasquesImportades.forEach((v) => {
        if(Util.getCategoriaByName(v.categoria.nom) === null)
            categories.push({nom: v.categoria.nom, color: v.categoria.color});
    });

    localStorage.setItem("categories", JSON.stringify(categories));

    tasques = tasques.concat(tasquesImportades);
    localStorage.setItem("tasques", JSON.stringify(tasques));
});