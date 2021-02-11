import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  name: any;

  constructor(private http: HttpClient) { }

  apiCall() {
    return this.http.get('https://api.themoviedb.org/3/search/movie?api_key=5900c1902eff818a094a42889d937d21&query=a')
  }
}
