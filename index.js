

(async () =>
{
    var BOX_WIDTH = 50
    var BOX_HEIGHT = 50
    var boxCountX = 0
    var boxCountY = 0

    // Create a new application
    const app = new PIXI.Application();
    // Initialize the application
    await app.init({
        resizeTo: window,
        preference: 'webgl',
    });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);
    var gameMode = MOD_PHYS
    
    let container = new PIXI.Container()
    let container2 = new PIXI.Container()

    container.x = container2.x = 10
    container.y = container2.y = 10
    container.width = container2.width = app.screen.width-20
    container.height = container2.height = app.screen.height-20
    app.stage.addChild(container);
    app.stage.addChild(container2);
    var laserSpottedOn = (pixelX,pixelY) => {
        let x = Math.floor((pixelX-container.x)/ BOX_WIDTH) % boxCountX
        let y = Math.floor((pixelY-container.y) / BOX_HEIGHT) % boxCountY
        let i = Math.floor(boxCountX*y + x)
        let c = container.children[i]
        if  (c) {
            c.laser++
        }
    }
    let laserPointers = []
    document.body.addEventListener('pointermove', event => {
        if (laserPointers.length === 0) {
            laserPointers.push({x: 0,y:0})
        }
        laserPointers[0].x = event.clientX
        laserPointers[0].y = event.clientY
        event.preventDefault();
        event.stopPropagation();
    }, false);



    let clearAll = (c) => {
        container.children.forEach(c => { c.laser = 0})
        while(container2.children[0]) { 
            container2.removeChild(container2.children[0]);
        }
        gameMode.init(container, container2)
        c.laser = 100
    }


    function baseInit(container, container2, app) {
        let w = BOX_WIDTH
        let h = BOX_HEIGHT
        let xCount = boxCountX = Math.ceil((app.screen.width-20) / w)
        let yCount = boxCountY = Math.ceil((app.screen.height-20) / h)
        for (let y = 0; y < yCount; y++) {
             for (let x = 0; x < xCount; x++) {
                let c = new PIXI.Graphics()
                .rect(-w/2,-h/2, w,h)
                .stroke('white')
                c.laser = 0
               
                if (x === 0 && y === 0 ){
                    c = new PIXI.Graphics()
                    .rect(-w/2,-h/2, w,h)
                    .stroke('white')
                    .moveTo(-w/2,-h/2)
                    .lineTo(w/2,h/2)
                    .moveTo(-w/2,h/2)
                    .lineTo(w/2,-h/2)
                    .stroke('white')
                    c.deleteAction = clearAll
                    c.laser = 100
                }
    
                if ((x === 4 && y === 5) || (x === 5 && y === 4) || (x === 6 && y === 5)) {
                    c.laser = 100
                }
                c.x = w*x + w/2
                c.y = h*y+ h/2
                c.alpha = 0
                c.rotation = 0
    
                container.addChild(c)
            }
        }
    }
   
  

    baseInit(container, container2, app)
    gameMode.init(container, container2, app)

   

    app.ticker.add((time) =>
    {

        var dtf = time.deltaMS / (1000.0/60.0)

        container.children.forEach(c => {
            if (c.laser > 0 && c.laser < 100) {
                c.laser -= 0.1*dtf
                if (c.laser > 50) {
                    c.laser -= 0.5*dtf
                }
                if (c.laser < 0) {
                    c.laser = 0
                }
            }

            if (c.laser > 150 && c.laser < 175) {
                c.laser -= 0.1*dtf
                if (c.laser < 100) {
                    c.laser = 100
                }
            }


            if (c.laser >= 200) {
                c.laser = -50
                c.angle = 0
                if (c.deleteAction) {
                    c.deleteAction(c)
                }
            } else if (c.laser >= 150) {
                c.alpha = 1.0 - (c.laser-150) / 50
                c.angle = -((c.laser-150)/50-1)*4+Math.random()*((c.laser-150)/50-1)*8
            } else if (c.laser >= 100) {
                c.alpha = 1
                c.angle = 0
            } else if (c.laser >= 50) {
               c.alpha = c.laser / 100
               c.angle = -(c.laser/50-1)*4+Math.random()*(c.laser/50-1)*8
            } else {
                c.alpha = c.laser / 100
                c.angle = 0
            } 

        })
        
        laserPointers.forEach(l => {
            laserSpottedOn(l.x,l.y)
        })

        
        gameMode.update(time.deltaMS, container, laserPointers)
    });
})();
