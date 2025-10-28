export class Search {
    fromlocationId : string;
    tolocationId : string;
    date:string;


    constructor(){
        this.fromlocationId = "";
        this.tolocationId = "";
        this.date = "";
    }

    
}

export interface ISearchBus {
  availableSeats: number
  totalSeats: number
  price: number
  arrivalTime: string
  scheduleId: number
  departureTime: string
  busName: string
  busVehicleNo: string
  fromLocationName: string
  toLocationName: string
  vendorName: string
  scheduleDate: string
  vendorId: number
}

