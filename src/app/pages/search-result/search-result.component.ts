import { Component, inject } from '@angular/core';
import { NgIf, NgFor, NgClass, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ISearchBus, Search } from '../../model/model';
import { SearchService } from '../../service/search.service';

@Component({
  selector: 'app-search-result',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, RouterLink],
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent {
  buses: any[] = [];
  searchObj : Search = new Search;
  activatedRoute = inject(ActivatedRoute);
  searchService = inject(SearchService);
  searchData: ISearchBus[] = [];
  busList: any;

  

  constructor(){
    this.activatedRoute.params.subscribe((res:any)=>{
    console.log(res);
    this.searchObj.fromlocationId = res.from;
    this.searchObj.tolocationId = res.to;
    this.searchObj.date = res.date; 
    this.getSearchResults();
    console.log("Check 1");

  })
}

getSearchResults(){
  this.searchService.searchBus(this.searchObj.fromlocationId,this.searchObj.tolocationId,this.searchObj.date).subscribe((res:any)=>{
    console.log("Check 22");

    console.log(res);
    this.searchData = res;
  });
}

trackById(index: number, item: any): number {
  return item.scheduleId;
}

}
