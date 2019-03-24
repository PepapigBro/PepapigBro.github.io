 //=====Utils======//
 var xmlns = 'http://www.w3.org/2000/svg';
  
 function createPath(points, color, name){   
  var path = document.createElementNS(xmlns, 'path'); 
  var pathValues="";
  
  for (var i = 1; i < points.length; i++) { 
    pathValues += "M " + points[i-1].x + "," + points[i-1].y +" " + "L "+points[i].x + ","+points[i].y + " ";   
  } 
  path.setAttribute("vector-effect", "non-scaling-stroke");
  path.setAttribute("d", pathValues);
  path.style.stroke = color;  
  return path;  
}

 function createXLabels(points, widthChart, heightXAxis){   
  var labels=[];
   
  for (var i = 0; i < points.length; i++) {  
    let label = document.createElementNS(xmlns, 'text'); 
    var xCoord =  points[i].x * (widthChart/points.length); 
    label.setAttribute('x', xCoord);
    label.setAttribute('y', heightXAxis * 0.8); // wants some free space
    label.setAttribute('fill', 'grey');
    label.setAttribute("vector-effect", "non-scaling-stroke");

    var textNode = document.createTextNode(points[i].label);
    label.appendChild(textNode);
    labels.push({label: label, originalX: xCoord});      
  }
  return labels;  
}

 const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
 const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
 function readLocalJSON(file) {
   return new Promise(function(resolve, reject) {
      const request = new XMLHttpRequest();
      request.open('GET', file, true);
      
       request.onload=()=>{
        if (request.status == 200){          
          resolve(request.responseText); 
        } 
      }
      request.send(null);
   });  
}
   
 function loadData() {
    return new Promise(function(resolve, reject) { readLocalJSON("chart_data.json").then(result=>resolve(result)); 
  });
}
   
 function getCssProperty(elem, property){   
   return window.getComputedStyle(elem, null).getPropertyValue(property);
 } 
   
 String.prototype.cutPx = function(){return this.substr(0, this.length-2);}
 
 function detectmobile() { 
  if( navigator.userAgent.match(/Android/i)
  || navigator.userAgent.match(/webOS/i)
  || navigator.userAgent.match(/iPhone/i)
  || navigator.userAgent.match(/iPad/i)
  || navigator.userAgent.match(/iPod/i)
  || navigator.userAgent.match(/BlackBerry/i)
  || navigator.userAgent.match(/Windows Phone/i)
  ){
     return true;
   }
  else {
     return false;
   }
}  
   
 var Point = function(x, y, label, fullDate){
  this.x = x;
  this.y = y;
  this.label = label;
  this.fullDate = fullDate;
 }
 
 var usedMobile = detectmobile();
 
 var body = document.body,
     html = document.documentElement;

 var mobileHeight = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );