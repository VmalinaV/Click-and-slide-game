export let timer = {
    interval: 'none',
    startMiliseconds: 0,
    miliseconds: 0,
    seconds: 0,
    minutes: 0,
    hours: 0,
    start: () => {
        const SECOND = 1000;
        const MINUTE = 60 * SECOND;
        const HOUR = 60 * MINUTE;

        let sequence, img;

        const timerContainer = document.querySelector('#timer-container');

        timer.startMiliseconds = Date.now();

        timer.interval = setInterval(() => {
            // update time values
            timer.miliseconds = (Date.now() - timer.startMiliseconds) % 1000;
            timer.seconds = parseInt((Date.now() - timer.startMiliseconds) / SECOND) % 60;
            timer.minutes = parseInt((Date.now() - timer.startMiliseconds) / MINUTE) % 60;
            timer.hours = parseInt((Date.now() - timer.startMiliseconds) / HOUR) % 100;

            // update graphical timer
            sequence = [ timer.hours, timer.minutes, timer.seconds ];

            for (let i = 0; i < sequence.length; i++) {
                img = timerContainer.children[0 + i * 3];
                img.setAttribute('src', `gfx/c${sequence[i] % 10 == sequence[i] ? 0 : parseInt(sequence[i] / 10) % 10}.gif`);
                img = timerContainer.children[1 + i * 3];
                img.setAttribute('src', `gfx/c${sequence[i] % 10}.gif`);
                
                img = timerContainer.children[2 + i * 3];
                if (i != sequence.length - 1)
                    img.setAttribute('src', `gfx/colon.gif`);
                else
                    img.setAttribute('src', `gfx/dot.gif`);
            }
            img = timerContainer.children[9];
            img.setAttribute('src', `gfx/c${timer.miliseconds % 100 == timer.miliseconds ? 0 : parseInt(timer.miliseconds / 100) % 10}.gif`);
            img = timerContainer.children[10];
            img.setAttribute('src', `gfx/c${timer.miliseconds % 10 == timer.miliseconds ? 0 : parseInt(timer.miliseconds / 10) % 10}.gif`);
            img = timerContainer.children[11];
            img.setAttribute('src', `gfx/c${timer.miliseconds % 10}.gif`);
        }, 1);
    },
    stop: () => {
        clearInterval(timer.interval);
    },
    timeToString: () => {
        return `${timer.hours % 10 == timer.hours ? 0 : parseInt(timer.hours / 10) % 10}` +
        `${timer.hours % 10}:` +

        `${timer.minutes % 10 == timer.minutes ? 0 : parseInt(timer.minutes / 10) % 10}` +
        `${timer.minutes % 10}:` +

        `${timer.seconds % 10 == timer.seconds ? 0 : parseInt(timer.seconds / 10) % 10}` +
        `${timer.seconds % 10}.` +

        `${timer.miliseconds % 100 == timer.miliseconds ? 0 : parseInt(timer.miliseconds / 100) % 10}` +
        `${timer.miliseconds % 10 == timer.miliseconds ? 0 : parseInt(timer.miliseconds / 10) % 10}` +
        `${timer.miliseconds % 10}`;
    }
}