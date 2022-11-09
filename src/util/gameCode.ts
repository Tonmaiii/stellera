import constellationNames from '../util/constellations'
import greekLetters from './greekLetters'
import type { star } from './types'

export const encode = (
    showConstellation: boolean,
    useDesignation: boolean,
    starWithName: boolean,
    constellations: boolean[],
    identifiers: boolean[]
) =>
    BigInt(showConstellation) |
    (BigInt(useDesignation) << 1n) |
    (BigInt(starWithName) << 2n) |
    (constellations.reduceRight(
        (sum, value) => (sum << 1n) | BigInt(value),
        0n
    ) <<
        3n) |
    (identifiers.reduceRight((sum, value) => (sum << 1n) | BigInt(value), 0n) <<
        (3n + BigInt(constellations.length)))

export const decode = (gameCode: bigint) => {
    const showConstellation = Boolean(gameCode & 1n)
    const useDesignation = Boolean((gameCode >> 1n) & 1n)
    const starWithName = Boolean((gameCode >> 2n) & 1n)
    const constellations = constellationNames.map((_, i) =>
        Boolean((gameCode >> (BigInt(i) + 3n)) & 1n)
    )
    const identifiers = greekLetters.map((_, i) =>
        Boolean(
            (gameCode >> (BigInt(i) + 3n + BigInt(constellationNames.length))) &
                1n
        )
    )
    return {
        useDesignation,
        showConstellation,
        starWithName,
        identifiers,
        constellations
    }
}

export const generateIncludedStars = (
    stars: star[],
    starWithName: boolean,
    constellations: boolean[],
    identifiers: boolean[]
) => {
    const includedConstellations = constellationNames
        .filter((_, i) => constellations[i])
        .map(({ abbreviation }) => abbreviation)
    const includedIdentifiers = greekLetters
        .filter((_, i) => identifiers[i])
        .map(({ abbreviation }) => abbreviation)
    return stars
        .filter(
            star =>
                includedConstellations.includes(star.constellation) &&
                ((starWithName &&
                    star.display_name !== star.designation_name) ||
                    includedIdentifiers.includes(star.identifier))
        )
        .map(star => star.HIC)
}
