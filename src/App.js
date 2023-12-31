import { StartScreen } from './components/StartScreen';
import './styles/Global.css'

import { useCallback, useEffect, useState } from 'react'

import { wordsList } from './data/words'
import { Game } from './components/Game';
import { GameOver } from './components/GameOver';

const stages = [
  { id: 1, name: 'start' },
  { id: 2, name: 'game' },
  { id: 3, name: 'end' }
]

const guessesQty = 3

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setPickedCategory] = useState("")
  const [letters, setLetters] = useState([])

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessesQty)
  const [score, setScore] = useState(0)



  const pickWordAndCategory = useCallback(() => {

    //pick random category
    const categories = Object.keys(words)
    const randomCategory = categories[Math.floor(Math.random() * Object.keys(categories).length)];
    

    //pick random word
    const word = words[randomCategory][Math.floor(Math.random() * words[randomCategory].length)];
 

    return { word, randomCategory }
  },[words]);

  //start secret word game
  const startGame = useCallback(() => {
    //clear all letters
    clearLetterStates()

    //pick word and pick category
    const { word, randomCategory } = pickWordAndCategory()

    //create a array of letters
    let wordLetters = word.split("")
    wordLetters = wordLetters.map((letter) => letter.toLowerCase())


  

    //fill states
    setPickedWord(word)
    setPickedCategory(randomCategory)
    setLetters(wordLetters)


    setGameStage(stages[1].name)
  },[pickWordAndCategory])

  //process the letter input 

  function verifyLetter(letter) {
    const normalizedLetter = letter.toLowerCase()

    //checando se a letra ja foi utilizada
    if (guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)) {
      return;
    }

    //push guessed letter or remove a chance
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1)
    }
  };

  function clearLetterStates() {
    setGuessedLetters([])
    setWrongLetters([])
  }

  useEffect(() => {
    if (guesses <= 0) {
      //reset all stages
      clearLetterStates()

      setGameStage(stages[2].name)
    }
  }, [guesses])

  // checando condição de vitória
  useEffect(() => {

    const uniqueLetters = [...new Set(letters)];

    //condição de vitória
    if (guessedLetters.length === uniqueLetters.length) {
      // adicionar score
      setScore((actualScore) => actualScore += 10)

      // retarta o game chamando uma nova palavra
      startGame()
    }

  }, [guessedLetters, letters, startGame]);


  // retry the game
  function retry() {
    setScore(0)
    setGuesses(guessesQty)

    setGameStage(stages[0].name)
  }


  return (
    <div>
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' && <Game
        verifyLetter={verifyLetter}
        pickedWord={pickedWord}
        pickedCategory={pickedCategory}
        letters={letters}
        guessedLetters={guessedLetters}
        wrongLetters={wrongLetters}
        guesses={guesses}
        score={score}
      />
      }
      {gameStage === 'end' && <GameOver retry={retry} score={score} />}
    </div>

  );
}

export default App;
