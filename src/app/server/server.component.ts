import  { 
  Component,
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/core';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls : ['./server.component.css'],
  animations: [
      trigger('divState',[
         state('small',style({
            // 'width':'0px',
            // 'height':'0px'
            'opacity':'0'
         })),
         state('big',style({
          // 'width':'1000px',
          // 'height':'1000px'
          'opacity':'1'
         })), 
         transition( 'small=>big',animate(1000))
      ])
  ]
})
export class ServerComponent
{
  state='small';
  allow=true;
  display=false;
  displayI=false;
  displayG=false
  constructor()
  {
      setTimeout(()=> 
      {
          this.allow=false;
      },2000);
  }
  twitch()
  {
     this.state='big';
  }
  on() {
      this.state="small";
      if(!this.display)
      {
      this.display = true;
      }
      else
      {
          this.off();
      }

      this.displayI=false;
      this.displayG=false;
      
  }
  
  off() {
      this.state="small";
      this.display=false;
      this.displayI=false;
      this.displayG=false;
  } 
 onI() {
  this.state="small";
     if(!this.displayI)
     {
      this.displayI = true;
     }
     else
     {
      this.displayI = false;
     }
      this.displayG=false;
      this.twitch();
  }
  
  offI() {
      this.state="small";
      this.displayI=false;
  }
  onG() {
      this.state="small";
      if(!this.displayG)
      {
          this.state="small";
       this.displayG = true;
      }
      else
      {
       this.displayG = false;
      }
      this.displayI=false;
      this.twitch();
  }
  
  offG() {
      this.state="small";
      this.displayG=false;
  }
}