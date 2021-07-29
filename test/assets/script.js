var zoomers = document.querySelectorAll('.zoomer');
var scroller = document.getElementById('scroller');
init();

function setScrollerHeight() {
  scroller.style.height = zoomers.length * (window.innerHeight * 1.5) + 'px';
}

function init() {
  setScrollerHeight();
  setTimeout(animate, 1000);

  for(var i=0; i<zoomers.length; i++) {
    zoomers[i].style.zIndex = zoomers.length - i;
    zoomers[i].addEventListener('click', openContent);
  }
}

function animate() {
  window.requestAnimationFrame(animate);
  var scrollY = window.scrollY;

  var scrollDiff = (scrollY + window.innerHeight) / (window.innerHeight);

  for(var i=0; i<zoomers.length; i++) {

    var zoomAmt = (1 * (i + 1)) - scrollDiff;
    var zoomer = Math.min(500, Math.max(0, Math.pow(500, zoomAmt) * (i + 1)) );
    zoomers[i].style.transform = 'translateZ(0px) scale(' + zoomer + ')';

  }

  if(scrollDiff > 4.2)
    window.scrollTo(0,0)

}

function openContent() {
  document.body.classList.add('open-content');
}
