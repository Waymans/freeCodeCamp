document.addEventListener('DOMContentLoaded',function(){      
  var request = new XMLHttpRequest();
  request.open('GET', 'data/content.json', true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var data = JSON.parse(request.responseText);
      document.getElementById('navbar').innerHTML = myNav(data);
      document.getElementById('content').innerHTML = myPage(data);
    } else {
      // We reached our target server, but it returned an error 
    }
  };
  request.onerror = function() {
    // There was a connection error of some sort
  };
  request.send();
})

document.getElementById('open').addEventListener('click', openNav);
/* closeNav isnt working without inline JS(from myNav), will fix after learning more */
document.getElementById('close').addEventListener('click', closeNav);

function openNav() {
  document.getElementById("navbar").style.width = "200px";
  document.getElementById("main").style.marginLeft = "200px";
}
function closeNav() {
  document.getElementById("navbar").style.width = "0";
  document.getElementById("main").style.marginLeft= "0";
}

function myNav(data) {
  var html = '<a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>'+
      '<a href="#">Home</a>';
  data.forEach((label,index) => {
    html += '<a href="#Section_'+index+'">'+label.title+'</a>'
  });
  return html.trim();
}

function myPage(data) {
  var html = '';
  data.forEach((info,index) => {
    html += '<section class="main-section" id="Section_'+index+'">'+
        '<header>'+info.title+'</header><hr>'+
        '<h1>'+info.desc+'</h1>'+
        '<p>'+info.text+'</p>'+
        '<div class="code"><code>'+info.code+'</code></div>'+
      '</section>'
  });
  return html.trim();
}