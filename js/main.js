//DOM Objects
const mainScreen = document.querySelector('.main-screen');
const pokeName = document.querySelector('.poke-name');
const pokeId = document.querySelector('.poke-id');
const pokeFrontImage = document.querySelector('.poke-front-image');
const pokeBackImage = document.querySelector('.poke-back-image');
const pokeTypeOne= document.querySelector('.poke-type-one');
const pokeTypeTwo= document.querySelector('.poke-type-two');
const pokeWeight= document.querySelector('.poke-weight');
const pokeHeight= document.querySelector('.poke-height');
const pokeListItems = document.querySelectorAll('.list-item');
const leftButton = document.querySelector('.left-button');
const rightButton = document.querySelector('.right-button');


//constantes y variables

const TYPES = [
    'normal', 'fighting', 'flying',
    'poison', 'ground', 'rock',
    'bug', 'ghost', 'steel',
    'fire', 'water', 'grass',
    'electric', 'psychic', 'ice',
    'dragon', 'dark', 'fairy'
];

let prevUrl = null;
let nextUrl = null;

//Functions
//convierte a mayusculas el primer caracter
const capitalize = (str) => str[0].toUpperCase() + str.substr(1);

const resetScreen = () => {
    mainScreen.classList.remove('hide');
    //for of de los tipos de pokemons
    for( const type of TYPES){
        mainScreen.classList.remove(type);
    }
};

const fetchPokeList = url => {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            //console.log(data);
            // const results = data['results'];
            // console.log(results);
            //se estructuran las propiedades de nuestra variable
            const {results, previous, next} = data;
            prevUrl = previous;
            nextUrl = next;
            // console.log(results);
            for (let i = 0; i < pokeListItems.length ; i++) {
                const pokeListItem = pokeListItems[i];
                const resultData = results[i];

                if(resultData) {
                    const { name, url } = resultData;
                    const urlArray = url.split('/');
                    const id = urlArray[urlArray.length - 2];
                    // console.log(urlArray);
                    pokeListItem.textContent = id + '. ' + capitalize( name);
                } else {
                    pokeListItem.textContent = '';
                }
            }
            
        });

}


const fetchPokeData = id => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(res => res.json()) //transforma el retorno en json 
    .then(data => {
        //console.log(data); //lo imprime

        resetScreen();

        const dataTypes = data['types']; //tipo del pokemon
        const dataFirstType = dataTypes[0]; //primer tipo del pokemon
        const dataSecondType = dataTypes[1]; //segundo tipo del pokemon
        pokeTypeOne.textContent = capitalize( dataFirstType['type']['name']); //imprime el primer tipo del pokemon
        if(dataSecondType){ // si el pokemon tiene un segundo tipo
            pokeTypeTwo.classList.remove('hide') //remueve la clse hide
            pokeTypeTwo.textContent = capitalize(dataSecondType['type']['name']); // imprime el segundi tipo
        }else {
        pokeTypeTwo.classList.add('hide') // añade la clase hide para que no se vea un circulo sin nada
        pokeTypeTwo.textContent = ''; // solo un string vacio
        }
        mainScreen.classList.add(dataFirstType['type']['name']);
        // mainScreen.classList.remove('hide');

        pokeName.textContent = capitalize( data['name']);
        pokeId.textContent = '#' + data['id'].toString().padStart(3, '0');
        pokeWeight.textContent = data['weight'];
        pokeHeight.textContent = data['height'];



        pokeFrontImage.src = data['sprites']['front_default'] || '';
        pokeBackImage.src = data['sprites']['back_default'] || '';

    });
}

//OBoton izquierdo
const handleLeftButtonClick = () => {
    if (prevUrl) {
      fetchPokeList(prevUrl);
    }
  };
  

//boton derecho
const handleRightButtonClick = () => {
    if (nextUrl) {
      fetchPokeList(nextUrl);
    }
  };

  const handleListItemClick = (e) => {
    if (!e.target) return;
  
    const listItem = e.target;
    if (!listItem.textContent) return;
  
    const id = listItem.textContent.split('.')[0];
    fetchPokeData(id);
  };
  

//event listeners

leftButton.addEventListener('click', handleLeftButtonClick);
rightButton.addEventListener('click', handleRightButtonClick);
for (const pokeListItem of pokeListItems) {
  pokeListItem.addEventListener('click', handleListItemClick);
}




//iniciar app

fetchPokeList('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20');