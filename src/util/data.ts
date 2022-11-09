import { writable } from 'svelte/store'
import type { star } from './types'

const data = writable<{
    stars: star[]
    starsIndexed: { [key: string]: star }
    constellationship: { [key: string]: [string, string][] }
}>(null)

export default data
;(async () => {
    const [stars, starsIndexed, constellationship] = await Promise.all(
        ['stars', 'stars_indexed', 'constellationship'].map(async file => {
            return await (await fetch(`data/${file}.json`)).json()
        })
    )
    data.set({ stars, starsIndexed, constellationship })
})()
