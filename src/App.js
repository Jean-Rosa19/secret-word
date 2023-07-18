import { StartScreen } from './components/StartScreen';
import './styles/Global.css'

import {useCallback, useEffect, useState} from 'react'

import {wordsList} from './data/words'
import { Game } from './components/Game';
import { GameOver } from './components/GameOver';

const stages = [
  {id:1, name: 'start'},
  {id:2, name: 'game'},
  {id:3, name: 'end'}
]

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)

  console.log(words)

  return (
    <div>
      {gameStage === 'start' && <StartScreen />}
      {gameStage === 'game' && <Game />}
      {gameStage === 'end' && <GameOver />}
    </div>
   
  );
}

export default App;