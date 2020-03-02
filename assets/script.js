var zoomers = document.querySelectorAll('.zoomer');
var scroller = document.getElementById('scroller');
var navLinks = document.querySelectorAll('nav a');
var videoCover = document.getElementById('video-cover');
var tourDates = document.getElementById('tour-dates');
var colorShifters = document.querySelectorAll('.color-shift');
var loader = document.querySelector('.loading');
var loaded = false;
var interact = false;
var interactTimer;
var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

function is_touch_device() {
    
    var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
    
    var mq = function (query) {
        return window.matchMedia(query).matches;
    }

    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
        return true;
    }

    // include the 'heartz' as a way to have a non matching MQ to help terminate the join
    // https://git.io/vznFH
    var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
    return mq(query);
}


init();
loader.addEventListener('click', enter);
document.body.addEventListener('mousemove', colorCycle);

var colorShift = 0;

function setScrollerHeight() {
  if(isFirefox)
    return false;
  
  scroller.style.height = (zoomers.length-1) * (window.innerHeight * 2) + 'px';
}

function init() {
  setScrollerHeight();
  
  for(var i=0; i<zoomers.length; i++) {
    zoomers[i].style.zIndex = zoomers.length - i;
  }

  initNav();
  initTour();
  //loop();
}

function colorCycle() {

  if(window.scrollY > 10)
    return false;

  colorShift += 1;

  // for(var i=0; i<colorShifters.length; i++) {
  //   //.style.filter = 'hue-rotate('+colorShift+'deg)';
  //   gsap.to(colorShifters[i], {duration: 0.15, 'filter': 'hue-rotate('+colorShift+'deg)', ease: "power2.Out"});
  // }
}

function enter() {
  var s = (window.innerHeight*2) * 1;
  gsap.to(window, {duration: 0, scrollTo: {y:s, autoKill:true}, ease: "power2.inOut"});
  //window.scrollTo(0, 0);
  animate();

  setTimeout(function() {
    window.addEventListener('click', onInteract);
    document.body.addEventListener('mousewheel', onInteract);
  }, 50);
}

function onInteract() {
  interact = true;
  clearTimeout(interactTimer);
  // interactTimer = setTimeout( function() {
  //   interact = false;
  // }, 30000);
}

function loop() {
  colorShift *= Math.min(0, colorShift * 0.01).toFixed(2);

  

  //window.requestAnimationFrame(loop);
}

function animate() {

  if(!loaded)
    document.body.classList.add('loaded')

  if(isFirefox) {
    document.body.classList.add('firefox')
    return false
  }

  loaded = true;
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
    zoomers[i].style.transform = 'translateZ(0px) scale(' + zoomer.toFixed(4) + ')';

  }

  if(!interact && !is_touch_device)
    scrollBy(0,2);

  if(scrollDiff > zoomers.length - 1.01)
    window.scrollTo(0, 0)

}

function initNav() {
  gsap.registerPlugin(ScrollToPlugin);
  for(var i=0;i<navLinks.length;i++) {
    navLinks[i].addEventListener('click', navClick);
  }
}

function navClick(e) {
  e.preventDefault;
  var el = document.getElementById(this.dataset.section);
  var index = [...el.parentElement.children].indexOf(el);
  if(index) {
    if(isFirefox) {
      var s = (window.innerHeight*1) * index;
    } else {
      var s = (window.innerHeight*2) * index;
    }
    
    var autokill = true;
    if(is_touch_device) {
      autokill = false;
    }

    gsap.to(window, {duration: 2, scrollTo: {y:s, autoKill:autokill}, ease: "power2.inOut"});
  }
  return false;
}


function onYouTubeIframeAPIReady() {
  initYoutube();
}

function initYoutube() {

    // 3. This function creates an <iframe> (and YouTube player)
    //    after the API code downloads.
    var player;
    player = new YT.Player('player', {
      height: '420',
      width: '560',
      videoId: 'yPKi6q9D_PM',
      playsinline: '1',
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });

    var videos = [
      'yPKi6q9D_PM',
      '5Dellfx4ImY',
      '1icYJ9FdEVs',
      'WlW_RAvD3oc',
      'F00Q-AaXYFo',
      'I_uLtGPE5PQ',
      '9Cl4SD2SFG0',
      '8NDfWLJRO6Y',
      '5U5DOjBevu0',
      'm4ybxrMYCEE',
      'yyPdqU868gs'
    ]

    https://api.songkick.com/api/3.0/artists/{artist_id}/calendar.json?apikey={your_api_key}

    // 4. The API will call this function when the video player is ready.
    function onPlayerReady(event) {
      player.cuePlaylist(videos)
      player.setLoop(true)
    }

    // 5. The API calls this function when the player's state changes.
    //    The function indicates that when playing a video (state=1),
    //    the player should play for six seconds and then stop.
    var done = false;
    function onPlayerStateChange(event) {

      console.log(event.data, YT.PlayerState)
      if(event.data === YT.PlayerState.BUFFERING) {
        videoCover.style.display = 'none'
      }
      
    }
    function stopVideo() {
      player.stopVideo();
    }

    var next = document.getElementById('next');
    var prev = document.getElementById('prev');

    next.addEventListener('click', function() {
      player.nextVideo()
    })

    prev.addEventListener('click', function() {
      player.previousVideo()
    })
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

    var html =  dateString;
    html +=     '<br/>'
    html +=     events[i].venue.displayName
    html +=     ', '
    html +=     events[i].location.city
    html +=     '<br/><a href="'+events[i].uri+'" target="_blank">Get tickets</a>'

    var tourItem = document.createElement('p')
    tourItem.innerHTML = html
    tourDates.append(tourItem)

  }
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

var eyes = document.querySelectorAll('.eye');
var eyeX = 0;
var eyeY = 0;
setEyeSizes();
window.addEventListener('resize', onWindowResize);

function onWindowResize() {
  setScrollerHeight();
  setEyeSizes();
}

function setEyeSizes() {
  for(var n=0; n<eyes.length; n++) {
    var eye = eyes[n];
    var pos = eye.getBoundingClientRect();
    eyeX = pos.left;
    eyeY = pos.top;
    eyeW = pos.width;
    eyeH = pos.height;
  }
}

function jseyesmove(e, t) {
  var r, i, s;
  

  for(var n=0; n<eyes.length; n++) {
    var eye = eyes[n];
    
    i = Math.max(-450, Math.min(300, e - eyeX + eyeW/2))/100;
    s = Math.max(-400, Math.min(400, t - eyeY))/100;
  
    eye.setAttribute('transform', "translate(" + (i) + " " + (s) +")");
  }
  
}

document.body.addEventListener('mousemove', onMouseMove);

function onMouseMove(e) {
  jseyesmove(e.clientX, e.clientY);
}

// $(document).ready(function () {
//   $(document).mousemove(function (e) {
//     jseyesmove(e.pageX, e.pageY, "auge");
//     jseyesmove(e.pageX, e.pageY, "auge2")
//   });
// });

