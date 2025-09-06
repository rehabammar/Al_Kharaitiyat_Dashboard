// confirm-popup.component.ts
export type DialogType = 'confirm' | 'error' | 'success' | 'info' | 'warning';

export interface ConfirmDialogData {
  type?: DialogType;                      // default: 'confirm'
  message?: string;                       // plain text (or use messageKey for i18n)
  messageKey?: string;                    // e.g. 'message.areYouSure'
  okLabel?: string;                       // defaults vary by type
  cancelLabel?: string;                   // defaults vary by type
  showCancel?: boolean;                   // ignored for success/info unless you set it true
  autoCloseMs?: number;                   // e.g. 2000 for success/info to auto close
  details?: string;                       // optional extra text (stacktrace etc.)
  icon?: string;                          // override icon if you want
}
