import { LCHECK, DCHECK } from './constants.js'

export function isEven(num) {
  return num % 2 === 0
}

export function isOdd(num) {
  return num % 2 !== 0
}

export function opposite(turn) {
  return turn === LCHECK ? DCHECK : LCHECK
}

export function padStart(string, padding, amount) {
  let padded = "";
  for(let i = 0; i < amount - 1; i++) {
    padded += padding;
  }
  padded += string ? string : padding;
  return padded.substr(padded.length - amount);
}

export function blankArray(width, height) {
  let temp = []
  for(let i = 0; i < height; i++) {
    temp.push(new Array(width).fill(false))
  }
  
  return temp
}