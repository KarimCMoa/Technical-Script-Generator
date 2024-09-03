document.addEventListener('DOMContentLoaded', (event) => {
    loadEventInfo();
    loadTechnicalScript();
    loadDiffusionOptions();
});

function addEventColumn() {
    const table = document.getElementById('event-info-table').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    const newCell = newRow.insertCell(0);
    newCell.innerHTML = '<input type="text" placeholder="Nouvelle information">';
    saveEventInfo();
}

function addTechnicalColumn() {
    const table = document.getElementById('technical-script-table').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    const newCell = newRow.insertCell(0);
    newCell.innerHTML = '<input type="text" placeholder="Nouvelle information">';
    saveTechnicalScript();
}

function toggleDiffusion() {
    const checkbox = document.getElementById('diffusion-checkbox');
    const options = document.getElementById('diffusion-options');
    if (checkbox.checked) {
        options.style.display = 'block';
        const numScreens = prompt("Combien d'écrans seront simultanément affichés ?");
        if (numScreens) {
            generateScreenCombinations(parseInt(numScreens));
        }
    } else {
        options.style.display = 'none';
        document.getElementById('screen-combinations').innerHTML = '';
    }
    saveDiffusionOptions();
}

function toggleLogo() {
    const checkbox = document.getElementById('logo-checkbox');
    const options = document.getElementById('logo-options');
    options.style.display = checkbox.checked ? 'block' : 'none';
}

function addDiffusionRow() {
    const table = document.getElementById('diffusion-table').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    const newCell1 = newRow.insertCell(0);
    const newCell2 = newRow.insertCell(1);
    const newCell3 = newRow.insertCell(2);
    newCell1.innerHTML = '<input type="text" placeholder="Intervenant">';
    newCell2.innerHTML = '<input type="text" placeholder="Écran">';
    newCell3.innerHTML = '<button class="btn-delete" onclick="deleteRow(this)">✖</button>'; // Bouton de suppression
    saveDiffusionOptions();
}

function generateScreenCombinations(numScreens) {
    const table = document.getElementById('diffusion-table').getElementsByTagName('tbody')[0];
    const rows = table.rows;
    const presenters = [];
    const screens = [];
    for (let row of rows) {
        presenters.push(row.cells[0].children[0].value);
        screens.push(row.cells[1].children[0].value);
    }

    const combinations = getCombinations(presenters, numScreens);
    const container = document.getElementById('screen-combinations');
    container.innerHTML = '<h4>Combinaisons possibles :</h4>';
    combinations.forEach((combination, index) => {
        const div = document.createElement('div');
        div.className = 'combination';
        div.innerHTML = `Option ${index + 1}: ${combination.join(', ')}`;
        container.appendChild(div);
    });

    const logoCheckbox = document.getElementById('logo-checkbox');
    if (logoCheckbox.checked) {
        const logoPosition = document.getElementById('logo-position').value;
        const logo = document.createElement('img');
        logo.src = 'logo.png'; // Assurez-vous d'avoir un fichier logo.png dans votre répertoire
        logo.className = `logo ${logoPosition}`;
        container.appendChild(logo);
    }
}

function getCombinations(arr, num) {
    const result = [];
    const f = function(prefix, arr) {
        for (let i = 0; i < arr.length; i++) {
            const newPrefix = prefix.concat(arr[i]);
            if (newPrefix.length === num) {
                result.push(newPrefix);
            } else {
                f(newPrefix, arr.slice(i + 1));
            }
        }
    }
    f([], arr);
    return result;
}

function saveEventInfo() {
    const rows = document.getElementById('event-info-table').getElementsByTagName('tbody')[0].rows;
    const data = [];
    for (let row of rows) {
        data.push(row.cells[0].children[0].value);
    }
    localStorage.setItem('eventInfo', JSON.stringify(data));
}

function loadEventInfo() {
    const data = JSON.parse(localStorage.getItem('eventInfo'));
    if (data) {
        const table = document.getElementById('event-info-table').getElementsByTagName('tbody')[0];
        table.innerHTML = '';
        for (let value of data) {
            const newRow = table.insertRow();
            const newCell = newRow.insertCell(0);
            newCell.innerHTML = `<input type="text" value="${value}">`;
        }
    }
}

function saveTechnicalScript() {
    const rows = document.getElementById('technical-script-table').getElementsByTagName('tbody')[0].rows;
    const data = [];
    for (let row of rows) {
        data.push(row.cells[0].children[0].value);
    }
    localStorage.setItem('technicalScript', JSON.stringify(data));
}

function loadTechnicalScript() {
    const data = JSON.parse(localStorage.getItem('technicalScript'));
    if (data) {
        const table = document.getElementById('technical-script-table').getElementsByTagName('tbody')[0];
        table.innerHTML = '';
        for (let value of data) {
            const newRow = table.insertRow();
            const newCell = newRow.insertCell(0);
            newCell.innerHTML = `<input type="text" value="${value}">`;
        }
    }
}

function saveDiffusionOptions() {
    const checkbox = document.getElementById('diffusion-checkbox').checked;
    const rows = document.getElementById('diffusion-table').getElementsByTagName('tbody')[0].rows;
    const data = {
        checkbox: checkbox,
        rows: []
    };
    for (let row of rows) {
        data.rows.push({
            intervenant: row.cells[0].children[0].value,
            ecran: row.cells[1].children[0].value
        });
    }
    localStorage.setItem('diffusionOptions', JSON.stringify(data));
}

function loadDiffusionOptions() {
    const data = JSON.parse(localStorage.getItem('diffusionOptions'));
    if (data) {
        document.getElementById('diffusion-checkbox').checked = data.checkbox;
        const diffusionOptions = document.getElementById('diffusion-options');
        diffusionOptions.style.display = data.checkbox ? 'block' : 'none';
        const table = document.getElementById('diffusion-table').getElementsByTagName('tbody')[0];
        table.innerHTML = '';
        for (let row of data.rows) {
            const newRow = table.insertRow();
            const newCell1 = newRow.insertCell(0);
            const newCell2 = newRow.insertCell(1);
            const newCell3 = newRow.insertCell(2);
            newCell1.innerHTML = `<input type="text" value="${row.intervenant}">`;
            newCell2.innerHTML = `<input type="text" value="${row.ecran}">`;
            newCell3.innerHTML = '<button class="btn-delete" onclick="deleteRow(this)">✖</button>'; // Bouton de suppression
        }
    }
}

function deleteRow(button) {
    // Supprime la ligne contenant le bouton
    var row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
    saveDiffusionOptions();
}

function updateDiffusionOptions() {
    // Récupère le tableau de diffusion
    var diffusionTable = document.getElementById('diffusion-table').getElementsByTagName('tbody')[0];
    var rows = diffusionTable.getElementsByTagName('tr');
    
    // Parcourt chaque ligne du tableau
    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName('td');
        if (cells.length > 1) {
            var intervenant = cells[0].getElementsByTagName('input')[0].value;
            var ecran = cells[1].getElementsByTagName('input')[0].value;
            
            // Logique pour mettre à jour les combinaisons avec les nouvelles valeurs
            console.log(`Mise à jour de la ligne ${i + 1}: Intervenant = ${intervenant}, Écran = ${ecran}`);
            // Vous pouvez ajouter ici la logique pour mettre à jour les combinaisons dans votre application
        }
    }
    
    alert("Options de Diffusion mises à jour !");
}

function resetInterface() {
    // Logique pour réinitialiser toute l'interface de création
    document.getElementById('diffusion-checkbox').checked = false;
    document.getElementById('diffusion-options').style.display = 'none';
    document.getElementById('logo-checkbox').checked = false;
    document.getElementById('logo-options').style.display = 'none';
    // Efface tous les champs de texte
    var inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => input.value = '');
    // Supprime toutes les lignes sauf la première dans le tableau de diffusion
    var diffusionTable = document.getElementById('diffusion-table').getElementsByTagName('tbody')[0];
    while (diffusionTable.rows.length > 1) {
        diffusionTable.deleteRow(1);
    }
    saveDiffusionOptions();
}

// Fonction pour sauvegarder les options de diffusion
function saveDiffusionOptions() {
    const checkbox = document.getElementById('diffusion-checkbox').checked;
    const rows = document.getElementById('diffusion-table').getElementsByTagName('tbody')[0].rows;
    const data = {
        checkbox: checkbox,
        rows: []
    };
    for (let row of rows) {
        data.rows.push({
            intervenant: row.cells[0].children[0].value,
            ecran: row.cells[1].children[0].value
        });
    }
    localStorage.setItem('diffusionOptions', JSON.stringify(data));
}

// Fonction pour charger les options de diffusion
function loadDiffusionOptions() {
    const data = JSON.parse(localStorage.getItem('diffusionOptions'));
    if (data) {
        document.getElementById('diffusion-checkbox').checked = data.checkbox;
        const diffusionOptions = document.getElementById('diffusion-options');
        diffusionOptions.style.display = data.checkbox ? 'block' : 'none';
        const table = document.getElementById('diffusion-table').getElementsByTagName('tbody')[0];
        table.innerHTML = '';
        for (let row of data.rows) {
            const newRow = table.insertRow();
            const newCell1 = newRow.insertCell(0);
            const newCell2 = newRow.insertCell(1);
            const newCell3 = newRow.insertCell(2);
            newCell1.innerHTML = `<input type="text" value="${row.intervenant}">`;
            newCell2.innerHTML = `<input type="text" value="${row.ecran}">`;
            newCell3.innerHTML = '<button class="btn-delete" onclick="deleteRow(this)">✖</button>'; // Bouton de suppression
        }
    }
}

// Fonction pour supprimer une ligne
function deleteRow(button) {
    // Supprime la ligne contenant le bouton
    var row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
    saveDiffusionOptions();
}

// Fonction pour mettre à jour les options de diffusion
function updateDiffusionOptions() {
    // Récupère le tableau de diffusion
    var diffusionTable = document.getElementById('diffusion-table').getElementsByTagName('tbody')[0];
    var rows = diffusionTable.getElementsByTagName('tr');
    
    // Parcourt chaque ligne du tableau
    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName('td');
        if (cells.length > 1) {
            var intervenant = cells[0].getElementsByTagName('input')[0].value;
            var ecran = cells[1].getElementsByTagName('input')[0].value;
            
            // Logique pour mettre à jour les combinaisons avec les nouvelles valeurs
            console.log(`Mise à jour de la ligne ${i + 1}: Intervenant = ${intervenant}, Écran = ${ecran}`);
            // Vous pouvez ajouter ici la logique pour mettre à jour les combinaisons dans votre application
        }
    }
    
    alert("Options de Diffusion mises à jour !");
}