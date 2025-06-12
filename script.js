// Add a subtle animation to the page when it loads
const headerLis = document.querySelectorAll('header nav ul li');
const homeCells = document.querySelectorAll('main .HomeCell');
const HomeCellsFilter = document.querySelectorAll('.HomeCellFilter');
const HomeCellsContainer = document.querySelectorAll('.HomeCellContainer');
const header = document.querySelector('header');
const footer = document.querySelector('footer');

// delay pour que la fin d'animation de la cellule coïncide avec le début d'animation du contenu.
const element = document.documentElement;
const delay = 1000 * parseFloat(getComputedStyle(element).getPropertyValue("--delay")) + 100;

// Adaptation de la hauteur pour le format téléphone (overlay safari non pris en compte dans 100vh)
const setHeight = () => {
  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
};

window.addEventListener('resize', setHeight);
setHeight();

window.addEventListener('load', () => {
    // Animate the header

    header.style.opacity = '0';
    header.style.transform = 'translateY(-20px)';

    setTimeout(() => {
        header.style.transition = 'all 0.8s ease';
        header.style.opacity = '1';
        header.style.transform = 'translateY(0)';
    }, 300);

    // Animate the HomeCells
    homeCells.forEach((cell, index) => {
        cell.style.opacity = '0';
        cell.style.transform = 'translateY(50px)';

        setTimeout(() => {
            cell.style.transition = 'all 0.8s ease';
            cell.style.opacity = '1';
            cell.style.transform = 'translateY(0)';
            }, 500 + (index * 200));
        });
});

function OnCellEnter(cell, li) {
    cell.classList.add('expand-hover');
    li.style.color = 'var(--accent-color)';
    li.classList.add('header-li');
};

function OnCellLeave(cell, li, filter, container) {

    // Ne fait rien si la div cellule est active
    if (cell.classList.contains('expand-click')) {
        return;
    }

    cell.classList.remove('expand-hover');
    li.style.color = 'var(--text-color)';
    li.classList.remove('header-li');
};

function ResetAllCells(idx) {
    homeCells.forEach((cell, index) => {
        if (idx === index) { return; };
        let li = headerLis[index];
        let filter = HomeCellsFilter[index];
        let container = HomeCellsContainer[index];

        cell.classList.remove('expanded');
        cell.classList.remove('expand-hover');
        cell.classList.remove('expand-click');
        cell.querySelector('.title-container').classList.remove("hidden");

        // filter.style.display = 'none';
        filter.classList.remove('visible');

        container.classList.add('invisible');
        li.style.color = 'var(--text-color)';
        li.classList.remove('header-li');

        Array.from(container.children).forEach((child, index) => {
            child.classList.add('invisible');
            child.classList.remove('ContentAnimation');
        });
    });
};


function OnCellClick(cell, filter, container, index) {

    // Ecrans d'ordinateurs
    if (screen.width >= 1025) {
        cell.classList.remove('expand-hover');
        cell.classList.toggle('expand-click');

        if (mask && index ===2 ) {
            mask = false;
        }
        
        else {
            filter.classList.toggle('visible');
            container.classList.toggle('invisible');
            mask = false;
        }
    };
    

    // Téléphones et tablettes
    if (screen.width <= 1024) { 
        cell.classList.toggle('expanded'); // Ajoute ou enlève la classe selon si l'élément la possède ou non
        cell.querySelector('.title-container').classList.toggle("hidden");

        if (mask && index ===2 ) {
            mask = false;
        }
        
        else {
            filter.classList.toggle('visible');
            container.classList.toggle('invisible');
            mask = false;
        }
    };

    // Ajout du delay pour faire coincider la fin d'aniamtion de .HomeCell/Filtre avec le début d'animation du contenu (cf css)
    Array.from(container.children).forEach((child, index) => {
        setTimeout(() => {
            child.classList.toggle('invisible');
            child.classList.toggle('ContentAnimation');
            }, delay + (index * 200));
    });
};

homeCells.forEach((cell, index) => {
    let li = headerLis[index];
    let filter = HomeCellsFilter[index];
    let container = HomeCellsContainer[index];

    // A priori 'mouseenter' et 'mouseleave' sont définis uniquement pour un curseur donc pas de rsique de conflit avec le tactile 
    cell.addEventListener('mouseenter', () => {
        OnCellEnter(cell, li);
    });

    cell.addEventListener('mouseleave', () => {
        OnCellLeave(cell, li, filter, container);
    });

    cell.addEventListener('click', () => {
        ResetAllCells(index);
        OnCellClick(cell, filter, container, index);
    });
});


let mask;
let filter_simu = document.getElementById('filtre-simu');
let container_simu = document.getElementById('container-simu');

// document.querySelector('#hide-content-btn').addEventListener('click', (event) => {
//     // Par défaut l'évenement clic est détecté par tous les éléments peu importe leur z-index,
//     event.stopPropagation(); // -> empêche l'appel de 'OnCellClick'. 

//     container_simu.classList.add('invisible');
//     filter_simu.classList.remove('visible');
//     mask = true;
// });

const video = document.getElementById("video-CFD");

document.querySelector('#hide-content-btn').addEventListener('click', (event) => {
    // Par défaut l'évenement clic est détecté par tous les éléments peu importe leur z-index,
    event.stopPropagation(); // -> empêche l'appel de 'OnCellClick'. 
    video.classList.add('visible');
    video.style.zIndex = 1001;
    video.play();

    video.addEventListener("ended", function() {
        video.style.zIndex = 0;
        video.classList.remove('visible');
    });
});
