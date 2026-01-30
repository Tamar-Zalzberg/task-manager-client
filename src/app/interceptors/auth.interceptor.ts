import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // שליפת הטוקן מהזיכרון המקומי
  const token = localStorage.getItem('token');

  // אם יש טוקן, משכפלים את הבקשה ומוסיפים לה את הכותרת
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  // אם אין טוקן, ממשיכים כרגיל
  return next(req);
};