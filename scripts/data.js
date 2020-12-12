import { render } from "./render.js";

export let data = {
    data: [],
    emptyPartX: 'none',
    emptyPartY: 'none',
    initializeData: () => {
        for (let i = 0; i < render.dimension + 2; i++) {
            data.data.push([]);
            for (let j = 0; j < render.dimension + 2; j++) {
                if (i == 0 || i == render.dimension + 1 || j == 0 || j == render.dimension + 1)
                    data.data[i][j] = -1;
                else
                    data.data[i][j] = (i - 1) * render.dimension + (j - 1);
            }
        }
        data.emptyPartX = render.dimension;
        data.emptyPartY = render.dimension;
    },
}