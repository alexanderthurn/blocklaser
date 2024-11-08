
var PHYS = {}


PHYS.createStaticBoxBody = (x,y,w,h, world) => {
    var boxBody = new p2.Body({
        mass: 0,
        position: [x,y]
    })
    var boxShape = new p2.Box({ width: w, height: h })
    boxBody.addShape(boxShape)
    world.addBody(boxBody)
    return boxBody
}

PHYS.init = (boxContainer, freeContainer) => {

    // Create a physics world, where bodies and constraints live
    var world = new p2.World({
        gravity:[0, 9.82]
    });

 
    // Create an empty dynamic body
    var circleBody = new p2.Body({
        mass: 5,
        position: [500, 100]
    });
    var circleShape = new p2.Circle({ radius: 50 });
    circleBody.addShape(circleShape);
    world.addBody(circleBody);
    var circlePIXI = new PIXI.Graphics(circleBody.position[0], circleBody.position[1]).circle(0,0, circleShape.radius).fill('white')
    circlePIXI.body = circleBody
    freeContainer.addChild(circlePIXI)

    var boxBody = new p2.Body({
        mass: 0,
        position: [500,500]
    })
    var boxShape = new p2.Box({ width: 1000, height: 10 })
    boxBody.addShape(boxShape)
    world.addBody(boxBody)
    var boxPIXI = new PIXI.Graphics(boxBody.position[0], boxBody.position[1]).rect(-boxShape.width/2, -boxShape.height/2, boxShape.width, boxShape.height).fill('green')
    boxPIXI.body = boxBody
    freeContainer.addChild(boxPIXI)

    var boxBody2 = new p2.Body({
        mass: 5,
        position: [210,110]
    })
    var boxShape2 = new p2.Box({ width: 150, height: 150 })
    boxBody2.addShape(boxShape2)
    world.addBody(boxBody2)
    var boxPIXI2 = new PIXI.Graphics(boxBody2.position[0], boxBody2.position[1]).rect(-boxShape2.width/2, -boxShape2.height/2, boxShape2.width, boxShape2.height).fill('white')
    boxPIXI2.body = boxBody2
    freeContainer.addChild(boxPIXI2)

   /* var groundBody = new p2.Body({
        mass: 0, // Setting mass to 0 makes it static,
        position: [0,100]
    });
    var groundShape = new p2.Plane();
    groundBody.addShape(groundShape);
    world.addBody(groundBody);   
*/

    PHYS.circle = circlePIXI
    PHYS.world = world
    PHYS.box = boxPIXI
    PHYS.box2 = boxPIXI2
}

const fixedTimeStep = 1 / 60; // seconds
const maxSubSteps = 10;
PHYS.update = (dt) => {
    PHYS.world.step(fixedTimeStep, dt, maxSubSteps);
    PHYS.circle.x = PHYS.circle.body.interpolatedPosition[0]
    PHYS.circle.y = PHYS.circle.body.interpolatedPosition[1]
    PHYS.box.x = PHYS.box.body.interpolatedPosition[0]
    PHYS.box.y = PHYS.box.body.interpolatedPosition[1]
    PHYS.box2.x = PHYS.box2.body.interpolatedPosition[0]
    PHYS.box2.y = PHYS.box2.body.interpolatedPosition[1]
}