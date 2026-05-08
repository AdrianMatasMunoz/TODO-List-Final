import { Categoria } from "./models.js";

let categories = [];

document.addEventListener("DOMContentLoaded", (ev) => {
    let categoriesStr = localStorage.getItem("categories");
    if(categoriesStr === null) return;

    try {
        let categoriesRaw = JSON.parse(categoriesStr);
        if(categoriesRaw.length === undefined)
            throw "WrongCategoryParseException: Category list is not an array.";

        for(let i = 0; i < categoriesRaw.length; i++) {
            let curCategory = categoriesRaw[i];
            let categoryKeys = Object.keys(curCategory);
            categoryKeys.forEach((v, j, a) => {
                if(v !== "nom" && v !== "color")
                    throw `WrongCategoryParseException: "${v}" is not an attribute of a category.`;
            });
            if(categoryKeys.length !== 2)
                throw `WrongCategoryParseException: Attribute count should be exactly 2.`;

            if(!(/#[0-9a-f]{6}/).test(curCategory.color))
                throw `WrongCategoryParseException: Color value ${curCategory.color} is incorrect.`;

            categories.push(new Categoria(curCategory.nom, curCategory.color));
        }
    } catch(e) {
        document.getElementById("load-error").classList.add("show-error");
        console.error(e);
        categories = undefined;
        return;
    }

    if(categories.length === 0) return;

    const categoryTemplate = `
<div class="menu-app category" style="background-color: {0}; border-color: #000;">
    <p>{1}</p>
    <button>
        <svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"
        image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 456 511.82">
            <path fill="#FFFFFF" d="M48.42 140.13h361.99c17.36 0 29.82 9.78 28.08 28.17l-30.73 317.1c-1.23 13.36-8.99 26.42-25.3 26.42
            H76.34c-13.63-.73-23.74-9.75-25.09-24.14L20.79 168.99c-1.74-18.38 9.75-28.86 27.63-28.86zM24.49 38.15h136.47V28.1
            c0-15.94 10.2-28.1 27.02-28.1h81.28c17.3 0 27.65 11.77 27.65 28.01v10.14h138.66c.57 0 1.11.07 1.68.13 10.23.93 18.15 9.02
            18.69 19.22.03.79.06 1.39.06 2.17v42.76c0 5.99-4.73 10.89-10.62 11.19-.54 0-1.09.03-1.63.03H11.22c-5.92 0-10.77-4.6-11.19
            10.38 0-.72-.03-1.47-.03-2.23v-39.5c0-10.93 4.21-20.71 16.82-23.02 2.53-.45 5.09-.37 7.67-.37zm83.78 208.38c-.51-10.17 8.21-18.83
            19.53-19.31 11.31-.49 20.94 7.4 21.45 17.57l8.7 160.62c.51 10.18-8.22 18.84-19.53 19.32-11.32.48-20.94-7.4-21.46-17.57l-8.69-160.63
            zm201.7-1.74c.51-10.17 10.14-18.06 21.45-17.57 11.32.48 20.04 9.14 19.53 19.31l-8.66 160.63c-.52 10.17-10.14 18.05-21.46 17.57-11.31
            -.48-20.04-9.14-19.53-19.32l8.67-160.62zm-102.94.87c0-10.23 9.23-18.53 20.58-18.53 11.34 0 20.58 8.3 20.58 18.53v160.63c0 10.23-9.24
            18.53-20.58 18.53-11.35 0-20.58-8.3-20.58-18.53V245.66z"/>
        </svg>
    </button>
</div>`;

    document.getElementById("no-categories").style.display = "none";
    const categoryList = document.getElementById("category-list");
    
    categories.forEach((v, i) => {
        let categoryHTML = categoryTemplate
            .replace("{0}", v.color)
            .replace("{1}", v.nom);
        categoryList.innerHTML += categoryHTML;
    });

    document.querySelectorAll(".category > button").forEach((v) => {
        v.addEventListener("click", (ev) => {
            categories = categories.filter((c) => {
                return c.nom !== v.parentElement.getElementsByTagName("p")[0].innerHTML;
            });

            localStorage.setItem("categories", JSON.stringify(categories));

            window.location.reload();
        });
    });
});

document.addEventListener("submit", (ev) => {
    let nom = document.getElementById("nom-categoria").value;
    let categoriaExists = false;
    categories.forEach((c) => {
        categoriaExists = categoriaExists || c.nom === nom;
    });
    if(categoriaExists) {
        alert("La categoria ja existeix.");
        ev.preventDefault();
        return;
    }

    categories.push(new Categoria(
        document.getElementById("nom-categoria").value,
        document.getElementById("color-categoria").value
    ));
    localStorage.setItem("categories", JSON.stringify(categories));
});