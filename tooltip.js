function ToolTip(container, curves, kx){
    var self = this;
    this.curves = Object.keys(curves).map(c=>curves[c]);
    this.kx = kx;
    this.verticalLine = container.querySelector('.vertical-pointer');
    this.square = container.querySelector('.tooltip');
    this.tooltipBody = container.querySelector('.tooltip-body');
    this.currentX;
    this.toolTipBodyes;
    
    (function init(){
       
      for (var i=0; i<self.curves.length-1; i++){ // one is already exist
          var cellClone = self.tooltipBody.querySelector('td').cloneNode(true);
          self.tooltipBody.appendChild(cellClone);
         
      }
      
      self.toolTipBodyes = self.square.getElementsByClassName('tooltip-cell');
      
    }())
    
    var fillData = function(){
      if (self.currentX!=undefined){
        console.log(self.curves)
      for(var i=0; i<self.curves.length; i++){
        var currentCurve = self.curves[i];
       
        var tooltipValueEl = self.toolTipBodyes[i].querySelector('.tooltip-value');
        var tooltipnameEl = self.toolTipBodyes[i].querySelector('.tooltip-name');
        
        
        tooltipValueEl.innerHTML = currentCurve.points[self.currentX].y;  
 
        tooltipnameEl.innerHTML = currentCurve.name;
        tooltipValueEl.style.color=currentCurve.color;
        tooltipnameEl.style.color=currentCurve.color;
      }

      self.square.querySelector('.tooltip-header span').innerHTML = self.curves[0].points[self.currentX].fullDate;
      self.square.querySelector('.tooltip-header td').setAttribute('colspan', self.curves.length);
      self.square.querySelector('table').style.width = self.curves.length * 30 +"px"; 
    }
    }
    
    this.toggle = (points, z, minx) => {
      var x = points[0].x;      
      if (self.currentX != x){
        
       self.square.classList.remove('invisible');
        
       self.currentX = x;
       self.updatePosition(z, minx);
        
       self.verticalLine.setAttribute('x1', x);
       self.verticalLine.setAttribute('x2', x);
        self.verticalLine.classList.remove('invisible');
        
        fillData();
      }
      else{
        self.verticalLine.classList.add('invisible');
        self.square.classList.add('invisible');
        self.currentX = null;
      }
      
    }  
    
    this.updatePosition =(z, minx)=>{
      var convertedX = (self.currentX - minx) * kx * z;
      if (convertedX + self.square.offsetWidth>container.offsetWidth){
        convertedX = convertedX - self.square.offsetWidth;
      }
      self.square.style.left = convertedX + "px";
    }
  }