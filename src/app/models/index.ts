import { Observable } from "rxjs";

export interface StateObserveElement {
  countObserve: number;
  elementVisible: boolean;
}

export interface ObserveElementRef {
  value$: Observable<StateObserveElement>;
  elementVisible$: Observable<StateObserveElement>;
  closeObserve: () => void
}
