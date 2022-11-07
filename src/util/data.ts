import type { star } from './types'

export default Promise.all(
    [
        'stars',
        'stars_indexed',
        'names',
        'constellationship'
        // 'clickable_stars/stars',
        // 'clickable_stars/stars_indexed'
    ].map(async file => {
        return await (await fetch(`data/${file}.json`)).json()
    })
) as Promise<
    [
        star[],
        { [key: string]: star },
        { [key: string]: string },
        { [key: string]: [string, string][] }
        // star[],
        // { [key: string]: star }
    ]
>
