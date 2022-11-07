const constellations = [
    {
        abbreviation: 'And',
        name: 'Andromeda',
        genitive: 'Andromedae'
    },
    {
        abbreviation: 'Ant',
        name: 'Antlia',
        genitive: 'Antliae'
    },
    {
        abbreviation: 'Aps',
        name: 'Apus',
        genitive: 'Apodis'
    },
    {
        abbreviation: 'Aqr',
        name: 'Aquarius',
        genitive: 'Aquarii'
    },
    {
        abbreviation: 'Aql',
        name: 'Aquila',
        genitive: 'Aquilae'
    },
    {
        abbreviation: 'Ara',
        name: 'Ara',
        genitive: 'Arae'
    },
    {
        abbreviation: 'Ari',
        name: 'Aries',
        genitive: 'Arietis'
    },
    {
        abbreviation: 'Aur',
        name: 'Auriga',
        genitive: 'Aurigae'
    },
    {
        abbreviation: 'Boo',
        name: 'Bootes',
        genitive: 'Bootis'
    },
    {
        abbreviation: 'Cae',
        name: 'Caelum',
        genitive: 'Caeli'
    },
    {
        abbreviation: 'Cam',
        name: 'Camelopardalis',
        genitive: 'Camelopardalis'
    },
    {
        abbreviation: 'Cnc',
        name: 'Cancer',
        genitive: 'Cancri'
    },
    {
        abbreviation: 'CVn',
        name: 'Canes Venatici',
        genitive: 'Canum Venaticorum'
    },
    {
        abbreviation: 'CMa',
        name: 'Canis Maior',
        genitive: 'Canis Maioris'
    },
    {
        abbreviation: 'CMi',
        name: 'Canis Minor',
        genitive: 'Canis Minoris'
    },
    {
        abbreviation: 'Cap',
        name: 'Capricornus',
        genitive: 'Capricorni'
    },
    {
        abbreviation: 'Car',
        name: 'Carina',
        genitive: 'Carinae'
    },
    {
        abbreviation: 'Cas',
        name: 'Cassiopeia',
        genitive: 'Cassiopeiae'
    },
    {
        abbreviation: 'Cen',
        name: 'Centaurus',
        genitive: 'Centauri'
    },
    {
        abbreviation: 'Cep',
        name: 'Cepheus',
        genitive: 'Cephei'
    },
    {
        abbreviation: 'Cet',
        name: 'Cetus',
        genitive: 'Ceti'
    },
    {
        abbreviation: 'Cha',
        name: 'Chamaeleon',
        genitive: 'Chamaeleonis'
    },
    {
        abbreviation: 'Cir',
        name: 'Circinus',
        genitive: 'Circini'
    },
    {
        abbreviation: 'Col',
        name: 'Columba',
        genitive: 'Columbae'
    },
    {
        abbreviation: 'Com',
        name: 'Coma Berenices',
        genitive: 'Comae Berenicis'
    },
    {
        abbreviation: 'CrA',
        name: 'Corona Australis',
        genitive: 'Coronae Australis'
    },
    {
        abbreviation: 'CrB',
        name: 'Corona Borealis',
        genitive: 'Coronae Borealis'
    },
    {
        abbreviation: 'Crt',
        name: 'Crater',
        genitive: 'Crateris'
    },
    {
        abbreviation: 'Crv',
        name: 'Corvus',
        genitive: 'Corvi'
    },
    {
        abbreviation: 'Cru',
        name: 'Crux',
        genitive: 'Crucis'
    },
    {
        abbreviation: 'Cyg',
        name: 'Cygnus',
        genitive: 'Cygni'
    },
    {
        abbreviation: 'Del',
        name: 'Delphinus',
        genitive: 'Delphini'
    },
    {
        abbreviation: 'Dor',
        name: 'Dorado',
        genitive: 'Doradus'
    },
    {
        abbreviation: 'Dra',
        name: 'Draco',
        genitive: 'Draconis'
    },
    {
        abbreviation: 'Equ',
        name: 'Equuleus',
        genitive: 'Equulei'
    },
    {
        abbreviation: 'Eri',
        name: 'Eridanus',
        genitive: 'Eridani'
    },
    {
        abbreviation: 'For',
        name: 'Fornax',
        genitive: 'Fornacis'
    },
    {
        abbreviation: 'Gem',
        name: 'Gemini',
        genitive: 'Geminorum'
    },
    {
        abbreviation: 'Gru',
        name: 'Grus',
        genitive: 'Gruis'
    },
    {
        abbreviation: 'Her',
        name: 'Hercules',
        genitive: 'Herculis'
    },
    {
        abbreviation: 'Hor',
        name: 'Horologium',
        genitive: 'Horologii'
    },
    {
        abbreviation: 'Hya',
        name: 'Hydra',
        genitive: 'Hydrae'
    },
    {
        abbreviation: 'Hyi',
        name: 'Hydrus',
        genitive: 'Hydri'
    },
    {
        abbreviation: 'Ind',
        name: 'Indus',
        genitive: 'Indi'
    },
    {
        abbreviation: 'Lac',
        name: 'Lacerta',
        genitive: 'Lacertae'
    },
    {
        abbreviation: 'Leo',
        name: 'Leo',
        genitive: 'Leonis'
    },
    {
        abbreviation: 'LMi',
        name: 'Leo Minor',
        genitive: 'Leonis Minoris'
    },
    {
        abbreviation: 'Lep',
        name: 'Lepus',
        genitive: 'Leporis'
    },
    {
        abbreviation: 'Lib',
        name: 'Libra',
        genitive: 'Librae'
    },
    {
        abbreviation: 'Lup',
        name: 'Lupus',
        genitive: 'Lupi'
    },
    {
        abbreviation: 'Lyn',
        name: 'Lynx',
        genitive: 'Lyncis'
    },
    {
        abbreviation: 'Lyr',
        name: 'Lyra',
        genitive: 'Lyrae'
    },
    {
        abbreviation: 'Men',
        name: 'Mensa',
        genitive: 'Mensae'
    },
    {
        abbreviation: 'Mic',
        name: 'Microscopium',
        genitive: 'Microscopii'
    },
    {
        abbreviation: 'Mon',
        name: 'Monoceros',
        genitive: 'Monocerotis'
    },
    {
        abbreviation: 'Mus',
        name: 'Musca',
        genitive: 'Muscae'
    },
    {
        abbreviation: 'Nor',
        name: 'Norma',
        genitive: 'Normae'
    },
    {
        abbreviation: 'Oct',
        name: 'Octans',
        genitive: 'Octantis'
    },
    {
        abbreviation: 'Oph',
        name: 'Ophiuchus',
        genitive: 'Ophiuchi'
    },
    {
        abbreviation: 'Ori',
        name: 'Orion',
        genitive: 'Orionis'
    },
    {
        abbreviation: 'Pav',
        name: 'Pavo',
        genitive: 'Pavonis'
    },
    {
        abbreviation: 'Peg',
        name: 'Pegasus',
        genitive: 'Pegasi'
    },
    {
        abbreviation: 'Per',
        name: 'Perseus',
        genitive: 'Persei'
    },
    {
        abbreviation: 'Phe',
        name: 'Phoenix',
        genitive: 'Phoenicis'
    },
    {
        abbreviation: 'Pic',
        name: 'Pictor',
        genitive: 'Pictoris'
    },
    {
        abbreviation: 'Psc',
        name: 'Pisces',
        genitive: 'Piscium'
    },
    {
        abbreviation: 'PsA',
        name: 'Piscis Austrinus',
        genitive: 'Piscis Austrini'
    },
    {
        abbreviation: 'Pup',
        name: 'Puppis',
        genitive: 'Puppis'
    },
    {
        abbreviation: 'Pyx',
        name: 'Pyxis',
        genitive: 'Pyxidis'
    },
    {
        abbreviation: 'Ret',
        name: 'Reticulum',
        genitive: 'Reticuli'
    },
    {
        abbreviation: 'Sge',
        name: 'Sagitta',
        genitive: 'Sagittae'
    },
    {
        abbreviation: 'Sgr',
        name: 'Sagittarius',
        genitive: 'Sagittarii'
    },
    {
        abbreviation: 'Sco',
        name: 'Scorpius',
        genitive: 'Scorpii'
    },
    {
        abbreviation: 'Scl',
        name: 'Sculptor',
        genitive: 'Sculptoris'
    },
    {
        abbreviation: 'Sct',
        name: 'Scutum',
        genitive: 'Scuti'
    },
    {
        abbreviation: 'Ser',
        name: 'Serpens',
        genitive: 'Serpentis'
    },
    {
        abbreviation: 'Sex',
        name: 'Sextans',
        genitive: 'Sextantis'
    },
    {
        abbreviation: 'Tau',
        name: 'Taurus',
        genitive: 'Tauri'
    },
    {
        abbreviation: 'Tel',
        name: 'Telescopium',
        genitive: 'Telescopii'
    },
    {
        abbreviation: 'Tri',
        name: 'Triangulum',
        genitive: 'Trianguli'
    },
    {
        abbreviation: 'TrA',
        name: 'Triangulum Australe',
        genitive: 'Trianguli Australis'
    },
    {
        abbreviation: 'Tuc',
        name: 'Tucana',
        genitive: 'Tucanae'
    },
    {
        abbreviation: 'UMa',
        name: 'Ursa Major',
        genitive: 'Ursae Majoris'
    },
    {
        abbreviation: 'UMi',
        name: 'Ursa Minor',
        genitive: 'Ursae Minoris'
    },
    {
        abbreviation: 'Vel',
        name: 'Vela',
        genitive: 'Velae'
    },
    {
        abbreviation: 'Vir',
        name: 'Virgo',
        genitive: 'Virginis'
    },
    {
        abbreviation: 'Vol',
        name: 'Volans',
        genitive: 'Volantis'
    },
    {
        abbreviation: 'Vul',
        name: 'Vulpecula',
        genitive: 'Vulpeculae'
    }
]
export default constellations

export const abbreviations = constellations.map(
    ({ abbreviation }) => abbreviation
)
export const names = constellations.map(({ name }) => name)
