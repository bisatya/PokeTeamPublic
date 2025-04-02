export interface TeamMember {
    name: string;
    introBlog: string;
    sprite: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
    { sprite: '143.png', name: 'Snorlax', introBlog: `https://bulbapedia.bulbagarden.net/wiki/Snorlax_(Pok%C3%A9mon)` },
    { sprite: '009.png', name: 'Blastoise', introBlog:`https://bulbapedia.bulbagarden.net/wiki/Blastoise_(Pok%C3%A9mon)` },
    { sprite: '006.png', name: 'Charizard', introBlog: `https://bulbapedia.bulbagarden.net/wiki/Charizard_(Pok%C3%A9mon)` },
    { sprite: '003.png', name: 'Venusaur', introBlog: `https://bulbapedia.bulbagarden.net/wiki/Venusaur_(Pok%C3%A9mon)` },
    { sprite: '025.png', name: 'Pikachu', introBlog: `https://bulbapedia.bulbagarden.net/wiki/Pikachu_(Pok%C3%A9mon)` },
    { sprite: '133.png', name: 'Eevee', introBlog: `https://bulbapedia.bulbagarden.net/wiki/Eevee_(Pok%C3%A9mon)` }
];