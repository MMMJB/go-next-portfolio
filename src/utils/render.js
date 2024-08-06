/**
 * A heavily modified version of the render module from matter-js (https://github.com/liabru/matter-js/blob/master/src/render/Render.js)
 * Reduced to solely render bodies and their parts, and to render them as solid shapes.
 */

import { Composite } from "matter-js";

export default function render(render) {
  var // startTime = Common.now(),
    engine = render.engine,
    world = engine.world,
    canvas = render.canvas,
    context = render.context,
    options = render.options; //,
  // timing = render.timing;

  var allBodies = Composite.allBodies(world),
    allConstraints = Composite.allConstraints(world),
    // background = options.wireframes
    //   ? options.wireframeBackground
    //   : options.background,
    bodies = [],
    constraints = []; //,
  // i;

  // clear the canvas with a transparent fill, to allow the canvas background to show
  // context.globalCompositeOperation = "source-in";
  // context.fillStyle = "transparent";
  // context.fillRect(0, 0, canvas.width, canvas.height);
  // context.globalCompositeOperation = "source-over";

  // clear the canvas with a solid white fill
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // handle bounds
  /*if (options.hasBounds) {
    // filter out bodies that are not in view
    for (i = 0; i < allBodies.length; i++) {
      var body = allBodies[i];
      if (Bounds.overlaps(body.bounds, render.bounds)) bodies.push(body);
    }

    // filter out constraints that are not in view
    for (i = 0; i < allConstraints.length; i++) {
      var constraint = allConstraints[i],
        bodyA = constraint.bodyA,
        bodyB = constraint.bodyB,
        pointAWorld = constraint.pointA,
        pointBWorld = constraint.pointB;

      if (bodyA) pointAWorld = Vector.add(bodyA.position, constraint.pointA);
      if (bodyB) pointBWorld = Vector.add(bodyB.position, constraint.pointB);

      if (!pointAWorld || !pointBWorld) continue;

      if (
        Bounds.contains(render.bounds, pointAWorld) ||
        Bounds.contains(render.bounds, pointBWorld)
      )
        constraints.push(constraint);
    }

    // transform the view
    Render.startViewTransform(render);

    // update mouse
    if (render.mouse) {
      Mouse.setScale(render.mouse, {
        x: (render.bounds.max.x - render.bounds.min.x) / render.options.width,
        y: (render.bounds.max.y - render.bounds.min.y) / render.options.height,
      });

      Mouse.setOffset(render.mouse, render.bounds.min);
    }
  } else {*/
  constraints = allConstraints;
  bodies = allBodies;

  if (render.options.pixelRatio !== 1) {
    render.context.setTransform(
      render.options.pixelRatio,
      0,
      0,
      render.options.pixelRatio,
      0,
      0,
    );
  }
  //}

  if (!options.wireframes || (engine.enableSleeping && options.showSleeping)) {
    // fully featured rendering of bodies
    renderBodies(render, bodies, context);
  } /*else {
    if (options.showConvexHulls)
      Render.bodyConvexHulls(render, bodies, context);

    // optimised method for wireframes only
    Render.bodyWireframes(render, bodies, context);
  }*/

  // log the time elapsed computing this update
  // timing.lastElapsed = Common.now() - startTime;
}

function renderBodies(render, bodies, context) {
  var c = context,
    options = render.options,
    showInternalEdges = options.showInternalEdges || !options.wireframes,
    body,
    part,
    i,
    k;

  for (i = 0; i < bodies.length; i++) {
    body = bodies[i];

    if (!body.render.visible) continue;

    // handle compound parts
    for (k = body.parts.length > 1 ? 1 : 0; k < body.parts.length; k++) {
      part = body.parts[k];

      if (!part.render.visible) continue;

      if (options.showSleeping && body.isSleeping) {
        c.globalAlpha = 0.5 * part.render.opacity;
      } else if (part.render.opacity !== 1) {
        c.globalAlpha = part.render.opacity;
      }

      if (
        part.render.sprite &&
        part.render.sprite.texture &&
        !options.wireframes
      ) {
        // part sprite
        var sprite = part.render.sprite,
          texture = _getTexture(render, sprite.texture);

        c.translate(part.position.x, part.position.y);
        c.rotate(part.angle);

        c.drawImage(
          texture,
          texture.width * -sprite.xOffset * sprite.xScale,
          texture.height * -sprite.yOffset * sprite.yScale,
          texture.width * sprite.xScale,
          texture.height * sprite.yScale,
        );

        // revert translation, hopefully faster than save / restore
        c.rotate(-part.angle);
        c.translate(-part.position.x, -part.position.y);
      } else {
        // part polygon
        if (part.circleRadius) {
          c.beginPath();
          c.arc(
            part.position.x,
            part.position.y,
            part.circleRadius,
            0,
            2 * Math.PI,
          );
        } else {
          c.beginPath();
          c.moveTo(part.vertices[0].x, part.vertices[0].y);

          for (var j = 1; j < part.vertices.length; j++) {
            if (!part.vertices[j - 1].isInternal || showInternalEdges) {
              c.lineTo(part.vertices[j].x, part.vertices[j].y);
            } else {
              c.moveTo(part.vertices[j].x, part.vertices[j].y);
            }

            if (part.vertices[j].isInternal && !showInternalEdges) {
              c.moveTo(
                part.vertices[(j + 1) % part.vertices.length].x,
                part.vertices[(j + 1) % part.vertices.length].y,
              );
            }
          }

          c.lineTo(part.vertices[0].x, part.vertices[0].y);
          c.closePath();
        }

        if (!options.wireframes) {
          c.fillStyle = part.render.fillStyle;

          if (part.render.lineWidth) {
            c.lineWidth = part.render.lineWidth;
            c.strokeStyle = part.render.strokeStyle;
            c.stroke();
          }

          c.fill();
        } else {
          c.lineWidth = 1;
          c.strokeStyle = render.options.wireframeStrokeStyle;
          c.stroke();
        }
      }

      c.globalAlpha = 1;
    }
  }
}

function _getTexture(render, imagePath) {
  var image = render.textures[imagePath];

  if (image) return image;

  image = render.textures[imagePath] = new Image();
  image.src = imagePath;

  return image;
}
