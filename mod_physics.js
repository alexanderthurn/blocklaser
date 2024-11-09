
var MOD_PHYS = {
    freeContainer: null,
    boxContainer: null,
    app: null,
    scale: 50,
    offset: 0
}
const deg2rad = deg => deg * (Math.PI / 180);
const rad2deg = rad => (rad * 180.0) / Math.PI;


MOD_PHYS.createPhysicalBoxBody = (x,y,w,h,m) => {
    var body = new p2.Body({
        mass: m,
        position: [x,y],
        damping: 0.2
    })
    var shape = new p2.Box({ width: w, height: h })
    body.addShape(shape)
    return body
}

MOD_PHYS.createPhyiscalBoxPIXI = (x,y,w,h,m,options) => {
    var body = MOD_PHYS.createPhysicalBoxBody(x,y,w,h,m)
    var pixi = new PIXI.Graphics(body.position[0], body.position[1]).rect(-w/2, -h/2, w, h).fill(options?.fill || 'white').stroke(options?.stroke || 'transparent')
    pixi.body = body
    return pixi
}

MOD_PHYS.createPhysicalCircleBody = (x,y,r,m) => {
    var body = new p2.Body({
        mass: m,
        position: [x,y],
        damping: 0.2
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

MOD_PHYS.getCurrentBodyAsReset = (body) => {
    return {
        position: [body.position[0], body.position[1]], 
        angle: body.angle, 
        angularVelocity: 0, 
        velocity: [body.velocity[0], body.velocity[1]],
        inertia: body.intertia,
        damping: body.damping
    }
}

MOD_PHYS.applyResetOnBody = (body, reset) => {
    body.angle = reset.angle
    body.position[0] = reset.position[0]
    body.position[1] = reset.position[1]
    body.velocity[0] = reset.velocity[0]
    body.velocity[1] = reset.velocity[1]
    body.angularVelocity = reset.angularVelocity
    body.setZeroForce ()
    body.intertia = reset.inertia
    body.damping = reset.damping
}

MOD_PHYS.init = (boxContainer, freeContainer, app) => {


    for (let y = 0; y < app.BOX_COUNT_Y; y++) {
        for (let x = 0; x < app.BOX_COUNT_X; x++) {
            let c = app.getBoxAtTileXY(x,y)
            if ((x === 22 && y === 15)) {
                let c = new PIXI.Graphics()
                .rect(-app.BOX_WIDTH/2,-app.BOX_HEIGHT/2, app.BOX_WIDTH,app.BOX_HEIGHT)
                .stroke('yellow')
                .moveTo(-app.BOX_WIDTH/2*0.75, app.BOX_HEIGHT/2*0.75)
                .lineTo(0,-app.BOX_HEIGHT/2*0.75)
                .lineTo(app.BOX_WIDTH/2*0.75,app.BOX_HEIGHT/2*0.75)
                .lineTo(-app.BOX_WIDTH/2*0.75, app.BOX_HEIGHT/2*0.75)
                .stroke('yellow')
                c.x = app.BOX_WIDTH*x + app.BOX_WIDTH/2
                c.y = app.BOX_HEIGHT*y+ app.BOX_HEIGHT/2
                c.alpha = 0
                c.rotation = 0
                c.laser = 100
                c.impulse = [0,-2000]
                app.replaceBoxAtTileXY(x,y,c)
            }

            if ((x === 22 && y === 5)) {
                let c = new PIXI.Graphics()
                .rect(-app.BOX_WIDTH/2,-app.BOX_HEIGHT/2, app.BOX_WIDTH,app.BOX_HEIGHT)
                .stroke('yellow')
                .moveTo(app.BOX_WIDTH/2*0.75, -app.BOX_HEIGHT/2*0.75)
                .lineTo(-app.BOX_WIDTH/2*0.75,0)
                .lineTo(app.BOX_WIDTH/2*0.75,app.BOX_HEIGHT/2*0.75)
                .lineTo(app.BOX_WIDTH/2*0.75, -app.BOX_HEIGHT/2*0.75)
                .stroke('yellow')
                c.x = app.BOX_WIDTH*x + app.BOX_WIDTH/2
                c.y = app.BOX_HEIGHT*y+ app.BOX_HEIGHT/2
                c.alpha = 0
                c.laser = 100
                c.impulse = [-2000,0]
                app.replaceBoxAtTileXY(x,y,c)
            }


        }
    }

    // Create a physics world, where bodies and constraints live
    var world = new p2.World({
        gravity:[0, 9.82*MOD_PHYS.scale]
    });
        world.on("beginContact",function(event){
            if (event.bodyA.impulse) {
                event.bodyB.applyImpulse([event.bodyA.impulse[0]*event.bodyB.mass, event.bodyA.impulse[1]*event.bodyB.mass]);
            }

            if (event.bodyB.impulse) {
                event.bodyA.applyImpulse([event.bodyB.impulse[0]*event.bodyA.mass, event.bodyB.impulse[1]*event.bodyA.mass]);
            }
      });

      /*
      world.on("endContact",function(event){
        console.log(event)
      });*/
 
    // Create an empty dynamic body
    var circle = MOD_PHYS.createPhysicalCirclePIXI(500,100,100,5)
    circle.reset = MOD_PHYS.getCurrentBodyAsReset(circle.body)
    world.addBody(circle.body)
    freeContainer.addChild(circle)


   

  var ground = MOD_PHYS.createPhyiscalBoxPIXI(500,600,500,10,0, {fill: 'transparent', stroke: 'white'})
    ground.body.angle = deg2rad(25)
    world.addBody(ground.body)
    freeContainer.addChild(ground)

 
    var cube = MOD_PHYS.createPhyiscalBoxPIXI(210,110,150,150,10, {fill: 'transparent', stroke: 'white'})
    //cube.reset = MOD_PHYS.getCurrentBodyAsReset(cube.body)
    world.addBody(cube.body)
    freeContainer.addChild(cube)


    MOD_PHYS.world = world
    MOD_PHYS.boxContainer = boxContainer
    MOD_PHYS.freeContainer = freeContainer
    MOD_PHYS.app = app
}

const fixedTimeStep = 1 / 60.0; // seconds
const maxSubSteps = 10;
MOD_PHYS.update = (dt) => {
    MOD_PHYS.world && MOD_PHYS.world.step(fixedTimeStep, dt/1000, maxSubSteps);

    MOD_PHYS.boxContainer && MOD_PHYS.boxContainer.children.forEach(p => {
    
        if (p.laser >= 100 && p.laser < 200) {
            if (!p.body && p.physics !== null) {
                p.body = MOD_PHYS.createPhysicalBoxBody(p.x,p.y,MOD_PHYS.app.BOX_WIDTH, MOD_PHYS.app.BOX_HEIGHT, 0)
                if (p.impulse)
                    p.body.impulse = p.impulse
                MOD_PHYS.world.addBody(p.body)
            }
        } else {
            if (p.body) {
                MOD_PHYS.world.removeBody(p.body)
                delete p.body
            }
        }

    })
    MOD_PHYS.freeContainer && MOD_PHYS.freeContainer.children.forEach(p => {
        p.x = p.body.interpolatedPosition[0]
        p.y = p.body.interpolatedPosition[1]
        p.rotation = p.body.angle
        if (p.y > MOD_PHYS.app.renderer.height + p.body.boundingRadius +MOD_PHYS.offset) {
            if (p.reset) {
               MOD_PHYS.applyResetOnBody(p.body, p.reset)
            } else {
                p.body.position[1] = -p.body.boundingRadius-2*MOD_PHYS.offset
            }
        }
        if (p.x < 0 -p.body.boundingRadius+MOD_PHYS.offset) {
            p.body.position[0]+= MOD_PHYS.app.renderer.width+p.body.boundingRadius+2*MOD_PHYS.offset
        }
        if (p.x > MOD_PHYS.app.renderer.width +p.body.boundingRadius -MOD_PHYS.offset) {
            p.body.position[0] += -(MOD_PHYS.app.renderer.width+p.body.boundingRadius+2*MOD_PHYS.offset)
        }
    })
}