import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { BackendService } from './services/backend.service';
import { Item } from './models/item';
import { GoogleSigninButtonModule, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, GoogleSigninButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'KarmaFront-End';
  allItems: Item[] = [];
  formItem: Item = {} as Item;
  googleUser: SocialUser = {} as SocialUser;
  loggedIn: boolean = false;

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
