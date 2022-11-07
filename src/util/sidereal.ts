const year = 31558149540
const day = 86164091
const offset = 22906350

export default (time: number, long: number) => {
    const sidereal = (time + offset + (long * day) / 360) % day
    return sidereal / day
}
