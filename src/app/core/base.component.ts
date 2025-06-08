import { OnDestroy, Component } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Component({
  template: '',
  standalone: false,
})
export abstract class BaseComponent implements OnDestroy {
  private isAlive$ = new Subject<void>();

  /**
   * Auto-unsubscribe all subscriptions
   */
  public ngOnDestroy() {
    this.isAlive$.next();
    this.isAlive$.complete();
  }

  protected unsubscribeOnDestroy = (
    source: Observable<any>
  ): Observable<any> => {
    return source.pipe(takeUntil(this.isAlive$));
  };
}
