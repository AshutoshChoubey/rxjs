# Why Use Higher Order Observable? (RxJS in Angular)

A **higher order observable (HOO)** is an observable that emits other observables (streams of events). They allow us to compose complex async actions (like API calls triggered by user input) in a way that's more **declarative (expressing what to do, not how)**, easier to reason about, test, and maintain.

## Key Points Explained (with bracket terminology)

- **Without HOO:** You often end up with **nested subscribe** (anti-pattern – means subscribing to one observable inside another, leading to callback pyramid, messy cleanup, and error handling).
- **With HOO:** Use flattening operators like **switchMap, mergeMap, concatMap, exhaustMap** (higher order mapping operator – lets us map values to inner observables and automatically handles subscription, unsubscription, and flattening).

***

## Working Angular Example: Search Field

### 1. Without Higher Order Observable (Nested Subscribes)

```typescript
// app.component.ts

import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `<input [formControl]="searchControl" placeholder="Type to search">`,
})
export class AppComponent implements OnInit {
  searchControl = new FormControl();
  ngOnInit() {
    this.searchControl.valueChanges.subscribe(term => {
      this.fakeSearch(term).subscribe(results => {
        console.log('WITHOUT HOO:', results);
      });
    });
  }
  fakeSearch(term: string) {
    // Simulate HTTP (observable emitting after delay)
    return of(`Results for "${term}"`).pipe(delay(1000)); // (inner observable)
  }
}
```

**Explanation:**

- Each time input changes, a new subscription is made to `fakeSearch` (inner observable).
- If the user rapidly types 'A', 'AB', 'ABC', all three requests remain active.
- No cancellation of previous requests (can lead to race conditions, possible outdated data shown).

***

### 2. With Higher Order Observable (switchMap)

```typescript
// app.component.ts

import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { of } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `<input [formControl]="searchControl" placeholder="Type to search">`,
})
export class AppComponent implements OnInit {
  searchControl = new FormControl();
  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      switchMap(term => this.fakeSearch(term)) // (switchMap is a higher order operator)
    ).subscribe(results => {
      console.log('WITH HOO:', results);
    });
  }
  fakeSearch(term: string) {
    return of(`Results for "${term}"`).pipe(delay(1000));
  }
}
```

**Explanation:**

- When input changes, `switchMap` starts a new search and cancels any in-progress searches (automatic inner observable unsubscription).
- The console will show only the result for the latest input, preventing outdated data.
- No nested subscribes: only one `.subscribe` in code, error handling and cleanup easier.

***

## Advantages

- **Declarative code:** More readable, less nesting, cleaner.
- **Automatic cancellation:** (switchMap) Latest request wins, previous gets unsubscribed.
- **Centralized error handling:** All errors can be managed in one place.
- **Easier resource management:** RxJS manages subscription/unsubscription for you.
- **Modular and maintainable:** You can easily switch between different flattening strategies if requirements change.


## Disadvantages

- **Learning curve:** Understanding HOO and flattening operators can be tricky for beginners.
- **Wrong operator selection:** Picking the wrong operator (e.g., mergeMap for a search field) can create hidden bugs (like race conditions, out-of-order results).

***

### Technical Terms (Clarified in brackets)

- **Observable:** Stream of async events (RxJS core unit).
- **Higher Order Observable:** Observable emitting other observables.
- **Flattening Operator:** Operator that turns higher order observables into regular ones; e.g., switchMap, mergeMap.
- **Nested Subscribe Anti-pattern:** Manual subscription to an inner observable inside outer subscription (should avoid).
- **Race Condition:** Competing async operations result in unpredictable output, common without cancellation (e.g., outdated search results).
- **Declarative vs Imperative:** *Declarative* describes what should happen, *imperative* describes how to do it.

***

## Console Output Example

Just run either code above, type in the input, and watch the difference in console.

- *Without HOO:* Several "WITHOUT HOO: ..." logs, even for outdated terms.
- *With HOO:* Only the latest "WITH HOO: ..." shown, no outdated logs.

***

