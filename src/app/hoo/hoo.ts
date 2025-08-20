import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { of, Subject } from 'rxjs';
import { delay, switchMap, mergeMap, concatMap, exhaustMap } from 'rxjs/operators';

@Component({
  selector: 'app-hoo',
  imports:[CommonModule],
  template: `
    <div>
      <button (click)="activate('switchMap')">Test switchMap</button>
      <button (click)="activate('mergeMap')">Test mergeMap</button>
      <button (click)="activate('concatMap')">Test concatMap</button>
      <button (click)="activate('exhaustMap')">Test exhaustMap</button>
    </div>
    <ul>
      <li *ngFor="let msg of messages">{{msg}}</li>
    </ul>
    <p>Open the console and click buttons several times quickly to see the difference!</p>
  `
})
export class Hoo {
  messages: string[] = [];
  private switchSubject = new Subject<number>();
  private mergeSubject = new Subject<number>();
  private concatSubject = new Subject<number>();
  private exhaustSubject = new Subject<number>();

  // Ensure count is unique for each operator
  private counter = {switchMap: 1, mergeMap: 1, concatMap: 1, exhaustMap: 1};

  constructor() {
    this.switchSubject.pipe(
      switchMap(v => this.simulateRequest('switchMap', v))
    ).subscribe(msg => this.render(msg));
    
    this.mergeSubject.pipe(
      mergeMap(v => this.simulateRequest('mergeMap', v))
    ).subscribe(msg => this.render(msg));
    
    this.concatSubject.pipe(
      concatMap(v => this.simulateRequest('concatMap', v))
    ).subscribe(msg => this.render(msg));
    
    this.exhaustSubject.pipe(
      exhaustMap(v => this.simulateRequest('exhaustMap', v))
    ).subscribe(msg => this.render(msg));
  }

  activate(type: 'switchMap'|'mergeMap'|'concatMap'|'exhaustMap') {
    // Simulate several quick clicks
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const index = this.counter[type]++;
        switch(type) {
          case 'switchMap': this.switchSubject.next(index); break;
          case 'mergeMap': this.mergeSubject.next(index); break;
          case 'concatMap': this.concatSubject.next(index); break;
          case 'exhaustMap': this.exhaustSubject.next(index); break;
        }
      }, i * 100);
    }
  }

  simulateRequest(op: string, val: number) {
    const time = Math.floor(500 + Math.random() * 2000);
    const msg = `[${op}] STARTED #${val} (will finish in ${time}ms)`;
    console.log(msg);
    return of(`[${op}] COMPLETED #${val} (${time}ms)`).pipe(
      delay(time)
    );
  }

  render(msg: string) {
    this.messages = [msg, ...this.messages].slice(0, 10);
    console.log(msg);
  }
}


