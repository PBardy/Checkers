export default class Board {

  constructor(board) {
    this.board = board
  }

  getTile(row, col) {
    if(row > this.board.length - 1) return
    if(col > this.board.length - 1) return
    if(this.board[row] == null) return
    return this.board[row][col]
  }

  getTilesBetween(start, end, dr, dc) {
    let tiles = []
    for (let i = 1; i < this.board.length - 1; i++) {
      const row = start.row + (dr * i)
      const col = start.col + (dc * i)
      if (row < 0 || row > this.board.length - 1) break
      if (col < 0 || col > this.board.length - 1) break
      tiles.push(this.board[row][col])
      if (row === end.row && col === end.col) break
    }
  
    return tiles
  }

}