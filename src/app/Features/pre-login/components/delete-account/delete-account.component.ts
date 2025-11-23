


import { Component } from '@angular/core';
import { ApiEndpoints } from '../../../../core/constants/api-endpoints';
import { User } from '../../../auth/models/user.model';
import { PreLoginService } from '../../services/pre-login.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmPopupComponent } from '../../../../shared/components/confirm-popup/confirm-popup.component';

@Component({
  selector: 'app-delete-account',
  standalone: false,
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.css'
})
export class DeleteAccountComponent {
  username = '';
  password = '';
  userData?: User;

  constructor(
    private preLoginService: PreLoginService,
    private dialog: MatDialog
  ) { }

  onDeleteRequest() {
    if (!this.username || !this.password) return;

    this.preLoginService.login(this.username, this.password).subscribe({
      next: (user: User) => {
        this.userData = user;
      },
      error: () => {
      
      }
    });
  }

  confirmDeleteDialog() {
    this.dialog.open(ConfirmPopupComponent, {
      data: {
        type: 'confirm',
        messageKey: 'deleteAccountDialogText',
        showCancel: true
      },
      panelClass: 'dialog-warning',
      disableClose: true
    }).afterClosed().subscribe(res => {
      if (res?.result === 1) {
        this.deleteAccount();
      }
    });
  }

  private deleteAccount() {
    this.userData!.statusFl = 0 ;
    this.preLoginService.updateUser(this.userData!).subscribe({
      next: () => {
        this.dialog.open(ConfirmPopupComponent, {
          data: {
            type: 'success',
            messageKey: 'deleteAccountSuccessMessage'
          },
          panelClass: 'dialog-success',
          disableClose: true
        });
      },
      error: () => {
      
      }
    });
  }
}
