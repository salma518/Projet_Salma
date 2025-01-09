const adminForm = document.getElementById('admin-form'); 
const adminList = document.querySelector('.admin-list');
let editingDishId = null; // Pour garder la trace de l'ID du plat en cours d'édition

// Charger les plats depuis l'API
function loadDishes() {
    fetch('https://676c6bee0e299dd2ddfcc682.mockapi.io/restaurant/resto')
        .then(response => response.json())
        .then(data => displayDishes(data))
        .catch(error => console.error('Erreur:', error));
}

// Afficher les plats
function displayDishes(dishes) {
    adminList.innerHTML = '';
    dishes.forEach(dish => {
        const item = document.createElement('div');
        item.classList.add('admin-item');
        item.innerHTML = `
            <h3>${dish.name}</h3>
            <img src="${dish.image}" alt="${dish.name}" style="width:100%;">
            <p>${dish.prix} MAD</p>
            <button class="edit-dish" data-id="${dish.id}">Modifier</button>
            <button class="delete-dish" data-id="${dish.id}">Supprimer</button>
        `;
        adminList.appendChild(item);
    });
    addEventListeners();
}

// Ajouter un plat ou modifier un plat existant
adminForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('dish-id').value;
    const name = document.getElementById('dish-name').value;
    const price = document.getElementById('dish-price').value;
    const image = document.getElementById('dish-image').value;

    const dishData = {
        name,
        prix: price,
        image
    };

    if (editingDishId) {
        // Modifier le plat existant
        fetch(`https://676c6bee0e299dd2ddfcc682.mockapi.io/restaurant/resto/${editingDishId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dishData)
        })
        .then(() => {
            resetForm();
            loadDishes(); // Recharger les plats
        })
        .catch(error => console.error('Erreur:', error));
    } else {
        // Ajouter un nouveau plat
        fetch('https://676c6bee0e299dd2ddfcc682.mockapi.io/restaurant/resto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dishData)
        })
        .then(() => {
            resetForm();
            loadDishes(); // Recharger les plats
        })
        .catch(error => console.error('Erreur:', error));
    }
});

// Ajouter les écouteurs d'événements pour modifier et supprimer un plat
function addEventListeners() {
    const editButtons = document.querySelectorAll('.edit-dish');
    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            editDish(id);
        });
    });

    const deleteButtons = document.querySelectorAll('.delete-dish');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            deleteDish(id);
        });
    });
}

// Modifier un plat
function editDish(id) {
    fetch(`https://676c6bee0e299dd2ddfcc682.mockapi.io/restaurant/resto/${id}`)
        .then(response => response.json())
        .then(dish => {
            console.log(dish); 
            document.getElementById('dish-id').value = dish.id;
            document.getElementById('dish-name').value = dish.name || ''; 
            document.getElementById('dish-price').value = dish.prix || '';
            document.getElementById('dish-image').value = dish.image || ''; 
            editingDishId = id; 
            document.getElementById('submit-dish').textContent = 'Modifier Plat'; // Changer le texte du bouton
            
        })
        .catch(error => console.error('Erreur:', error));

}

// Supprimer un plat
function deleteDish(id) {
    fetch(`https://676c6bee0e299dd2ddfcc682.mockapi.io/restaurant/resto/${id}`, {
        method: 'DELETE'
    })
    Swal.fire({
        title: "Supprimer?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, supprimer!"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "L'element a ete supprime!",
            icon: "success"
          });
        }
      })
    .then(() => loadDishes()) // Recharge les plats après suppression
    .catch(error => console.error('Erreur:', error));
}

// Réinitialiser le formulaire
function resetForm() {
    editingDishId = null;
    adminForm.reset(); // Réinitialiser le formulaire
    document.getElementById('submit-dish').textContent = 'Ajouter Plat'; // Réinitialiser le texte du bouton
}

// Charger les plats au démarrage
loadDishes();

