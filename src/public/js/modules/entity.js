export default class Entity {

  constructor(element) {
    this.entity = element
    this.row = parseInt(element.getAttribute('data-row'))
    this.col = parseInt(element.getAttribute('data-col'))
    this.type = element.getAttribute('data-type')
    this.color = element.getAttribute('data-color')
  }

  equals(entity) {
    if(!entity) return false
    if(!entity.row) return false
    if(!entity.col) return false
    return (entity.row === this.row && entity.col === this.col)
  }

}