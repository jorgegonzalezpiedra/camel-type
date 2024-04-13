/**
 * JS of game behaviour
 */
export let wordsApiUrl = 'https://random-word-api.herokuapp.com/word?number=30&lang=en';
const $time = document.querySelector('time');
const $paragraph = document.querySelector('p');
const $input = document.getElementById('input-word');
const $game = document.getElementById('game')
const $results = document.getElementById('results')
const $wpm = $results.querySelector('#results-wpm')
const $accuracy = $results.querySelector('#results-accuracy')
const $button = $results.querySelector('#reload-button')
const $languajeButton = document.getElementById('languaje-button')

const INITIAL_TIME = 30

let words = []
let currentTime = INITIAL_TIME
let playing

initWords()

export async function initWords(){
    fetch(wordsApiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok', response)
      }
      return response.json()
    })
    .then(data => {
        
      words = trimWords(data).slice(0,30)

      initGame()
      initEvents()
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
  
}

export async function initGame() {
    $game.style.display = 'flex'
    $languajeButton.style.display = 'block'
    $results.style.display = 'none'
    $input.value = ''
    $input.focus()

    playing = false

    currentTime = INITIAL_TIME

    $time.textContent = currentTime
    
    $paragraph.innerHTML = words.map((word) => {
        const letters = word.split('')

        return `<word>
        ${letters
            .map(letter => `<letter>${letter}</letter>`)
            .join('')
        }
        </word>
        `
    }).join('')

    const $firstWord = $paragraph.querySelector('word')
    $firstWord.classList.add('active')
    $firstWord.querySelector('letter').classList.add('active')
}

export async function initEvents() {
    $input.addEventListener('keydown', () => {
        $input.focus()
        if (!playing) {
        playing = true
        const intervalId = setInterval(() => {
            currentTime--
            $time.textContent = currentTime

            if (currentTime === 0) {
            clearInterval(intervalId)
            gameOver()
            }
        }, 1000)
        }
    })
    $input.addEventListener('keydown', onKeyDown)
    $input.addEventListener('keyup', onKeyUp)
    $button.addEventListener('click', initGame)
    $paragraph.addEventListener('click', $input.focus())
}

export function onKeyDown(event) {
    const $currentWord = $paragraph.querySelector('word.active')
    const $currentLetter = $currentWord.querySelector('letter.active')

    const { key } = event
    if (key === ' ') {
        event.preventDefault()

        const $nextWord = $currentWord.nextElementSibling
        const $nextLetter = $nextWord.querySelector('letter')

        $currentWord.classList.remove('active', 'marked')
        $currentLetter.classList.remove('active')

        $nextWord.classList.add('active')
        $nextLetter.classList.add('active')

        $input.value = ''

        const hasMissedLetters = $currentWord
        .querySelectorAll('letter:not(.correct)').length > 0

        const classToAdd = hasMissedLetters ? 'marked' : 'correct'
        $currentWord.classList.add(classToAdd)

        return
    }

    if (key === 'Backspace') {
        const $prevWord = $currentWord.previousElementSibling
        const $prevLetter = $currentLetter.previousElementSibling

        if (!$prevWord && !$prevLetter) {
        event.preventDefault()
        return
        }

        const $wordMarked = $paragraph.querySelector('word.marked')
        if ($wordMarked && !$prevLetter) {
        event.preventDefault()
        $prevWord.classList.remove('marked')
        $prevWord.classList.add('active')

        const $letterToGo = $prevWord.querySelector('letter:last-child')

        $currentLetter.classList.remove('active')
        $letterToGo.classList.add('active')

        $input.value = [
            ...$prevWord.querySelectorAll('letter.correct, letter.incorrect')
        ].map($el => {
            return $el.classList.contains('correct') ? $el.innerText : '*'
        })
            .join('')
        }
    }
}

export function onKeyUp() {
    // recuperamos los elementos actuals
    const $currentWord = $paragraph.querySelector('word.active')
    const $currentLetter = $currentWord.querySelector('letter.active')

    const currentWord = $currentWord.innerText.trim()
    $input.maxLength = currentWord.length

    const $allLetters = $currentWord.querySelectorAll('letter')

    $allLetters.forEach($letter => $letter.classList.remove('correct', 'incorrect'))

    $input.value.split('').forEach((char, index) => {
        const $letter = $allLetters[index]
        const letterToCheck = currentWord[index]

        const isCorrect = char === letterToCheck
        const letterClass = isCorrect ? 'correct' : 'incorrect'
        $letter.classList.add(letterClass)
    })

    $currentLetter.classList.remove('active', 'is-last')
    const inputLength = $input.value.length
    const $nextActiveLetter = $allLetters[inputLength]

    if ($nextActiveLetter) {
        $nextActiveLetter.classList.add('active')
    } else {
        $currentLetter.classList.add('active', 'is-last')
        // TODO: gameover si no hay próxima palabra
    }
}

export function gameOver() {
    $game.style.display = 'none'
    $languajeButton.style.display = 'none'

    $results.style.display = 'flex'

    const correctWords = $paragraph.querySelectorAll('word.correct').length
    const correctLetter = $paragraph.querySelectorAll('letter.correct').length
    const incorrectLetter = $paragraph.querySelectorAll('letter.incorrect').length

    const totalLetters = correctLetter + incorrectLetter

    const accuracy = totalLetters > 0
        ? (correctLetter / totalLetters) * 100
        : 0

    const wpm = correctWords * 60 / INITIAL_TIME
    $wpm.textContent = wpm
    $accuracy.textContent = `${accuracy.toFixed(2)}%`
}

export function setWorldApi(api){
    wordsApiUrl = api;
}

/**
 * The api that returns words, sometimes, return in one position 
 * more than one word. Eg: "Más fuerte"
 * This method treat that to trim that words and re-arrange the array
 */
export function trimWords(words){

    words.forEach((word, index) => {
        if(word.indexOf(' ') >= 0){
            let arr = word.split(' ')
            words.splice(index, 1, ...arr)
        }
    })

    return words;

}