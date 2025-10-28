import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }

  searchBus(fromId:string, toId:string, date:string){
    return this.http.get("https://api.freeprojectapi.com/api/BusBooking/searchBus2?fromLocation="+fromId+"&toLocation="+toId+"&travelDate="+date+"");
  }

}
