//a non physical object. This exists just to build the maze (color matter, not this object).
//x and y are the top left position of the block
//blocks are square, so width is the width and hight
//blocks can be colored.
function Block(x,y, width, red,green,blue){
	this.x = x;
	this.y = y;
	this.width = width;
	this.red = red;
	this.green = green;
	this.blue = blue;
	this.humans = new Array();
	this.zombies = new Array();
	if(red){
		this.red = red;
	}else{
		this.red = Math.random() * 255;
	}
	
	if(blue){
		this.blue = blue;
	}else{
		this.blue = Math.random() * 255;
	}
	
	if(green){
		this.green = green;
	}else{
		this.green = Math.random() * 255;
	}
	this.shading = ")-#fff";
	this.color = "45-rgb(" + this.red + "," + this.green + "," + this.blue+this.shading;
	
	this.isBarrier = function(){
	   //smaller color numbers are darker. if it's below a threshold, it's light, and thus not a barrier
	   if(this.red + this.blue + this.green > 400){
	     return false
	   }else{
	     return true;
	   }
	};
	
	//returns true if x/y coordinates are inside this block
	this.isInside = function(x,y){
	//  console.log("Is: " + x + "," + y + " inside me?");
	  littlex = this.x
	  bigx = this.x + this.width;
	  littley = this.y
	  bigy = this.y + this.width;
	  
	  if(x < bigx && x > littlex && y < bigy && y > littley){
	    return true
	  }else{
	    return false
	  }
	};
	
	this.addZombie = function(zombie){
	  this.zombies.push(zombie.copy);
	};
	
	this.addHuman = function(human){
	  this.humans.push(human.copy);
	};
	
	this.removeZombie = function(zombie){
	  this.removeByElement(zombies, zombie.copy);
	};
	
	this.removeHuman = function(human){
	  this.removeByElement(humans, human.copy);
	};
	
	this.removeByElement = function(arrayName,arrayElement){
          for(i in arrayName ){ 
            if(arrayName[i]==arrayElement){
              ////console.log("found it");
              arrayName.splice(i,1); 
            } //end if
          }//end for
        }//end remove element   
        
        
}//end function block
