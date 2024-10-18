import { Component, Input, input } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { User } from '../../models/user';
import { Item } from '../../models/item';
import { FormsModule } from '@angular/forms';
import { ChatComponent } from '../chat/chat.component';
import { UserComponent } from '../user/user.component';
import { GetlocationService } from '../../services/getlocation.service';
import { HttpHeaders } from '@angular/common/http';
import { retryWhen, mergeMap, timer, throwError, catchError } from 'rxjs';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [FormsModule, ChatComponent, UserComponent],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css'
})
export class ItemComponent {
  
  lat:number |null =null;
  long:number |null =null;
  http: any;
  constructor(private backendService: BackendService, private socialAuthServiceConfig: SocialAuthService, private userComponent: UserComponent,private getlocationservice:GetlocationService){}
  @Input() googleUser: User = {} as User;

  
  allItems: Item[] = [];
  userProfile: User = {} as User;
  
  formItem: Item = {} as Item;
  
  selectedCondition: string = "";
  selectedCategory: string = "";

  selectedFile: File | null = null;  // For the selected file
  imageUrl: string | null = null;  // To store the uploaded image URL
 
  
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

  ngOnInit(){
    this.getAll();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.backendService.getImgurClientId().subscribe(response => {
      const imgurClientId = response.clientId;
      
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('image', this.selectedFile);
  
        const headers = new HttpHeaders({
          Authorization: `Client-ID ${imgurClientId}`
        });
  
        this.http.post('https://api.imgur.com/3/image', formData, { headers })
          .subscribe((imgurResponse: { [x: string]: { [x: string]: any; }; }) => {
            console.log('Imgur upload success', imgurResponse);
            const imageUrl = imgurResponse['data']['link'];
            this.formItem.pic = imageUrl;
          }, (error: any) => {
            console.error('Imgur upload failed', error);
          });
      }
    });
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

  uploadImageAndAddItem() {
    if (this.selectedFile) {
      console.log('File selected for upload:', this.selectedFile);
  
      const observer = {
        next: (response: any) => {
          console.log('Image upload response:', response);
          if (response && response.data && response.data.link) {
            this.imageUrl = response.data.link;
            console.log('Image URL set:', this.imageUrl);
            this.addItem();
          } else {
            console.error('Error: Image URL not found in the response');
            alert('Failed to upload image. Please try again.');
          }
        },
        error: (err: any) => {
          console.error('Image upload failed:', err);
          alert('Image upload failed. Please check your file and try again.');
        },
        complete: () => console.log('Image upload complete')
      };
  
      this.backendService.uploadImage(this.selectedFile).subscribe(observer);
    } else {
      console.warn('No file selected for upload.');
      this.addItem();
    }
  }

  addItem(){
    this.formItem.googleId = this.googleUser.googleId;
    this.formItem.categories = this.selectedCategory; 
    this.formItem.condition = this.selectedCondition;
    this.formItem.pic = this.imageUrl || '';
    this.backendService.addItem(this.formItem).subscribe(response=>{
      console.log(response);
      this.getAll();
      this.formItem = {} as Item;
      this.imageUrl = null;
    });
}

uploadImage(imageFile: File) {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  this.backendService.uploadImage(imageFile).pipe(
    retryWhen(errors =>
      errors.pipe(
        mergeMap(error => {
          if (error.status === 429) {
            const retryAfter = parseInt(error.headers.get('Retry-After'), 10) || 60;
            console.log(`429 Too Many Requests. Retrying after ${retryAfter} seconds.`);
            return timer(retryAfter * 1000); 
          }
          return throwError(error);
        })
      )
    ),
    catchError(error => {
      console.error('Image upload failed:', error);
      return throwError(error);
    })
  ).subscribe(response => {
    console.log('Image uploaded successfully:', response);
  });
}


getCoordinates():void {
  if (!this.formItem.geoCode) {
    alert('Please enter an address.');
    return;
  }
  this.getlocationservice.getLocation(this.formItem.geoCode).subscribe(response =>{
    console.log(response);
    const location = response.results[0].geometry.location;
    this.lat = location.lat;
    this.long = location.lng;
    this.formItem.geoCode = `${this.lat},${this.long}`;

  })
}

 openLocation(geoCode: string): void {
 const googleMapsUrl = `https://www.google.com/maps/place/${geoCode}`;
   window.open(googleMapsUrl, '_blank');
}


}