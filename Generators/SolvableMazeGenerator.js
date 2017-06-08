

//generates a solvable maze, given a matrix of barrier blocks
function SolvableMazeGenerator(height, width, block_width, world, paper){
  this.end = null;
  this.start = null;
  this.generate = function(){
    //console.log("generating");
    base_world = initWorld(height, width, block_width, world, paper);
    this.random_maze(base_world);
    //console.log("Made a solvable maze?  " + this.end.done);
    count = 0;
   
    while(count < 10 && this.end.done == false){
      count ++;
      //console.log(count);
      base_world = initWorld(height, width, block_width, world, paper);
      this.random_maze(base_world);
    }
    
    
    
    return world
  }
  
  this.random_maze = function(base_world){
    //console.log("making random world");
    start_y = Math.floor(Math.random() * (base_world.length - 1 ));
    start_x =  Math.floor(Math.random() * (base_world[0].length - 1));
    this.start = base_world[start_y][start_x];
   // //console.log("Starting from: " + start_x + ", " + start_y);
    end_x = Math.floor(Math.random() * (base_world[0].length - 1));
    end_y = Math.floor(Math.random() * (base_world.length - 1));
    this.end = base_world[end_y][end_x];
    ////console.log("Ending at: " + end_x + ", " + end_y);
    
    this.start.is_start = true;
    this.end.is_end = true;
    //blocks themselves will take care of spreading the maze
    this.end.makeSpace(base_world, end_y, end_x,null, null, this.end);
    this.start.makeSpace(base_world, start_y, start_x, null, null, this.end);
    ////console.log("Made a solvable maze?  " + this.end.done);
  }//end random maze
  
  //makes a world full of blank blocks
  function initWorld(height, width, block_width, world, paper){
    //width
    for(var i = 0; i < height; i+= block_width){
	//set this row in the matrix	
	world[i/block_width] = new Array(Math.round(width/block_width));	
	for(var j = 0; j < width; j+=block_width){
	  var block = new Block(j,i,block_width,1,1,1)	
	  world[i/block_width][j/block_width] = block;
	  var block_sprite = paper.rect(block.x, block.y, block.width, block.width);
	  block_sprite.attr("fill", block.color);
	  block_sprite.attr("stroke", "none");
	  block.setSprite(block_sprite);
	}//end for j			
    }//end for i
    return world;
  }//end buildWorld  
        
}//end function block
