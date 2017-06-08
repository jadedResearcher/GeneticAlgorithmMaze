//generates a set of Evos that can solve a given maze.
//using genetic algorithms
function ArtistGenerator(num_evos, num_ticks, block_width, world, paper, start, speed, num_gens,evo_size){
  this.world = world;
  this.speed = speed;
  this.block_width = block_width;
  this.num_evos = num_evos;
  //needed to know where to spawn evos
  this.start = start;
  this.evo_size = evo_size;
  this.done = false;
  this.evos = new Array();
  this.num_ticks = 0;
  this.max_num_ticks = num_ticks;
  this.generation_number = 1;
  
  //randomly generates some evos
  this.firstGeneration = function(){
    for(var i = 0; i < this.num_evos; i++){
      evo = new ArtistEvo(this.start, this.block_width, this.world, speed, this.max_num_ticks, this.evo_size);
      this.start = this.start.get_right(this.world, evo.y_index, evo.x_index); //always put next creature to the right
      if(this.start == null){
        this.start = this.world[Math.min(i, Math.floor(Math.random() * (world.length-1)))][0];//if you have to reset, also pick random row
      }

      this.evos[i] = evo;
      evo_sprite = paper.circle(evo.x, evo.y, this.evo_size/2);
      evo_sprite.attr("fill", evo.color);
      evo.setSprite(evo_sprite);
    }
  }//end generate
  


  
  //ticks all evos
  this.tick = function(){
    this.num_ticks += 1;
    
    for(evo in this.evos){
    //don't tick every one every time
      if(Math.random()*100 < 50){
       this.evos[evo].tick(this.evos);
       //don't tick on dead evos
       if(this.evos[evo].dead == true){
         this.evos.splice(evo, 1);
       }
     }//end if random
   }//end for
   
     
     if(this.evos.length == 0){
       this.done = false;//don't stop now that people can spawn more creatures
       //this.firstGeneration();
     }

  }//end tick
  
 
        
}//end function block
