function ResponsiveChart(id, chartData)  {
   var self = this;
   this.id = id;
   this.curves= chartData.curves;
   this.absMaxY = chartData.yMax;
   this.absMaxX = chartData.xMax;
   this.element=document.getElementById(id);
   this.slider;
   this.svgg;
   this.mainFrame;
   this.yAxis;
   this.body;
   this.currentMaxY;
   this.currentZoomX = 1;
   this.currentZoomY = 1;
   this.inversedZoomX = 1;
   this.currentLeftShift = 0;
   this.xLabels;
   this.pathesMainFrame = [];
   this.pathesSlider=[];
   this.timerYAxisUpdate;
   this.xAreaSVG;
   this.xLabelWidth;
   this.chartWidth;
   this.chartHeight;
   this.xAreaSVGBoxSize;
   this.xAreaMaxTextElements;
   this.minX;
   this.maxX;
   this.svgHeight;
   this.svgWidth = 0;
   this.percantageX;
   this.verticalLinePointerEl;
   this.toolTip;
   
   this.toggleCurveisVisible = (curveKey, el) => {
     toogleBtnPressedState(el);
     this.curves[curveKey].isVisible =!this.curves[curveKey].isVisible;
     var display = this.curves[curveKey].isVisible ? "block" : "none";
     self.pathesMainFrame[curveKey].style.display = display;
     self.pathesSlider[curveKey].style.display = display;
     var currentAbsMaxY = Math.max.apply(Math, Object.entries(self.curves).map(c=>c[1]).filter(c=>c.isVisible).map(c=>c.yMax));     
   
     if(self.absMaxY){
       zoomCurve(self.slider.X, self.slider.Z) 
       var yScale = -0.8 * (self.absMaxY / currentAbsMaxY); // some free space for slider
       var yTranslate = (self.slider.height * h + self.slider.height) / 2;
       self.slider.sliderAreaSVG.setAttribute("transform",  "translate(0, "+ yTranslate + ") scale(1," + yScale + ")");        
     }     
   }  
   
   this.toggleNightMode = (el) => {
     toogleBtnPressedState(el);
     
     for (var chart of document.getElementsByClassName('chart-container')){ // some fast fix  
       chart.classList.toggle('night-mode');
     }
     
     body.classList.toggle('night-mode');
   }
   
   var reorginizeXLabels = function(){ 
     var currentCountTextElementsOnChart = self.maxX - self.minX + 1;
     var degree = Math.floor(Math.log2(currentCountTextElementsOnChart)) - 2;
     var survivorIndex = Math.pow(2, degree);
     var i = survivorIndex;
     
     for (var xlabel of self.xLabels){
         if (i >= survivorIndex){
            xlabel.label.classList.remove('svg-null-opacity');
             i = 0;
         }
         else{
            xlabel.label.classList.add('svg-null-opacity');  
         }
         i++;
     }
  }
   
   var moveXAxis = (x) => {    
     var shift = -self.xAreaSVGBoxSize.width * x;
     self.xAreaSVG.setAttribute("transform", "translate(" + ((shift*self.currentZoomX)+shift) + ", 0) scale(" + self.currentZoomX + ", 1)"); 
          
     for(var xlabel of self.xLabels){
        xlabel.label.setAttribute("transform", "scale("+ 1 / self.currentZoomX + ", 1)"); 
        xlabel.label.setAttribute("x",  self.currentZoomX*xlabel.originalX - shift); 
     }  
   } 
  
   var scaleXAxis = (x) => {     
     var shift = -self.xAreaSVGBoxSize.width * x;
     self.xAreaSVG.setAttribute("transform", "translate(" + ((shift * self.currentZoomX) + shift) + ", 0) scale("+self.currentZoomX + ", 1)"); 
     
     for(var xlabel of self.xLabels){
        xlabel.label.setAttribute("transform", "scale("+ 1 / self.currentZoomX + ", 1)");
        xlabel.label.setAttribute("x",  self.currentZoomX*xlabel.originalX - shift); 
     }
 
     reorginizeXLabels();
   }
   
   var getMaxYOfVisiblePoints = (x, z) => {
     var minX = Math.abs(Math.ceil(-self.svgWidth * x)); 
     var maxX = Math.abs(Math.floor(-(x + z) * self.svgWidth)) - 1;
     var maxInRange;   
     
     for (var key in self.curves){
       var max = Math.max.apply(null, self.curves[key].points
                                              .slice(minX, maxX)
                                              .map(p => p.y));
       if (self.curves[key].isVisible == true && (maxInRange == undefined || max>maxInRange)){
         maxInRange = max;          
       }
     }
      
     self.minX = minX;
     self.maxX = maxX;
     
     return maxInRange;
   }
   
   var fitToSizeYAxisAfterDelay = (newMax, delay) => {          
    clearInterval(self.timerYAxisUpdate);
    
    self.timerYAxisUpdate = setTimeout(function(){            
      self.yAxis.apply(self.currentMaxY);
    }, delay);
   }
   
   var getScaleString = (x, z) => {     
     self.currentMaxY = getMaxYOfVisiblePoints(x, z);
     self.currentZoomY = (self.absMaxY / self.currentMaxY);
     return (self.currentZoomX && self.currentZoomY) ? "scale("+self.currentZoomX + ",-" + self.currentZoomY + ")" : "";
   }
   
   // x: 0..1, z: 0..1
   var moveCurve = (x, z) => {
     if (!z){ z = 1; }
     self.percantageX = x;
     self.currentZoomX = !z ? 1 : 1/z; 
     self.currentLeftShift = -(self.svgWidth * x) / z; 
     
     self.mainFrame.setAttribute("transform", "translate(" + self.currentLeftShift + "," + self.absMaxY+") " + getScaleString(x, z));
     fitToSizeYAxisAfterDelay(self.currentMaxY, 30)      
     moveXAxis(x);     
     
     self.toolTip.updatePosition(self.currentZoomX, self.minX);
   }
   
   // x: 0..1, z: 0..1
   var zoomCurve = (x, z) => { 
     self.percantageX = x;
     self.currentZoomX = !z ? 1 : 1/z; 
     self.currentLeftShift = -(self.svgWidth * x) / z; 
     var scaleString = getScaleString(x, z);
     fitToSizeYAxisAfterDelay(self.currentMaxY, 30)
     
     self.mainFrame.setAttribute("transform", "translate("+self.currentLeftShift+","+self.absMaxY+") "+scaleString);     
     
     scaleXAxis(x);
     self.toolTip.updatePosition(self.currentZoomX, self.minX);
   } 
   
   var createChartByTemplate = (templateId) => { 
    this.body = document.getElementById(templateId).content.querySelector("div").cloneNode(true);
    this.body.style.height = mobileHeight + "px";
     
    this.slider = new Slider(self.body, moveCurve, zoomCurve);
     
    this.svgg = this.body.querySelector(".svg");
    this.mainFrame = this.body.querySelector(".mainFrame");
    
    return this.body;
   }     
   var toogleBtnPressedState = (btn)=>{
     var iconCls = btn.querySelector('.circle div').classList;
     iconCls.toggle('pressed');     
     iconCls.toggle('non-pressed');     
   } 
   
   this.findNearestPoint = (x, y, kx, ky) => {     
     var svgX = Math.round(x * kx / self.currentZoomX + self.minX);
     var svgY = Math.round(y * ky / self.currentZoomY);
     
     return Object.keys(self.curves).map(c=>self.curves[c].points[svgX]); 
   }
      
   (function() {         
     var chart = createChartByTemplate("chart-template");
        
     // рендеринг готового чата в див в разметке
     self.element.appendChild(chart);
     
     this.verticalLinePointerEl=self.body.querySelector('.vertical-pointer');
     
     let switchersContainer = chart.querySelector(".switchers-container")
     let switcherNightMode = chart.querySelector(".switcher");
     
     // получение свойств после рендеринга
     self.slider.sliderAreaWidth = self.body.querySelector(".slideArea").offsetWidth;
     self.slider.width = self.body.querySelector(".slider").offsetWidth;      
                    
     // ================= Axis Y Createions    
     self.yAxis = new DynamicYAxis(7, "dynamic-y-axis-template", 20, null, '14px');
     var axisContainer = self.yAxis.generateContainer();
     self.body.querySelector(".output").appendChild(axisContainer);
     self.yAxis.evenlyDistibuteDivisions();     
     // ================= Axis Y Createions
     
     for (var key in self.curves){
       let curve = self.curves[key];
      
       self.pathesMainFrame[key] = createPath(curve.points, curve.color, curve.name);
       self.pathesSlider[key] = createPath(curve.points, curve.color, curve.name);
      
       self.mainFrame.appendChild(self.pathesMainFrame[key]);    
       self.slider.slideFrame.appendChild(self.pathesSlider[key]);  

       let switcher = switcherNightMode.cloneNode(true); 
       switcher.querySelector('.switcher-label').innerHTML = key;
       switcher.querySelector('.circle').style.background = self.curves[key].color;
       switchersContainer.appendChild(switcher);
       let cKey = key;
       switcher.onclick = function(){self.toggleCurveisVisible(cKey, switcher)};
       toogleBtnPressedState(switcher);
      }  
     
     switcherNightMode.onclick = function(){self.toggleNightMode(switcherNightMode)};
     
     //scaling viewBox for mainArea   
     self.slider.absMaxX = self.absMaxX;
     self.slider.height = self.body.querySelector(".slideArea").offsetHeight;      
     
     self.body.querySelector(".output svg").setAttribute("viewBox", "0 0 " + self.absMaxX + " " + self.absMaxY);
     self.element.querySelector(".mainFrame").setAttribute("transform", "scale(1,-1)");
  
     //scaling viewBox for slideArea 
     self.body.querySelector(".slideArea svg").setAttribute("viewBox", "0 0 " + self.absMaxX + " " + self.absMaxY);
     self.body.querySelector(".slideArea svg").setAttribute("transform", "scale(1,-1)");
     
     self.body.querySelector(".vertical-pointer").setAttribute('y2', self.absMaxY);     
     
     //xArea
     self.xAreaSVG = chart.querySelector(".x-axis-area .xAxisFrame"); 
     self.xAreaSVGBoxSize = chart.querySelector(".x-axis-area svg").viewBox.baseVal;
            
     var chartRect = self.body.querySelector(".output").getBoundingClientRect();
     
     self.chartWidth = chartRect.width;
     self.chartHeight = chartRect.height;     
     
     self.xLabels = createXLabels(self.curves[Object.keys(self.curves)[0]].points, self.xAreaSVGBoxSize.width, self.xAreaSVGBoxSize.height);
     for(var label of self.xLabels.map(l => l.label)){
          self.xAreaSVG.appendChild(label); 
     }       
     
     self.xLabelWidth = self.xLabels[0].label.getBBox().width;     
     self.xAreaMaxTextElements = Math.floor(self.chartWidth/(self.xLabelWidth * 2)) - 1; 
          
     self.svgWidth = self.svgg.getBBox().width;
     self.svgHeight = self.svgg.getBBox().height;

     self.toolTip = new ToolTip(self.body, self.curves, self.chartWidth / self.svgWidth)
     
     var proportionX = self.svgWidth / self.chartWidth;
     var proportionY = self.svgHeight / self.chartHeight;
     
     if (usedMobile){
       self.body.querySelector(".output").addEventListener('touchstart', (e)=>{
            var x = e.touches[0].clientX;
            var y = e.touches[0].clientY;
            
            var clickedPoints = self.findNearestPoint((x - chartRect.left), (chartRect.height - (y - chartRect.top)), proportionX, proportionY);
            self.toolTip.toggle(clickedPoints, self.currentZoomX, self.minX);
           });
     }
     else{
          self.body.querySelector(".output").addEventListener('mousedown', (e)=>{
            var clickedPoints = self.findNearestPoint((e.clientX - chartRect.left), (chartRect.height - (e.clientY - chartRect.top)), proportionX, proportionY);
            self.toolTip.toggle(clickedPoints, self.currentZoomX, self.minX);
           });       
     }
     
           //=======document Events========//
          

           self.slider.setXandZoom(0, 0);
if (usedMobile){
          document.addEventListener('touchend', ()=>{
             self.slider.stopChanging();
           }); 
  
}
     else{
           document.addEventListener('mouseup', ()=>{
             self.slider.stopChanging();
           });  
       
     }
            
     if (usedMobile){
       
           document.addEventListener('touchmove', (e)=> {
             var x = e.touches[0].clientX;
             if (self.slider.readyToDrug){               
               self.slider.changePosition(x);
             }
             if (self.slider.readyToResize){
               self.slider.changeWidth(x);
             }    
           });
     }
     else{
     document.addEventListener('mousemove', (e)=> {
       
             if (self.slider.readyToDrug){               
               self.slider.changePosition(e.clientX);
             }
             if (self.slider.readyToResize){
               self.slider.changeWidth(e.clientX);
             }    
           });
     }


          //=======//document Events========//   
          })();
 } 