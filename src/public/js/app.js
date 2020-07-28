import { LCHECK, DCHECK, LTILE, DTILE, BOARD_SIZE, PLEB, KING, SOURCE_COLOR } from './modules/constants.js'
import { isEven, isOdd, opposite, blankArray } from './modules/util.js'
import { startTimer } from './modules/timer.js'
import Entity from './modules/entity.js'
import Movement from './modules/movement.js'

const gameBoard = document.getElementById('GameBoard')
const player1ScoreEl = document.getElementById('player1-score')
const player2ScoreEl = document.getElementById('player2-score')

let board = []
let tiles = []
let checkers = []
let potentialMoves = []
let turn = LCHECK
let player1Score = 0
let player2Score = 0
let selectedTile = null
let selectedChecker = null

function isValidMovement(move) {
  if (!move.validSource) return false
  if (!move.validTarget) return false
  if (!move.isDiagonal) return false
  if ((move.distance < 1)) return false
  if ((move.distance > 2)) return false
  if ((move.st.type === PLEB) && (move.isBackward)) return false
  if ((move.distance === 2) && move.inBetween[0] !== opposite(turn)) return false
  return true
}

function getPotentialMoves() {
  let moves = []
  for(let x = 1; x <= 2; x++) {
    for(let i = -1; i <= 2; i+=2) {
      for(let j = -1; j <= 2; j+=2) {
        const row = selectedTile.row - (i * x)
        const col = selectedTile.col + (j * x)
        if(row < 0 || row > 7) continue
        if(col < 0 || col > 7) continue
        const tile = getTile(row, col)
        const move = new Movement(selectedChecker, tile, turn, board)
        if(!isValidMovement(move)) continue
        moves.push(move)
      }
    }
  }

  return moves
}

function getTile(row, col) {
  return tiles[(row * BOARD_SIZE) + col]
}

function getChecker(row, col) {
  const checker = checkers.filter((value) => {
    return value.row === row && value.col === col
  })
  if(checker.length <= 0) return
  return checker[0]
}

function getBoardDetails() {
  return {
    board: board,
    width: gameBoard.clientWidth,
    height: gameBoard.clientHeight,
    size: gameBoard.clientWidth / BOARD_SIZE,
    checkerSize: (gameBoard.clientWidth / BOARD_SIZE) * 0.8,
  }
}

function getRank(move) {
  if(move.st.type === KING) return true
  if(move.et.row === 0 && turn === LCHECK) return true
  if(move.et.row === 7 && turn === DCHECK) return true 
  return false
}

function moveChecker(movement) {
  const lastPos = getTile(movement.st.row, movement.st.col)
  const checker = getChecker(movement.st.row, movement.st.col)
  const { size, checkerSize } = getBoardDetails()
  const rank = getRank(movement) ? KING : PLEB
  movement.st.entity.setAttribute('data-type', rank)
  movement.st.entity.setAttribute('data-row', movement.et.row)
  movement.st.entity.setAttribute('data-col', movement.et.col)
  movement.st.entity.style.top =  `${size * movement.et.row + ((size - checkerSize) * 0.5)}px`
  movement.st.entity.style.left = `${size * movement.et.col + ((size - checkerSize) * 0.5)}px`
  board[movement.st.row][movement.st.col] = false
  board[movement.et.row][movement.et.col] = movement.st.color
  checker.type = rank
  checker.row = movement.et.row
  checker.col = movement.et.col
  selectedChecker = checker
  lastPos.entity.style.backgroundColor = DTILE
  potentialMoves = []
}

function removeChecker(move) {
  const row = move.st.row + ((move.dr) / Math.abs(move.dr))
  const col = move.st.col + ((move.dc) / Math.abs(move.dc))
  const checker = getChecker(row, col)
  if(checker == null) return
  checker.entity.style.display = 'none'
  checkers.splice(checkers.indexOf(checker), 1)
  if(checker.color === DCHECK) (player1Score++)
  if(checker.color === LCHECK) (player2Score++)
  board[row][col] = false
  player1ScoreEl.innerHTML = player1Score
  player2ScoreEl.innerHTML = player2Score
}

function selectTile(event) {
  if (!selectedChecker) return
  const tile = event.target
  const move = new Movement(selectedChecker, tile, turn, board)
  selectedTile = new Entity(tile)
  const valid = potentialMoves.some(value => { return value.equals(move) })
  if(!valid) return
  moveChecker(move)
  if(move.distance === 1) {
    selectedTile = null
    selectedChecker = null
    turn = opposite(turn)
  } else {
    removeChecker(move)
    potentialMoves = getPotentialMoves()
    potentialMoves = potentialMoves.filter(value => { return value.distance === 2 })
    if(potentialMoves.length === 0) {
      selectedChecker = null
      turn = opposite(turn)
    }
  }
}

function selectChecker(event) {
  const checker = new Entity(event.target)
  if (checker.color !== turn) return
  const beneath = getTile(checker.row, checker.col)

  if (checker.equals(selectedChecker)) {
    selectedTile = null
    selectedChecker = null
    beneath.entity.style.backgroundColor = beneath.color
    return
  }

  if (selectedChecker == null) {
    selectedTile = beneath
    selectedChecker = checker
    beneath.entity.style.backgroundColor = SOURCE_COLOR
    potentialMoves = getPotentialMoves()
    return
  }

}

function addTile(row, col) {
  const div = document.createElement('div')
  const filled = (isEven(row) && isEven(col)) || (isOdd(row) && isOdd(col))
  const color = filled ? DTILE : LTILE
  div.classList.add('Tile')
  div.style.backgroundColor = color
  div.setAttribute('data-row', row)
  div.setAttribute('data-col', col)
  div.setAttribute('data-color', color)
  div.addEventListener('click', selectTile, false)
  gameBoard.appendChild(div)
  tiles.push(new Entity(div))
}

function addChecker(row, col, color, size, checkerSize) {
  const div = document.createElement('div')
  div.style.width = `${checkerSize}px`
  div.style.height = `${checkerSize}px`
  div.style.top = `${size * row + ((size - checkerSize) * 0.5)}px`
  div.style.left = `${size * col + ((size - checkerSize) * 0.5)}px`
  div.style.backgroundColor = color
  div.classList.add('Checker')
  div.setAttribute('data-row', row)
  div.setAttribute('data-col', col)
  div.setAttribute('data-type', PLEB)
  div.setAttribute('data-color', color)
  div.addEventListener('click', selectChecker, false)
  gameBoard.appendChild(div)
  board[row][col] = color
  checkers.push(new Entity(div))
}

function addDarkChecker(row, col, size, checkerSize) {
  if (row > 2) return
  if (isEven(row) && isOdd(col)) return
  if (isEven(col) && isOdd(row)) return
  addChecker(row, col, DCHECK, size, checkerSize)
}

function addLightChecker(row, col, size, checkerSize) {
  if (row < 5) return
  if (isOdd(row) && isEven(col)) return
  if (isOdd(col) && isEven(row)) return
  addChecker(row, col, LCHECK, size, checkerSize)
}

function onKeyDown(event) {
  if(event.keyCode === 82) {
    window.location.href = '/src/'
  }
}

function setup() {

  const { size, checkerSize } = getBoardDetails()

  turn = LCHECK
  board = blankArray(BOARD_SIZE, BOARD_SIZE)
  gameBoard.innerHTML = ''

  for (let i = 0; i < 64; i++) {
    const row = Math.floor(i / BOARD_SIZE)
    const col = i - (BOARD_SIZE * row)
    addTile(row, col)
    addDarkChecker(row, col, size, checkerSize)
    addLightChecker(row, col, size, checkerSize)
  }

  window.addEventListener('keydown', onKeyDown, false)

}

setup()
startTimer()