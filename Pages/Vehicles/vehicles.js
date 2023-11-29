let currentPageUrl = 'https://swapi.dev/api/vehicles/';

window.onload = async () => {

    try {
        await loadCharacters(currentPageUrl);
    } catch (error) {
        console.log(error);
        alert('Erro ao carregar cards!');
    }

    const nextButton = document.getElementById('next-btn');
    const backButton = document.getElementById('back-btn');

    nextButton.addEventListener('click', loadNextPage);
    backButton.addEventListener('click', loadPreviousPage);
};

async function loadCharacters(url) {
    const mainContent = document.getElementById('main-content');

    mainContent.innerHTML = ''; //Limpar os resultados anteriores

    try {

        const response = await fetch(url);
        const responseJson = await response.json();

        responseJson.results.forEach(async (character) => {
            const card = document.createElement("div");
            let urlImg = `https://starwars-visualguide.com/assets/img/vehicles/${character.url.replace(/\D/g, "")}.jpg`;
            const response = await fetch(urlImg)
            if(response.status == '404'){
                urlImg = 'https://starwars-visualguide.com/assets/img/placeholder.jpg';
            }
            card.style.backgroundImage = `url('${urlImg}')`;
            card.className = 'cards';

            const characterNameBg = document.createElement("div");
            characterNameBg.className = 'character-name-bg';

            const characterName = document.createElement('span');
            characterName.className = 'character-name';
            characterName.innerText = `${character.name}`;

            characterNameBg.appendChild(characterName);
            card.appendChild(characterNameBg);

            card.onclick = () => {
                const modal = document.getElementById('modal');
                modal.style.visibility = 'visible';

                const modalContent = document.getElementById('modal-content');
                modalContent.innerHTML = '';

                const characterImage = document.createElement('div');
                characterImage.style.backgroundImage = `url('${urlImg}')`
                characterImage.className = 'character-img';

                const name = document.createElement('span');
                name.className = 'character-details';
                name.innerText = `Nome: ${character.name}`;

                const model = document.createElement('span');
                model.className = 'character-details';
                model.innerText = `Modelo: ${character.model}`;

                const manufacturer = document.createElement('span');
                manufacturer.className = 'character-details';
                manufacturer.innerText = `Fabricação: ${character.manufacturer}`;

                const maxSpeed = document.createElement('span');
                maxSpeed.className = 'character-details';
                maxSpeed.innerText = `Vél. Máxima: ${character.max_atmosphering_speed} KM/h`;

                const vehicleClass = document.createElement('span');
                vehicleClass.className = 'character-details';
                vehicleClass.innerText = `Classe do Veículo: ${character.vehicle_class}`;

                modalContent.appendChild(characterImage);
                modalContent.appendChild(name);
                modalContent.appendChild(model);
                modalContent.appendChild(manufacturer);
                modalContent.appendChild(maxSpeed);
                modalContent.appendChild(vehicleClass);
            }

            mainContent.appendChild(card);
        });

        const nextButton = document.getElementById('next-btn');
        const backButton = document.getElementById('back-btn');

        nextButton.disabled = !responseJson.next;
        backButton.disabled = !responseJson.previous;

        backButton.style.visibility = responseJson.previous ? 'visible' : 'hidden';

        currentPageUrl = url;

    } catch (error) {
        console.log(error)
        alert('Erro ao carregar os personagens')
    }
}

async function loadNextPage() {
    if (!currentPageUrl) return;

    try {
        const response = await fetch(currentPageUrl);
        const responseJson = await response.json();

        await loadCharacters(responseJson.next);

    } catch (error) {
        console.log(error);
        alert('Erro ao carregar a próxima página!');
    }
}

async function loadPreviousPage() {
    if (!currentPageUrl) return;

    try {
        const response = await fetch(currentPageUrl);
        const responseJson = await response.json();

        await loadCharacters(responseJson.previous);

    } catch (error) {
        console.log(error);
        alert('Erro ao carregar a página anterior!');
    }
}

function hideModal() {
    const modal = document.getElementById('modal');
    modal.style.visibility = 'hidden';
}