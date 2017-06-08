//Evos are creatures that a genetic algorithm is used on.
//there genes are the path they will take through the maze
//such as L R U D R L  
//if they attempt to move into a block that is a barrier, 
//they simply remain where they are.

//Survival Evos take this one further...
//they have a lifespan, and die if they've lived too many ticks
//or if they are too hungry
//every x ticks (where x is constant across all survival evos)
//they try to breed. Breeding is succesfull if there are other survival evos in their block
//they breed once with every evo sharing their block
//their hunger increases over time. When it gets over a certain threshold, they try to eat.
//eating is successfull if there is plants in the block they are in.
//when eating, hunger decreases.

//each evo is on one and only one block, but is rendered randomly on said block.
//each evo moves to another block, and is again rendered randomly on that block
function ArtistEvo(block, block_width, world, speed, path_length,size, route){
  this.block = block;
  this.speed = speed;
  this.block_width = block_width;
  this.route = route;
  this.size = size
  this.dead = false;
  this.can_breed = true;
  this.path_length = path_length;
  this.world = world; //don't expect this to change
  this.route_index = 0;
  this.pheremone_direction = 1;  //negative is repulsive, zero is neutral
  this.time_since_mating = 0;
  //lower the fitnes, the better it is
  this.fitness = null;
  
  this.setSprite = function(mysprite){
     this.sprite = mysprite;
  };
 //co-opt this to be pheremone strength....COULD rewrite everything, but lazy.
 //L = low  R= mid-low U = mid-high d = high pheremone strength  (green, blue red) 
  this.randomColor = function(){
     chance = Math.random() * 100;
     if(chance > 66){
         return "R";
     }else if(chance < 66 && chance > 33){
         return "B";
     }else{
         return "G";
     }
  }//end random direction
  
  this.randomPath = function(){
    // //console.log("making random path");
     var st = ""
     for(var i = 0; i < this.path_length; i++){
       st += this.randomColor();
     }//end for
     return st;
  }//end random Path
  
  //first generation is homogynous, only as they breed do they become not all one thing
  this.randomConsistenPath = function(){
     var c = this.randomColor();
      // //console.log("making random path");
     var st = ""
     for(var i = 0; i < this.path_length; i++){
       st += c;
     }//end for
     return st;
  }//end random Path
  
  

  
  //chooses a random position on the block to be at.
  this.setPosition = function(){
    //upper left corner?
    //so i can go width down, or width to the right.
    target_x = this.block.x;
    target_y = this.block.y;
    //console.log("Target: " + target_x + ", " + target_y + " Max " + (target_x + this.block_width) + ", " + (target_y + this.block_width));
    this.x = target_x + Math.round((Math.random() * this.block_width));
    this.y = target_y + Math.round((Math.random() * this.block_width));
    this.x_index = Math.floor(this.x / this.block_width);
    //console.log("Actual: " + this.x + ", " + this.y);
    this.y_index = Math.floor(this.y /this.block_width);    
  };
  
  this.setColor = function(){
      this.red = 0;
      this.blue = 0;
      this.green = 0;
    //  //console.log(this.route);
      for(var i = 0; i < this.route.length; i++){
        if(this.route.charAt(i) == 'B'){
          this.blue += Math.floor(255/this.path_length);
        }
        if(this.route.charAt(i) == 'G'){
          this.green += Math.floor(255/this.path_length);
        }
        if(this.route.charAt(i) == 'R'){
          this.red += Math.floor(255/(this.path_length));
        }
      }//end for
      
      this.color = "rgb(" + this.red + "," + this.green + "," + this.blue +")";
      //console.log(this.color);
  };
  

  
  if(this.route == null){
    this.route = this.randomPath();
  }
  
  //can't call them before they are defined, so have to set position and color here, not at top
  this.setPosition();
  this.setColor();
  
  this.moveAwayPheremones = function(){
      var direction = this.route.charAt(this.route_index);
      var left = this.block.get_left(world, this.y_index, this.x_index);
      var right = this.block.get_right(world, this.y_index, this.x_index);
      var up = this.block.get_up(world, this.y_index, this.x_index);
      var down = this.block.get_down(world, this.y_index, this.x_index);
      var x_pot = this.x_index;
      var y_pot = this.y_index;
      var potential_block = null;
      var best_pheremone = 9999999;
      var num_hits = 0;
      if(left != null && left.pheremone_concentration <= best_pheremone){
             best_pheremone = left.pheremone_concentration;
             potential_block = left;
             x_pot = this.x_index - 1;
             y_pot = this.y_index;
             num_hits +=1;
      }
          
      if(right != null && right.pheremone_concentration <= best_pheremone){
             best_pheremone = right.pheremone_concentration;
             potential_block = right;
             x_pot = this.x_index + 1;
             y_pot = this.y_index;
             num_hits +=1;
      }
          
      if(up != null && up.pheremone_concentration <= best_pheremone){
             best_pheremone = up.pheremone_concentration;
             potential_block = up;
             x_pot = this.x_index;
             y_pot = this.y_index - 1;
             num_hits +=1;
      }
          
      if(down != null && down.pheremone_concentration <= best_pheremone){
             best_pheremone = down.pheremone_concentration;
             potential_block = down;
             x_pot = this.x_index;
             y_pot = this.y_index + 1;
             num_hits +=1;
      }
      
      
      //move according to instinct
      if(num_hits > 3){
        return false;
      }
      
      if(potential_block != null && !potential_block.isBarrier()){
          //console.log("moving to " + x_pot + ", " + y_pot + " from " + this.x_index + ", " + this.y_index );
          this.block.removeEvo(this);
          potential_block.addEvo(this);
          this.block = potential_block;
          this.x_index = x_pot;
          this.y_index = y_pot; 
          return true; 
      }
  }
   
  this.moveTowardsPheremones = function(){
      var direction = this.route.charAt(this.route_index);
      var left = this.block.get_left(world, this.y_index, this.x_index);
      var right = this.block.get_right(world, this.y_index, this.x_index);
      var up = this.block.get_up(world, this.y_index, this.x_index);
      var down = this.block.get_down(world, this.y_index, this.x_index);
      var x_pot = this.x_index;
      var y_pot = this.y_index;
      var potential_block = null;
      var best_pheremone = 0;
      var num_hits = 0;
      if(left != null && left.pheremone_concentration > best_pheremone){
             best_pheremone = left.pheremone_concentration;
             potential_block = left;
             x_pot = this.x_index - 1;
             y_pot = this.y_index;
             num_hits +=1;
      }
          
      if(right != null && right.pheremone_concentration > best_pheremone){
             best_pheremone = right.pheremone_concentration;
             potential_block = right;
             x_pot = this.x_index + 1;
             y_pot = this.y_index;
             num_hits +=1;
      }
          
      if(up != null && up.pheremone_concentration > best_pheremone){
             best_pheremone = up.pheremone_concentration;
             potential_block = up;
             x_pot = this.x_index;
             y_pot = this.y_index - 1;
             num_hits +=1;
      }
          
      if(down != null && down.pheremone_concentration > best_pheremone){
             best_pheremone = down.pheremone_concentration;
             potential_block = down;
             x_pot = this.x_index;
             y_pot = this.y_index + 1;
             num_hits +=1;
      }
      
      //move according to instinct, don't just blindly go left
      if(num_hits > 3){
        return false;
      }
      
      if(potential_block != null && !potential_block.isBarrier()){
          //console.log("moving to " + x_pot + ", " + y_pot + " from " + this.x_index + ", " + this.y_index );
          this.block.removeEvo(this);
          potential_block.addEvo(this);
          this.block = potential_block;
          this.x_index = x_pot;
          this.y_index = y_pot; 
          return true; 
      }
  }
  
  // ?~~~~~~~~~~~~~~~~~~~End initializing functions and parms~~~~~//
  //no longer move based on DNA, instead more towards pheremone
  //if nothing is better, default to moving based on DNA 
  this.Move = function(){
      this.route_index ++; 
      var success = false; 
      
      if(this.pheremone_direction > 0){
         success = this.moveTowardsPheremones();
      }else if(this.pheremone_direction < 0){
         success = this.moveAwayPheremones();
      }  
      //if i should ignore pheremones or the pheremones fail, i should move according to dna
       if(!success){
          this.moveAccordingToDNA();
       }   
      //put down pheremones (extra if food is eaten)
      this.emitPheremones();
      this.emitColor();

  }
  
  this.emitColor = function(){
     var character = this.route.charAt(this.route_index);
     if(character == 'B'){
        this.block.addBlue();
     }
     //red color is high pheremones
     if(character == 'G'){
        this.block.addGreen();
     }
     if(character == 'R'){
        this.block.addRed();
     }
     
  }
  
  this.emitPheremones = function(){
      var direction = this.route.charAt(this.route_index);
      this.block.addPheremones(this.translateDNAToPheremone(direction));
  }
  //creatures need to avoid places another creature has died
  this.deathPheremones = function(){
      var direction = this.route.charAt(this.route_index);
      this.block.addPheremones(-100 * this.translateDNAToPheremone(direction));
  }
  
  this.translateDNAToPheremone = function(character){
     if(character == 'B'){
        return 5;
     }
     //red color is high pheremones
     if(character == 'G'){
        return 5;
     }
     if(character == 'R'){
        return 5;
     }
     return 0;
  }
  
  //attempt to move in the direction specified.
  //don't move at all if blocked
  this.moveAccordingToDNA = function(){
    potential_block = null;
    direction = this.route.charAt(this.route_index);
    this.route_index ++;
    //go left
    if(direction == 'G'){
    //not sure why this is necessary but it is
    //sometimes my CURRENT position is an invalid on in the matrix (one longer than it should be on the y axis)
    //when i have so many checks against it.
       if(this.world[this.y_index] != null){
        potential_block = this.world[this.y_index][this.x_index - 1];
        x_pot = this.x_index - 1;
        y_pot = this.y_index;
      }
    };
    
    if(direction == 'B'){
      if(this.world[this.y_index] != null){
        potential_block = this.world[this.y_index][this.x_index + 1];
        x_pot = this.x_index + 1;
        y_pot = this.y_index;
      }
    };
    
    if(direction == 'R'){
    //have to check row
      if(this.world[this.y_index -1]){
       potential_block = this.world[this.y_index - 1][this.x_index];
       x_pot = this.x_index;
       y_pot = this.y_index - 1;
      }
    };

    
    if(potential_block != null && !potential_block.isBarrier()){
      //console.log("moving to " + x_pot + ", " + y_pot + " from " + this.x_index + ", " + this.y_index );
      this.block.removeEvo(this);
      potential_block.addEvo(this);
      this.block = potential_block;
      this.x_index = x_pot;
      this.y_index = y_pot;
      if(this.world[this.y_index] == null){
      }
      ////console.log(this.x_index + ", " + this.y_index);
    }else{

    }    
  }//end move

  
  this.Animate = function(){
    if(false){
      this.sprite.animate({r: this.size/2,cx: this.x, cy: this.y }, this.speed);
    }else{
      this.sprite.animate({r: this.size, cx: this.x, cy: this.y}, this.speed);
    }
  }//end animate
  
  this.tick = function(evos){
    if(this.dead == false){
      this.time_since_mating += 1;
      if(!this.block.is_end){
        this.Move();
        this.setPosition();
        this.Animate();
      }
    //should they die randomly the more crowded things are?
      if(this.route_index >= this.route.length){
        this.Die("old age");
      }
     
      if(this.block.burning == true){
         this.Die("fire");
      }
      
      if(this.can_breed && (this.time_since_mating > (Math.random() * 10 + 10))){
        this.findMates(evos);
      }
    }//end if dead
  }//end tick
  

  //mate with every evo on your block
  this.findMates = function(evos){
   mates = this.block.evos;
   if(mates.length > 1){  //no more aesexual reproduction (trying to limit artist population)
     for(m in mates){
       if(mates[m].time_since_mating > 10){
         this.time_since_mating = 0;
         baby_route = this.BreedRoute(mates[m].route);
         baby = new ArtistEvo(this.block, this.block_width, world, speed, this.path_length,this.size, baby_route)
         baby_sprite = paper.circle(baby.x, baby.y, baby.size/2);
         baby_sprite.attr("fill", baby.color);
         baby.setSprite(baby_sprite); 
         baby.pheremone_direction = this.pheremone_direction;
         evos.push(baby);
         this.emitPheremones();
       }
     }//end for all mates
   }//end if any mates
  }//end find mates
  

  this.Die = function(method){
    this.dead = true;
    this.cause_of_death = method;
    if(method == "hunger"){
      this.sprite.animate({r: 1}, 0, "none", function(){
            this.hide();
      });
    }else if(method == "fire"){
       this.sprite.animate({fill: "#000000"}, 100, "none", function(){
            this.hide();
      }); 
    }else if(method == "old age"){
      this.sprite.animate({r: 1, stroke: "#ff0000"}, 0, "none", function(){
           this.hide();
      });
    }else if(method == "murder"){
      this.sprite.animate({fill: "#ff0000", r: 2}, 0, "none", function(){
          this.hide();
      });
    }
    
    this.block.removeEvo(this);
    //dead body decomposes
    //this.sprite.remove();

  }//end die
  
  //takes in a breeding route, and outputs a 
  //route that is half itself, half the other
  //with a small amount of mutation
  this.BreedRoute = function(breeding_route){
    st = "";
    for(var i = 0; i < this.path_length; i++){
      chance = Math.random() * 100;
      if(chance < 90){
        //mine or theirs
        if(chance < 50){
          //mine
          st += this.route.charAt(i);
        }else{
          //theirs
          st += breeding_route.charAt(i);
        }//end mine or theirs
      }else{
       //mutate
       st += this.randomColor();
      }//end if
    }//end for
    return st;
  }//end breed
  
  
  
  
  
}//end evo.
