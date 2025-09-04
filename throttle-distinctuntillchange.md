
# 📘 RxJS Operators Explained with Examples

When working with user interactions (typing, scrolling, clicking), events can fire too fast or too often.  
Without handling them, apps become slow, buggy, or spammy.

RxJS provides operators like **`debounceTime`**, **`throttleTime`**, **`exhaustMap`**, and **`distinctUntilChanged`** to manage these events in a clean way.

---

## 1. ✨ Debounce – The Listener Who Waits

**Idea:**  
Wait until the user has stopped for a certain time, then emit the value.

**Perfect for:**
- Search input boxes
- Autocomplete suggestions
- “Wait until typing is done”

**Example – Search Box**

```ts
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

const input = document.getElementById('search') as HTMLInputElement;

fromEvent(input, 'input')
  .pipe(
    map((event: any) => event.target.value),
    debounceTime(500) // wait 500ms of silence
  )
  .subscribe(value => {
    console.log('API call with:', value);
  });
````

👉 Behavior: If the user types `h-e-l-l-o` quickly, it will only call API once after they stop typing.

---

## 2. ⚡ Throttle – The Timekeeper

**Idea:**
Take the first event, then ignore the rest for a fixed period.

**Perfect for:**

* Scroll events
* Mouse move events
* Buttons where too many clicks flood the system

**Example – Scroll Event**

```ts
import { fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

const box = document.getElementById('scrollBox');

fromEvent(box, 'scroll')
  .pipe(
    throttleTime(2000) // allow only 1 event every 2s
  )
  .subscribe(() => {
    console.log('Scroll event processed at', new Date().toLocaleTimeString());
  });
```

👉 Behavior: Even if the user keeps scrolling, it only prints once every 2 seconds.

---

## 3. 🔒 ExhaustMap – The Gatekeeper

**Idea:**
Accept the first request, ignore all others until it finishes.

**Perfect for:**

* Login button
* Payment or form submission
* Any request that should only run once at a time

**Example – Login Button**

```ts
import { fromEvent, of } from 'rxjs';
import { exhaustMap, delay } from 'rxjs/operators';

const btn = document.getElementById('loginBtn');

fromEvent(btn, 'click')
  .pipe(
    exhaustMap(() => {
      console.log('API call started...');
      return of('API response').pipe(delay(3000)); // mock 3s API
    })
  )
  .subscribe(res => {
    console.log('API call finished with:', res);
  });
```

👉 Behavior:

* First click → ✅ Starts API call
* Extra clicks during API call → ❌ Ignored
* After completion → ✅ Next click allowed

---

## 4. 🔁 DistinctUntilChanged – The Duplicate Filter

**Idea:**
Ignore values if they are the same as the previous one.

**Perfect for:**

* Search boxes (avoid duplicate queries)
* State changes (only act when value actually changes)
* Prevent redundant API calls

**Example – Search Box with Duplicate Filter**

```ts
import { fromEvent } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

const input = document.getElementById('search') as HTMLInputElement;

fromEvent(input, 'input')
  .pipe(
    map((event: any) => event.target.value),
    distinctUntilChanged() // ignore same values
  )
  .subscribe(value => {
    console.log('API call with:', value);
  });
```

👉 Typing `hello`, then deleting and typing `hello` again → will not trigger a new API call because the value hasn’t changed.

---

## 5. 🧩 Putting It All Together

Imagine a search box with smart handling:

* **Debounce:** Wait until typing stops.
* **DistinctUntilChanged:** Only search when input changes.
* **Throttle:** Don’t allow too many calls per second.
* **ExhaustMap:** Ensure only one request runs at a time.

**Combined Example**

```ts
import { fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, throttleTime, exhaustMap } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

const input = document.getElementById('search') as HTMLInputElement;

fromEvent(input, 'input')
  .pipe(
    map((event: any) => event.target.value),
    debounceTime(500),           // wait for user to stop typing
    distinctUntilChanged(),      // only new terms
    throttleTime(1000),          // 1 request per second
    exhaustMap(query =>          // ignore new ones while fetching
      ajax.getJSON(`/api/search?q=${query}`)
    )
  )
  .subscribe(result => {
    console.log('Search results:', result);
  });
```

---

## 🎯 Summary Table

| Operator               | What it does                            | Example Use Case            |
| ---------------------- | --------------------------------------- | --------------------------- |
| `debounceTime`         | Wait until events stop for X ms         | Typing in search box        |
| `throttleTime`         | Allow 1 event per X ms                  | Scroll / mouse move         |
| `exhaustMap`           | First request runs, others ignored      | Login / form submission     |
| `distinctUntilChanged` | Ignore duplicates, only emit if changed | Prevent duplicate API calls |

---

