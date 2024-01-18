import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, tap } from 'rxjs';
import { ScrollService } from '../services/scroll.service';
import { ObserveElementRef, StateObserveElement } from '../models';

@Directive({
  selector: '[elementVisible]',
  exportAs: 'elementVisible'
})
export class ElementObserverDirective implements OnInit, OnDestroy {

  @Input({ required: true }) portal!: Element;
  @Input({ required: true }) activeClass!: string;
  @Input() showOnce: boolean = false;
  public state$!: Observable<StateObserveElement>;
  private _observeRef!: ObserveElementRef;
  private _subs: Subscription = new Subscription();

  constructor(
    private readonly _el: ElementRef,
    private readonly _scrollService: ScrollService
  ) { }

  ngOnInit(): void {
    const portalNode = this.portal;
    const elementNode = this._el.nativeElement;

    this._observeRef = this._scrollService.observeElement(elementNode, portalNode);
    this.state$ = this._observeRef.value$;

    const subsValue = this._observeRef.value$.subscribe(stateObserveElement => {
      if (this.showOnce === false) this._toggleElement(portalNode, stateObserveElement);
    });

    const subsElementVisible = this._observeRef.elementVisible$.subscribe(stateObserveElement => {
      if (this.showOnce === true) {
        this._toggleElement(portalNode, stateObserveElement);
        this._destroy();
      }
    });

    this._subs.add(subsElementVisible);
    this._subs.add(subsValue);
  }

  private _toggleElement(portalNode: Element, { elementVisible }: StateObserveElement): void {
    if (elementVisible) {
      portalNode.classList.add(this.activeClass);
    } else {
      portalNode.classList.remove(this.activeClass);
    }
  }

  ngOnDestroy(): void {
    this._destroy();
  }

  private _destroy(): void {
    this._observeRef.closeObserve();
    this._subs.unsubscribe();
  }

}
