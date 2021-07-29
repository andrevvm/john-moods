var zoomers = document.querySelectorAll('.zoomer');
var scroller = document.getElementById('scroller');

var animate_bool = true;
var resizeTimer = null;

init();

function setScrollerHeight() {
  scroller.style.height = (zoomers.length-1) * (window.innerHeight * 2) + 'px';
}

function init() {
  setScrollerHeight();

  var s = (window.innerHeight*2) * 1;
  window.scrollTo(0,s);

  setTimeout(animate, 1000);

  for(var i=0; i<zoomers.length; i++) {
    zoomers[i].style.zIndex = zoomers.length - i;
    zoomers[i].addEventListener('click', openContent);
  }
}

function animate() {

  window.requestAnimationFrame(animate);

  var scrollY = window.scrollY;

  var scrollDiff = (scrollY + window.innerHeight*2) / (window.innerHeight*2);

  for(var i=0; i<zoomers.length; i++) {

    var zoomAmt = (i + 1) - scrollDiff;
    var zoomer = Math.min(900, Math.max(0, Math.pow(1000, zoomAmt)) );
    if(zoomer < 0.001) {
      zoomers[i].style.opacity = 0;
      zoomers[i].style.pointerEvents = 'none';
    } else {
      zoomers[i].style.opacity = 1;
      zoomers[i].style.pointerEvents = 'auto';
    }
    zoomers[i].style.transform = 'translateZ(0px) scale3d(' + zoomer.toFixed(4) + ',' + zoomer.toFixed(4) + ','+ zoomer.toFixed(4) +' )';

  }

  if(scrollDiff > zoomers.length - 1.02)
    window.scrollTo(0, (window.innerHeight*2))

  if(scrollDiff <= 1.98)
    window.scrollTo(0, scroller.offsetHeight - window.innerHeight*2.08)

}

window.addEventListener('resize', function() {

  setScrollerHeight();

})

function openContent() {
  document.body.classList.add('open-content');
  var el = document.getElementById(this.dataset.id);

  el.classList.add('open');
  el.addEventListener('click', closeContent);
}

function closeContent() {
  this.classList.remove('open');
  document.body.classList.remove('open-content');
}
