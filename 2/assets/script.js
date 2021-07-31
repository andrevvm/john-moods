var zoomers_container = document.querySelector('.zoomers');
var zoomers = document.querySelectorAll('.zoomer');
var scroller = document.getElementById('scroller');
var tourDates = document.getElementById('tour-dates');

var back = document.querySelector('.back');

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

  initTour();

  back.addEventListener('click', closeContent);
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

    //gsap.to(zoomers[i], {duration: 0.5, scale: zoomer.toFixed(4), ease: "power2.inOut"});
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

function openContent(e) {

  var origin_x = (e.clientX / window.innerWidth) * 100;
  var origin_y = (e.clientY / window.innerHeight) * 100;

  zoomers_container.style.transformOrigin = origin_x + '% ' + origin_y + '%';

  var s = (window.innerHeight*2) * 2;

  if(!this.dataset.id) {
    gsap.to(window, {duration: 1, scrollTo: {y:s, autoKill:true}, ease: "power2.inOut"});
    return;
  }



  document.body.classList.add('open-content');
  var el = document.getElementById(this.dataset.id);

  el.classList.add('open');
  el.addEventListener('click', closeContent);


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

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.responseType = 'json';
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.response);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function initTour() {
  httpGetAsync('https://api.songkick.com/api/3.0/artists/9417964-john-moods/calendar.json?apikey=kC1UkCrm3DDG7TfQ', response)
}

function response(data) {

  if(!tourDates)
    return false;
  
  var events = data.resultsPage.results.event;

  if(events.length === 0)
    return

  tourDates.innerHTML = '';

  for(var i=0;i<events.length;i++) {

    var date = Date.parse(events[i].start.date)
    var dateOptions = {month:'long', day: '2-digit', year: 'numeric'}
    var dateString = new Date(date).toLocaleDateString(undefined, dateOptions)

    var html =  '<a href="'+events[i].uri+'" target="_blank">';
    if(events[i].venue.displayName != 'Unknown venue') {
      html +=     events[i].venue.displayName
      html +=     ', '
    }
    
    html +=     events[i].location.city
    html +=     '<br/><small>' + dateString + '</small>'
    html +=     '</a>'

    var tourItem = document.createElement('p')
    tourItem.innerHTML = html
    tourDates.append(tourItem)

  }
}
