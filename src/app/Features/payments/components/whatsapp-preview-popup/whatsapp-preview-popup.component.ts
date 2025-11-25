import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommunicationService } from '../../../communication/services/communication.service';
import { ConfirmPopupComponent } from '../../../../shared/components/confirm-popup/confirm-popup.component';

@Component({
  selector: 'app-whatsapp-preview-popup',
  standalone: false,
  templateUrl: './whatsapp-preview-popup.component.html',
  styleUrl: './whatsapp-preview-popup.component.css'
})
export class WhatsappPreviewPopupComponent {

  messageTemplate: string = '';
  finalMessages: { number: string, message: string, userFk: number }[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<WhatsappPreviewPopupComponent>,
    private communicationService: CommunicationService,
    private dialog: MatDialog
  ) {
    if (data.type === 'teacher') {
      this.buildTeacherMessages();
    } else {
      this.buildStudentMessages();
    }
  }


  /** تجهيز الرسائل */
  buildStudentMessages() {

    const grouped: Record<string, any[]> = {};

    this.data.rows.forEach((row: any) => {
      const num = row.whatsappNumber;
      if (!grouped[num]) grouped[num] = [];
      grouped[num].push(row);
    });

    const messages: any[] = [];

    Object.keys(grouped).forEach(number => {

      const rows = grouped[number];

      /** 1) تفاصيل كل حصة */
      const studentLines = rows.map(row => {

        const formattedDate = new Date(row.actualStartDate).toLocaleString('ar', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        return `━━━━━━━━━━━━━━
📘 *حصة رقم:* ${row.relatedClassFk}
━━━━━━━━━━━━━━
*الطالب:* ${row.payerFkName}
*المعلم:* ${row.teacherFkName}
*التاريخ:* ${formattedDate}
💰 *المبلغ:* ${row.amountRemaining} ريال`;
      }).join('\n\n');

      /** 2) إجمالي المبالغ */
      const total = rows.reduce((sum, r) => sum + (r.amountRemaining || 0), 0);

      /** 3) الرسالة النهائية */
      const fullMessage =
        `السلام عليكم ورحمة الله وبركاته 🌿،

تم إرسال هذه الرسالة بشكل آلي من قبل *مركز الخريطيات التعليمي* 🎓.

📌 *تفاصيل المستحقات :*

${studentLines}

────────────────
💵 *إجمالي المستحق:* ${total} ريال
💵 *إجمالي الباص:* ${0.0} ريال

────────────────

💳 تذكير بسداد المستحقات.
🙏 شاكرين حسن تعاونكم المستمر.`;

      const finalNum = number.startsWith('+') ? number : `+${number}`;

      messages.push({
        number: finalNum,
        message: fullMessage,
        userFk: rows[0].payerFk
      });
    });

    this.finalMessages = messages;
    this.messageTemplate = messages
      .map(m => m.message)
      .join("\n\n============================\n\n");

  }


  buildTeacherMessages() {

    const grouped: Record<string, any[]> = {};

    // Group by teacher WhatsApp only (all classes in one message)
    this.data.rows.forEach((row: any) => {
      const key = row.teacherWhatsappNumber;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(row);
    });

    const messages: any[] = [];

    Object.keys(grouped).forEach(number => {

      const rows = grouped[number];

      const teacherName = rows[0].teacherFkName;

      // Format each class block
      const classLines = rows.map(r => {

        const formattedDate = new Date(r.actualStartDate).toLocaleString('ar', {
          year: 'numeric', month: 'long', day: 'numeric',
          hour: '2-digit', minute: '2-digit'
        });

        return `
تم تسجيل بيانات *الحصة رقم ${r.relatedClassFk}*:

📅 *التاريخ:* ${formattedDate}

📘 *قائمة الطلاب:*
👤 الطالب: ${r.payerFkName}
💰 المستحق: ${r.amountRemaining} ريال

────────────────`;
      }).join("\n");

      // Total amount for teacher
      const total = rows.reduce((sum, r) => sum + (r.amountRemaining || 0), 0);

      // Final formatted WhatsApp message
      const message =
        `السلام عليكم أستاذ *${teacherName}* 👋،

${classLines}

💵 *إجمالي المستحقات:* ${total} ريال
────────────────

نشكركم على جهودكم ونأمل لكم مزيدًا من التوفيق والنجاح 🌟`;

      const finalNum = number?.startsWith('+') ? number : `+${number}`;

      messages.push({
        number: finalNum,
        message,
        userFk: rows[0].coursesTeacherFk
      });
    });

    this.finalMessages = messages;
    this.messageTemplate = messages
      .map(m => m.message)
      .join("\n\n============================\n\n");  }



  /** إرسال الرسائل */
  sendNow() {

    // لو المستخدم عدل الرسالة بنفسه — نطبق التعديل على كل الرسائل
    this.finalMessages = this.finalMessages.map(m => ({
      ...m,
      message: this.messageTemplate
    }));

    const payload = { messages: this.finalMessages };

    console.log("WHATSAPP FINAL PAYLOAD:", payload);

    this.communicationService.sendBroadcast(payload).subscribe({
      next: () => {
        this.dialog.open(ConfirmPopupComponent, {
          data: {
            type: 'success',
            messageKey: 'message.success',
            autoCloseMs: 2000,
            showCancel: false,

          },
          panelClass: 'dialog-success'
        });

        this.dialogRef.close();
      }
    });
  }

}
