import { writable } from 'svelte/store'

let startTime: number

export const resetTimer = () => {
    running = true
    startTime = Date.now()
    requestAnimationFrame(updateTimer)
}

let running = false

export const stopTimer = () => {
    running = false
}

export const timer = writable<number>()

const updateTimer = () => {
    timer.set(Date.now() - startTime)
    if (running) requestAnimationFrame(updateTimer)
}

export const formatTime = (time: number) => {
    time = Math.round(time / 1000)
    if (time >= 3600) {
        return `${Math.floor(time / 3600)}:${`${Math.floor(
            (time % 3600) / 60
        )}`.padStart(2, '0')}:${`${time % 60}`.padStart(2, '0')}`
    }
    return `${Math.floor((time % 3600) / 60)}:${`${time % 60}`.padStart(
        2,
        '0'
    )}`
}
