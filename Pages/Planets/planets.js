let currentPageUrl = 'https://swapi.dev/api/planets/';

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
            let urlImg = `https://starwars-visualguide.com/assets/img/planets/${character.url.replace(/\D/g, "")}.jpg`;
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

                const rotationPeriod = document.createElement('span');
                rotationPeriod.className = 'character-details';
                rotationPeriod.innerText = `Período de Rotação: ${character.rotation_period}`;

                const climate = document.createElement('span');
                climate.className = 'character-details';
                climate.innerText = `Clima: ${convertClimate(character.climate)}`;

                const gravity = document.createElement('span');
                gravity.className = 'character-details';
                gravity.innerText = `Gravidade: ${character.gravity}`;

                const population = document.createElement('span');
                population.className = 'character-details';
                population.innerText = `População: ${character.population}`;

                modalContent.appendChild(characterImage);
                modalContent.appendChild(name);
                modalContent.appendChild(rotationPeriod);
                modalContent.appendChild(climate);
                modalContent.appendChild(gravity);
                modalContent.appendChild(population);
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

function convertClimate(climate) {
    const clima = {
      temperate: "Temperado",
      tropical: " Tropical",
      arid: "Árido",
      frozen: "Congelado",
      murky: "Obscuro",
      windy: "Ventoso",
      hot: "Quente",
      frigid: "Frio",
      humid: "Húmido",
      moist: "Húmido",
      polluted: "Poluído",
      unknown: " Desconhecido"
    };
  
    return clima[climate.toLowerCase()] || climate;
  }