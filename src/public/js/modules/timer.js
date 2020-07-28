import { padStart } from './util.js'

const timerOutput = document.getElementById('timer-output')

let time = 0
let lastTime = 0

function formatSeconds(time) {
  const secs = time % 60
  const mins = Math.floor(time / 60)
  return `${padStart(mins, '0', 2)}:${padStart(secs, '0', 2)}`
}

function updateTimer(delta) {
  window.requestAnimationFrame(updateTimer)
  if(delta - lastTime >= 1000) {
    time++
    lastTime = delta
    timerOutput.innerHTML = formatSeconds(time)
  }
}

export function startTimer() {
  window.requestAnimationFrame(updateTimer)
}