let currentPageUrl = 'https://swapi.dev/api/people/'    //Endpoint da API que vamos consumir.(declarado como let, pois dependendo do card, as informações iram mudar e consequentemente a url)

window.onload = async () => {     //Carregando as infos da API toda vez que a pag. for atualizada.
    try {
        await loadCharacters(currentPageUrl);     //A função loadCharacters irá ler o endpoint da API, toda vez que a pag. for atualizada.
    } catch (error) {
        console.log(error);
        alert('Erro ao carregar cards');
    }

    const nextButton = document.getElementById('next-button')
    const backButton = document.getElementById('back-button')

    //Monitorando eventos no elemento next/back button |Toda vez que o botão for clicado, irá p/ pag seguinte(Next) ou p/ a anterior(Previous)|
    nextButton.addEventListener('click', loadNextPage)
    backButton.addEventListener('click', loadPreviousPage)
};


async function loadCharacters(url) {
    const mainContent = document.getElementById('main-content');  //Manipulando com o DOM.
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
            mainContent.appendChild(card)
        });

        const nextButton = document.getElementById('next-button')
        const backButton = document.getElementById('back-button')

        //Habilitando ou desabilitando os botões Anterior e Proxima
        nextButton.disabled = !responseJson.next
        backButtonButton.disabled = !responseJson.previous

        //Manipulando o botão de voltar |Se existir o previous(alguma pag anterior), botão visivel, se não, escondido.
        backButton.style.visibility = responseJson.previous? "visible" : "hidden"

        currentPageUrl = url

    } catch (error) {
        alert('Erro ao carregar os personagens')
        console.log(error)
    }
}
