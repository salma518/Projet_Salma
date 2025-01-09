let searchForm = document.querySelector('.search-form');

document.querySelector('#search').onclick = () => {
searchForm.classList.toggle('active');
navbar.classList.remove('active');
};

let navbar = document.querySelector('.navbar');

document.querySelector('#menu').onclick = () => {
navbar.classList.toggle('active');
searchForm.classList.remove('active');
};

window.onscroll = () => {
searchForm.classList.remove('active');
navbar.classList.remove('active');
};

//Charger les Produits
function loadProducts() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://676c6bee0e299dd2ddfcc682.mockapi.io/restaurant/resto', true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            const products = JSON.parse(xhr.responseText);
            displayProducts(products);

        } else {
            console.error('Erreur lors du chargement des produits:', xhr.statusText);
        }
    };

    xhr.onerror = function () {
        console.error('Erreur de connexion à l\'API');
    };

    xhr.send();
}

// Fonction pour afficher les produits sur la page
function displayProducts(products) {
    const cardList = document.querySelector('.card--list');
    cardList.innerHTML = '';//vider le contenu 

//Parcourt chaque produit
    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}"/>
            <h2 class="card-title">${product.name}</h2>
            <div class="card--price">
                <div class="price">${product.prix} MAD</div>
                <i class="fa-solid fa-plus add-to-cart" id="add-to-cart"></i>
            </div>
        `;
        cardList.appendChild(card);//Ajouter à la liste des cartes
    });

    addCartEventListeners();
}

//Gestion de Panier

// Fonction pour ajouter les événements aux boutons "Ajouter au panier"
function addCartEventListeners() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemCount = document.querySelector('#cart span'); 
    const cartItemsList = document.querySelector('.cart-items'); 
    const cartTotal = document.querySelector('.cart-total');
    const cartIcon = document.querySelector('#cart');
    const sidebar = document.getElementById('sidebar');

    let cartItems = []; //Tab Pour stocker les article de panier
    let totalAmount = 0;

    addToCartButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            //Objet
            const item = {
                name: document.querySelectorAll('.card .card-title')[index].textContent,
                price: parseFloat(
                    document.querySelectorAll('.price')[index].textContent.slice(0, -4) 
                ),
                quantity: 1,
            };

            const existingItem = cartItems.find(cartItem => cartItem.name === item.name);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cartItems.push(item);
            }

            totalAmount += item.price;
            updateCartUI(); //Actualiser l'interface
        });
    });

    function updateCartUI() {
        updateCartItemCount(cartItems.length);
        updateCartItemList();
        updateCartTotal();
    }

//Met à jour le nombre d'articles (span)
    function updateCartItemCount(count) {
        if (cartItemCount) {
            cartItemCount.textContent = count;
        }
    }

// Met à jour la liste des articles dans le panier
    function updateCartItemList() {
        if (cartItemsList) {
            cartItemsList.innerHTML = '';
            cartItems.forEach((item, index) => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item', 'individual-cart-item');
                cartItem.innerHTML = `
                    <span>(${item.quantity}x) ${item.name}</span>
                    <span class="cart-item-price">${(item.price * item.quantity).toFixed(2)} MAD</span>
                    <button class="remove-btn" data-index="${index}"><i class="fa-solid fa-times"></i></button>
                `;
                cartItemsList.append(cartItem);
            });

            const removeButtons = document.querySelectorAll('.remove-btn');
            removeButtons.forEach((button) => {
                button.addEventListener('click', (event) => {
                    const index = event.target.closest('button').dataset.index;
                    removeItemFromCart(index);
                });
            });
        }
    }

    function removeItemFromCart(index) {
        const removedItem = cartItems.splice(index, 1)[0];
        totalAmount -= removedItem.price * removedItem.quantity;  // Mise à jour correcte du total
        updateCartUI(); // Met à jour l'interface utilisateur
    }

    function updateCartTotal() {
        if (cartTotal) {
            cartTotal.textContent = `${totalAmount.toFixed(2)} MAD`;
        }
    }

    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    const closeButton = document.querySelector('.sidebar-close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            sidebar.classList.remove('open');
        });
    }
}

// Appeler la fonction pour charger les produits
loadProducts();

//Bouton de Commander
document.getElementById('btn').onclick = function(){
    Swal.fire({
        title: "La Commande est passé avec succès !",
        icon: "success",
        draggable: true
      });
}

//Envoyer un Commentaire

document.getElementById('submit').onclick = function()
{
    Swal.fire({
        text: "Votre commentaire est envoye!",
        icon: "success"
      });
}


// Fonction pour afficher les informations du client
function showClientInfo() {
    const clients = JSON.parse(localStorage.getItem('clients')) || [];    
    const client_conn = JSON.parse(localStorage.getItem('userconn')) || [];    
    if (!clients) {
        Swal.fire({
            title: 'Erreur',
            text: "Aucune information trouvée.",
            icon: 'error'
        });
        return;
    }
    
    const clientconnecte = clients.find(c => c.email === client_conn.email);
    if (clients) {
        const clientInfo = `
            <h1>Informations du Client</h1>
            <h2><strong>Nom :</strong> ${clientconnecte.fullName}</h2>
            <h2><strong>Email :</strong> ${clientconnecte.email}</h2>`
        ;
        Swal.fire({
            html: clientInfo,
            icon: 'info'
        });
    } else {
        Swal.fire({
            title: 'Erreur',
            text: "Aucune information trouvée.",
            icon: 'error'
        });
    }
}

// Ajout d'un événement click sur l'icône de profil
document.getElementById('login').onclick = function() {
    showClientInfo();
};

// Logout
document.getElementById('logout').onclick = function() {
    document.getElementById('logout-form').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
};

document.getElementById('dec').onclick = function() {
    Swal.fire({
        title: "Vous êtes sûr que vous voulez vous déconnecter?",
        text: "Vous ne pourrez pas revenir en arrière!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, Déconnecter!"
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userPassword');
            localStorage.setItem('connecte', false);
            Swal.fire({
                title: "Vous avez été déconnecté!",
                icon: "success",
                draggable: true
            }).then(() => {
                // Redirection vers 1.html
                window.location.href = 'Page 1.html';
            });
        } else {
            return;
        }
    });
};

// Fermer le formulaire de connexion en dehors du formulaire
document.getElementById('overlay').onclick = function() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('logout-form').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
};

