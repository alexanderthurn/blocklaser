
var PHYS = {
    freeContainer: null,
    boxContainer: null
}


PHYS.createPhysicalBoxBody = (x,y,w,h,m) => {
    var body = new p2.Body({
        mass: m,
        position: [x,y]
    })
    var shape = new p2.Box({ width: w, height: h })
    body.addShape(shape)
    return body
}

PHYS.createPhyiscalBoxPIXI = (x,y,w,h,m) => {
    var body = PHYS.createPhysicalBoxBody(x,y,w,h,m)
    var pixi = new PIXI.Graphics(body.position[0], body.position[1]).rect(-w/2, -h/2, w, h).fill('white')
    pixi.body = body
    return pixi
}

PHYS.createPhysicalCircleBody = (x,y,r,m) => {
    var body = new p2.Body({
        mass: m,
        position: [x,y]
    })
    var shape = new p2.Circle({ radius: r });
    body.addShape(shape)
    return body
}

PHYS.createPhysicalCirclePIXI = (x,y,r,m) => {
    var body = PHYS.createPhysicalCircleBody(x,y,r,m)
    var pixi = new PIXI.Graphics(body.position[0], body.position[1]).circle(0,0, r).fill('white')
    pixi.body = body
    return pixi
}

PHYS.init = (boxContainer, freeContainer) => {

    // Create a physics world, where bodies and constraints live
    var world = new p2.World({
        gravity:[0, 9.82]
    });

 
    // Create an empty dynamic body
    var circle = PHYS.createPhysicalCirclePIXI(500,100,50,5)
    world.addBody(circle.body)
    freeContainer.addChild(circle)

    var ground = PHYS.createPhyiscalBoxPIXI(500,500,1000,10,0)
    ground.angle = 0.1
    world.addBody(ground.body)
    freeContainer.addChild(ground)

    var cube = PHYS.createPhyiscalBoxPIXI(210,110,150,150,5)
    world.addBody(cube.body)
    freeContainer.addChild(cube)


    PHYS.world = world
    PHYS.boxContainer = boxContainer
    PHYS.freeContainer = freeContainer
}

const fixedTimeStep = 1 / 60; // seconds
const maxSubSteps = 10;
PHYS.update = (dt) => {
    PHYS.world && PHYS.world.step(fixedTimeStep, dt, maxSubSteps);
    PHYS.freeContainer && PHYS.freeContainer.children.forEach(p => {
        p.x = p.body.interpolatedPosition[0]
        p.y = p.body.interpolatedPosition[1]
    })
}