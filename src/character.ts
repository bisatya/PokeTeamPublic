import { Coordinate, Direction } from "./common-models";
import { BASE_URL, PIXEL_PER_UNIT } from "./constants";
import { TeamMember } from "./team-members";

enum CharacterState {
    STATIONARY = 0,
    MOVING = 1
}

class Character {
    private readonly FPS = 8;

    private readonly id: string;
    private readonly teamMember: TeamMember;

    private x: number;
    private y: number;
    private xPx: number;
    private yPx: number;
    private direction: Direction;
    private state: CharacterState;
    private spriteTextureIndex: number;

    constructor(id: string, teamMember: TeamMember, x: number, y: number) {
        this.id = id;
        this.teamMember = teamMember;

        this.x = x;
        this.y = y;
        this.xPx = x * PIXEL_PER_UNIT;
        this.yPx = y * PIXEL_PER_UNIT;
        this.direction = Direction.SOUTH;
        this.state = CharacterState.STATIONARY;
        this.spriteTextureIndex = 0;
    }

    private getElId() { return `character-${this.id}`; }
    private getContainerElId() { return `${this.getElId()}-container`; }
    private getCanvasElId() { return `${this.getElId()}-canvas`; }
    private getDetailsElId() { return `${this.getElId()}-details`; }

    public getCoordinate() { return { x: this.x, y: this.y }; }

    public render(fieldEl: HTMLDivElement) {
        this.prepareCanvas(fieldEl);
        this.renderSprite();
        this.registerClickEvent();
    }

    private prepareCanvas(fieldEl: HTMLDivElement) {
        const elHtml = `
            <div id="${this.getContainerElId()}" class="character-container" style="left: ${this.xPx}px; top: ${this.yPx}px;">
                <div class="character-shadow"></div>
                <canvas id="${this.getCanvasElId()}" class="character-canvas" style="width: ${PIXEL_PER_UNIT}px; height: ${PIXEL_PER_UNIT}px;"></canvas>
                <div id="${this.getDetailsElId()}" class="character-details" style="display: none;">
                    Hi there! I'm <a href="${this.teamMember.introBlog}" target="_blank">${this.teamMember.name}</a>.
                    <br />
                    Nice to meet you!
                </div>
            </div>
        `;

        fieldEl.innerHTML += elHtml;
    }

    private renderSprite() {
        // delaying the rendering until the end of the event loop so that all characters are rendered on screen
        // without this, only the latest character is displayed
        window.setTimeout(() => {
            const canvasEl = document.querySelector<HTMLCanvasElement>(`#${this.getCanvasElId()}`)!;
            const canvasContext = canvasEl.getContext('2d')!;
            const img = new Image();
            img.src = `${BASE_URL}/gen1_standard/${this.teamMember.sprite}`;
            img.onload = () => { this.startAnimationLoop(canvasContext, img); };
        }, 0);
    }

    private startAnimationLoop(canvasContext: CanvasRenderingContext2D, img: HTMLImageElement) {
        const containerEl = document.querySelector<HTMLDivElement>(`#${this.getContainerElId()}`)!;
        window.setInterval(() => {
            this.handleSpriteAnimation(canvasContext, img);
            this.handleMoveAnimation(containerEl);
            
        }, 1000 / this.FPS);
    }

    private handleSpriteAnimation(canvasContext: CanvasRenderingContext2D, img: HTMLImageElement) {
        canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
        canvasContext.drawImage(
            img, 
            PIXEL_PER_UNIT * this.spriteTextureIndex, 
            PIXEL_PER_UNIT * this.direction,
            PIXEL_PER_UNIT, 
            PIXEL_PER_UNIT, 
            0, 
            0, 
            canvasContext.canvas.width, 
            canvasContext.canvas.height
        );
        
        this.spriteTextureIndex = (this.spriteTextureIndex + 1) % 4;
    }

    private handleMoveAnimation(containerEl: HTMLDivElement) {
        const pxChangePerFrame = (PIXEL_PER_UNIT / this.FPS / 2); // character will take 2 seconds to move 1 unit

        if (this.xPx < this.x * PIXEL_PER_UNIT) {
            this.xPx += pxChangePerFrame;
        } else if (this.xPx > this.x * PIXEL_PER_UNIT) {
            this.xPx -= pxChangePerFrame;
        } else if (this.yPx < this.y * PIXEL_PER_UNIT) {
            this.yPx += pxChangePerFrame;
        } else if (this.yPx > this.y * PIXEL_PER_UNIT) {
            this.yPx -= pxChangePerFrame;
        }

        containerEl.style.left = `${this.xPx}px`;
        containerEl.style.top = `${this.yPx}px`;

        if (this.xPx === this.x * PIXEL_PER_UNIT && this.yPx === this.y * PIXEL_PER_UNIT) {
            this.stopMoving();
        }
    }

    public move(targetCoordinate: Coordinate) {
        if (!targetCoordinate) return;
        if (this.state === CharacterState.MOVING) return;

        const direction = this.getRelativeDirection(targetCoordinate);
        if (direction === undefined) {
            this.direction = Direction.SOUTH;
            return;
        }

        this.startMoving(direction);
        this.x = targetCoordinate.x;
        this.y = targetCoordinate.y;
    }

    private startMoving(direction: Direction) {
        this.state = CharacterState.MOVING;
        this.direction = direction;
    }

    private stopMoving() {
        this.state = CharacterState.STATIONARY;
        this.direction = Direction.SOUTH;
    }

    private getRelativeDirection(targetCoordinate: Coordinate) {
        if (targetCoordinate.x === this.x && targetCoordinate.y === this.y - 1) return Direction.NORTH;
        if (targetCoordinate.x === this.x && targetCoordinate.y === this.y + 1) return Direction.SOUTH;
        if (targetCoordinate.x === this.x - 1 && targetCoordinate.y === this.y) return Direction.WEST;
        if (targetCoordinate.x === this.x + 1 && targetCoordinate.y === this.y) return Direction.EAST;
        
        return undefined;
    }
    
    private registerClickEvent() {
        window.setTimeout(() => {
            const canvasEl = document.querySelector<HTMLDivElement>(`#${this.getCanvasElId()}`)!;
            const detailsEl = document.querySelector<HTMLDivElement>(`#${this.getDetailsElId()}`)!;
    
            canvasEl.addEventListener('click', () => {
                const shouldDisplayBubble = detailsEl.style.display === "none";
                document.querySelectorAll<HTMLDivElement>(`.character-details`).forEach(el => el.style.display = 'none');
                detailsEl.style.display = shouldDisplayBubble ? "block" : "none";
            });
        }, 0);
    }
}

export default Character;
