import { GoogleSigninButtonModule, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { User } from '../../models/user';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JoinRoomComponent } from '../join-room/join-room.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterOutlet,FormsModule,JoinRoomComponent,GoogleSigninButtonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  googleUser: SocialUser = {} as SocialUser;
  loggedIn: boolean = false;
  constructor(private backendService: BackendService, private socialAuthServiceConfig: SocialAuthService){}

  ngOnInit(){
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

}
