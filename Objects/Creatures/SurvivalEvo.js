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
function SurvivalEvo(block, block_width, world, speed, path_length,size, route){
  this.block = block;
  this.speed = speed;
  this.block_width = block_width;
  this.route = route;
  this.size = size
  this.hunger = 0;
  this.max_hunger = 8;
  this.diseased = false;
  this.dead = false;
  this.cause_of_death = "nothing";
  this.path_length = path_length;
  this.disease_clock = this.path_length/5; //how long you can survive after becoming diseased
  this.world = world; //don't expect this to change
  this.route_index = 0;
  this.time_since_mating = 0;
  //lower the fitnes, the better it is
  this.fitness = null;
  
  this.setSprite = function(mysprite){
     this.sprite = mysprite;
  };
 //co-opt this to be pheremone strength....COULD rewrite everything, but lazy.
 //L = low  R= mid-low U = mid-high d = high pheremone strength  (green, blue red) 
  this.randomDirection = function(){
     chance = Math.random() * 100;
     //diseased creatures head down more often than not
     //and very rarely left
     if(this.diseased == true){
       chance = Math.random() * 80;
     }

     if(chance > 75){
         return "L";
     }else if(chance < 75 && chance > 50){
         return "R";
     }else if(chance < 50 && chance > 25){
        return "U";
     }else{
         return "D";
     }
  }//end random direction
  
  this.randomPath = function(){
    // //console.log("making random path");
     var st = ""
     for(var i = 0; i < this.path_length; i++){
       st += this.randomDirection();
     }//end for
     return st;
  }//end random Path
  
  //first generation is homogynous, only as they breed do they become not all one thing
  this.randomConsistentPath = function(){
      var c = this.randomDirection();
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
        if(this.route.charAt(i) == 'L'){
          this.blue += Math.floor(255/this.path_length);
        }
        if(this.route.charAt(i) == 'R'){
          this.green += Math.floor(255/this.path_length);
        }
        if(this.route.charAt(i) == 'U' || this.route.charAt(i) == 'D'){
          this.red += Math.floor(255/(this.path_length*2));
        }
      }//end for
      
      this.color = "rgb(" + this.red + "," + this.green + "," + this.blue +")";
      //console.log(this.color);
  };
  
  //diseased creatures are marked, and have their dna (path) scrambled.
  //this has a benefit: bringing genetic diversity (they can still produce healthy offspring)
  //however, it's at the cost of a shortened lifespan.
  this.makeDiseased = function(){
     this.diseased = true;
     //this.sprite.animate({stroke: "#ff2222"}, 0);
     this.sprite.animate({stroke: "#8e9b61", 'stroke-width': 2}, 0);
     this.randomPath();
     this.setColor();
  }
  
  
  if(this.route == null){
    this.route = this.randomConsistentPath();
  }
  
  //can't call them before they are defined, so have to set position and color here, not at top
  this.setPosition();
  this.setColor();
  
  this.moveTowardsFood = function(){
      var direction = this.route.charAt(this.route_index);
      var left = this.block.get_left(world, this.y_index, this.x_index);
      var right = this.block.get_right(world, this.y_index, this.x_index);
      var up = this.block.get_up(world, this.y_index, this.x_index);
      var down = this.block.get_down(world, this.y_index, this.x_index);
      var x_pot = this.x_index;
      var y_pot = this.y_index;
      var potential_block = null;
      var best_food = 0;
      if(left != null && left.plant > best_food){
             best_food = left.plant;
             potential_block = left;
             x_pot = this.x_index - 1;
             y_pot = this.y_index;
      }
          
      if(right != null && right.plant > best_food){
             best_food = right.plant;
             potential_block = right;
             x_pot = this.x_index + 1;
             y_pot = this.y_index;
      }
          
      if(up != null && up.plant > best_food){
             best_food = up.plant;
             potential_block = up;
             x_pot = this.x_index;
             y_pot = this.y_index - 1;
      }
          
      if(down != null && down.plant > best_food){
             best_food = down.plant;
             potential_block = down;
             x_pot = this.x_index;
             y_pot = this.y_index + 1;
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
      if(left != null && left.pheremone_concentration > best_pheremone){
             best_pheremone = left.pheremone_concentration;
             potential_block = left;
             x_pot = this.x_index - 1;
             y_pot = this.y_index;
      }
          
      if(right != null && right.pheremone_concentration > best_pheremone){
             best_pheremone = right.pheremone_concentration;
             potential_block = right;
             x_pot = this.x_index + 1;
             y_pot = this.y_index;
      }
          
      if(up != null && up.pheremone_concentration > best_pheremone){
             best_pheremone = up.pheremone_concentration;
             potential_block = up;
             x_pot = this.x_index;
             y_pot = this.y_index - 1;
      }
          
      if(down != null && down.pheremone_concentration > best_pheremone){
             best_pheremone = down.pheremone_concentration;
             potential_block = down;
             x_pot = this.x_index;
             y_pot = this.y_index + 1;
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
  //no longer move based on DNA, instead more towards greatest food & pheremone
  //if nothing is better, default to moving based on DNA 
  this.Move = function(){
      this.route_index ++;      
      //if hungry, pay attention to food first
      if(this.hunger > this.max_hunger/2){
         if(!this.moveTowardsFood()){
            this.moveAccordingToDNA();
         }           
      }else{
         if(!this.moveTowardsPheremones()){
            this.moveAccordingToDNA();
         }   
      }
      //put down pheremones (extra if food is eaten)
      this.emitPheremones();

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
     if(character == 'L'){
        return 10;
     }
     if(character == 'R'){
        return 40;
     }
     //red color is high pheremones
     if(character == 'U'){
        return 60;
     }
     if(character == 'D'){
        return 90;
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
    if(direction == 'L'){
    //not sure why this is necessary but it is
    //sometimes my CURRENT position is an invalid on in the matrix (one longer than it should be on the y axis)
    //when i have so many checks against it.
       if(this.world[this.y_index] != null){
        potential_block = this.world[this.y_index][this.x_index - 1];
        x_pot = this.x_index - 1;
        y_pot = this.y_index;
      }
    };
    
    if(direction == 'R'){
      if(this.world[this.y_index] != null){
        potential_block = this.world[this.y_index][this.x_index + 1];
        x_pot = this.x_index + 1;
        y_pot = this.y_index;
      }
    };
    
    if(direction == 'U'){
    //have to check row
      if(this.world[this.y_index -1]){
       potential_block = this.world[this.y_index - 1][this.x_index];
       x_pot = this.x_index;
       y_pot = this.y_index - 1;
      }
    };
    
    if(direction == 'D'){
      if(this.world[this.y_index + 1]){
        potential_block = this.world[this.y_index + 1][this.x_index];
        x_pot = this.x_index;
        y_pot = this.y_index + 1;
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

  //try to eat.
  //check block i'm on first
  //if not, check adj blocks.
  this.Eat = function(){  
    done = false 
    if(this.block.plant > 0){
      this.hunger = 0;
      this.block.remove_plants();
      //more likely to catch a disease if you're standing on it
      if(Math.random()  * 5 < this.block.disease){
          this.makeDiseased();
      }
      done = true
    }else{
     //start looking at adjacents
     left = block.get_left(world,this.y_index, this.x_index)
     right = block.get_right(world,this.y_index, this.x_index)
     up = block.get_up(world,this.y_index, this.x_index)
     down = block.get_down(world,this.y_index, this.x_index)
     if(left != null && done == false){
      if(left.plant > 0){
        this.hunger = 0;
        left.remove_plants();
        if(Math.random()  * 15< left.disease){
          this.makeDiseased();
        }
        done = true
      }//done if left plant
     }else if(right != null && done == false){
      if(right.plant > 0){
        this.hunger = 0;
        right.remove_plants();
        if(Math.random() * 15 < right.disease){
          this.makeDiseased();
        }
        done = true
      }//done if right plant
     }else if(up != null && done == false){
      if(up.plant > 0){
        this.hunger = 0;
        up.remove_plants();
        //check for disease
        if(Math.random()  * 15 < up.disease){
          this.makeDiseased();
        }
        done = true
      }//done if up plant
     }else if(down != null && done == false){
       if(down.plant > 0){
        this.hunger = 0;
        down.remove_plants();
        if(Math.random()  * 15< down.disease){
          this.makeDiseased();
        }
        done = true
      }//dont if down plant
     }//done if this left exists
     }//done if this block
     if(this.hunger == 0){
        this.emitPheremones();
        this.block.addFertility(); //poop
     }     

  }//end eat
  
  this.Animate = function(){
    if(this.route_index < 10){
      this.sprite.animate({r: this.size/2,cx: this.x, cy: this.y }, this.speed);
    }else{
      this.sprite.animate({r: this.size, cx: this.x, cy: this.y}, this.speed);
    }
  }//end animate
  
  this.tick = function(evos){
    if(this.dead == false){
    this.hunger += 1;
    this.time_since_mating += 1;
    if(!this.block.is_end){
      this.Move();
      this.setPosition();
      this.Animate();
    }
    
    if(this.route_index >= this.route.length){
      this.Die("old age");
    }
    
    if(this.hunger > this.max_hunger){
      this.Die("hunger");
    }
    
    if(this.diseased == true){
      this.disease_clock += -1;
    }
    
    if(this.disease_clock <= 0){
      this.Die("disease");
    }
    
    if(this.block.burning == true){
       this.Die("fire");
    }
    
    if(this.hunger > 1){
       this.Eat();
    }
    
    if(this.time_since_mating > 10 && this.hunger < 3){
      this.findMates(evos);
    }
    }//end if dead
  }//end tick
  

  //mate with every evo on your block
  this.findMates = function(evos){
   mates = this.block.evos;
   if(mates.length > 0){
     for(m in mates){
       //close contact with diseased creatures make you diseased
       if(mates[m].diseased == true){
           this.makeDiseased();
       }
       if(mates[m].time_since_mating > 10){
         this.time_since_mating = 0;
         baby_route = this.BreedRoute(mates[m].route);
         baby = new SurvivalEvo(this.block, this.block_width, world, speed, this.path_length,this.size, baby_route)
         baby_sprite = paper.circle(baby.x, baby.y, baby.size/2);
         baby_sprite.attr("fill", baby.color);
         baby.setSprite(baby_sprite); 
         evos.push(baby);
         //it takes it out of you to make a baby
         this.hunger += 3;
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
    }else if(method == "disease"){
      this.block.add_disease();
      this.sprite.animate({r: 1, stroke: "#ff0000"}, 100, "none", function(){
         this.hide();
      });
    }
    this.block.removeEvo(this);
    //dead body decomposes
    this.block.addFertility();
    this.block.addFertility();
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
       st += this.randomDirection();
      }//end if
    }//end for
    return st;
  }//end breed
  
  
  
  
  
}//end evo.
