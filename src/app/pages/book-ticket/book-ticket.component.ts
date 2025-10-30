import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe, NgFor, NgIf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-book-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, NgFor, NgIf, NgClass],
  templateUrl: './book-ticket.component.html',
  styleUrls: ['./book-ticket.component.css'],
})
export class BookTicketComponent implements OnInit {
  busDetails: any = {};

  // ✅ Used by your HTML
  leftSeatPairs: any[][] = [];
  rightSeatPairs: any[][] = [];

  selectedSeats: { number: string; index: number }[] = [];

  user = { name: '', email: '', phone: '' };

  subTotal = 0;
  taxAmount = 0;
  totalAmount = 0;

  modalTitle = '';
  modalMessage = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const scheduleId = params['id'];
      this.busDetails = {
        scheduleId,
        vendorId: 85,
        busName: 'Palanquin Express',
        busVehicleNo: 'MH49 CD2324',
        fromLocationName: 'Pune',
        toLocationName: 'Nagpur',
        departureTime: '2025-05-04T08:45:23.403',
        arrivalTime: '2025-05-04T20:45:23.403',
        scheduleDate: '2025-05-04T08:45:23.403',
        price: 1000,
        totalSeats: 40,
      };

      this.generateSeatLayout();
    });
  }

  /** ✅ Generates seat layout like:
   *  12   34
   *  56   78
   *  910  1112
   */
  generateSeatLayout() {
    const totalSeats = this.busDetails.totalSeats || 40;

    const leftSeats: any[] = [];
    const rightSeats: any[] = [];

    // Create all seat objects
    for (let i = 1; i <= totalSeats; i++) {
      const seat = this.createSeat(i);
      // Left column gets 1,2 then 5,6 then 9,10 etc.
      // Right column gets 3,4 then 7,8 then 11,12 etc.
      if (i % 4 === 1 || i % 4 === 2) leftSeats.push(seat);
      else rightSeats.push(seat);
    }

    // Group into pairs for 2-column vertical layout
    this.leftSeatPairs = this.groupIntoPairs(leftSeats);
    this.rightSeatPairs = this.groupIntoPairs(rightSeats);
  }

  /** Groups array items into pairs: [ [1,2], [3,4], [5,6] ] */
  private groupIntoPairs(seats: any[]): any[][] {
    const pairs: any[][] = [];
    for (let i = 0; i < seats.length; i += 2) {
      pairs.push(seats.slice(i, i + 2));
    }
    return pairs;
  }

  private createSeat(num: number) {
    return {
      number: String(num),
      selected: false,
      disabled: false,
      index: num - 1,
    };
  }

  toggleSeat(seat: any, evt?: Event) {
    if (seat.disabled) return;
    seat.selected = !seat.selected;
    this.updateSelectedSeats();
    this.calculateFare();
    if (evt) evt.stopPropagation();
  }

  updateSelectedSeats() {
    const allSeats = [
      ...this.leftSeatPairs.flat(),
      ...this.rightSeatPairs.flat(),
    ];
    this.selectedSeats = allSeats
      .filter((s) => s.selected)
      .map((s) => ({ number: s.number, index: s.index }));
  }

  calculateFare() {
    this.subTotal =
      (this.selectedSeats.length || 0) * (this.busDetails.price || 0);
    this.taxAmount = Math.round(this.subTotal * 0.05);
    this.totalAmount = this.subTotal + this.taxAmount;
  }

  proceedToPay() {
    if (!this.user.name || !this.user.email || !this.user.phone) {
      this.showPopup(
        'Missing Details',
        'Please fill passenger name, email, and phone.'
      );
      return;
    }

    if (!this.selectedSeats.length) {
      this.showPopup(
        'No Seats Selected',
        'Please select at least one seat before proceeding.'
      );
      return;
    }

    this.showPopup(
      'Proceeding to Payment',
      `You are booking ${this.selectedSeats.length} seat(s) for ₹${this.totalAmount}.`
    );
  }

  showPopup(title: string, message: string) {
    this.modalTitle = title;
    this.modalMessage = message;

    const modalEl = document.getElementById('popupModal');
    if (!modalEl) {
      console.error('Modal element not found in DOM');
      return;
    }

    // Show bootstrap modal
    if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
      const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();
    } else {
      alert(`${title}\n\n${message}`); // fallback
    }
  }

  onSeatKey(event: KeyboardEvent, seat: any) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleSeat(seat);
    }
  }
}
