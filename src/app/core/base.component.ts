import { OnDestroy, Component } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Component({
  template: ''
})
export abstract class BaseComponent implements OnDestroy {
  private isAlive$ = new Subject<any>();

  /**
   * Auto-unsubscribe all subscriptions
   */
  public ngOnDestroy() {
    this.isAlive$.next();
    this.isAlive$.complete();
  }

  protected unsubsribeOnDestroy = (source: Observable<any>): Observable<any> => {
    return source.pipe(
      takeUntil(this.isAlive$)
    );
  }
}
