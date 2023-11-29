let currentPageUrl = 'https://swapi.dev/api/species/';

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

        responseJson.results.forEach((character) => {
            const card = document.createElement("div");
            card.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/species/${character.url.replace(/\D/g, "")}.jpg')`;
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
                characterImage.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/species/${character.url.replace(/\D/g, "")}.jpg')`;
                characterImage.className = 'character-img';

                const name = document.createElement('span');
                name.className = 'character-details';
                name.innerText = `Nome: ${character.name}`;

                const characterClassification = document.createElement('span');
                characterClassification.className = 'character-details';
                characterClassification.innerText = `Classificação: ${character.classification}`;

                const height = document.createElement('span');
                height.className = 'character-details';
                height.innerText = `Altura média: ${convertHeight(character.average_height)} cm`;

                const skinColor = document.createElement('span');
                skinColor.className = 'character-details';
                skinColor.innerText = `Cor da Pele: ${convertSkinColor(character.skin_colors)}`;

                const averageLifespan = document.createElement('span');
                averageLifespan.className = 'character-details';
                averageLifespan.innerText = `Vida Útil: ${convertLifespan(character.average_lifespan)}`;

                modalContent.appendChild(characterImage);
                modalContent.appendChild(name);
                modalContent.appendChild(characterClassification);
                modalContent.appendChild(height);
                modalContent.appendChild(skinColor);
                modalContent.appendChild(averageLifespan);
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

function convertHeight(height) {
    if (height === "unknown") {
        return "Desconhecida"
    }
    return (height / 100).toFixed(2);
}

function convertLifespan(averageLifespan) {
    const tempo = {
      indefinite: " Desconhecida",
      unknown: " Desconhecida"
    };
  
    return tempo[averageLifespan.toLowerCase()] || averageLifespan;
  }

  function convertSkinColor(skinColor) {
    const cores = {
      blue: "Azul",
      brown: "Castanho",
      green: "Verde",
      yellow: "Amarelo",
      black: "Preto",
      grey: "Cinza",
      gray: "Cinza",
      pink: "Rosa",
      purple: "Roxo",
      red: "Vermelho",
      orange: "Laranja",
      hazel: "Avela",
      magenta: "Magenta",
      pale: "Pálido",
      tan: "bronzeado",
      palepink: "Rosa Pálido",
      caucasian: "Caucasiano",
      asian: "Asiático",
      hispanic: "Hispânico",
      unknown: " Desconhecida"
    };
  
    return cores[skinColor.toLowerCase()] || skinColor;
  }