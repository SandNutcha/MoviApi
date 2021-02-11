import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ServiceService } from './sevices/service.service'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { NotifierService } from "angular-notifier";
import { faCartPlus, faShoppingCart, faMinusCircle, faTimes, faCalendarDay, faStar, faFile } from '@fortawesome/free-solid-svg-icons'

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { CountdownComponent } from 'ngx-countdown';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {

  @ViewChild('countdown') counter!: CountdownComponent;


  title = 'MovieApi';

  // fontawesome
  faSearch = faSearch;
  faCartPlus = faCartPlus;
  faShoppingCart = faShoppingCart;
  faMinusCircle = faMinusCircle;
  faTimes = faTimes
  faCalendarDay = faCalendarDay;
  faStar = faStar;
  faFile = faFile

  term: any;

  movieData!: any;
  movieArray!: Array<any>;

  private notifier: NotifierService;

  movieInCart!: Array<any>
  closeResult = '';


  public constructor(private api: ServiceService, notifierService: NotifierService, private modalService: NgbModal) {
    this.notifier = notifierService;
  }

  ngOnInit() {
    this.api.apiCall().subscribe(data => {
      this.movieData = data.valueOf()
      this.movieArray = this.movieData['results']
    })

    if (localStorage.getItem('movieInCart') != null) {
      this.movieInCart = JSON.parse(localStorage.getItem('movieInCart') || '{}')
      console.log(this.movieInCart)
    } else {
      this.movieInCart = []
    }
    // this.totalPrice()
  }

  addCart(movieTitle: string) {
    this.movieInCart.push(movieTitle)
    localStorage.setItem('movieInCart', JSON.stringify(this.movieInCart));
    this.showNotification('Add: ' + movieTitle, 'success')
  }

  removeCart(movieTitle: string, removeAll: boolean) {
    if (removeAll) {
      this.movieInCart = []
      localStorage.setItem('movieInCart', JSON.stringify(this.movieInCart));
      this.showNotification('Remove All', 'error')
    } else {
      this.movieInCart = this.movieInCart.filter(e => e !== movieTitle);
      localStorage.setItem('movieInCart', JSON.stringify(this.movieInCart));
      localStorage.removeItem(movieTitle)
      this.showNotification('Remove: ' + movieTitle, 'error')
    }
  }

  check(movieTitle: string) {
    return this.movieInCart.some(item => item === movieTitle)
  }

  addPrice(movieTitle: string, moviePrice: any) {
    if (moviePrice.value != '') {
      this.modalService.dismissAll();
      this.addCart(movieTitle)
      localStorage.setItem(movieTitle, moviePrice.value);
    } else {
      alert("price")
    }
  }

  showPrice(movieTitle: string) {
    return JSON.parse(localStorage.getItem(movieTitle) || '{}')
  }

  totalPrice() {
    let total = 0
    for (let i = 0; i < this.movieInCart.length; i++) {
      total += JSON.parse(localStorage.getItem(this.movieInCart[i]) || '{}')
    }
    return (total)
  }

  discountPrice() {
    if (this.movieInCart.length > 5) {
      return this.totalPrice() * (20 / 100)
    } else if (this.movieInCart.length > 3) {
      return this.totalPrice() * (10 / 100)
    } else {
      return 0
    }
  }



  // Notification
  public showNotification(movieTitle: string, type: string): void {
    this.notifier.notify(type, movieTitle);
  }

  // Modal
  openModal(content: any) {
    this.modalService.dismissAll();
    this.modalService.open(content, { centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onTimerFinished(event: any) {
    if (event.action == "done") {
      this.modalService.dismissAll()
      this.showNotification('Time Out', 'error')
    }
  }


}
