

//generates a solvable maze, given a matrix of barrier blocks
function CanvasGenerator(height, width, block_width, world, paper){

  this.generate = function(){
    this.start = null;
    this.num_blocks = 0;
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
	  var block = new ArtistPixelBlock(j,i,block_width, paper);
	  this.num_blocks += 1;	
	  world[i/block_width][j/block_width] = block;
	  //lets you use eraser
	  block.pixel_sprite.mousemove(function () {
             if(mouseIsDown){
                 blockClicked(this.attrs["x"], this.attrs["y"]);
             }
          });
          //also work if just click
          block.pixel_sprite.mousedown(function () {
                 blockClicked(this.attrs["x"], this.attrs["y"]);
          });
	  	  
	  if(this.start == null){
	      this.start = block;
	  }

	}//end for j			
    }//end for i
    return world;
  }//end buildWorld  

  
  
  //all blocks spread their plants
  this.tick = function(){
    for(i in this.world){
       for(j in this.world[i]){
         block = this.world[i][j];
         block.tick(world,i,j);
       }//end inner for
    }
  }//end tick
        
}//end function generator
