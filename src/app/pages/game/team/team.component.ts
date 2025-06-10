import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FailIndicatorComponent } from './fail-indicator/fail-indicator.component';

@Component({
  selector: 'app-team',
  styleUrls: ['team.component.scss'],
  templateUrl: './team.component.html',
  imports: [FailIndicatorComponent],
})
export class TeamComponent {
  @Input() icon: string;
  @Input() count: number = 0;
  @Input() fails: number = 0;
  @Input() maxFails: number = 3;
  @Input() name: string;


  @Output() failed: EventEmitter<void> = new EventEmitter();
}
