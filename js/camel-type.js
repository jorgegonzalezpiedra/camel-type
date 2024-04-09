const $languajePopup = document.getElementById('languaje-popup')
const $input = document.querySelector('input');

function openPopup(){
  $languajePopup.classList.add('open-languaje-popup')
  $input.blur
}

function closePopup(){
  $languajePopup.classList.remove('open-languaje-popup')
  $input.blur
}