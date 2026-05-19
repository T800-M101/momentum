import { CanDeactivateFn } from '@angular/router';

export interface HasPendingChanges {
  canDeactivate: () => boolean | Promise<boolean>;
}

export const pendingChangesGuard: CanDeactivateFn<HasPendingChanges> = (component) => {
  return component.canDeactivate ? component.canDeactivate() : true;
};
