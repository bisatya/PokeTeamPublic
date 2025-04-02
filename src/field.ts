import Character from "./character";
import { PIXEL_PER_UNIT } from "./constants";
import FieldOrchestrator from "./field-orchestrator";
import FieldRandomCoordinateGenerator from "./field-random-coordinate-generator";
import { TeamMember } from "./team-members";

class Field {
    private readonly id: string;
    private readonly sizeX: number;
    private readonly sizeY: number;

    private readonly characters: Character[];

    constructor(id: string, sizeX: number, sizeY: number) {
        this.id = id;
        this.sizeX = sizeX;
        this.sizeY = sizeY;

        this.characters = [];

        (window as any).field = this;
        (window as any).characters = this.characters;
    }

    public addCharacters(teamMembers: TeamMember[]) {
        if (teamMembers.length > this.sizeX * this.sizeY)
            throw new Error("Unable to render all team members because the field is not big enough");

        const randomCoordinates = FieldRandomCoordinateGenerator.getRandomCoordinates(
            this.sizeX, 
            this.sizeY, 
            teamMembers.length
        );
        for (let idx = 0; idx < teamMembers.length; idx++) {
            this.characters.push(new Character(`tm-${idx}`, teamMembers[idx], randomCoordinates[idx].x, randomCoordinates[idx].y));
        }
    }

    public render(rootEl: HTMLDivElement) {
        const widthPx = this.sizeX * PIXEL_PER_UNIT;
        const heightPx = this.sizeY * PIXEL_PER_UNIT;
        const elHtml = `<div id="${this.id}" class="field" style="width: ${widthPx}px; height: ${heightPx}px;"></div>`;

        rootEl.innerHTML += elHtml;

        const el = document.querySelector<HTMLDivElement>(`#${this.id}`)!
        this.characters.forEach(c => c.render(el));
    }

    public orchestrate() {
        FieldOrchestrator.orchestrate(this.sizeX, this.sizeY, this.characters);
    }
}

export default Field;
