//the story generator has one big huge super method that takes in an event
//and uses it to generate one or more new lines for a story.
//the story is saved into an array of strings.

//every request to write more story is checked to see if it's valid (i.e. not repeating itself)
//and then each event is passed to seomthing that looks for a reason for the event (such as creatures dying because there is no food).
//if a reason is found, it's added to the story.

//at the end of the story (all creatures are dead), the story is summarized, then simply listed.

function StoryGenerator(){
  this.story_list = new Array();
  this.story = "";
  this.num_starved = 0;
  this.num_aged = 0;
  this.num_murdered = 0;
  this.num_disease_deaths = 0;
  this.num_high_plants = 0;
  this.num_low_plants = 0;
  this.num_high_fertile = 0;
  this.num_low_fertile = 0;
  this.num_births = 0;
  this.num_disease = 0;
  this.num_fires = 0;
  this.num_fire_deaths = 0;
  this.too_many_preds = 0;
  this.too_many_evos = 0;
  
  //can I reason about things?
  this.event_list = new Array();
  //an event is a string. I look to see if the event
  //matches one I'm expecting, and append that event's 
  //prewritten lines to the story.
  this.writeStory = function(event, number){
    //don't even bother processing it if it's the same as the last few events
    if(this.eventIsValid(event) == false){
     return null;
    }
    this.event_list.push(event);
    var possible_choices = [];
    good_adj = this.random_good_adj();
    bad_adj = this.random_bad_adj();
    if(event == "Begining"){
      possible_choices = [" Once upon a time, there were " + number + " " + good_adj + " young creatures.", " Our story begins with " + number + " " + good_adj + " young creatures."]
      possible_choices.push(" It started out with " + number + " " + good_adj + " young creatures. ");
    }
    
    if(event == "Many Deaths"){
      possible_choices = [" So many " + good_adj + " creatures are dying. Too many.", " " +number + " good, " + good_adj + " creatures died today. "];
    }
    
    if(event == "Natural Deaths"){
      this.num_aged += 1;
      possible_choices = [" At least the deaths are natural.  Most of 'em went in their sleep.", " The deaths aren't a surprise...too many creatures getting to be past their prime"];
    }
    
    if(event == "Disease Deaths"){
      this.num_disease_deaths += 1;
      possible_choices = [" The plague of disease had taken its toll. ", " The disease was too much for the " + good_adj + " creatures. "]
    }
    
    if(event == "Predator Deaths"){
      this.num_murdered += 1;
      possible_choices = [" There is nothing clean in these deaths. The predators are " + bad_adj + ". ", " The predators made short work of them. "];
      possible_choices.push(" The creatures had no chance against the " + bad_adj + " predators. ");
    }
    
    if(event == "Fire Deaths"){
      this.num_fire_deaths += 1;
      possible_choices = ["The fire is too much for the " + good_adj + " creatures. ", "What chance do the " + good_adj + " creatures have against a vengeful god?" ];
      possible_choices.push(" The creatures die horribly in the " + bad_adj + " fire. ");
    }
    
    if(event == "Starvation Deaths"){
      this.num_starved += 1;
      possible_choices = [" The famine is taking its toll.", " Times are tough. Food is hard to find. Not everybody is lucky."];
    }
    
    if(event == "Many Births"){
      this.num_births += 1;
      possible_choices = [" Many families are blessed with little ones to take care of. ", " " + number + " babies born all at once. Things are going well." ];
    }
    
    if(event == "Predator Spawn"){
      possible_choices = [" A predator is attracted to all the prosperity the creatures are enjoying.", " Mother Nature has a way of keeping things balanced. A predator is just one of her many tools", " Nobody WANTS a predator...but without one...well, those " + good_adj + " creatures would eat themselves out of house and home." ];
      possible_choices.push("The " + good_adj + " creatures are becoming too many. A predator is attracted to the excess.");
    }
    
    if(event == "Many Plants"){
      this.num_high_plants += 1;
      possible_choices = [" It is a land of plenty. ", " Such a lush jungle, the " + good_adj + " creatures are truly blessed. "];
      possible_choices.push( " There are plenty of plants to feed the " + good_adj + " creatures. ");
      possible_choices.push(" With " + number + " percent of the land briming with vegetation, the creatures should not go hungry.");
    }
    
    if(event == "Fertile"){
      this.num_high_fertile += 1;
      possible_choices = [" The land is very fertile. ", " Such a fertile land, the " + good_adj + " creatures are truly blessed. "];
      possible_choices.push( " The land is fertile and can support many plants. ");
      possible_choices.push(" With " + number + " percent of the land perfect for vegetation, the " + good_adj + "creatures should not go hungry..");
    }
    
    if(event == "Not Fertile"){
      this.num_low_fertile += 1;
      possible_choices = [" It is a land of desolation. ", " In such a wasteland, will the " + good_adj + " creatures be able to survive? "];
      possible_choices.push( " Will fertility ever return to the land? ");
      possible_choices.push(" With " + number + " percent of the land baren, will the plants ever grow back?");
    }
    
    if(event == "Few Plants"){
      this.num_low_plants += 1;
      possible_choices = [" A desert. How would the creatures survive?", " Too few plants. Too few for the " + good_adj + " creatures to live on, maybe."];
      possible_choices.push(" Only " + number + " percent of the world is plants. Would this be enough for the creatures to live on?");
    }
    
    if(event == "No Predators, Few Evos"){
      possible_choices = [" With the last of the predators gone, will these " + number + " creatures be able to rebuild? ", " Only " + number +" creatures left. Will that be enough? "];
      possible_choices.push(" The " + bad_adj + " predator was too efficient. How can only " + number + " creatures survive? ");
    }
    
    if(event == "No Predators, Many Evos"){
      possible_choices = [" The predators, " + bad_adj + " though they might have been, didn't cause too much damage. It won't take long before more will come to finish the job, though.", " Luckily, the " + bad_adj + " predators died off before they could cause much trouble. More will come, though."];
      possible_choices.push(" The " + bad_adj + " predators are gone. How long until more take their place? " );
      possible_choices.push(" The creatures are safe, as long as the predators remain gone. ");
    }
    
    if(event == "Too Many Predators"){
      this.too_many_preds += 1;
      possible_choices = [" More predators then prey. This can't be good.", " The " + bad_adj + " predators are too efficient. They just might wipe out the poor " + good_adj + " creatures"];
    }
    
    if(event == "Too Many Evos"){
      this.too_many_evos += 1;
      possible_choices = [" So many creatures. Can the land possibly sustain them?", " Times are easy for the " + good_adj + " creatures. But can the land really support " + number + " creatures?"]
      possible_choices.push("The creatures are flourishing, but can they sustain this level of growth?");
    }
    
    if(event == "Too Few Evos"){
      possible_choices = [" So few creatures left. Is this the end?", " Only " + number + " " + good_adj + " creatures remain. Can they make it?" ];
    }
   
    if(event == "Replenished Evos"){
      possible_choices = [" The " + good_adj + " creatures replenish their ranks. ", "Finally, there are " + number + " creatures again. " ];
      possible_choices.push(" There are once again a decent amount of creatures. ");
    }
    
    if(event == "No Evos"){
      possible_choices = ["It was too much for them. ", "Despite how " + good_adj + " the creatures were...they still died. "];
      possible_choices.push(" Being " + good_adj + " wasn't enough for the little creatures.  They still died. ");
    }
    
    if(event == "No Plants"){
      this.num_low_plants += 1;
      possible_choices = [" No plants. That's it then. No hope.", " Hope is gone. No plants, no food...no life. " ];
    }
    
    if(event == "Little Disease"){
      possible_choices = [" The world, at least, is a healthy one.  ", " Only " + number + " percent of the world is diseased.  The " + good_adj + " creatures are lucky. "  ];
    }
    
    if(event == "No Disease"){
      possible_choices = [" The world is disease free. ", " The last of the disease has finally been wiped out. "  ];
    }
    
        
    if(event == "Much Disease"){
      this.num_disease += 1;
      possible_choices = [" Disease is rampant in the plant life. ", " " + number + " percent of the world is diseased.  Too much. "  ];
      possible_choices.push(" So much disease. How will the " + good_adj + " creature survive? " );
      possible_choices.push(" The disease spreads quickly amongst the plants... ");
    }
    
    if(event == "Fire"){
      this.num_fires += number;
      possible_choices = [" Fire. Not good for the " + good_adj + " creatures, but good for the land", "Fire. Will the " + good_adj + " creatures be able to survive it?" ];
      possible_choices.push(" A fire has started.  Hopefully the creatures can survive the wrath of their god." );
      possible_choices.push(" The  " + good_adj + " creatures can only hope the fire dies quickly." );
    }
    
    if(event == "No Fire"){
      possible_choices = [" The fire is gone. Will the creatures be able to recover from its effects? "];
      possible_choices.push(" Thankfully, the fire has gone out. ");
    }
    
    random_index = Math.round(Math.random() * (possible_choices.length - 1))
    line = possible_choices[random_index]
    line += this.find_reason();
    this.story_list.push(line);
    this.story += "<br><br>" + line;
  }//end write story
  
  //takes in an event and confirms it didn't show up in the last few events
  //returns true or false
  this.eventIsValid = function(event){
    if(this.event_list.length > 3){
      prev_event = this.event_list[this.event_list.length -1];
      two_before = this.event_list[this.event_list.length -2];
      three_before = this.event_list[this.event_list.length -3];
      if(prev_event == event || two_before == event || three_before == event){
        return false
      }
    }
    
    if(this.event_list[this.event_list.length -1] == event){
      return false
    }
    return true;
  }
  //looks at the last event and sees if there is a clear reason it happened.
  this.find_reason = function(){
    event = this.event_list[this.event_list.length-1];
    good_adj = this.random_good_adj();
    bad_adj = this.random_bad_adj();
    //console.log("finding reason for " + event);
    if(this.event_list.length > 5){
       last_few = this.event_list.slice((this.event_list.length -6),this.event_list.length -1);
    }else{
     last_few = this.event_list.slice(0,5);
    }
      //console.log(last_few);
      //console.log(this.event_list.indexOf("Few Plants"));
      //things I can look at:
    
      //why is there so few plants? (was there recently a lot of creatures?)
      
      if(event == "Few Plants" && (last_few.indexOf("Too Many Evos") >=0)){
        return " The creatures brought this on themselves. They bled the land dry. "
      }
      
      if(event == "Few Plants" && (last_few.indexOf("Not Fertile") >=0)){
        return " It's no surprise that the baren land can't support many plants. "
      }
      
      if(event == "Many Plants" && (last_few.indexOf("Fertile") >=0)){
        return " The fertile land thrives.";
      }
      
      if(event == "Few Plants" && (last_few.indexOf("Fertile") >=0)){
        return " With the land as fertile as it is, the plants should recover quickly. "
      }
      
      if(event == "Many Plants" && (last_few.indexOf("Not Fertile") >=0)){
        return " The land is not fertile enough to sustain such growth. ";
      }
      
      if(event == "Fertile" && (last_few.indexOf("Fire") >=0)){
        return " Did the fire contribute to such fertility? ";
      }
      
      if(event == "Fertile" && (last_few.indexOf("Many Deaths") >=0)){
        return " The land grows strong on the corpses of the " + good_adj + " creatures";
      }
      
            
      
      //are there a lot of plants because the creatures are dwindling?
      if(event == "Many Plants" && (last_few.indexOf("Too Few Evos") >=0)){
        possible_choices = [" While the creatures' population was dwindling, the land had time to grow strong. ", " Will the creatures have time to find all the plants that have grown in their absence? "]
        random_index = Math.round(Math.random() * (possible_choices.length - 1))
        return possible_choices[random_index];
      }
      
      //are there a lot of plants because the creatures are dwindling?
      if(event == "Many Plants" && (last_few.indexOf("Too Many Evos") >=0)){
        return " How long can the land sustain this level of growth? "
      }
      
      if(event == "Too Few Evos" && ((last_few.indexOf("Few Plants") >=0 || last_few.indexOf("No Plants") >=0) && last_few.indexOf("Many Plants") <=0 )){
        return " The desert is wearing them down. "
      }
      
      if(event == "Too Few Evos" && (last_few.indexOf("Too Many Predators") >=0)){
        return " The predators have gotten too greedy. "
      }
      
      if(event == "Too Few Evos" && (last_few.indexOf("Fire") >=0)){
        return " The fire is taking its toll "
      }
      
      if((event == "Starvation Deaths" && (last_few.indexOf("Many Plants") >=0))){
        possible_choices = [ " It is a mystery how the creatures managed to starve in a land of plenty. ", " The creatures are foolish to starve while the land is so bountiful. "];
        possible_choices.push( " The creatures starve. The land is green and full. How can both be true? ");
        random_index = Math.round(Math.random() * (possible_choices.length - 1))
        return possible_choices[random_index];
      }
       
      //why are there so many creatures? (a lot of plants, or no predators?)
      if((event == "Many Births" || event == "Too Many Evos") && (last_few.indexOf("Many Plants") >=0)){
        possible_choices = [" The bounty of the land is helping the creatures to flourish, for now. ", " It's easy to flourish when food is so plentiful. "];
        random_index = Math.round(Math.random() * (possible_choices.length - 1))
        return possible_choices[random_index];
      }
    
      //why are there so few creatures (few plants, many predators?)
    
      //why are so many starving? Is it a desert, or are they just in the wrong place?
      if(event == "Starvation Deaths" && last_few.indexOf("Few Plants")>= 0){
        possible_choices = [" A desert is a terrible place to look for food. ", " The only hope is that the few plants remaining grow quickly. "];
        random_index = Math.round(Math.random() * (possible_choices.length - 1))
        return possible_choices[random_index];
      }
    
      if(event == "Starvation Deaths" && (last_few.indexOf("Few Plants") <= 0 && last_few.indexOf("No Plants") <= 0 )){
        possible_choices = [" If only the creatures could find what food the land has. ", " There's food...why can't the creatures find it? " ];
        possible_choices.push(" The food does the creatures no good where it is. ");
        random_index = Math.round(Math.random() * (possible_choices.length - 1))
        return possible_choices[random_index];
      }
      
       if(event == "Starvation Deaths" && last_few.indexOf("No Plants")>= 0){
        return " The deaths aren't that surprising, in the absense of any food. ";
      }
    
      //why did all the creatures die? (no plants, many predators? summarize their lives. Was it hard? easy? short? uneventful?)
      if(event == "No Evos"){
        return this.make_summary();
      }

    
    if(this.event_list.length == 2){
      possible_choices = [" That's just how things started.", " No way to change how things started.", " No sense complaining about the hand these creatures were dealt."];
      possible_choices.push(" Complaining about how things started will get the " + good_adj + " creatures nowhere.");
      random_index = Math.round(Math.random() * (possible_choices.length - 1))
      return possible_choices[random_index]
    }
    return "";
  }
  
  //summarizes the whole set of events
  this.make_summary = function(){ 
    if(this.event_list.length > 5){
       last_few = this.event_list.slice((this.event_list.length -6),this.event_list.length -1);
    }else{
     last_few = this.event_list.slice(0,5);
    } 
    ret = "";
    
    if(this.num_high_plants > this.num_low_plants){
      ret += " Their's had been a frequently lush world. " 
    }
    
    //comment that it was both lush and barren
    if(this.num_high_plants == this.num_low_plants){
      ret += " The world was a contradiction, sometimes bestowing great feasts, and sometimes great famines. ";
    }
    
    if(this.num_high_plants < this.num_low_plants){
      ret += " The world had been harsh and was often barren. " 
    }
    
    if(this.num_high_plants > this.num_low_plants){
      ret += " And yet...";
    }
    
    if(this.num_high_plants > this.num_low_plants){
      ret += " It was no suprise...";
    }
    
    if(this.num_starved > 2 || (this.num_starved >= 1 && this.event_list.length < 15)){
      ret += "Many died of hunger.";
    }
    
    if(this.num_aged > 2 || (this.num_aged >= 1 && this.event_list.length < 15)){
      ret += " Many died peacefully in their sleep. " 
    }
    
    if(this.num_murdered > 2 || (this.num_murdered >= 1 && this.event_list.length < 15)){
      ret += " It was a violent time. Many were killed by " + this.random_bad_adj() + " predators."; 
    }
    
    if(this.num_disease > 2){
      ret += " Disease had run rampant. "
    }
    
    if(this.num_disease_deaths > 2){
      ret += " Many had died from plague. "
     }
    
    if(this.num_births > 1){
      ret += " Their population had flourished, once."
    }
    
    if(this.num_fires > 1){
      ret += " Fire had plagued them. "
    }
    
    if(this.num_fire_deaths > 1){
      ret += " Many had died in the fires. "
    }
    
    if(this.too_many_preds > 1){
      ret += " They had been plagued by far too many " + this.random_bad_adj() + " predators"; 
    }
    
        
    if(this.too_many_evos > 2){
      ret += " They had bred too much, too quickly. How could the land sustain them?"; 
    }
    
    if(this.event_list.indexOf("Too Few Evos") >=0 && last_few.indexOf("Too Few Evos") <=0){
      ret += " They had nearly gone extinct in the past, yet had preservered. Not so lucky, this time. ";
    }
    
    
    if(last_few.indexOf("Starvation Deaths") >=0){
      ret += " In the end, it was hunger that killed them."
    }
    
    if(last_few.indexOf("Predator Deaths") >=0){
      ret += " In the end, the predators were just too much."
    }
    

    
    
   return ret;  
  }
  

  
  this.random_good_adj= function(){
    possible_choices = ["happy", "humble", "peaceful", "hopeful", "amazing", "brave", "caring", "kind", "persistant", "good"];
    random_index = Math.round(Math.random() * (possible_choices.length - 1))
    return possible_choices[random_index];   
  }//end random adj
  
  this.random_bad_adj = function(){
    possible_choices = ["cruel", "evil", "horrible", "monstrous", "horrifying", "murderous", "deadly"];
    random_index = Math.round(Math.random() * (possible_choices.length - 1))
    return possible_choices[random_index]; 
  }


}
