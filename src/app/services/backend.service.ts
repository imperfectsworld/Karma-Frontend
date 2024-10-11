import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { Item } from '../models/item';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  url: string = environment.apiDomain;
  constructor(private http: HttpClient) { }

  getAllItems():Observable<Item[]>{
    return this.http.get<Item[]>(`https://karmabackend.azurewebsites.net/api/Item`)
  }

  addItem(i:Item):Observable<Item>{
    return this.http.post<Item>(`https://karmabackend.azurewebsites.net/api/Item`, i)
  }

  addUser(u:User):Observable<User>{
    return this.http.post<User>(`https://karmabackend.azurewebsites.net/api/User`, u)
  }

}
