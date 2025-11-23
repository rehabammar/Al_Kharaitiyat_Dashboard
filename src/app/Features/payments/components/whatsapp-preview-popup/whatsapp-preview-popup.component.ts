import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommunicationService } from '../../../communication/services/communication.service';

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
    private communicationService: CommunicationService
  ) {
    this.buildDefaultMessages();
  }

  /** تجهيز الرسائل */
  buildDefaultMessages() {

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
    this.messageTemplate = messages[0]?.message || '';
  }

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
        alert("✔ تم إرسال الرسائل بنجاح");
        this.dialogRef.close();   // ← إغلاق البوب أب
      }
    });
  }

}
