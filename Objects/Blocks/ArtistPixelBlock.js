//a non physical object. This exists just to build the maze (color matter, not this object).
//x and y are the top left position of the block
//blocks are square, so width is the width and hight
//blocks can be colored.
function ArtistPixelBlock(x,y, width, paper){

        //needs to be above where i call it in init (for some reason)
        this.setSprites = function(){
	    this.pixel_sprite = paper.rect(this.x, this.y, this.width, this.width);
	    this.pixel_sprite.attr("stroke", "1.0");	
	}
	
	this.setColor = function(){
	   this.color = "rgb(" + this.red + "," + this.green + "," + this.blue+")";
	   this.pixel_sprite.attr({"fill": this.color, "fill-opacity": (this.opacity)/100});
	};
	
	
	this.x = x;
	this.y = y;
	this.paper = paper;
	this.width = width;
	this.earth_sprite = null;
	this.plant_sprite = null; //experimenting with layering
	this.red = 150;
	this.green = 150;
	this.blue = 150;
	this.opacity = 0;  //opacity is pheremone level
	this.setSprites();
	this.setColor();
	this.is_barrier = false;
	this.evos = new Array();
	this.pheremone_concentration = 0;  //the amount of pheremones this block has. (degrades and spreads over time)
	
		
	
	this.isBarrier = function(){
	   return this.is_barrier;
	};
	
	this.makeBarrier = function(){
	   this.is_barrier = true;
	};
	
	this.makeSpace = function(world, y, x, y_dir, x_dir, goal_end){
	   this.is_barrier = false;	  
	};


        this.addRed = function(){
          this.red = Math.max(this.red - 20, 0);
          this.setColor();
        }
        
        this.addBlue = function(){
          this.blue = Math.max(this.blue - 20, 0);
          this.setColor();
        }
        
        this.addGreen = function(){
          this.green = Math.max(this.green - 20, 0);
          this.setColor();
        }
 	

 	
 	
 	this.get_left = function(world,i,j){
 	  ret = null;
 	  //not sure why this is necessary but it is
         //sometimes my CURRENT position is an invalid on in the matrix (one longer than it should be on the y axis)
         //when i have so many checks against it.
 	  if(world[i] != null){
  	    ret = world[i][j-1]
 	    return ret;
 	  }
 	}
 	
 	this.get_right = function(world,i,j){
 	  ret = null;
 	  if(world[i] != null){
 	    ret = world[i][j-0+1]
 	    return ret;
 	  } 
 	}
 	
 	this.get_up = function(world,i,j){
 	  up = null
 	  if(world[i-1]){
	    up = world[i-1][j];
	  }
	  return up;
 	}
 	
 	this.get_down = function(world,i,j){
 	   down = null;
 	   if(world[i - 0 + 1]){
	    down = world[i- 0 +1][j];
	  }
	  return down;
 	}

	
	this.tick =function(world,i,j){            
            if(this.pheremone_concentration > 0 && Math.random()*100 > 50){
               this.spreadPheremones(world, i, j);
            }
	}
	
	this.addPheremones = function(amount){
	  this.pheremone_concentration = Math.min(500, this.pheremone_concentration + amount);
	};
	
	
	
	//reduce pheremones in self, add fractions of them to adjacents.
	this.spreadPheremones = function(world, i, j){
	  var amount = Math.floor(this.pheremone_concentration/4);  //keep negative or positive
	  var left = this.get_left(world,i,j);
	  var right = this.get_right(world,i,j);
	  var up = this.get_up(world,i,j); 
	  var down = this.get_down(world,i,j);
	  if(left != null){
	      left.addPheremones(Math.floor(amount/4));
	  }
	  if(down != null){
	      down.addPheremones(Math.floor(amount/4));
	  }
	  if(right != null){
	      right.addPheremones(Math.floor(amount/4));
	  }
	  if(up != null){
	      up.addPheremones(Math.floor(amount/4));
	  }	  
	  //can't get negative pheremones (repulsive, not attractive) just from dissipation
	  if(this.pheremone_concentration > 0){
	      this.pheremone_concentration = Math.max(0, (this.pheremone_concentration - amount));
	  }else{  //likewise can't get positive pheremones if negative
	      this.pheremone_concentration = Math.min(0, (this.pheremone_concentration - amount));  
	  }
	  //only blocks with pheremones in them have color
	  this.opacity = Math.max(Math.min(100,this.pheremone_concentration*10),1); //opacity between 20 and 100
	  this.setColor();
	  
	}


	
	
	//returns true if x/y coordinates are inside this block
	this.isInside = function(x,y){
	//  //console.log("Is: " + x + "," + y + " inside me?");
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

	
	this.addEvo = function(evo){
	  this.evos.push(evo);
	};
	
	this.removeEvo = function(evo){
	  this.removeByElement(this.evos, evo);
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
