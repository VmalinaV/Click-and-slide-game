import { data } from './data.js';
import { highscores } from './highscores.js';
import { render } from './render.js';
import { settings } from './settings.js';
import { timer } from './timer.js';

const information = document.querySelector('#information');

export let player = {
    boxesWithActiveListeners: [],
    addClickListeners: () => {
        let possibleMoves = [1, 2, 3, 4], idOfBoxToAddEventOn;
        if (data.data[data.emptyPartY - 1][data.emptyPartX] == -1)    // top border reached
            possibleMoves.splice(possibleMoves.indexOf(1), 1);

        if (data.data[data.emptyPartY][data.emptyPartX + 1] == -1)    // right border reached
            possibleMoves.splice(possibleMoves.indexOf(2), 1);

        if (data.data[data.emptyPartY + 1][data.emptyPartX] == -1)    // bottom border reached
            possibleMoves.splice(possibleMoves.indexOf(3), 1);

        if (data.data[data.emptyPartY][data.emptyPartX - 1] == -1)    // left border reached
            possibleMoves.splice(possibleMoves.indexOf(4), 1);

        possibleMoves.forEach((element) => {
            if (element == 1)
                idOfBoxToAddEventOn = 'n' + data.data[data.emptyPartY - 1][data.emptyPartX];
            else if (element == 2)
                idOfBoxToAddEventOn = 'n' + data.data[data.emptyPartY][data.emptyPartX + 1];
            else if (element == 3)
                idOfBoxToAddEventOn = 'n' + data.data[data.emptyPartY + 1][data.emptyPartX];
            else if (element == 4)
                idOfBoxToAddEventOn = 'n' + data.data[data.emptyPartY][data.emptyPartX - 1];

            let boxToAddEventOn = document.getElementById(idOfBoxToAddEventOn);
            boxToAddEventOn.style.cursor = 'pointer';

            let functionToExecute = () => { render.moveEmptyPart(element) };
            boxToAddEventOn.addEventListener('click', functionToExecute);
            player.boxesWithActiveListeners.push({ box: boxToAddEventOn, func: functionToExecute });
        });
    },
    removeClickListeners: () => {
        (player.boxesWithActiveListeners).forEach((element) => {
            (element.box).removeEventListener('click', element.func);
            element.box.style.cursor = 'default';
        });
    },
    checkIfFinished: () => {
        let condition = true;
        for (let i = 1; i < render.dimension + 1; i++)
            for (let j = 1; j < render.dimension + 1; j++) {
                if (data.data[i][j] != (i - 1) * render.dimension + (j - 1))
                    condition = false;
            }
        return condition;
    },
    finishGame: async() => {
        timer.stop();
        information.innerText = 'Congratulations!';

        // render last part
        const canvas = document.getElementById('n' + (render.dimension * render.dimension - 1));
        canvas.style.opacity = '0.01';
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
            render.imageToRender,
            Math.floor(settings.imagesDimensions / render.dimension) * ((render.dimension * render.dimension - 1) % render.dimension),
            Math.floor(settings.imagesDimensions / render.dimension) * parseInt((render.dimension * render.dimension - 1) / render.dimension),
            Math.ceil(settings.imagesDimensions / render.dimension),
            Math.ceil(settings.imagesDimensions / render.dimension),
            0,
            0,
            Math.ceil(settings.gameFieldDimensions / render.dimension),
            Math.ceil(settings.gameFieldDimensions / render.dimension)
        );

        for (let i = 0; i < 99; i++) {
            await render.delay(20);
            canvas.style.opacity = parseFloat(canvas.style.opacity) + 0.01;
        }
        await render.delay(2000);

        // display result
        highscores.addClickListeners();
        const overlay = document.querySelector('#overlay');
        const results = document.querySelector('#results');
        overlay.style.display = 'block';
        results.style.display = 'flex';

        results.children[1].innerText = timer.timeToString();
        results.children[2].appendChild(render.imageToRender.cloneNode(true));
    },
}