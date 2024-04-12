/**
 * JS of general page behaviour
 */
import { initWords, setWorldApi} from "./game.js";

const AVAILABLE_LANGUAJES_MAP = 
  new Map([["Spanish", "es"], ["English", "en"]]);

const $languajePopup = document.getElementById('languaje-popup')
const $languajeButton = document.getElementById('languaje-button')
const $input = document.getElementById('input-word');
const $languajesList = document.getElementById('languajes-list');
const $languajeText = document.getElementById('languaje-text');

$languajeButton.addEventListener("click", () =>{
  openPopup();
}); 

export function openPopup(){
  $input.blur
  $languajePopup.classList.add('open-languaje-popup')
  document.querySelector('.popup-overlay').style.display = 'block';

  //languajes list creation
  $languajesList.innerHTML = Array.from(AVAILABLE_LANGUAJES_MAP).map(([clave, valor]) => {
      return `<li lang='${valor}'>
      ${clave}
      </li>
      `
  }).join('');
    
  //click event of languajes items
  $languajesList.querySelectorAll('li').forEach(item => {
     item.addEventListener("click", () => {
       closePopup();
     })

    item.addEventListener("click", () => {
      selectLanguaje(item.lang , item.innerHTML);
    })
  })

}

export function closePopup(){
  $input.blur
  $languajePopup.classList.remove('open-languaje-popup')
  document.querySelector('.popup-overlay').style.display = 'none'; 
}

export function selectLanguaje(lang , langText){
  let wordsApiUrl = "https://random-word-api.herokuapp.com/word?number=50&lang=" + lang
  $languajeText.innerHTML = langText
  setWorldApi(wordsApiUrl);
  closePopup()
  initWords()
}