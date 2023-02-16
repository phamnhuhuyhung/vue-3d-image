/* eslint-disable no-undef */

// eslint-disable-next-line no-unused-vars
var w = 0, h = 0;
var renderer;
var stage;
var container;
var foreground 

var f;
var fg;
var d;
var mousex = w/2, mousey = h/2;
var ploader;

export const draw3d = (width, height, img, mapImg) => {
  stage = new PIXI.Container();
  container = new PIXI.Container();
  foreground = new PIXI.Container();
  stage.addChild(container);
  stage.addChild(foreground);
  ploader = new PIXI.loaders.Loader();
  mousex = 0;
  mousey = 0;
  w = width;
  h = height;
  renderer = new PIXI.WebGLRenderer({
    width: w,
    height: h,
    backgroundColor: 0xffffff
  });
  var cOutput = document.getElementById('wrap');
  cOutput.appendChild(renderer.view);
  ploader.add('fg', img);
  ploader.add('depth', mapImg);

  ploader.once('complete', startMagic);
  // Begin loading -
  ploader.load();
}

export const removeDraw3d = () => {
  if(stage) {
    while(stage.children[0]) { 
      stage.removeChild(stage.children[0]);
    }
    ploader.reset();
    stage.destroy(true);
    stage = null;
    container = null;
    // renderer.view.destroy(true);
    renderer.view = null;

    // renderer.destroy(true);
    renderer = null;
  } 
}

function startMagic() {
  fg = new PIXI.Sprite(ploader.resources.fg.texture);

  foreground.addChild(fg);
  
  d = new PIXI.Sprite(ploader.resources.depth.texture);
    f = new PIXI.filters.DisplacementFilter(d, 0);
    fg.filters = [f];  
    window.onmousemove = function(e) {
      mousex = e.clientX;
      mousey = e.clientY;
    };
  animate();
}


function animate() {
  f.scale.x = (window.innerWidth - mousex) / 80;
  f.scale.y = (window.innerHeight - mousey) / 80;
  fg.addChild(d);
  d.renderable=false;
   
  if (stage) {
    renderer.render(stage);
    requestAnimationFrame(animate);
  }
}
