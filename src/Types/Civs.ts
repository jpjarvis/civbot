import {Civ5CivGroup, Civ6CivGroup} from "./CivGroups";

type CivsType = {
    [group in Civ5CivGroup | Civ6CivGroup]: string[]
}

export const Civs: CivsType = {
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
        "The Zulu"
    ],

    "lekmod": [
        "Akkad",
        "Argentina",
        "Ayyubids",
        "Brunei",
        "Finland",
        "Gauls",
        "Goths",
        "Hittites",
        "Ireland",
        "Khmer",
        "Macedonia",
        "Sioux",
        "Timurids",
        "Belgium",
        "Bulgaria",
        "Burma",
        "Canada",
        "Franks",
        "Hungary",
        "Israel",
        "Jerusalem",
        "Mexico",
        "Normandy",
        "Norway",
        "Nubia",
        "Prussia",
        "Scotland",
        "Sumeria",
        "Turkey",
        "Ukraine",
        "Vatican",
        "Venice",
        "Wales",
        "Armenia",
        "Boers",
        "Italy",
        "Kongo",
        "Lithuania",
        "Pheonicia",
        "Romania",
        "Tibet",
        "Madagascar",
        "Manchuria",
        "Vietnam",
        "Australia",
        "Golden Horde",
        "Kilwa",
        "Akzum",
        "Zimbabwe",
        "Tonga",
        "The Maori",
        "New Zealand",
        "U.A.E",
        "Papal State",
        "Oman",
        "Nabatea",
        "Moors",
        "Cuba",
        "Chile",
        "Bolivia",
        "Mysore",
        "Philippines",
        "Maurya",
        "Colombia"
    ],

    "civ6-vanilla": [
        "Teddy Roosevelt",
        "Saladin",
        "Montezuma",
        "Pedro II",
        "Qin Shi Huang",
        "Cleopatra",
        "Victoria",
        "Catherine de Medici",
        "Frederick Barbarossa",
        "Gorgo",
        "Pericles",
        "Gandhi",
        "Hojo Tokimune",
        "Mvemba a Nzinga",
        "Harald Hardrada",
        "Trajan",
        "Peter",
        "Tomyris",
        "Philip II",
        "Gilgamesh"
    ],

    "civ6-rnf": [
        "Poundmaker",
        "Wilhelmina",
        "Tamar",
        "Seondeok",
        "Chandragupta",
        "Lautaro",
        "Genghis Khan",
        "Robert the Bruce",
        "Shaka"
    ],

    "civ6-gs": [
        "Wilfred Laurier",
        "Eleanor of Aquitaine (England)",
        "Eleanor of Aquitaine (France)",
        "Matthias Corvinus",
        "Pachacuti",
        "Mansa Musa",
        "Kupe",
        "Suleiman",
        "Dido",
        "Kristina"
    ],

    "civ6-frontier": [
        "Hammurabi",
        "Basil II",
        "Kublai Khan (China)",
        "Menelik II",
        "Ambiorix",
        "Simón Bolívar",
        "Lady Six Sky",
        "Kublai Khan (Mongolia)",
        "João III",
        "Bà Triệu"
    ],

    "civ6-extra": [
        "John Curtin",
        "Gitarja",
        "Jayavarman VII",
        "Alexander",
        "Amanitore",
        "Cyrus",
        "Jadwiga"
    ]
}
