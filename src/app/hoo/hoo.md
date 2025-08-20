
# RxJS Flattening Operators: The Complete Guide

These four operators are the most commonly confused in RxJS interviews. Here's how to never forget them again with practical examples.

## The Core Concept

All four operators **flatten** observables - they take an observable that emits other observables and merge them into a single stream. The difference is **how** they handle multiple inner observables.

## 🔄 switchMap - "Cancel Previous, Keep Latest"

**Mental Model:** Like switching TV channels - you only see the current channel.

```typescript
// Search as user types
fromEvent(searchInput, 'input')
  .pipe(
    debounceTime(300),
    switchMap(event => searchAPI(event.target.value))
  )
  .subscribe(results => displayResults(results));
```

**What happens:**

- User types "re" → API call starts
- User types "red" → Previous call **cancelled**, new call starts
- User types "redux" → Previous call **cancelled**, new call starts

**Use Cases:**

- Search suggestions
- Auto-complete
- Navigation (route changes)


## 🚀 mergeMap - "Run Everything in Parallel"

**Mental Model:** Like opening multiple browser tabs - all requests run simultaneously.

```typescript
// Upload multiple files
fromEvent(fileInput, 'change')
  .pipe(
    mergeMap(event => {
      const files = Array.from(event.target.files);
      return files.map(file => uploadFile(file));
    })
  )
  .subscribe(response => showUploadProgress(response));
```

**What happens:**

- Select 3 files → All 3 uploads start **immediately**
- Results arrive in **any order** (fastest first)

**Use Cases:**

- File uploads
- Parallel API calls
- Real-time data streams


## ⏳ concatMap - "Wait Your Turn, One at a Time"

**Mental Model:** Like a queue at the bank - one customer served at a time.

```typescript
// Process orders sequentially
orderQueue$
  .pipe(
    concatMap(order => processPayment(order))
  )
  .subscribe(result => updateOrderStatus(result));
```

**What happens:**

- Order 1 arrives → Payment processing starts
- Order 2 arrives → **Waits** for Order 1 to complete
- Order 3 arrives → **Waits** for Order 2 to complete

**Use Cases:**

- Payment processing
- Database transactions
- Animation sequences


## 🚫 exhaustMap - "Busy? Ignore New Requests"

**Mental Model:** Like a busy cashier - ignores customers while serving current one.

```typescript
// Prevent double-click on login
fromEvent(loginButton, 'click')
  .pipe(
    exhaustMap(() => loginAPI(credentials))
  )
  .subscribe(response => handleLoginResponse(response));
```

**What happens:**

- First click → Login API call starts
- Rapid clicks → **Completely ignored** until first call completes
- After completion → Next click will work

**Use Cases:**

- Form submissions
- Button click prevention
- Modal dialogs


## 📝 Quick Reference Card

| Operator | Behavior | Use Case | Memory Trick |
| :-- | :-- | :-- | :-- |
| **switchMap** | Cancel previous, keep latest | Search, navigation | TV channel switching |
| **mergeMap** | Run all in parallel | File uploads, parallel calls | Highway merge |
| **concatMap** | Queue and run sequentially | Payments, animations | Bank queue |
| **exhaustMap** | Ignore new while busy | Button spam prevention | Busy cashier |

## 🎯 Interview Tips

**Key Questions to Ask Yourself:**

1. **Do I care about previous results?** → No = `switchMap`, Yes = others
2. **Can operations run simultaneously?** → Yes = `mergeMap`, No = others
3. **Does order matter?** → Yes = `concatMap`, No = `exhaustMap`
4. **Should I ignore rapid triggers?** → Yes = `exhaustMap`

**Common Pitfalls:**

- Using `mergeMap` for search (creates race conditions)
- Using `switchMap` for file uploads (cancels ongoing uploads)
- Using `concatMap` when order doesn't matter (unnecessary delays)

**Remember:** The operator name often hints at the behavior - *switch*, *merge*, *concat* (concatenate), *exhaust* (ignore when tired).

