// 1. On crée une variable pour stocker le nombre d'articles dans le panier
let compteurPanier = 0;

// 2. On demande au JavaScript de cibler l'élément du panier dans le bandeau du haut
// Pour cela, on va lui donner un identifiant (ID) dans le HTML juste après
const elementPanier = document.getElementById("compteur-panier");

// 3.On cible uniquement les boutons situés dans un élément qui a la classe .carte-produit
const boutonsAchat = document.querySelectorAll(".carte-produit button");

// 4. On dit à chaque bouton ce qu'il doit faire quand on clique dessus
if (boutonsAchat.length > 0) {
    boutonsAchat.forEach(bouton => {
        bouton.addEventListener("click", () => {
            compteurPanier = compteurPanier + 1;
            if (elementPanier) elementPanier.textContent = compteurPanier;
            alert("✨ Une dose de bonheur a été ajoutée à votre panier ! ✨");
        });
    });
}


// ==========================================
// GESTION DU MENU BURGER
// ==========================================

// 1. On cible le bouton burger et le menu
const boutonBurger = document.getElementById("bouton-burger");
const menuGauche = document.getElementById("menu-gauche");

// 2. Quand on clique sur le bouton burger...
boutonBurger.addEventListener("click", () => {
    // "toggle" ajoute la classe si elle n'y est pas, et l'enlève si elle y est déjà
    menuGauche.classList.toggle("visible");
});

// 3. Optionnel : Fermer le menu si on clique sur un lien du menu (pour les ancres)
const liensMenu = document.querySelectorAll(".menu-gauche a");
liensMenu.forEach(lien => {
    lien.addEventListener("click", () => {
        menuGauche.classList.remove("visible");
    });
});