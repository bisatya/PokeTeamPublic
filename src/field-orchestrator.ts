import Character from "./character";
import { Coordinate } from "./common-models";

class FieldOrchestrator {
    public static orchestrate(sizeX: number, sizeY: number, characters: Character[]) {
        if (characters.length < 1) 
            return;

        characters.forEach(c => this.moveRandomly(sizeX, sizeY, c, characters));
    }

    private static getStandStillDelay() { return Math.floor(Math.random() * 5000) + 5000; }

    private static moveRandomly(sizeX: number, sizeY: number, character: Character, allCharacters: Character[]) {
        window.setTimeout(() => {
            const coordinate = character.getCoordinate() as Coordinate;
            const adjacentCoordinates = this.getAdjacentCoordinates(sizeX, sizeY, coordinate);
            const availableCoordinates = this.getAvailableCoordinates(adjacentCoordinates, allCharacters);
            const targetCoordinate = this.pickRandomCoordinate(availableCoordinates);
    
            character.move(targetCoordinate);
    
            window.setTimeout(() => this.moveRandomly(sizeX, sizeY, character, allCharacters), this.getStandStillDelay());
        }, this.getStandStillDelay());
    }

    private static getAdjacentCoordinates(sizeX: number, sizeY: number, coordinate: Coordinate) {
        const allPossibleCoordinates: Coordinate[] = [
            { x: coordinate.x, y: coordinate.y-1 },
            { x: coordinate.x-1, y: coordinate.y },
            { x: coordinate.x+1, y: coordinate.y },
            { x: coordinate.x, y: coordinate.y+1 }
        ];

        const allValidCoordinates = allPossibleCoordinates
            .filter(c => c.x >= 0 && c.x < sizeX)
            .filter(c => c.y >= 0 && c.y < sizeY);

        return allValidCoordinates;
    }

    private static getAvailableCoordinates(adjacentCoordinates: Coordinate[], allCharacters: Character[]) {
        const occupiedCoordinates = allCharacters.map(c => c.getCoordinate());
        const availableCoordinates = adjacentCoordinates.filter(c => !occupiedCoordinates.some(oc => oc.x === c.x && oc.y === c.y));
        return availableCoordinates;
    }

    private static pickRandomCoordinate(availableCoordinates: Coordinate[]) {
        const randomIndex = Math.floor(Math.random() * availableCoordinates.length);
        return availableCoordinates[randomIndex];
    }
}

export default FieldOrchestrator;