
var PHYS = {}



PHYS.init = (boxContainer, freeContainer) => {

    // Create a physics world, where bodies and constraints live
    var world = new p2.World({
        gravity:[0, 9.82]
    });

 
    // Create an empty dynamic body
    var circleBody = new p2.Body({
        mass: 5,
        position: [100, 100]
    });
    var circlePIXI = new PIXI.Graphics(circleBody.position[0], circleBody.position[1],10).circle(0,0, 10).fill('white')


    // Add a circle shape to the body
    var circleShape = new p2.Circle({ radius: 1 });
    circleBody.addShape(circleShape);

    // ...and add the body to the world.
    // If we don't add it to the world, it won't be simulated.
    world.addBody(circleBody);

    // Create an infinite ground plane body
    var groundBody = new p2.Body({
        mass: 0 // Setting mass to 0 makes it static
    });
    var groundShape = new p2.Plane();
    groundBody.addShape(groundShape);
    world.addBody(groundBody);   

    circlePIXI.body = circleBody
    PHYS.circle = circlePIXI
    freeContainer.addChild(PHYS.circle)
    PHYS.world = world
}

const fixedTimeStep = 1 / 60; // seconds
const maxSubSteps = 10;
PHYS.update = (dt) => {
    PHYS.world.step(fixedTimeStep, dt, maxSubSteps);
    PHYS.circle.x = PHYS.circle.body.interpolatedPosition[0]
    PHYS.circle.y = PHYS.circle.body.interpolatedPosition[1]
}