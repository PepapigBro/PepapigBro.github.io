function Slider(body, onmoveSlider, onresizeSlider){  
  var self = this;
  this.body = body;
  this.element = body.querySelector(".slider");
  this.leftBlock = body.querySelector(".left-side");
  this.rightBlock = body.querySelector(".right-side");
  this.sliderArea = this.body.querySelector(".slideArea");
  this.sliderAreaSVG = this.body.querySelector(".slideArea svg");
  this.slideFrame = body.querySelector(".slideFrame");
  this.sliderMoved = onmoveSlider;
  this.sliderResized = onresizeSlider;
  this.initialLeftSideWidth;
  this.initialRightSideWidth;
  this.initialCenterSliderWidth;
  this.initialX;
  this.readyToDrug = false;
  this.readyToResize = false;
  this.leftSideChanging = false;
  this.rightSideChanging = false;
  this.activeAreaWidthPercantage;
  this.activeAreaLeftPercantage;   
  this.sliderAreaWidth = 0;
  this.width;
  this.height;
  this.minWidth = 160;
  this.X; 
  this.Z;   
  this.absMaxX; 
   
  this.setXandZoom = (x, z) => {
    self.initialLeftSideWidth = self.sliderAreaWidth - self.minWidth;
    self.initialRightSideWidth = 0;
    self.initialX = 0;
    self.changePosition(0);
    self.changeWidth(0);
  }
  
  this.stopChanging = () => {
    this.readyToDrug = false;  
    this.readyToResize = false;
    this.leftSideChanging = false;  
    this.rightSideChanging = false; 
  }
  
  var onMouseDownActions = function(e){
    
  }
  
   if (usedMobile){
   
     this.element.addEventListener('touchstart', (e)=>{
       var x = e.touches[0].clientX;
       
    self.initialLeftSideWidth = self.leftBlock.offsetWidth;
    self.initialRightSideWidth = self.rightBlock.offsetWidth;   
    self.initialCenterSliderWidth = self.element.offsetWidth;
    self.initialX=x;
    self.leftSideChanging=(x- self.element.getBoundingClientRect().left)<30;

    self.rightSideChanging=(self.element.getBoundingClientRect().right-x)<30;
    
    if (!self.leftSideChanging && !self.rightSideChanging){
      self.readyToDrug = true;
    }
    else{
      this.readyToResize=true;
    }
  });
   }
   else{
     
      this.element.addEventListener('mousedown', (e)=>{
    self.initialLeftSideWidth = self.leftBlock.offsetWidth;
    self.initialRightSideWidth = self.rightBlock.offsetWidth;   
    self.initialCenterSliderWidth = self.element.offsetWidth;
    self.initialX=e.clientX;
    self.leftSideChanging=(e.clientX- self.element.getBoundingClientRect().left)<10;

    self.rightSideChanging=(self.element.getBoundingClientRect().right-e.clientX)<10;
    
    if (!self.leftSideChanging && !self.rightSideChanging){
      self.readyToDrug = true;
    }
    else{
      this.readyToResize=true;
    }
  }); 
   }


  this.changePosition=(x)=>{  
    
    delta = x-this.initialX;  
       
    
    var updatedLeftBlockWidth = self.initialLeftSideWidth + delta;
    var updatedRightBlockWidth = self.initialRightSideWidth - delta;
    
    if (updatedLeftBlockWidth<0)
     {       
       updatedLeftBlockWidth=0;
       updatedRightBlockWidth = this.sliderAreaWidth - this.initialCenterSliderWidth; 
     }
    if (updatedRightBlockWidth<0) {
      updatedRightBlockWidth=0;
       updatedLeftBlockWidth = this.sliderAreaWidth -this.initialCenterSliderWidth; 
    }

      self.leftBlock.style.width=updatedLeftBlockWidth+"px";
      self.rightBlock.style.width=updatedRightBlockWidth+"px"; 
      self.X=updatedLeftBlockWidth/self.sliderAreaWidth;
      self.sliderMoved(self.X, self.Z);      
  }
   
  this.changeWidth=(x)=>{   
    let delta = x-this.initialX;
    var updatedLeftBlockWidth = this.initialLeftSideWidth + delta;
    var updatedRightBlockWidth = this.initialRightSideWidth - delta;
    var centerWidth = this.sliderAreaWidth -(updatedLeftBlockWidth + updatedRightBlockWidth); 
    
      if (this.leftSideChanging){
        if (updatedLeftBlockWidth<0)
        {       
          updatedLeftBlockWidth=0;        
        }
        if ((this.sliderAreaWidth -(updatedLeftBlockWidth + this.initialRightSideWidth))<this.minWidth)
          {
              updatedLeftBlockWidth = this.sliderAreaWidth-this.initialRightSideWidth-this.minWidth;
          }
            self.leftBlock.style.width=updatedLeftBlockWidth+"px";
            self.Z=1-((updatedLeftBlockWidth+this.initialRightSideWidth)/self.sliderAreaWidth)
            self.X=updatedLeftBlockWidth/self.sliderAreaWidth;
      }
      else{
        if (updatedRightBlockWidth<0)
        {       
          updatedRightBlockWidth=0; 
        }
        if ((this.sliderAreaWidth -(updatedRightBlockWidth + this.initialLeftSideWidth))<this.minWidth)
          {
            updatedRightBlockWidth = this.sliderAreaWidth-this.initialLeftSideWidth-this.minWidth;
          }   
        
        self.rightBlock.style.width=updatedRightBlockWidth+"px"; 
        self.Z=1-((updatedRightBlockWidth+this.initialLeftSideWidth)/self.sliderAreaWidth);
       
      
      }
    
    self.sliderResized(self.X, self.Z); 
  }
  
  this.element.addEventListener('selectstart', (e)=>{ e.preventDefault(); return false; }, false);  
} 