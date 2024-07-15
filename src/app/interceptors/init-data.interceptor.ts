import { HttpInterceptorFn } from '@angular/common/http';
import { retrieveLaunchParams, initCloudStorage } from '@tma.js/sdk';

export const initDataInterceptor: HttpInterceptorFn = (req, next) => {


   const { initDataRaw, initData } = retrieveLaunchParams();
   const cloudStorage = initCloudStorage();
   cloudStorage
   .get('token')
   .then((value) => {
     console.log('token cloud', value);
     req = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${value}`
      }
    });
    return next(req);
   });
  if (initDataRaw) {
    req = req.clone({
      setHeaders: {
        'X-Telegram-Init-Data': initDataRaw,
        'X-Telegram-Uid': initData?.user?.id +''
      }
    });
  }

  return next(req);
};
