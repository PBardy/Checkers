import Board from './board.js'
import Entity from './entity.js'
import { LCHECK, DTILE } from './constants.js'

export default class Movement {

  constructor(st, et, turn, board) {
    this.st = st instanceof Entity ? st: new Entity(st)
    this.et = et instanceof Entity ? et: new Entity(et)
    this.turn = turn
    this.board = new Board(board)
  }

  get dr() {
    return (this.et.row - this.st.row)
  }

  get dc() {  
    return (this.et.col - this.st.col)
  }

  get distance() {
    return Math.floor(Math.sqrt(Math.pow(this.dr, 2) + Math.pow(this.dc, 2)))
  }

  get validSource() {
    return this.st.color === this.turn
  }

  get validTarget() {
    return this.et.color === DTILE && !this.board.getTile(this.et.row, this.et.col)
  }

  get isDiagonal() {
    return Math.abs(this.et.row - this.st.row) === Math.abs(this.et.col - this.st.col)
  }

  get isBackward() {
    return this.turn === LCHECK ? (this.st.row < this.et.row) : (this.st.row > this.et.row)
  }

  get inBetween() {
    return this.board.getTilesBetween(this.st, this.et, this.dr / Math.abs(this.dr), this.dc / Math.abs(this.dc))
  }

  equals(move) {
    if(move == null) return false
    if(move.st == null) return false
    if(move.et == null) return false
    if(move.st.row == null) return false
    if(move.et.row == null) return false
    if(move.st.col == null) return false
    if(move.et.col == null) return false
    return move.st.row === this.st.row && move.et.row === this.et.row && move.et.col === this.et.col && move.st.col === this.st.col
  }

}