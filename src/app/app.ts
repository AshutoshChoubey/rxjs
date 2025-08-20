import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { Hoo } from './hoo/hoo';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, Hoo],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  searchControl = new FormControl();
  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      switchMap(term => {
        console.log("It  is comes from the outer Observable:", term);
       return this.fakeSearch(term)
      }) // (switchMap is a higher order operator)
    ).subscribe(results => {
      console.log('WITH HOO:', results);
    });
  }
  fakeSearch(term: string) {
    // Simulate HTTP (observable emitting after delay)
    return of(`Results for "${term}"`).pipe(delay(1000)); // (inner observable)̉
  }

  // ngOnInit() {
  //   this.searchControl.valueChanges.subscribe(term => {
  //     this.fakeSearch(term).subscribe(results => {
  //       console.log('WITHOUT HOO:', results);
  //     });
  //   });
  // }


}
