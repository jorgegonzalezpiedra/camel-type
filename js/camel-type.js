// import { initWords } from "./game";

const AVAILABLE_LANGUAJES_MAP = 
  new Map([["Spanish", "es"], ["English", "en"]]);

const $languajePopup = document.getElementById('languaje-popup')
const $input = document.getElementById('input-word');
const $languajesList = document.getElementById('languajes-list');

function openPopup(){
  $input.blur
  $languajePopup.classList.add('open-languaje-popup')
  document.querySelector('.popup-overlay').style.display = 'block';

  $languajesList.innerHTML = Array.from(AVAILABLE_LANGUAJES_MAP).map(([clave, valor]) => {
    return `<li onclick='selectLanguaje(this)'>
    ${clave}
    </li>
    `
}).join('');
}

function closePopup(){
  $input.blur
  $languajePopup.classList.remove('open-languaje-popup')
  document.querySelector('.popup-overlay').style.display = 'none';
  
}

function selectLanguaje(element){
  let selectedLanguaje = AVAILABLE_LANGUAJES_MAP.get(element.innerHTML.trim(''))
  closePopup()
  // initWords()
}