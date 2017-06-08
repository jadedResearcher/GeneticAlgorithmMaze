//a non physical object. This exists just to build the maze (color matter, not this object).
//x and y are the top left position of the block
//blocks are square, so width is the width and hight
//blocks can be colored.
function PlantBlock(x,y, width, paper){

        //needs to be above where i call it in init (for some reason)
        this.setSprites = function(){
	    this.earth_sprite = paper.rect(this.x, this.y, this.width, this.width);
	    this.earth_sprite.attr("stroke", "none");
	    this.plant_sprite = paper.rect(this.x, this.y, this.width, this.width);
	    this.plant_sprite.attr("stroke", "none");
	    this.earth_sprite.toFront();//need to be clickable
	    //in center of block
	    this.fire_path = "M " + (this.x+this.width/2) + "," +  (this.y+this.width) + " l -5,-10 0,-5 5,5 0,-10 5,-5 0,10 5,-5 -5,15 -5,5 0,0 0,0z";
	    this.fire_sprite_front = paper.path(this.fire_path);
	    this.fire_sprite_back = paper.path(this.fire_path);
	    this.fire_sprite_back.toFront();
	    this.fire_sprite_front.attr({"transform": "s 0.6", "fill": "#ffdd00", "stroke": "none"});
	    this.fire_sprite_front.toFront();
	    this.fire_sprite_back.attr({"fill": "#ff2200", "stroke": "none"});
	    this.fire_sprite_front.hide();
	    this.fire_sprite_back.hide();
	
	}
	
	
	this.x = x;
	this.y = y;
	this.paper = paper;
	this.width = width;
	this.earth_sprite = null;
	this.plant_sprite = null; //experimenting with layering
	this.setSprites();
	this.plant = 0;
	this.disease = 0;
	this.evos = new Array();
	this.pred_evos = new Array();
	this.fertility = Math.random()*50+50;  //fertile land gets plants faster than unfertile land, fertility decreases over time.
	this.burning = false;
	this.pheremone_concentration = 0;  //the amount of pheremones this block has. (degrades and spreads over time)
	
		
	
	this.isBarrier = function(){
	   //smaller color numbers are darker. if it's below a threshold, it's light, and thus not a barrier
	   if(this.plant > 80){
	     return true
	   }else{
	     return false;
	   }
	};
	
	this.makeBarrier = function(){
	   this.plant = Math.random()*20+80;
	   this.fertility = 100;
	   //small chance of being diseased
	   if(Math.random()*100 < 20){
	     //this.disease = 50;
	   }
	   this.setColor();
	};
	
	this.makeSpace = function(world, y, x, y_dir, x_dir, goal_end){
	   this.plant = Math.min((Math.random() * 20), this.fertility);  //less than 40% plant
	   this.shading = ")-#eee";
	   this.setColor();
	  
	};
	
	this.makeEmpty =  function(world, y, x, y_dir, x_dir, goal_end){
	   this.plant =0;
	   this.shading = ")-#eee";
	   this.setColor();
	  
	};
	
	this.animateFire = function(){
	   this.fire_sprite_front.show();
	   this.fire_sprite_back.show();
	   var animation_front = Raphael.animation({"transform": "s " + Math.random() },400,"elastic", function(){
	       //this.hide();
	   });
	   this.fire_sprite_front.animate(animation_front.repeat(3));
	   var animation_back = Raphael.animation({"transform": "s " + Math.random() * 2.0  },400,"elastic", function(){
	       //this.hide();
	   });
	   this.fire_sprite_back.animate(animation_back.repeat(3));
	}
	
	//add 10 plants to self, unless at 100% plant
	this.add_plants = function(){
	  if(this.plant < this.maxPlants()){
	    //amount added at any given time is based on fertility, as well
	    //as maximum amount of plants
	    amount = (this.fertility/5);
	    this.removeFertility();
	    //no negative fertility
	    this.fertility = Math.max(0, this.fertility);
	    this.plant += amount;
	    //random chance of adding a smidge more based on fertility
	    //still has a small chance even if no fertility
	    if(Math.random()*101 + this.fertility > 90){
	      this.plant += 5;
	    }
	    this.setColor();
	  }
 	}//end add plants
 	
 	//remove 10 or more plants unless already zero or less
 	this.remove_plants = function(){
 	  if(this.plant > 0){
 	    amount = 50;
 	    this.plant = Math.max(0, this.plant - amount);
 	    this.setColor();
 	  }
 	  //this.remove_disease();
 	}//end remove plants
 	
 		
	this.add_disease = function(){
	  if(this.disease < this.plant){
	    amount = Math.min(1,this.plant-this.disease);
	    this.disease += amount;
	    this.setColor();
	  }
 	}//end add plants
 	
 	//remove 10 plants unless already zero or less
 	this.remove_disease = function(){
 	  if(this.disease > 0){
 	    amount = Math.min(30,this.plant);
 	    this.disease = this.plant - amount;
 	    this.setColor();
 	  }
 	}//end remove plants
 	
 	this.addFertility = function(){
 	    if(this.fertility < 95){
 	        this.fertility += 5;
 	        this.setColor();
 	    }
 	}
 	
 	this.removeFertility = function(){
 	    if(this.fertility > 5){
 	       this.fertility += -5;
 	       this.setColor();
 	    }
 	}
 	
 	
 	//while burning, plants are reduced, and fertility increased.
 	//block burns until plants are gone, or randomly goes out
 	this.burn = function(){
 	   this.burning = true;
 	   if(this.plant > 0 || Math.random() * 100 < 20){
 	      this.remove_plants();
 	      this.addFertility();
 	      this.animateFire();
 	   }else{
 	      this.burning = false;
 	      this.fire_sprite_front.hide();
 	      this.fire_sprite_back.hide();
 	   }
 	}
 	
 	//max plants the ground can sustain
 	this.maxPlants = function(){
 	   return this.fertility-this.plant;
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
	
	//have a random chance to spread to each adjacent block
	//y and x are the indexes in the world matrix
	this.spread_plants = function(world,i,j){
	  //know y element exists (it's me)
	  left = this.get_left(world,i,j);
	  right = this.get_right(world,i,j);
	  up = this.get_up(world,i,j); 
	  down = this.get_down(world,i,j);
	  
	  if(left != null && Math.random()*100 < this.plant){
	      left.add_plants();
	  }
	  
	  if(right != null && Math.random()*100 < this.plant){
	      right.add_plants();
	  }
	  
	  if(up != null && Math.random()*100 < this.plant){
	      up.add_plants();
	  }
	  
	  if(down != null && Math.random()*100 < this.plant){
	      down.add_plants();
	  }
	  
	  
	}//end spread plants
	
	this.tick =function(world,i,j){
	    if(this.plant > 0 && Math.random() * 100 < 15){
                block.spread_plants(world, i,j);
            }
            if(this.disease > 0 && Math.random() * 100 < 9){
               this.spread_disease(world, i,j);
            }
            if(this.burning == true){
               this.burn();
               this.spreadFire(world, i, j);
            }
            
            if(this.pheremone_concentration > 0){
               this.spreadPheremones(world, i, j);
            }
	}
	
	this.addPheremones = function(amount){
	  this.pheremone_concentration += amount;
	};
	
	
	
	//reduce pheremones in self, add fractions of them to adjacents.
	this.spreadPheremones = function(world, i, j){
	  var amount = Math.floor(this.pheremone_concentration/10);  //keep negative or positive
	  var left = this.get_left(world,i,j);
	  var right = this.get_right(world,i,j);
	  var up = this.get_up(world,i,j); 
	  var down = this.get_down(world,i,j);
	  if(left != null){
	      left.addPheremones(Math.floor(amount/10));
	  }
	  if(down != null){
	      down.addPheremones(Math.floor(amount/10));
	  }
	  if(right != null){
	      right.addPheremones(Math.floor(amount/10));
	  }
	  if(up != null){
	      up.addPheremones(Math.floor(amount/10));
	  }	  
	  //can't get negative pheremones (repulsive, not attractive) just from dissipation
	  if(this.pheremone_concentration > 0){
	      this.pheremone_concentration = Math.max(0, (this.pheremone_concentration - amount));
	  }else{  //likewise can't get positive pheremones if negative
	      this.pheremone_concentration = Math.min(0, (this.pheremone_concentration - amount));  
	  }
	}
	 
	 //fire spreads based on plants
	 this.spreadFire = function(world, i, j){
	     	  //know y element exists (it's me)
	  left = this.get_left(world,i,j);
	  right = this.get_right(world,i,j);
	  up = this.get_up(world,i,j); 
	  down = this.get_down(world,i,j);
	  
	  if(left != null && Math.random()*90 < this.plant){
	      left.burning = true;
	  }
	  
	  if(right != null && Math.random()*90 < this.plant){
	      right.burning = true;
	  }
	  
	  if(up != null && Math.random()*90 < this.plant){
	      up.burning = true;
	  }
	  
	  if(down != null && Math.random()*90 < this.plant){
	      down.burning = true;
	  }
	 }
	 
	 
         this.spread_disease = function(world,i,j){
	  //know y element exists (it's me)
	  left = this.get_left(world,i,j);
	  right = this.get_right(world,i,j);
	  up = this.get_up(world,i,j); 
	  down = this.get_down(world,i,j);
	  //disease travels with plants, not with air
	  //should always have at LEAST as many plants as disease
	  if(left != null && Math.random()*150 < left.plant + this.disease){
	      left.add_plants();
	      left.add_disease();
	  }
	  
	  if(right != null && Math.random()*150 < right.plant  + this.disease){
	      right.add_plants();
	      right.add_disease();
	  }
	  
	  if(up != null && Math.random()*150 < up.plant  + this.disease){
	      up.add_plants();
	      up.add_disease();

	  }
	  
	  if(down != null && Math.random()*150 < down.plant  + this.disease){
	      //down.add_plants();
	      down.add_disease();
	  }
	  
	  //remove some plants from self if surrounded
	  if(left != null && right != null && up != null && down != null){
	    if(left.disease +right.disease + up.disease + down.disease >= 350){
	      if(Math.random()*100 < 50){
	        this.remove_plants();//diseased plants die faster
	        this.remove_disease();
	        this.remove_disease();
	      }
	    }
	  }//end remove plants
	  
	}//end spread plants
	
	
	
	//baren is based on fertility
	this.setColor = function(){
	   //this.shading = ")-#aa3";
	   this.shading = ")";
	   this.red = 235-this.fertility*1.5;
	   this.blue = 200-this.fertility*2;
	   this.green = 210-this.fertility*1.4 ;
	   //diseased plants look different, wait no, that's ugly
	   if(this.disease > 10){
	     var r = this.disease;
	     var b = 0;
	     var g = this.plant/2;
	     this.earth_sprite.attr({"stroke":"rgb(" + r + "," + g + "," + b + ")", "stroke-width": 2, "stroke-opacity": this.disease/100});
	   }else{
	       this.earth_sprite.attr({stroke: "none"});
	   }
	   //pheremone color changes don't seem to work? why?
	   if(false && this.pheremone_concentration > 10){
	     var r = this.pheremone_concentration;
	     var b = 0;
	     var g = this.plant/2;
	     this.earth_sprite.attr({"stroke":"rgb(" + r + "," + g + "," + b + ")", "stroke-width": 2, "stroke-opacity": Math.abs(this.pheremone_concentration/100)});
	   }else{
	       this.earth_sprite.attr({stroke: "none"});
	   }

	   this.color = "rgb(" + this.red + "," + this.green + "," + this.blue+this.shading;
	   this.earth_sprite.attr({"fill": this.color, "fill-opacity": (100-this.plant)/100});
	   this.plant_sprite.attr({"fill": "rgb(120,170,40)"});
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
	
	//outputs a three degit color hex
	//larger the fertility, smaller the number
	this.fertilityToColorHex = function(){
	   var r = 4 + (10-this.fertility/10);
	   var b = 2+(10-this.fertility/10)
	   var g = 0;
	   var num = (r*16*16) + b*16 + g;
	   var ret = num.toString(16);
	   var diff = 3-ret.length; //if negative, need to chop, if pos, need to add
	   if(diff > 0){
	      while(diff != 0){
	         ret = "0"+ret;
	         diff = 3-ret.length;
	      }
	   }
	   return ret;	   
	}
	
	this.addEvo = function(evo){
	  this.evos.push(evo);
	};
	
	this.removeEvo = function(evo){
	  this.removeByElement(this.evos, evo);
	};
	
	this.addPredEvo = function(evo){
	  this.pred_evos.push(evo);
	};
	
	this.removePredEvo = function(evo){
	  this.removeByElement(this.pred_evos, evo);
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
