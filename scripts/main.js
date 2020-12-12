/* APLLY SETTINGS */
import { settings } from './settings.js';

const gameField = document.querySelector('#game-field');
const restartButtons = document.querySelectorAll('a.restart');

gameField.style.width = settings.gameFieldDimensions + 'px';
gameField.style.height = settings.gameFieldDimensions + 'px';

/* ENABLE USER INTERACTION */
import { slider } from './slider.js';
import { dimensions } from './render.js';
import { highscores } from './highscores.js'

slider.addClickListeners();
dimensions.addClickListeners();
highscores.addClickListeners();
restartButtons.forEach((element) => {
    element.addEventListener('click', () => {
        window.location.reload();
    });
});