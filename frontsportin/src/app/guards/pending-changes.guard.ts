import { Injectable, inject } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { ModalService } from '../component/shared/modal/modal.service';
import { Observable, map } from 'rxjs';
import { ConfirmDialogComponent } from '../component/shared/confirm-dialog/confirm-dialog.component';

export interface CanComponentDeactivate {
  canDeactivate?: () => Observable<boolean> | Promise<boolean> | boolean;
  // fallback: component may expose a FormGroup named blogForm
}

@Injectable({ providedIn: 'root' })
export class PendingChangesGuard implements CanDeactivate<CanComponentDeactivate> {
  private readonly modalService = inject(ModalService);

  canDeactivate(component: CanComponentDeactivate): Observable<boolean> | Promise<boolean> | boolean {
    // prefer explicit canDeactivate on the component
    if (component && component.canDeactivate) {
      return component.canDeactivate();
    }

    // fallback: check blogForm.dirty
    const form = (component as any)?.blogForm;
    if (form && form.dirty) {
      const ref = this.modalService.open<{ title?: string; message?: string }, boolean>(
        ConfirmDialogComponent,
        {
          data: {
            title: 'Cambios sin guardar',
            message: 'Hay cambios sin guardar. ¿Desea salir sin guardar los cambios?'
          }
        }
      );
      return ref.afterClosed$.pipe(map(r => r === true));
    }

    return true;
  }
}
