/* eslint-disable no-undef */

// eslint-disable-next-line no-unused-vars
var w = 0, h = 0;
var renderer;
var stage = new PIXI.Container();
var container = new PIXI.Container();
var foreground = new PIXI.Container();
stage.addChild(container);
stage.addChild(foreground); 

var f;
var fg;
var d;
var mousex = w/2, mousey = h/2;
var ploader = new PIXI.loaders.Loader();

export const draw3d = (width, height, img, mapImg) => {
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
  stage.destroy(true);
  stage = new PIXI.Container();
  renderer = new PIXI.WebGLRenderer({
    width: 0,
    height: 0,
    backgroundColor: 0xffffff
  });
  ploader.reset(); 
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
  f.scale.x = (window.innerWidth/2 - mousex) / 80;
  f.scale.y = (window.innerHeight/2 - mousey) / 80;
  fg.addChild(d);
  d.renderable=false;
   
  renderer.render(stage);       
  requestAnimationFrame(animate);
}
