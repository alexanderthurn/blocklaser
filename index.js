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
            container.addChild(c)
        }
    }
  
   
    app.stage.addChild(container);


    document.body.addEventListener('pointermove', event => {
        let x = Math.floor(event.clientX / w) % xCount
        let y = Math.floor(event.clientY / h) % yCount
        let i = Math.floor(xCount*y + x)
        let c = container.children[i]
        console.log(x,y,xCount, yCount, i,c)
        c.alpha = 0
        event.preventDefault();
        event.stopPropagation();
    }, false);

    app.ticker.add(() =>
    {

        //container.rotation += 0.01;
    });
})();
