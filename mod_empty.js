var MOD_EMPTY = {
    freeContainer: null,
    boxContainer: null
}


MOD_EMPTY.init = (boxContainer, freeContainer, app, laserPointers) => {

    for (let y = 0; y < app.BOX_COUNT_Y; y++) {
        for (let x = 0; x < app.BOX_COUNT_X; x++) {
            let c = app.getBoxAtTileXY(x,y)
            if ((x === 4 && y === 5) || (x === 5 && y === 4) || (x === 6 && y === 5)) {
                c.laser = 100
            }
        }
    }
 

}


MOD_EMPTY.update = (dt) => {

}