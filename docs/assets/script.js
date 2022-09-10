var zoomers_container = document.querySelector('.zoomers');
var zoomers = document.querySelectorAll('.zoomer');
var scroller = document.getElementById('scroller');
var loader = document.querySelector('.loading');

var back = document.querySelector('.back');

var animate_bool = true;
var resizeTimer = null;

var h = window.innerHeight;
var w = window.innerWidth;

setTimeout(init, 1200);

loader.addEventListener('click', init);

function setScrollerHeight() {
  scroller.style.height = (zoomers.length-1) * (window.innerHeight * 2) + 'px';
}

function init() {

  document.body.classList.add('loaded');

  setScrollerHeight();

  var s = (window.innerHeight*2) * 1;
  window.scrollTo(0,s);

  window.addEventListener('scroll', function() {
    window.requestAnimationFrame(animate);
  })

  for(var i=0; i<zoomers.length; i++) {
    zoomers[i].style.zIndex = zoomers.length - i;
    zoomers[i].addEventListener('click', openContent);
  }

  back.addEventListener('click', closeContent);
}

function animate() {

  var scrollY = window.scrollY;

  var scrollDiff = (scrollY + h*2) / (h*2);

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

    //gsap.to(zoomers[i], {duration: 0.5, scale: zoomer.toFixed(4), ease: "power2.inOut"});
    zoomers[i].style.transform = 'translateZ(0px) scale3d(' + zoomer.toFixed(4) + ',' + zoomer.toFixed(4) + ','+ zoomer.toFixed(4) +' )';

  }

  if(scrollDiff > zoomers.length - 1.02) {

    resetView();
    window.scrollTo(0, (h*2))
    
  }

  if(scrollDiff <= 1.98) {
    window.scrollTo(0, scroller.offsetHeight - h*2.08)
  }

}

window.addEventListener('resize', resetView);

function resetView() {
  document.body.classList.add('reset');
  setTimeout(function() {
    document.body.classList.remove('reset');
  }, 50);
}

function scrollIn() {
  var s = (window.innerHeight*2) * 2;
  gsap.to(window, {duration: 1, scrollTo: {y:s, autoKill:true}, ease: "power2.inOut"});
}

function openContent(e) {

  var origin_x = (e.clientX / window.innerWidth) * 100;
  var origin_y = (e.clientY / window.innerHeight) * 100;

  zoomers_container.style.transformOrigin = origin_x + '% ' + origin_y + '%';

  if(!this.dataset.id) {
    scrollIn();
    return;
  }

  document.body.classList.add('open-content');
  var el = document.getElementById(this.dataset.id);

  el.classList.add('open');

}

function closeContent() {
  document.body.classList.remove('open-content');
  var open = document.querySelector('.open');
  open.addEventListener('transitionend', contentClosed);
  zoomers_container.style.transformOrigin = '';
}

function contentClosed() {
  this.classList.remove('open');
  this.removeEventListener('transitionend', contentClosed);
}
