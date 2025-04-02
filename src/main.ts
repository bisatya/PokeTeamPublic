import './style.css';
import Field from './field';
import { TEAM_MEMBERS } from './team-members';
import { PIXEL_PER_UNIT } from './constants';

const sizeX = Math.min(8, Math.floor(window.innerWidth * 0.5 / PIXEL_PER_UNIT));
const sizeY = Math.min(8, Math.floor(window.innerHeight * 0.5 / PIXEL_PER_UNIT));

const field = new Field('field', sizeX, sizeY);
field.addCharacters(TEAM_MEMBERS);
field.render(document.querySelector<HTMLDivElement>('#app')!);
field.orchestrate();
