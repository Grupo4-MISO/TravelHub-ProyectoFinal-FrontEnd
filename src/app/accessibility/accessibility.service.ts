import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AccessibilityService {
  private fontSizeSubject = new BehaviorSubject<number>(0);
  private contrastSubject = new BehaviorSubject<boolean>(false);
  private cursorSubject = new BehaviorSubject<boolean>(false);

  fontSize$: Observable<number> = this.fontSizeSubject.asObservable();
  contrast$: Observable<boolean> = this.contrastSubject.asObservable();
  cursor$: Observable<boolean> = this.cursorSubject.asObservable();

  cycleFontSize(): void {
    const next = (this.fontSizeSubject.value + 1) % 3;
    this.fontSizeSubject.next(next);
    document.body.classList.remove('accessibility-font-level-1', 'accessibility-font-level-2');
    if (next > 0) {
      document.body.classList.add(`accessibility-font-level-${next}`);
    }
  }

  toggleContrast(): void {
    const next = !this.contrastSubject.value;
    this.contrastSubject.next(next);
    document.body.classList.toggle('accessibility-high-contrast', next);
  }

  toggleCursor(): void {
    const next = !this.cursorSubject.value;
    this.cursorSubject.next(next);
    document.body.classList.toggle('accessibility-cursor-large', next);
  }
}
