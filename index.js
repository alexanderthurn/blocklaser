(async () =>
{

    // Create a new application
    const app = new PIXI.Application();
    app.container = new PIXI.Container()
    app.container2 = new PIXI.Container()
    app.container.x = app.container2.x = 10
    app.container.y = app.container2.y = 10
    app.laserPointers = []
    app.BOX_WIDTH = 50
    app.BOX_HEIGHT = 50
    app.BOX_COUNT_X = 0
    app.BOX_COUNT_Y = 0
    app.MOD = MOD_PHYS
    app.MOD_BUTTONS_ACTIVATED = true


    app.getBoxAtTileXY = (tileX,tileY) => {
        let i = Math.floor(app.BOX_COUNT_X*tileY + tileX)
        if (i >= 0 && i < app.container.children.length)
            return app.container.children[i] 
        else 
            return null
    }

    app.replaceBoxAtTileXY = (tileX, tileY, box) => {
        let i = Math.floor(app.BOX_COUNT_X*tileY + tileX)
        if (i >= 0 && i < app.container.children.length) {
            app.container.addChildAt(box, i)
            app.container.removeChildAt(i+1)
        }
    }

    app.getBoxAtPixel = (pixelX,pixelY) => {
        let tileX = Math.floor((pixelX-app.container.x)/ app.BOX_WIDTH) % app.BOX_COUNT_X
        let tileY = Math.floor((pixelY-app.container.y) / app.BOX_HEIGHT) % app.BOX_COUNT_Y
        return app.getBoxAtTileXY(tileX, tileY)
    }

    // Initialize the application
    await app.init({
        resizeTo: window,
        preference: 'webgl',
    });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);
    app.stage.addChild(app.container);
    app.stage.addChild(app.container2);
    var laserSpottedOn = (pixelX,pixelY,dtf) => {
        let c = app.getBoxAtPixel(pixelX, pixelY)
        if (c) {
            if (c.laser >= 0 && c.laser < 40) {
                c.laser = 40
            } if (c.laser > 50 && c.laser < 100) {
                c.laser+=1.5*dtf
            } else if (c.laser > 150 && c.laser < 200) {
                c.laser+=1.5*dtf
            } else {
                c.laser+=1*dtf
            }
        }
    }
  
    document.body.addEventListener('pointermove', event => {
        if (app.laserPointers.length === 0) {
            app.laserPointers.push({x: 0,y:0})
        }
        app.laserPointers[0].x = event.clientX
        app.laserPointers[0].y = event.clientY
        event.preventDefault();
        event.stopPropagation();
    }, false);


    app.renderer.on('resize', function(event){
        clearAll(null)
    });

    let startMODEmpty = (c) => {
        app.MOD = MOD_EMPTY
        clearAll(c)
    }

    let startMODPhysics = (c) => {
        app.MOD = MOD_PHYS
        clearAll(c)
    }


    window.addEventListener('keyup', event => {
        if (event.key === '0') {
            app.MOD_BUTTONS_ACTIVATED = !app.MOD_BUTTONS_ACTIVATED
            app.getBoxAtTileXY(0,0).laser = app.getBoxAtTileXY(0,2).laser = app.MOD_BUTTONS_ACTIVATED ? 100 : 50
        }
        if (event.key === '1') {
            startMODEmpty()
        }

        if (event.key === '2') {
            startMODPhysics()
        }
    });


    let clearAll = (c) => {
        while(app.container.children[0]) { 
            app.container.removeChild(app.container.children[0]);
        }
        while(app.container2.children[0]) { 
            app.container2.removeChild(app.container2.children[0]);
        }

        baseInit(app)
        app.MOD.init(app)

        if (c)
            c.laser = app.MOD_BUTTONS_ACTIVATED ? 100 : 50
    }

    function baseInit(app) {
        let w = app.BOX_WIDTH
        let h = app.BOX_HEIGHT
        app.BOX_COUNT_X = Math.ceil((app.renderer.width-20) / w)
        app.BOX_COUNT_Y = Math.ceil((app.renderer.height-20) / h)
        for (let y = 0; y < app.BOX_COUNT_Y; y++) {
             for (let x = 0; x < app.BOX_COUNT_X; x++) {
                let c = new PIXI.Container()
                c.shape = new PIXI.Graphics()
                .rect(-w/2,-h/2, w,h)
                .stroke('white')
                c.laser = 0
               
                // mod empty
                if (x === 0 && y === 0 ){
                    c.shape
                    .rect(-w/2,-h/2, w,h)
                    .stroke('green')
                    .moveTo(-w/2,-h/2)
                    .lineTo(w/2,h/2)
                    .moveTo(-w/2,h/2)
                    .lineTo(w/2,-h/2)
                    .stroke('green')
                    c.deleteAction = startMODEmpty
                    c.physics = null
                }

                 // mod phys
                 if (x === 0 && y === 2 ){
                    c.shape
                    .rect(-w/2,-h/2, w,h)
                    .stroke('green')
                    .moveTo(0,0)
                    .lineTo(w/2,h/2)
                    .moveTo(0,0)
                    .lineTo(w/2,-h/2)
                    .stroke('green')
                    c.deleteAction = startMODPhysics
                    c.physics = null
                }

                c.x = w*x + w/2
                c.y = h*y+ h/2
                c.alpha = 0
                c.rotation = 0
                c.addChild(c.shape)
                app.container.addChild(c)
            }
        }
        app.getBoxAtTileXY(0,0).laser = app.getBoxAtTileXY(0,2).laser = app.MOD_BUTTONS_ACTIVATED ? 100 : 50
    }
   
    clearAll(null)

    app.ticker.add((time) =>
    {

        var dtf = time.deltaMS / (1000.0/60.0)

        app.container.children.forEach(c => {
            if (c.laser > 0 && c.laser < 100) {
                c.laser -= 0.2*dtf
                if (c.laser > 50) {
                    c.laser -= 0.5*dtf
                }
                if (c.laser < 0) {
                    c.laser = 0
                }
            }

            if (c.laser > 100 && c.laser < 200) {
                c.laser -= 0.2*dtf
                if (c.laser > 150) {
                    c.laser -= 0.5*dtf
                }

                if (c.laser < 100) {
                    c.laser = 100
                }
            }


            if (c.laser >= 200) {
                c.laser = -50
                c.angle = 0
                if (c.deleteAction && app.MOD_BUTTONS_ACTIVATED) {
                    c.deleteAction(c)
                }
            } else if (c.laser >= 150) {
                c.alpha = 1.0 - ((c.laser-150) / 50)*0.5
                c.angle = -((c.laser-150)/50-1)*4+Math.random()*((c.laser-150)/50-1)*8
            } else if (c.laser >= 100) {
                c.alpha = 1
                c.angle = 0
            } else if (c.laser >= 50) {
               c.alpha = c.laser / 150
               c.angle = -(c.laser/75-1)*4+Math.random()*(c.laser/75-1)*8
            } else {
                c.alpha = c.laser / 200
                c.angle = 0
            } 

        })
        
        app.laserPointers.forEach(l => {
            laserSpottedOn(l.x,l.y, dtf)
        })

        
        app.MOD.update(time.deltaMS)
    });
})();
