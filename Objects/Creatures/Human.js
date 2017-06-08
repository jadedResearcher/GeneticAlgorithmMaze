//zombies move randomly
//move towards humans
//and can only move on light blocks.
//and make sure it's a light block. if not, they simply cancel their movement.
function Human(x,y, max_height, max_width, block_width){
	this.x = x;
	this.y = y;
	this.max_height = max_height - 15;
	this.max_width = max_width - 15;
	this.block_width = block_width
	this.red = 255;
	this.green = 200;
	this.blue = 100;
	this.shading = ")-#fff";
	this.color = "45-rgb(" + this.red + "," + this.green + "," + this.blue+this.shading;
	this.block = null;
	this.dead = false;
	
	//what block is this creature on?
	//use x and y to find out
	this.findBlock = function(world){
	  my_i = [Math.round(this.new_y/this.block_width)]
	  my_j = [Math.round(this.new_x/this.block_width)]
	  possible_blocks = new Array();
	  //look at blocks close by
	  for(i = -1; i < 2; i++){
	    if(world[my_i/1 + i/1]){ //division needed, for some reason thinking is string, not int?
	      for(j = -1; j < 2; j++){
	        if(world[my_i/1 + i/1][my_j/1 + j/1]){
	          possible_blocks.push(world[i/1+ my_i/1][j + my_j/1]);
	        }//end if block exists
	      }//end for j
	    }//end if block row exists
	  }//end for i
	  //now that i have all possible blocks find the one i actually sit on
	  for(b in possible_blocks){
	    if(possible_blocks[b].isInside(this.new_x, this.new_y)){
	      //let block know i'm on it
	      if(this.block){
	        this.block.removeHuman(this);
	      }
	      this.block = possible_blocks[b];
	      possible_blocks[b].addHuman(this);
	      return possible_blocks[b];
	    }
	  }
	  //console.log("couldn't find block");
	  return null;
	};
	
	//only look inside of my block to find other creatures to interact with
	this.tick = function(world){
	  this.moveRandomly();
	  this.checkCollisions(world)
	  this.zombify();	  
	}
	
	this.zombify = function(){
	 if(this.block.zombies.length > 0){
	  //console.log("zombified");
	  this.dead = true;
	  this.block.removeHuman(this);	    
	  }
	};
	
	this.moveRandomly = function(){
	   x_dir_calc = Math.random()*100;
	   y_dir_calc = Math.random()*100;
	   x_dir = 1;
	   y_dir = 1;
	   
	   if(x_dir_calc > 50){
	     x_dir = -1;
	   }
	   
	   if(y_dir_calc > 50){
	     y_dir = -1;
	   }
	   
	   x_amount = Math.random()*this.block_width * x_dir;
	   y_amount = Math.random()*this.block_width * y_dir;
	   
	   this.new_x = this.x + x_amount;
	   this.new_y = this.y + y_amount;	
	  // //console.log(this.x + " to new x of" + this.new_x);
	   ////console.log(this.y + " to new y of" + this.new_y);
	   if(this.new_x > this.max_width || this.new_x < 0){
	     this.new_x = this.x;
	   //  //console.log("not moving x");
	   }   
	   
	    if(this.new_y > this.max_height || this.new_y < 0){
	     this.new_y = this.y;
	    // //console.log("not moving y");
	   }   
	};
	
	//make sure you're going onto a light block. if yes, save movement.
	//if no, don't save movement.
	this.checkCollisions = function(world){
	   block = this.findBlock(world);
	   if(block){
	   if(!block.isBarrier()){
	     this.x = this.new_x;
	     this.y = this.new_y;
	   }else{
	     //  //console.log("not moving because of barrier");
	   }
	   }//end if block
	};
}//end zombie
