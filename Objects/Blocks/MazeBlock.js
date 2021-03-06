//a non physical object. This exists just to build the maze (color matter, not this object).
//x and y are the top left position of the block
//blocks are square, so width is the width and hight
//blocks can be colored.
function Block(x,y, width, red,green,blue, sprite){
	this.x = x;
	this.y = y;
	this.width = width;
	this.red = red;
	this.dead_end_chance = 2;
	this.branch_chance = 10;
	this.green = green;
	this.blue = blue;
	this.sprite = sprite;
	this.is_start = false;
	this.is_end = false;
	this.done = false;
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
	
	this.makeBarrier = function(){
	   this.red = 1;
	   this.blue = 1;
	   this.green = 1;
	   this.setColor();
	};
	
	this.makeSpace = function(world, y, x, y_dir, x_dir, goal_end){
	  // //console.log(goal_end.done);
	  // //console.log("Goal is: " + goal_end.x + ", " + goal_end.y);
	   ////console.log("making space " + x + "," + y);
	   this.shading = ")-#eee";
	   if(this.is_start ){
	     this.shading = ")-#00f"; 
	   }
	   if(this.is_end ){
	     this.shading = ")-#0f0"; 
	   }
	   
           this.red = 254;
	   this.blue = 254;
	   this.green = 254;
	   this.setColor();
	   //don't spread if done, if i'm adj to the end, or if I am the end
	   if(!this.is_end && !goal_end.done && !this.found_end(x,y)){
	   //can spread zero (unlikely) to 2 times.
	    if(Math.random() * 100 < (100 - this.dead_end_chance)){
	      this.spread(world, y, x, y_dir, x_dir, goal_end);
	    }else{
	    //  //console.log("Making dead end");
	    }//end first try
	    if(Math.random() * 100 < this.branch_chance){
	      ////console.log("branching");
	      this.spread(world, y, x, x_dir, y_dir, goal_end);
	    }//end second try
	   }
	};
	
	
	//choose one block adj to you, make it a space
	//small chance of spreading randomly, but mostly continues in current direction
	this.spread = function(world, y, x, y_dir, x_dir, end){
	////console.log("spreading: " + x_dir + ", " + y_dir);
	  if((y_dir == null || x_dir == null) || Math.random() * 100 < 20){
	    this.spread_random(world, y, x, end);
	  }else{
	  new_y = y + y_dir;
	  new_x = x + x_dir;
	  if(world[new_y]){
	   // //console.log("found y");
	    if(world[new_y][new_x]){
	      ////console.log("found x");
	      world[new_y][new_x].makeSpace(world, new_y, new_x, y_dir, x_dir, end);
	   }else{
	     this.spread_again(world,y,x, end);
	   }//end no x
	  }else{
	    this.spread_again(world,y,x, end);
	  }//end no y
	  }//spread normally
	  
	};
	
	//we're on an edge, and tried to spread into the void
	//spread to the first barrier you find.
	this.spread_again = function(world, y, x, end){
          ////console.log("spreading again");
          //does the north exist, and is it not a barrier?
          if(world[y-1]){
	    north = world[y - 1][x];
	    if(north){
	      // //console.log("North exists");
	       ////console.log(north.isBarrier());
	       if(north.isBarrier()){
	        //   //console.log('spreading north');
	           north.makeSpace(world, y-1, x, -1, 0, end);
	           return null;
	       }//end if not barrier
	    }//end if block exists
	  }//end if row exists
	  
	  if(world[y+1]){
	    south = world[y + 1 ][x];
	    if(south){
	      ////console.log("South exists");
	       if(south.isBarrier()){
	        //    //console.log('spreading south');
	           south.makeSpace(world, y+1, x, 1, 0, end);
	           return null;
	       }//end if not barrier
	    }//end if block exists
	  }
	  
	  if(world[y][x-1]){
	    west = world[y][x - 1];
	    if(west){
	      ////console.log("West exists");
	       if(west.isBarrier()){
	          // //console.log('spreading west');
	           west.makeSpace(world, y, x-1, 0, -1, end);
	           return null;
	       }//end if not barrier
	    }//end if block exists
	  }
	  
	  if(world[y][x+1]){
	    east = world[y][x + 1];
	    if(east){
	       ////console.log("East exists");
	       if(east.isBarrier()){
	            ////console.log('spreading east');
	           east.makeSpace(world, y, x+1, 0, 1, end);
	           return
	       }//end if not barrier
	    }//end if block exists
	  }
	}//end spread_again
	
	//adds or subtracts from either x or y (no diagonals)
	this.spread_random = function(world, y, x, end){
	 // //console.log("spreading randomly");
          if(Math.random() * 100 < 50 ){
	    amount = 1;
	  }else{
	    amount = -1;
	  } //end set amount
	//  //console.log("amount set: " + amount);
	  //decide which gets modified
	  if(Math.random() * 100 < 50 ){
	    new_x = x + amount;
	    new_y = y;	    
	    x_dir = amount;
	    y_dir = 0;
	  }else{
	    new_x = x;
	    new_y = y + amount;
	    x_dir = 0;
	    y_dir = amount;
	  }//end set dir
	 // //console.log("direction set");	  
	 // //console.log("Trying to spread to: " + new_x + ", " + new_y);
	  if(world[new_y]){
	   // //console.log("found y");
	    if(world[new_y][new_x]){
	      ////console.log("found x");
	      world[new_y][new_x].makeSpace(world, new_y, new_x, y_dir, x_dir, end);
	   }else{
	     this.spread_again(world,y,x, end);
	   }//end no x
	  }else{
	    this.spread_again(world,y,x, end);
	  }//end no y
	};//end spread random
	
	
	//check to see if you are adj to the ending block. 
	//if so, set the end to 'done' and return true
	//else return false
	this.found_end = function(x, y){
	////console.log("checking for end");
	  if(world[y-1]){
	    north = world[y - 1][x];
	  }else{
	    return false;
	  }
	  
	  if(world[y+1]){
	    south = world[y + 1 ][x];
	  }else{
	    return false;
	  }
	  
	  if(world[y][x-1]){
	    west = world[y][x - 1];
	  }else{
	     return false;
	  }
	  
	  if(world[y][x+1]){
	    east = world[y][x + 1];
	  }else{
	    return false;
	  }
	  
	  if(north.is_end){
	     north.done = true
	     //console.log("I made a solvable maze!");
	     return true
	  }
	  
	  if(west.is_end){
	     west.done = true
	     //console.log("I made a solvable maze!");
	     return true
	  }
	  
	  if(south.is_end){
	     south.done = true
	     //console.log("I made a solvable maze!");
	     return true
	  }
	  
	  if(east.is_end){
	     east.done = true
	     //console.log("I made a solvable maze!");
	     return true
	  }
	  
	  return false;
	};
	
	this.setSprite = function(mysprite){
	  this.sprite = mysprite;
	};
	
	this.setColor = function(){
	   this.color = "45-rgb(" + this.red + "," + this.green + "," + this.blue+this.shading;
	   this.sprite.attr("fill", this.color)
	};
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
              arrayName[i] = null; 
            } //end if
          }//end for
        }//end remove element  
        
        
}//end function block
