const responsiveBtn = document.getElementById("responsive-btn");
const asideMenu = document.getElementById("menu-aside");
let asideOpen = false;

responsiveBtn.addEventListener("click", (ev) => {
    asideOpen = !asideOpen;
    
    responsiveBtn.innerHTML = (asideOpen ? "<" : ">");

    if(asideOpen)
        asideMenu.classList.add("moved");
    else
        asideMenu.classList.remove("moved");
});