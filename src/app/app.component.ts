import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { BackendService } from './services/backend.service';
import { Item } from './models/item';
import { GoogleSigninButtonModule, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { User } from './models/user';
import { JoinRoomComponent } from './components/join-room/join-room.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, GoogleSigninButtonModule,JoinRoomComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'KarmaFront-End';
  allItems: Item[] = [];
  formItem: Item = {} as Item;
  googleUser: SocialUser = {} as SocialUser;
  loggedIn: boolean = false;
  selectedCondition: string = "";
  selectedCategory: string = "";
  condition = [
    {value: "option1", label: "Mint"},
    {value: "option2", label: "Like New"},
    {value: "option3", label: "Used"},
    {value: "option4", label: "Worn"},
    {value: "option5", label: "Broken"}
  ];
  category = [
    {value: "option1", label: "Food"},
    {value: "option2", label: "Services"},
    {value: "option3", label: "Furniture"},
    {value: "option4", label: "Car Seats"},
    {value: "option5", label: "Electronics"},
    {value: "option6", label: "Clothing"},
    {value: "option7", label: "Stroller"},
    {value: "option8", label: "Nursing & Feeding"},
    {value: "option9", label: "Playards"},
    {value: "option10", label: "Bassinets"},
    {value: "option11", label: "Infant Activity"},
    {value: "option8", label: "Infant Toys"}
    
  ];

  constructor(private backendService: BackendService, private socialAuthServiceConfig: SocialAuthService){}

  ngOnInit(){
    this.getAll();
    this.socialAuthServiceConfig.authState.subscribe((userResponse: SocialUser) => {
      this.googleUser = userResponse;
      this.loggedIn = (userResponse != null);
      if(this.loggedIn == true){
        let u:User = {
          googleId: this.googleUser.id,
          userName: this.googleUser.name,
          profilePic: this.googleUser.photoUrl
        };
        this.backendService.addUser(u).subscribe(response => {console.log(response)});
      }
    })
  }

  signOut(): void{
    this.socialAuthServiceConfig.signOut()
  }

  getAll(){
    this.backendService.getAllItems().subscribe(response=> {
      console.log(response);
      this.allItems = response;
    });
  }

  addItem(){
    this.formItem.googleId = this.googleUser.id;
    this.backendService.addItem(this.formItem).subscribe(response=>{
      console.log(response);
      this.getAll();
      this.formItem = {} as Item;
    });
  
  }
}
