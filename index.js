(async () =>
{
    // Create a new application
    const app = new PIXI.Application();

    // Initialize the application
    await app.init({
        resizeTo: window,
        preference: 'webgl',
    });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);


    let w = 50
    let h = 50
    let xCount = Math.ceil(app.screen.width / w)
    let yCount = Math.ceil(app.screen.width / h)
    let container = new PIXI.Container()
    
    for (let y = 0; y < yCount; y++) {
         for (let x = 0; x < xCount; x++) {
            let c = new PIXI.Graphics()
            .rect(w*x,h*y, w,h)
            .stroke('white')
            c.laser = 0
            c.alpha = 0
            container.addChild(c)
        }
    }
  
   
    app.stage.addChild(container);

    var laserSpottedOn = (pixelX,pixelY) => {
        let x = Math.floor(pixelX/ w) % xCount
        let y = Math.floor(pixelY / h) % yCount
        let i = Math.floor(xCount*y + x)
        let c = container.children[i]
        //c.alpha = 0
        c.laser++
         if (c.laser < 50) {
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

    app.ticker.add(() =>
    {
        laserPointers.forEach(l => {
            laserSpottedOn(l.x,l.y)
        })

        container.children.forEach(c => {
            if (c.laser > 0 && c.laser < 50) {
                c.laser -= 0.5
                if (c.laser < 0) {
                    c.laser = 0
                }
            }

            if (c.laser > 100 && c.laser < 150) {
                c.laser -= 0.5
                if (c.laser < 100) {
                    c.laser = 100
                }
            }


            if (c.laser > 200) {
                c.laser = 0
            } else if (c.laser > 150) {
                c.alpha = 0
            } else if (c.laser > 100) {
                c.alpha = 1.0 - (c.laser-100) / 50
            } else if (c.laser > 50) {
               c.alpha = 1
            } else {
                c.alpha = c.laser / 50
            } 

        })
        //container.rotation += 0.01;
    });
})();
