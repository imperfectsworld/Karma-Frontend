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
  fileName = '';
  selectedFile: File | null = null;

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
        this.backendService.addUser(u).subscribe(response => console.log(response));
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


  onFileSelected(event: any): void{
    const file:File = event.target.files[0];
    if(file){
      this.selectedFile = file;
    }
  }
  addItem(): void{

    if (this.googleUser) {
      const formData = new FormData();
      
      // Add text fields to FormData
      formData.append('name', this.formItem.name);
      formData.append('description', this.formItem.description);
      formData.append('condition', this.formItem.condition);
      formData.append('categories', this.formItem.categories);
      formData.append('googleId', this.googleUser.id);

      // Add the file to FormData
      if (this.selectedFile) {
        formData.append('pic', this.selectedFile, this.selectedFile.name);
      }

      // Different method for handling multipart form-data in your BackendService
      this.backendService.addItemWithImage(formData).subscribe(response => {
        console.log(response);
        this.getAll();
        this.formItem = {} as Item;
        this.selectedFile = null; // Reset file input after upload
      });
    }
  }


}
