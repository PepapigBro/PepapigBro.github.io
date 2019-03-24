function DynamicYAxis(divisionsCount, templateId, delay, initialMax, fontize){
    this.delay = delay;
    this.previousMax = initialMax;
    this.axisContainer;
    this.fontSize = fontize;
    this.divisionsCount = divisionsCount - 1;
    this.multiplier;
    var self=this;
    
    
    this.apply = (newMax)=>{ 
        newMax = this.multiplier * newMax;
      
        if (this.previousMax == newMax) { return false; }
        
        var dividerContainers = this.axisContainer.getElementsByClassName('divider');        
        var inverse = newMax<this.previousMax;        
        this.previousMax = newMax;  
      
        var count = dividerContainers.length-1; 
        var i=0; j=1;
        if (inverse){
            i= count+1;
            j=-1;
        }                
               
        var nearestWholeMax = Math.ceil(newMax/count)*count;
        var incr = nearestWholeMax/count;
        
        let indexSequence = count;
        for (var divContainer of dividerContainers){
            i+=j;
            let container = divContainer;
            let increment = incr;
            let indexDelay = i;
            let indexSeq = indexSequence;
            setTimeout(function(){
                var currDigitEl = container.querySelector('.digit');
                var toReplaceDigitEl = container.querySelector('.digit-current');               
                var currDigitTextEl = currDigitEl.querySelector('.real-text');
              
                if (inverse){                   
                  container.classList.add('inverse-direction');  
                }
                else{                  
                  container.classList.remove('inverse-direction'); 
                }

                toReplaceDigitEl.querySelector('.real-text').innerHTML = currDigitTextEl.innerHTML;
                currDigitTextEl.innerHTML = increment * indexSeq;
                
                currDigitEl.classList.remove('animated')
                void currDigitEl.offsetWidth;
                currDigitEl.classList.add('animated')
                
                toReplaceDigitEl.classList.remove('animated')
                void toReplaceDigitEl.offsetWidth;
                toReplaceDigitEl.classList.add('animated')    
                
                }, indexDelay*this.delay) 
            indexSequence--;
        }            
    }
    
    this.evenlyDistibuteDivisions = ()=>{
        var container = self.axisContainer;
        var containerHeigth = container.offsetHeight; 
      var dividerHeight = container.querySelector(".divider").offsetHeight; 
      var maxDividersCount =  Math.floor(containerHeigth/dividerHeight); 
      var maxAvailableHeight = maxDividersCount*dividerHeight;
        var totalDivisionsHeight = dividerHeight * (self.divisionsCount); 
      var maxTotalDivisionsHeight = maxDividersCount*dividerHeight; 
      this.multiplier = maxTotalDivisionsHeight / containerHeigth;
      if (totalDivisionsHeight>maxTotalDivisionsHeight){
            totalDivisionsHeight = maxTotalDivisionsHeight; 
        }
        var marginBetweenDivisions = (maxAvailableHeight - totalDivisionsHeight - dividerHeight) / (self.divisionsCount); 
      
        var dividers = self.axisContainer.getElementsByClassName('divider');
        for (var i=0; i < dividers.length-1; i++){ 
            dividers[i].style.marginBottom = marginBetweenDivisions + "px";
        }        
    }
    
    this.generateContainer = ()=>{ 
     
      self.axisContainer = document.getElementById(templateId).content.querySelector(".container").cloneNode(true);
      
      self.axisContainer.style.fontSize = self.fontSize;

      for(var i=0; i<self.divisionsCount; i++){
        var divisionClone = document.getElementById(templateId).content.querySelector(".divider").cloneNode(true);        
        self.axisContainer.appendChild(divisionClone);
      }
      return self.axisContainer;
    };      
  }