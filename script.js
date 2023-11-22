let currentPageUrl = 'https://swapi.dev/api/people/';    //Endpoint da API que vamos consumir.(declarado como let, pois dependendo do card, as informações iram mudar e consequentemente a url)

window.onload = async () => {     //Carregando as infos da API toda vez que a pag. for atualizada.
    try {
        await loadCharacters(currentPageUrl);     //A função loadCharacters irá ler o endpoint da API, toda vez que a pag. for atualizada.
    } catch (error) {
        console.log(error);
        alert('Erro ao carregar cards');
    }

    const nextButton = document.getElementById('next-button');
    const backButton = document.getElementById('back-button');

    //Monitorando eventos no elemento next/back button |Toda vez que o botão for clicado, irá p/ pag seguinte(Next) ou p/ a anterior(Previous)|
    nextButton.addEventListener('click', loadNextPage);
    backButton.addEventListener('click', loadPreviousPage);
};

//Função para carregar os personagens na tela.
async function loadCharacters(url) {
    const mainContent = document.getElementById('main-content');  //Manipulando com o DOM (document).
    mainContent.innerHTML = '';  //Limpar os resultados anteriores.

    try {
        const response = await fetch(url);
        const responseJson = await response.json();   //Transformando os resultados da api (variável response) em Json (armazenando em responseJson)

        responseJson.results.forEach((character) => {     //Iterando os resultados em arrays (forEach). Cada iteração cria um novo persongem. |Abaixo estamos manipulando o HTML pelo JS|
            const card = document.createElement("div");    //Criando a div card atráves do createElement.
            card.style.backgroundImage =
            `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')`   //Setando um background image, como foi feito inicialmente no HTML
            card.className = "cards"    //Dando o nome da classe cards com o className

            //Criando uma DIV no JS
            const characterNameBG = document.createElement("div")
            characterNameBG.className = "character-name-bg"

            //Criando um SPAN no JS
            const characterName = document.createElement("span")
            characterName.className = "character-name"
            characterName.innerText = `${character.name}`   //Setando um novo texto (nome do personagem) atráves do innerText

            //Passando um elemento p/ dentro de outro (appendChild), igual a estrutura no HTML
            characterNameBG.appendChild(characterName)
            card.appendChild(characterNameBG)
            mainContent.appendChild(card);

            //Chamando o modal ao clicar na imagem.
            card.onclick = () => {
                const modal = document.getElementById("modal")
                modal.style.visibility = "visible"

                //Limpando os resultados anteriores.
                const modalContent = document.getElementById("modal-content")
                modalContent.innerHTML = '';

                //Criando a div de imagem de cada personagem dentro do modal e passando a imagem correspondente ao personagem selecionado(backgroundImage).
                const characterImage = document.createElement("div")
                characterImage.style.backgroundImage =
                `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')`
                characterImage.className = "character-image"

                //Criando os detalhes dos personagens (Nome, Altura, Peso, Cor dos olhos e Nascimento).
                const name = document.createElement("span")
                name.className = "character-details"
                name.innerText = `Nome: ${character.name}`

                const characterHeight = document.createElement("span")
                characterHeight.className = "character-details"
                characterHeight.innerText = `Altura: ${convertHeight(character.height)}`

                const mass = document.createElement("span")
                mass.className = "character-details"
                mass.innerText = `Peso: ${convertMass(character.mass)}`

                const eyeColor = document.createElement("span")
                eyeColor.className = "character-details"
                eyeColor.innerText = `Cor dos olhos: ${convertEyeColor(character.eye_color)}`

                const birthYear = document.createElement("span")
                birthYear.className = "character-details"
                birthYear.innerText = `Nascimento: ${convertBirthYear(character.birth_year)}`

                //Passando os "span" p/ dentro de modalContent(Conteúdo do modal) com o appendChild, igual a estrutura HTML.
                modalContent.appendChild(characterImage)
                modalContent.appendChild(name)
                modalContent.appendChild(characterHeight)
                modalContent.appendChild(mass)
                modalContent.appendChild(eyeColor)
                modalContent.appendChild(birthYear)
            }
        });

        //Manipulando os botões no JS
        const nextButton = document.getElementById("next-button");
        const backButton = document.getElementById("back-button");

        //Habilitando ou desabilitando os botões Anterior e Proxima
        nextButton.disabled = !responseJson.next;
        backButton.disabled = !responseJson.previous;

        //Manipulando o botão de voltar |Se existir o previous(alguma pag anterior), botão visivel, se não, escondido.
        backButton.style.visibility = responseJson.previous? "visible" : "hidden";

        //A partir da pág dois, a currentPageUrl não terá mais o valor inicial, terá a url da próxima pág e assim por diante.
        currentPageUrl = url;

    } catch (error) {
        console.log(error);
        alert('Erro ao carregar os personagens');
    }
}

// Função para carregar a PRÓXIMA página.
async function loadNextPage () {
    //Previnindo um possivel erro. Só vai carregar a próx pág caso tenha um valor na currentPageUrl. Caso n tenha, vai interromper a função com o return.    
    if (!currentPageUrl) return;

    try {
        const response = await fetch(currentPageUrl);
        const responseJson = await response.json();

        await loadCharacters(responseJson.next);

    } catch (error) {
        console.log(error);
        alert('Erro ao carregar a próxima página');
    }
}

// Função para carregar a página ANTERIOR.
async function loadPreviousPage () {
    if (!currentPageUrl) return;

    try {
        const response = await fetch(currentPageUrl);
        const responseJson = await response.json();

        await loadCharacters(responseJson.previous);

    } catch (error) {
        console.log(error);
        alert('Erro ao carregar a página anterior');
    }
}

//Função ao clicar no modal ou fora dele, o modal fica hidden, escondido.
function hideModal() {
    const modal = document.getElementById("modal")
    modal.style.visibility = "hidden"
}

//Convertendo a cor dos olhos que originalmente vem em ingles pela API.
function convertEyeColor(eyeColor) {
    const cores = {
      blue: "azul",
      brown: "castanho",
      green: "verde",
      yellow: "amarelo",
      black: "preto",
      pink: "rosa",
      red: "vermelho",
      orange: "laranja",
      hazel: "avela",
      unknown: "desconhecida"
    };
  
    return cores[eyeColor.toLowerCase()] || eyeColor;
  }

//Convertendo a altura em decimal e acrescentando o "."
function convertHeight(height) {
    if (height === "unknown") {
        return "desconhecida"
    }
    return (height / 100).toFixed(2);
}

//Convertendo o peso em KG.
function convertMass(mass) {
    if (mass === "unknown") {
      return "desconhecido";
    }
    
    return `${mass} kg`;
  }

//Convertendo "unknown" em "desconhecido".
function convertBirthYear(birthYear) {
    if (birthYear === "unknown") {
      return "desconhecido";
    }
    
    return birthYear;
  }