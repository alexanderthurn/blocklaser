
var MOD_PHYS = {
    freeContainer: null,
    boxContainer: null,
    app: null
}
const deg2rad = deg => deg * (Math.PI / 180);
const rad2deg = rad => (rad * 180.0) / Math.PI;


MOD_PHYS.createPhysicalBoxBody = (x,y,w,h,m) => {
    var body = new p2.Body({
        mass: m,
        position: [x,y]
    })
    var shape = new p2.Box({ width: w, height: h })
    body.addShape(shape)
    return body
}

MOD_PHYS.createPhyiscalBoxPIXI = (x,y,w,h,m) => {
    var body = MOD_PHYS.createPhysicalBoxBody(x,y,w,h,m)
    var pixi = new PIXI.Graphics(body.position[0], body.position[1]).rect(-w/2, -h/2, w, h).fill('white')
    pixi.body = body
    return pixi
}

MOD_PHYS.createPhysicalCircleBody = (x,y,r,m) => {
    var body = new p2.Body({
        mass: m,
        position: [x,y]
    })
    var shape = new p2.Circle({ radius: r });
    body.addShape(shape)
    return body
}

MOD_PHYS.createPhysicalCirclePIXI = (x,y,r,m) => {
    var body = MOD_PHYS.createPhysicalCircleBody(x,y,r,m)
    var pixi = new PIXI.Graphics(body.position[0], body.position[1]).circle(0,0, r).fill('white')
    pixi.body = body
    return pixi
}

MOD_PHYS.init = (boxContainer, freeContainer, app) => {

    // Create a physics world, where bodies and constraints live
    var world = new p2.World({
        gravity:[0, 9.82]
    });

 
    // Create an empty dynamic body
    var circle = MOD_PHYS.createPhysicalCirclePIXI(500,100,50,5)
    world.addBody(circle.body)
    freeContainer.addChild(circle)

 /*   var ground = MOD_PHYS.createPhyiscalBoxPIXI(500,600,500,10,0)
    ground.body.angle = deg2rad(25)
    world.addBody(ground.body)
    freeContainer.addChild(ground)
*/

    var cube = MOD_PHYS.createPhyiscalBoxPIXI(210,110,150,150,5)
    world.addBody(cube.body)
    freeContainer.addChild(cube)


    MOD_PHYS.world = world
    MOD_PHYS.boxContainer = boxContainer
    MOD_PHYS.freeContainer = freeContainer
    MOD_PHYS.app = app
}

const fixedTimeStep = 1 / 60; // seconds
const maxSubSteps = 10;
MOD_PHYS.update = (dt) => {
    MOD_PHYS.world && MOD_PHYS.world.step(fixedTimeStep, dt, maxSubSteps);
    MOD_PHYS.freeContainer && MOD_PHYS.freeContainer.children.forEach(p => {
        p.x = p.body.interpolatedPosition[0]
        p.y = p.body.interpolatedPosition[1]
        p.rotation = p.body.angle
        if (p.body.position[1] > MOD_PHYS.app.renderer.height + p.body.boundingRadius) {
            p.body.position[1] = -p.body.boundingRadius
        }
        if (p.body.position[0] < 0) {
            p.body.position[0] = MOD_PHYS.app.renderer.width
        }
        if (p.body.position[0] > MOD_PHYS.app.renderer.width) {
            p.body.position[0] = 0
        }
    })
}