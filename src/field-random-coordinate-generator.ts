class FieldRandomCoordinateGenerator {
    public static getRandomCoordinates(sizeX: number, sizeY: number, randomCoordinateCount: number) {
        const fieldArea = sizeX * sizeY;
        const allNumbers = new Array<number>(fieldArea).fill(0).map((_, idx) => idx);
        const randomlySelectedNumbers = [];

        while (randomlySelectedNumbers.length < randomCoordinateCount) {
            const randomIndex = Math.floor(Math.random() * allNumbers.length);
            randomlySelectedNumbers.push(allNumbers[randomIndex]);
            allNumbers.splice(randomIndex, 1);
        }

        const coordinates = randomlySelectedNumbers
            .map(n => ({ 
                x: Math.floor(n % sizeX), 
                y: Math.floor(n / sizeX) 
            }));
        
        return coordinates;
    }
}

export default FieldRandomCoordinateGenerator;