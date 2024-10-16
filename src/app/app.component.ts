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
  // selectedFile: File | null = null;

  
  selectedCondition: string = "";
  selectedCategory: string = "";
  
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

  condition = [
    {value: "option1", label: "Mint"},
    {value: "option2", label: "Like New"},
    {value: "option3", label: "Used"},
    {value: "option4", label: "Worn"},
    {value: "option5", label: "Broken"}
  ];

  foodCondition = [
    {value: "option1", label: "Perishable"},
    {value: "option2", label: "Non-Perishable"}
  ];

  
  // onFileSelected(event: any): void {
  //   this.selectedFile = event.target.files[0];
  // }

  // addItemWithImage(): void {
  //   const formData = new FormData();
  //   formData.append('file', this.selectedFile as File);
  //   formData.append('name', this.formItem.name);
  //   formData.append('description', this.formItem.description);
  //   formData.append('condition', this.selectedCondition);
  //   formData.append('category', this.selectedCategory);
    
  //   this.backendService.addItemWithImage(formData).subscribe(response => {
  //     console.log('Item added successfully', response);
  //     this.getAll();
  //   });
  // }

  

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
