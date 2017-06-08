

//generates a solvable maze, given a matrix of barrier blocks
function SurvivalMazeGenerator(height, width, block_width, world, paper, story_generator){

  this.generate = function(){
    this.start = null;
    this.total_plants = 0;
    this.fire = 0;
    this.total_disease = 0;
    this.total_fertility = 0;
    this.num_blocks = 0;
    //starting plant seeding
    this.percent_plants = Math.random() * 10 + 10;
    this.story_generator = story_generator;
    base_world = this.initWorld(height, width, block_width, world, paper);
    this.world = base_world;
    return base_world
  }
  

  
  //makes a world full of random blocks
  this.initWorld = function(height, width, block_width, world, paper){
    //width
    for(var i = 0; i < height; i+= block_width){
	//set this row in the matrix	
	world[i/block_width] = new Array(Math.round(width/block_width));	
	for(var j = 0; j < width; j+=block_width){
	  var block = new PlantBlock(j,i,block_width, paper);
	  this.num_blocks += 1;
	  world[i/block_width][j/block_width] = block;
          //ties into story_world
          //lets you paint blocks
          block.earth_sprite.mousemove(function () {
             if(mouseIsDown){
                 blockClicked(this.attrs["x"], this.attrs["y"]);
             }
          });
          //also work if just click
          block.earth_sprite.mousedown(function () {
                 blockClicked(this.attrs["x"], this.attrs["y"]);
          });		  
	  //random chance of being space or not
	  if(Math.random() * 100 < this.percent_plants){
	    block.makeBarrier();
	  }else{
	    block.makeSpace();
	    if(this.start == null){
	      this.start = block;
	    }
	  }

	}//end for j			
    }//end for i
    return world;
  }//end buildWorld  
  
  this.compare = function(prev_plants,prev_fire, prev_fertility){
    //if over half plants
    if((this.total_plants > (this.num_blocks * 50)) && Math.abs(prev_plants - this.total_plants) > 100){
      story_generator.writeStory("Many Plants", Math.round(this.total_plants/this.num_blocks));
    };
    //less than 10 percent plants
    if((this.total_plants < (this.num_blocks * 30)) && (Math.abs(prev_plants - this.total_plants) > 300 || (this.total_plants < 300 && this.total_plants > 0))){
      story_generator.writeStory("Few Plants", Math.round(this.total_plants/this.num_blocks));
    };
    
    if((this.total_fertility > (this.num_blocks * 50)) && Math.abs(prev_fertility - this.total_fertility) > 100){
      story_generator.writeStory("Fertile", Math.round(this.total_fertility/this.num_blocks));
    };
    
    if((this.total_fertility < (this.num_blocks * 30)) && (Math.abs(prev_fertility - this.total_fertility) > 300 || (this.total_fertility < 300 && this.total_fertility > 0))){
      story_generator.writeStory("Not Fertile", Math.round(this.total_fertility/this.num_blocks));
    };
    
    if(this.total_disease < (this.total_plants/5) && ((Math.abs(prev_disease - this.total_disease) > 300) && this.total_disease > 0 )){
      story_generator.writeStory("Little Disease", Math.round(this.total_disease/this.num_blocks));
    };
    
    if(this.total_disease > (this.total_plants) && (Math.abs(prev_disease - this.total_disease) > 600)){
      story_generator.writeStory("Much Disease", Math.round(this.total_disease/this.num_blocks));
    }
    
    if(this.total_disease == 0 && prev_disease != 0){
       story_generator.writeStory("No Disease", 0);
    }
    
    if(this.total_plants == 0 && prev_plants != 0){
      story_generator.writeStory("No Plants", 0);
    }
    
    if(this.fire > 0 && prev_fire == 0){
       story_generator.writeStory("Fire",this.fire);
    }
    
    if(this.fire == 0 && prev_fire > 0){
       story_generator.writeStory("No Fire",this.fire);
    }
    
  }//end compare
  
  
  //all blocks spread their plants
  this.tick = function(){
    prev_plants = this.total_plants;
    prev_fire = this.fire;
    prev_fertility = this.total_fertility;
    this.total_plants = 0;
    this.total_disease = 0;
    this.total_fertility = 0;
    this.fire = 0;
    for(i in this.world){
       for(j in this.world[i]){
         block = this.world[i][j];
         this.total_plants += block.plant;
         this.total_disease += block.disease;
         this.total_fertility += block.fertility;
         if(block.burning == true){
             this.fire += 1;
         }
         block.tick(world,i,j);
       }//end inner for
    }
    
    this.compare(prev_plants,prev_fire, prev_fertility);
  }//end tick
        
}//end function generator
