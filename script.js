// Add a subtle animation to the page when it loads
const headerLis = document.querySelectorAll('header nav ul li');
const homeCells = document.querySelectorAll('main .HomeCell');
const HomeCellsFilter = document.querySelectorAll('.HomeCellFilter');
const HomeCellsContainer = document.querySelectorAll('.HomeCellContainer');
const header = document.querySelector('header');
const footer = document.querySelector('footer');

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
    // Désactivé pour la version mobile
    if (screen.width <= 1024 ) {
        return;
    }

    cell.classList.add('expand-hover');
    li.style.color = 'var(--accent-color)';
    li.classList.add('header-li');
};

function OnCellLeave(cell, li, filter, container) {

    // Ne fait rien si la div cellule est active
    if (cell.classList.contains('expand-click')) {
        return;
    }

    // On 'désactive' la fonction pour les téléphones portables: tout est géré par OnCellClick
    if (screen.width <= 1024 ) {
        return;
    }

    cell.classList.remove('expand-hover');
    cell.classList.remove('expand-click');

    li.style.color = 'var(--text-color)';
    li.classList.remove('header-li');
    filter.classList.add('invisible');
    container.classList.add('invisible');

    Array.from(container.children).forEach((child, index) => {
        child.classList.add('invisible');
        child.classList.remove('ContentAnimation');
    });
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


function OnCellClick(cell, filter, container) {

    // delay pour que la fin d'animation de la cellule coïncide avec le début d'animation du contenu.
    const element = document.documentElement;
    const delay = 1000 * parseFloat(getComputedStyle(element).getPropertyValue("--delay")) + 100;

    // Ecrans d'ordinateurs
    if (screen.width >= 1025) {
        // cell.style.width = '40%';
        cell.classList.remove('expand-hover');
        cell.classList.toggle('expand-click');
        filter.classList.toggle('visible');
        container.classList.toggle('invisible');
    } 
    

    // Téléphones
    if (screen.width <= 1024) { 
        cell.classList.toggle('expanded'); // Ajoute ou enlève la classe selon si l'élément la possède ou non
        filter.classList.toggle('visible');
        cell.querySelector('.title-container').classList.toggle("hidden");
        container.classList.toggle('invisible');
    }

    // delay pour coincider avec l'animation de la cellule et du content (voir css)
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

    // écran tactile = mobile / tablette
    // if ('ontouchstart' in window) {

    //     cell.addEventListener('touchstart', (event) => {
    //         let startY = event.touches[0].clientY;

    //         cell.addEventListener('touchend', (event) => {
    //             let endY = event.touches[0].clientY;
    //             let dy = Math.abs(endY - startY);

    //             // Important de vérifier cette condition dans la fonction 'touchend' sinon exécution du if sans attendre le calcul de dy
    //             if (dy <= 20) {
    //                 ResetAllCells(index);
    //                 OnCellClick(cell, filter, container);
    //                 if (index == 2) {document.querySelector('video').play();};
    //             };
    //         });
    //     });
    // }

    // écran non-tactile = ordinateur
    // else {
    cell.addEventListener('mouseenter', () => {
        OnCellEnter(cell, li);
    });

    cell.addEventListener('mouseleave', () => {
        OnCellLeave(cell, li, filter, container);
    });

    cell.addEventListener('click', () => {
        ResetAllCells(index);
        OnCellClick(cell, filter, container);
    });
    // };
});

document.querySelector('#hide-content-btn').addEventListener('click', (event) => {
    event.stopPropagation(); // Empêche l'éxécution de la fonction 'OnCellClick'.
    let parentDiv = event.target.parentNode; // récupère la div parent de classe .HomeCellContent.
    parentDiv.classList.add('invisible');
    parentDiv.parentNode.classList.add('invisible');
});
