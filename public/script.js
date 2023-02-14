var formstr = '<fieldset><legend>Rotation values (in degrees)</legend>'+
                '<p><label for="rotatex">X-rotation:</label>'+
                '<input type="range" id="rotatex" value="0" min=0'+
                ' max=360></p>'+
                '<p><label for="rotatey">Y-rotation:</label>'+
                '<input type="range" id="rotatey" value="0" min=0'+
                ' max=360></p>'+
                '<p><label for="rotatez">Z-rotation:</label>'+
                '<input type="range" id="rotatez" value="0" min=0'+
                ' max=360></p>'+
                '<p><button id="spin">stop spinning</button></p>'+
                '</fieldset>';
  var pfx = '',
      spin = true;

  var form = document.querySelector('form');

  if (checksupport()) {
    form.innerHTML = formstr;
    var logo = document.querySelector('#logo'),
        x = document.querySelector('#rotatex'),
        y = document.querySelector('#rotatey'),
        z = document.querySelector('#rotatez'),
        b = document.querySelector('#spin'),
        canrange = (x.type === 'range');

    if (canrange) {
      x.parentNode.appendChild(document.createElement('span'));
      y.parentNode.appendChild(document.createElement('span'));
      z.parentNode.appendChild(document.createElement('span'));
    }

    b.addEventListener('click', function(ev) {
      if (spin === true) {
        this.innerHTML = 'start spinning';
        logo.className = '';
        spin = false;
      } else {
        this.innerHTML = 'stop spinning';
        logo.className = 'spin';
        spin = true;
      }
      ev.preventDefault();
    } ,false);

    form.addEventListener('change', function() {
      logo.className = '';
      spin = false;
      b.innerHTML = 'start spinning';
      var transform = 'rotateX('+ x.value +'deg) rotateY('+ y.value +'deg)'+
                  ' rotateZ('+ z.value +'deg)';
      logo.style.MozTransform = logo.style.WebkitTransform = 
      logo.style.oTransform = logo.style.MsTransform =
      logo.style.transform = transform;
      if (canrange) {
        x.nextSibling.innerHTML = x.value;
        y.nextSibling.innerHTML = y.value;
        z.nextSibling.innerHTML = z.value;
      }
    } ,false);
    
    var s = '';
    var styles = document.createElement('style');
    s += '#stage{-'+ pfx +'-perspective: 300px;}'+
         '#logo{-'+ pfx +'-transform-style: preserve-3d;position:relative;}'+
         '#logo.spin{-'+ pfx +'-animation: spin 3s infinite linear;}'+
         '@-'+ pfx +'-keyframes spin {'+
         '0% {'+ 
         '-'+ pfx +'-transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);'+ 
         '}'+
         '100% {'+ 
         '-'+ pfx +'-transform: rotateX(0deg) rotateY(360deg)'+
         ' rotateZ(360deg);'+ 
         '}}';
     styles.innerHTML = s;
     document.querySelector('head').appendChild(styles);
    
  }
  
  function checksupport() {
    var props = ['perspectiveProperty', 'WebkitPerspective',
                 'MozPerspective', 'OPerspective', 'msPerspective'],
        i = 0,
        support = false;
    while (props[i]) {
      if (props[i] in form.style) {
        support = true;
        pfx = props[i].replace('Perspective','');
        pfx = pfx.toLowerCase();
        break;
      }
      i++;
    } 
    return support;
  }

  var stage = document.querySelector('#stage');

    // マウスムーブイベントに登録する処理
function mouseMove(e){
  logo.className = '';
    spin = false;
    b.innerHTML = 'start spinning';
    var transform1 = 'rotateX('+ e.x +'deg) rotateY('+ e.y +'deg)'+
                ' rotateZ('+ (e.x + e.y)/2 +'deg)';
    logo.style.MozTransform = logo.style.WebkitTransform = 
    logo.style.oTransform = logo.style.MsTransform =
    logo.style.transform = transform1;
  //   if (canrange) {
  //     x.nextSibling.innerHTML = x.value;
  //     y.nextSibling.innerHTML = y.value;
  //     z.nextSibling.innerHTML = z.value;
  //   }
}

// マウスムーブイベントに登録する処理
  stage.addEventListener('mousemove', function(ev) {
        mouseMove(ev);
      ev.preventDefault();
    } ,false);