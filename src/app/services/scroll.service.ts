import { Injectable } from '@angular/core';
import { BehaviorSubject, shareReplay, skip } from 'rxjs';
import { ObserveElementRef, StateObserveElement } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  constructor() { }

  observeElement(element: Element, parent: Element): ObserveElementRef {
    let closeObserve = () => {};

    const state = new BehaviorSubject<StateObserveElement>({ countObserve: 0, elementVisible: false });

    const observer = new IntersectionObserver((entries, observer) => {
      closeObserve = () => {
        observer.disconnect();
      };

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          state.next({ countObserve: state.value.countObserve + 1, elementVisible: true });
        } else {
          state.next({ countObserve: state.value.countObserve, elementVisible: false });
        }
      });
    }, { root: parent });

    observer.observe(element);

    return {
      value$: state.pipe(
        skip(1),
        shareReplay(1)
      ),
      elementVisible$: state.pipe(
        skip(2),
        shareReplay(1)
      ),
      closeObserve: () => closeObserve()
    };
  }
}
