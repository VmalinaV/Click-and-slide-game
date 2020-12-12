import { slider } from './slider.js';
import { settings } from './settings.js';
import { data } from './data.js';
import { player } from './player.js';
import { timer } from './timer.js';
import { highscores } from './highscores.js';

const dimensionsButtons = document.querySelector('.half-screen').querySelectorAll('.buttons .btn');
const information = document.querySelector('#information');
const gameField = document.querySelector('#game-field');

export let dimensions = {
    addClickListeners: () => {
        dimensionsButtons.forEach((element) => {
            element.addEventListener('click', render.initializeRendering);
            element.classList.remove('disabled');
        });
    },
    removeClickListeners: () => {
        dimensionsButtons.forEach((element) => {
            element.removeEventListener('click', render.initializeRendering);
            element.classList.add('disabled');
        });
    }
}

export let render = {
    imageToRender: 'none',
    dimension: 'none',
    widthOfPart: 'none',
    heightOfPart: 'none',
    shuffled: false,
    lastDirection: 3,
    initializeRendering: function() {
        slider.removeClickListeners();
        dimensions.removeClickListeners();
        highscores.removeClickListeners();

        information.innerText = 'Shuffling...';

        render.dimension = parseInt(this.id);
        render.imageToRender = document.querySelector('img.active');
        render.widthOfPart = Math.ceil(settings.gameFieldDimensions / render.dimension);
        render.heightOfPart = Math.ceil(settings.gameFieldDimensions / render.dimension);
        
        render.renderParts()
    },
    renderParts: () => {
        let canvases = [];
        let positionLeft = 0, positionTop = 0;

        for (let i = 0; i < render.dimension * render.dimension; i++) {
            if (Math.ceil(positionLeft) >= settings.gameFieldDimensions) {
                positionLeft = 0;
                positionTop += render.heightOfPart;
            }

            let canvas = document.createElement('canvas');
            canvas.id = 'n' + i;
            canvas.width = render.widthOfPart;
            canvas.height = render.heightOfPart;
            canvas.style.left = positionLeft + 'px';
            canvas.style.top = positionTop + 'px';
            gameField.appendChild(canvas);
            canvases.push(canvas);

            // correct placing of parts
            if (i != render.dimension * render.dimension - 1) {
                const ctx = canvas.getContext('2d');
                ctx.drawImage(
                    render.imageToRender,
                    Math.floor(settings.imagesDimensions / render.dimension) * (i % render.dimension),
                    Math.floor(settings.imagesDimensions / render.dimension) * parseInt(i / render.dimension),
                    Math.ceil(settings.imagesDimensions / render.dimension),
                    Math.ceil(settings.imagesDimensions / render.dimension),
                    0,
                    0,
                    Math.ceil(settings.gameFieldDimensions / render.dimension),
                    Math.ceil(settings.gameFieldDimensions / render.dimension)
                );
            }
            positionLeft += render.widthOfPart;
        }

        data.initializeData();
        render.shuffleParts();
    },
    shuffleParts: async() => {
        let condition, direction;

        for (let i = 0; i < 25 * render.dimension; i++) {
            do {
                condition = true;
                direction = Math.floor(Math.random() * 4 + 1);
                
                if (data.data[data.emptyPartY - 1][data.emptyPartX] == -1 && direction == 1)    // top border reached
                    condition = false;
                if (data.data[data.emptyPartY][data.emptyPartX + 1] == -1 && direction == 2)    // right border reached
                    condition = false;
                if (data.data[data.emptyPartY + 1][data.emptyPartX] == -1 && direction == 3)    // bottom border reached
                    condition = false;
                if (data.data[data.emptyPartY][data.emptyPartX - 1] == -1 && direction == 4)    // left border reached
                    condition = false;
                if ((render.lastDirection > 2 ? (render.lastDirection - 2) : (render.lastDirection + 2)) == direction)    // opposite direction
                    condition = false;
    
            } while (condition == false);

            await render.moveEmptyPart(direction);
            render.lastDirection = direction;
        }

        render.shuffled = true;
        player.addClickListeners();

        timer.start();
        information.innerText = 'Recreate an image! The clock is ticking!';
    },
    moveEmptyPart: async(direction) => {
        let idOfEmpty = 'n' + (render.dimension * render.dimension - 1), idOfReplaced;
        let emptyElement = document.querySelector(`canvas#${idOfEmpty}`), replacedElement;

        if (direction == 1) {   // empty moves to top
            idOfReplaced = 'n' + data.data[data.emptyPartY - 1][data.emptyPartX];
            data.data[data.emptyPartY][data.emptyPartX] = data.data[data.emptyPartY - 1][data.emptyPartX];
            data.data[data.emptyPartY - 1][data.emptyPartX] = render.dimension * render.dimension - 1;
            replacedElement = document.querySelector(`canvas#${idOfReplaced}`);
            for (let i = 0; i < render.widthOfPart / 9; i++) {
                await render.delay(1);
                emptyElement.style.top = `${parseInt(emptyElement.style.top) - 9}px`;
                replacedElement.style.top = `${parseInt(replacedElement.style.top) + 9}px`;
            }
            data.emptyPartY--;
        }
        else if (direction == 2) {  // empty moves to right
            idOfReplaced = 'n' + data.data[data.emptyPartY][data.emptyPartX + 1];
            data.data[data.emptyPartY][data.emptyPartX] = data.data[data.emptyPartY][data.emptyPartX + 1];
            data.data[data.emptyPartY][data.emptyPartX + 1] = render.dimension * render.dimension - 1;
            replacedElement = document.querySelector(`canvas#${idOfReplaced}`);
            for (let i = 0; i < render.widthOfPart / 9; i++) {
                await render.delay(1);
                emptyElement.style.left = `${parseInt(emptyElement.style.left) + 9}px`;
                replacedElement.style.left = `${parseInt(replacedElement.style.left) - 9}px`;
            }
            data.emptyPartX++;
        }
        else if (direction == 3) {  // empty moves to bottom
            idOfReplaced = 'n' + data.data[data.emptyPartY + 1][data.emptyPartX];
            data.data[data.emptyPartY][data.emptyPartX] = data.data[data.emptyPartY + 1][data.emptyPartX];
            data.data[data.emptyPartY + 1][data.emptyPartX] = render.dimension * render.dimension - 1;
            replacedElement = document.querySelector(`canvas#${idOfReplaced}`);
            for (let i = 0; i < render.widthOfPart / 9; i++) {
                await render.delay(1);
                emptyElement.style.top = `${parseInt(emptyElement.style.top) + 9}px`;
                replacedElement.style.top = `${parseInt(replacedElement.style.top) - 9}px`;
            }
            data.emptyPartY++;
        }
        else if (direction == 4) {  // empty moves to left
            idOfReplaced = 'n' + data.data[data.emptyPartY][data.emptyPartX - 1];
            data.data[data.emptyPartY][data.emptyPartX] = data.data[data.emptyPartY][data.emptyPartX - 1];
            data.data[data.emptyPartY][data.emptyPartX - 1] = render.dimension * render.dimension - 1;
            replacedElement = document.querySelector(`canvas#${idOfReplaced}`);
            for (let i = 0; i < render.widthOfPart / 9; i++) {
                await render.delay(1);
                emptyElement.style.left = `${parseInt(emptyElement.style.left) - 9}px`;
                replacedElement.style.left = `${parseInt(replacedElement.style.left) + 9}px`;
            }
            data.emptyPartX--;
        }

        if (render.shuffled == true) {
            player.removeClickListeners();
            if (player.checkIfFinished() == true)
                player.finishGame();
            else
                player.addClickListeners();
        }
    },
    delay: (timeout) => {
        return new Promise((resolve) => setTimeout(resolve, timeout));
    }
}