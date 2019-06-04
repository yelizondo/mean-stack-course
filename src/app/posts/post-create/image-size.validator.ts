import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

export const sizeValidator = (
  control: AbstractControl
): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  if (typeof(control.value) === 'string') {
    return of(null);
  }
  const file = control.value as File;
  const fileReader = new FileReader();
  const frObs = Observable.create(
    (observer: Observer<{ [key: string]: any }>) => {
      fileReader.addEventListener('loadend', () => {
        let isValid = false;

        // Set the file size limit
        if (file.size <= 150000) {
          isValid = true;
        }

        if (isValid) {
          observer.next(null);
        } else {
          observer.next({ invalidSize: true });
        }
        observer.complete();
      });
      fileReader.readAsArrayBuffer(file);
    }
  );
  return frObs;
};
