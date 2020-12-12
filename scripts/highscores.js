import { render } from "./render.js";
import { timer } from "./timer.js";

const displayButtons = document.querySelectorAll('a.highscores');
const changeDimensionButtons = document.querySelectorAll('#highscores .buttons *');

let highscores3x3 = [];
let highscores4x4 = [];
let highscores5x5 = [];
let highscores6x6 = [];

export let highscores = {
    username: 'none',
    addClickListeners: () => {
        displayButtons.forEach((element) => {
            element.addEventListener('click', highscores.displayHighscores);
            element.classList.remove('disabled');
        });
    },
    removeClickListeners: () => {
        displayButtons.forEach((element) => {
            element.removeEventListener('click', highscores.displayHighscores);
            element.classList.add('disabled');
        });
    },
    displayHighscores: () => {
        const overlay = document.querySelector('#overlay');
        const highscoresBox = document.querySelector('#highscores');
        overlay.style.display = 'block';
        highscoresBox.style.display = 'flex';

        // default highscores display is for 3 x 3
        changeDimensionButtons.forEach((element, index) => {
            if (index != 0) {
                element.addEventListener('click', highscores.changeDimension);
                element.classList.remove('disabled');
            }
        });
        highscores.updateAndSortArrays();
        highscores.updateHighscores(3);
    },
    changeDimension: function() {
        changeDimensionButtons.forEach((element) => {
            element.removeEventListener('click', highscores.changeDimension);
        });

        changeDimensionButtons.forEach((element) => {
            if (element != this) {
                element.addEventListener('click', highscores.changeDimension);
                element.classList.remove('disabled');
            }
            else
                element.classList.add('disabled');
        });
        highscores.updateHighscores(parseInt(this.id[this.id.length - 1]));
    },
    updateAndSortArrays: () => {
        const compareResults = (a, b) => {
            const hoursA = parseInt(a[2] + a[3]);
            const minutesA = parseInt(a[5] + a[6]);
            const secondsA = parseInt(a[8] + a[9]);
            let milisecondsA = parseInt(a[11] + a[12] + a[13]);

            const hoursB = parseInt(b[2] + b[3]);
            const minutesB = parseInt(b[5] + b[6]);
            const secondsB = parseInt(b[8] + b[9]);
            let milisecondsB = parseInt(b[11] + b[12] + b[13]);

            milisecondsA += hoursA * 60 * 60 * 1000 + minutesA * 60 * 1000 + secondsA * 1000;
            milisecondsB += hoursB * 60 * 60 * 1000 + minutesB * 60 * 1000 + secondsB * 1000;

            if (milisecondsA < milisecondsB) return -1;
            else if (milisecondsA > milisecondsB) return 1;
            else return 0;
        };

        // update and sort arrays
        let allRecords = highscores.getCookie(`username`).split('/');
        allRecords.forEach((element) => {
            if (element[0] == 3) {
                highscores3x3.push(element);
                highscores3x3.sort(compareResults);
            }
            else if (element[0] == 4) {
                highscores4x4.push(element);
                highscores4x4.sort(compareResults);
            }
            else if (element[0] == 5) {
                highscores5x5.push(element);
                highscores5x5.sort(compareResults);
            }
            else if (element[0] == 6) {
                highscores6x6.push(element);
                highscores6x6.sort(compareResults);
            }
        });
    },
    getInfoFromForm: () => {
        const usernameInput = document.querySelector('#username').value;
        if (usernameInput.length != 0) {
            highscores.username = usernameInput;
            
            highscores.setCookie(`username`, `${highscores.getCookie('username') != "" ? highscores.getCookie('username') + '/' : ""}` +
            `${render.dimension}|${timer.timeToString()}|${highscores.username}`, 3650);

            highscores.displayHighscores();
        }
    },
    updateHighscores: (dimension) => {
        const top10 = document.querySelectorAll('#highscores h3');

        top10.forEach((element, index) => {
            element.innerText = (index + 1) + '.';
        });

        // display records
        let time, username;
        for (let i = 1; i <= 10; i++) {
            if (dimension == 3) {
                if (highscores3x3[i - 1] != undefined) {
                    time = highscores3x3[i - 1].substr(2, 12);
                    username = highscores3x3[i - 1].substr(15);
                }
                else break;
            }
            else if (dimension == 4) {
                if (highscores4x4[i - 1] != undefined) {
                    time = highscores4x4[i - 1].substr(2, 12);
                    username = highscores4x4[i - 1].substr(15);
                }
                else break;
            }
            else if (dimension == 5) {
                if (highscores5x5[i - 1] != undefined) {
                    time = highscores5x5[i - 1].substr(2, 12);
                    username = highscores5x5[i - 1].substr(15);
                }
                else break;
            }
            else if (dimension == 6) {
                if (highscores6x6[i - 1] != undefined) {
                    time = highscores6x6[i - 1].substr(2, 12);
                    username = highscores6x6[i - 1].substr(15);
                }
                else break;
            }

            top10[i - 1].innerText = `${i}. ${username} - ${time}`;
        }
    },
    setCookie: (cname, cvalue, exdays) => {
        let d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + btoa(encodeURIComponent(cvalue)) + ";" + expires + ";path=/";
    },
    getCookie: (cname) => {
        let name = cname + "=";
        let decodedCookie = document.cookie;
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return decodeURIComponent(atob(c.substring(name.length, c.length)));
            }
        }
        return "";
    }
}

const submitButton = document.querySelector('#submit-button');
submitButton.addEventListener('click', highscores.getInfoFromForm);