import {Expansion} from "./Expansions";

export type Civ = string | { leader: string, civ: string }

export function hasLeader(civ: Civ): civ is {leader: string, civ: string} {
    return !(typeof civ === 'string');
}

export function civsEqual(a: Civ, b: Civ) {
    if (!hasLeader(a) || !hasLeader(b)) {
        return a === b;
    }
    
    return a.leader === b.leader && a.civ === b.civ;
}

export const Civs : { [ex in Exclude<Expansion, "custom">]: Civ[] } = {
    "civ5-vanilla": [
        "America",
        "Arabia",
        "Assyria",
        "Austria",
        "The Aztecs",
        "Babylon",
        "Brazil",
        "Byzantium",
        "Carthage",
        "The Celts",
        "China",
        "Denmark",
        "Netherlands",
        "Egypt",
        "England",
        "Ethiopia",
        "France",
        "Germany",
        "Greece",
        "The Huns",
        "The Inca",
        "India",
        "Indonesia",
        "The Iroquois",
        "Japan",
        "Korea",
        "The Maya",
        "Mongolia",
        "Morocco",
        "The Ottomans",
        "Persia",
        "Poland",
        "Polynesia",
        "Portugal",
        "Rome",
        "Russia",
        "The Shoshone",
        "Siam",
        "Songhai",
        "Spain",
        "Sweden",
        "Mali",
        "The Zulu",
    ],

    lekmod: [
        'Akkad',
        'Akzum',
        'Argentina',
        'Armenia',
        'Australia',
        'Ayyubids',
        'Belgium',
        'Boers',
        'Bolivia',
        'Brunei',
        'Bulgaria',
        'Burma',
        'Canada',
        'Chile',
        'Colombia',
        'Cuba',
        'Finland',
        'Franks',
        'Gauls',
        'Georgia',
        'Golden Horde',
        'Goths',
        'Hittites',
        'Hungary',
        'Ireland',
        'Israel',
        'Italy',
        'Jerusalem',
        'Khmer',
        'Kilwa',
        'Kongo',
        'Lithuania',
        'Macedonia',
        'Madagascar',
        'Manchuria',
        'The Maori',
        'Maurya',
        'Mexico',
        'Moors',
        'Mysore',
        'Nabatea',
        'New Zealand',
        'Normandy',
        'Norway',
        'Nubia',
        'Oman',
        'Palmyra',
        'Papal State',
        'Pheonicia',
        'Philippines',
        'Prussia',
        'Romania',
        'Scotland',
        'Sioux',
        'Sumeria',
        'Switzerland',
        'Tibet',
        'Timurids',
        'Tonga',
        'Turkey',
        'U.A.E',
        'Ukraine',
        'Vatican',
        'Venice',
        'Vietnam',
        'Wales',
        'Yugoslavia',
        'Zimbabwe'
    ],

    "civ6-vanilla": [
        {
            leader: "Catherine de Medici",
            civ: "France"
        },
        {
            leader: "Cleopatra",
            civ: "Egypt"
        },
        {
            leader: "Frederick Barbarossa",
            civ: "Germany"
        },
        {
            leader: "Gandhi",
            civ: "India"
        },
        {
            leader: "Gilgamesh",
            civ: "Sumeria"
        },
        {
            leader: "Gorgo",
            civ: "Greece"
        },
        {
            leader: "Harald Hardrada",
            civ: "Norway"
        },
        {
            leader: "Hojo Tokimune",
            civ: "Japan"
        },
        {
            leader: "Julius Caesar",
            civ: "Rome"
        },
        {
            leader: "Montezuma",
            civ: "Aztec"
        },
        {
            leader: "Mvemba a Nzinga",
            civ: "Kongo"
        },
        {
            leader: "Pedro II",
            civ: "Brazil"
        },
        {
            leader: "Pericles",
            civ: "Greece"
        },
        {
            leader: "Peter",
            civ: "Russia"
        },
        {
            leader: "Philip II",
            civ: "Spain"
        },
        {
            leader: "Qin Shi Huang",
            civ: "China"
        },
        {
            leader: "Saladin",
            civ: "Arabia"
        },
        {
            leader: "Teddy Roosevelt",
            civ: "America"
        },
        {
            leader: "Tomyris",
            civ: "Scythia"
        },
        {
            leader: "Trajan",
            civ: "Rome"
        },
        {
            leader: "Victoria",
            civ: "England"
        },
    ],

    "civ6-rnf": [
        {
            leader: "Chandragupta",
            civ: "India"
        },
        {
            leader: "Genghis Khan",
            civ: "Mongolia"
        },
        {
            leader: "Lautaro",
            civ: "Mapuche"
        },
        {
            leader: "Poundmaker",
            civ: "Cree"
        },
        {
            leader: "Robert the Bruce",
            civ: "Scotland"
        },
        {
            leader: "Seondeok",
            civ: "Korea"
        },
        {
            leader: "Shaka",
            civ: "Zulu"
        },
        {
            leader: "Tamar",
            civ: "Georgia"
        },
        {
            leader: "Wilhelmina",
            civ: "The Netherlands"
        }
    ],

    "civ6-gs": [
        {
            leader: "Dido",
            civ: "Carthage"
        },
        {
            leader: "Eleanor of Aquitaine",
            civ: "England"
        },
        {
            leader: "Eleanor of Aquitaine",
            civ: "France"
        },
        {
            leader: "Kristina",
            civ: "Sweden"
        },
        {
            leader: "Kupe",
            civ: "The Maori"
        },
        {
            leader: "Mansa Musa",
            civ: "Mali"
        },
        {
            leader: "Matthias Corvinus",
            civ: "Hungary"
        },
        {
            leader: "Pachacuti",
            civ: "The Inca"
        },
        {
            leader: "Suleiman",
            civ: "The Ottomans"
        },
        {
            leader: "Wilfred Laurier",
            civ: "Canada"
        }
    ],

    "civ6-frontier": [
        {
            leader: "Ambiorix",
            civ: "Gaul"
        },
        {
            leader: "Basil II",
            civ: "Byzantium"
        },
        {
            leader: "Bà Triệu",
            civ: "Vietnam"
        },
        {
            leader: "Hammurabi",
            civ: "Babylon"
        },
        {
            leader: "João III",
            civ: "Portugal"
        },
        {
            leader: "Kublai Khan",
            civ: "China"
        },
        {
            leader: "Kublai Khan",
            civ: "Mongolia"
        },
        {
            leader: "Lady Six Sky",
            civ: "Maya"
        },
        {
            leader: "Menelik II",
            civ: "Ethiopia"
        },
        {
            leader: "Simón Bolívar",
            civ: "Gran Colombia"
        }
    ],

    "civ6-leaderpass": [
        {
            leader: "Abraham Lincoln",
            civ: "America"
        },
        {
            leader: "Cleopatra (Ptolemaic)",
            civ: "Egypt"
        },
        {
            leader: "Elizabeth I",
            civ: "England"
        },
        {
            leader: "Harald Hardrada (Varangian)",
            civ: "Norway"
        },
        {
            leader: "Ludwig II",
            civ: "Germany"
        },
        {
            leader: "Nader Shah",
            civ: "Persia"
        },
        {
            leader: "Nzinga Mbande",
            civ: "Kongo"
        },
        {
            leader: "Qin Shi Huang (Unifier)",
            civ: "China"
        },
        {
            leader: "Ramses II",
            civ: "Egypt"
        },
        {
            leader: "Saladin (Sultan)",
            civ: "Arabia"
        },
        {
            leader: "Sejong",
            civ: "Korea"
        },
        {
            leader: "Suleiman (Muhtesem)",
            civ: "The Ottomans"
        },
        {
            leader: "Sundiata Keita",
            civ: "Mali"
        },
        {
            leader: "Theodora",
            civ: "Byzantium"
        },
        {
            leader: "Tokugawa",
            civ: "Japan"
        },
        {
            leader: "Victoria (Age of Steam)",
            civ: "England"
        },
        {
            leader: "Wu Zetian",
            civ: "China"
        },
        {
            leader: "Yongle",
            civ: "China"
        }
    ],

    "civ6-extra": [
        {
            leader: "Alexander",
            civ: "Macedon"
        },
        {
            leader: "Amanitore",
            civ: "Nubia"
        },
        {
            leader: "Cyrus",
            civ: "Persia"
        },
        {
            leader: "Gitarja",
            civ: "Indonesia"
        },
        {
            leader: "Jadwiga",
            civ: "Poland"
        },
        {
            leader: "Jayavarman VII",
            civ: "Khmer"
        },
        {
            leader: "John Curtin",
            civ: "Australia"
        },
    ],

    "civ6-personas": [
        {
            leader: "Catherine de Medici (Magnificence)",
            civ: "France"
        },
        {
            leader: "Teddy Roosevelt (Rough Rider)",
            civ: "America"
        }
    ]
};
