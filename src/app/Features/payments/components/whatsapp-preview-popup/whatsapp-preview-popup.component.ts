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

  finalMessages: { number: string, message: string, userFk: number  , name : string}[] = [];

  selectedIndex: number = 0;   // المؤشر الحالي للطالب المحدد
  messageTemplate: string = ''; // النص الذي يظهر في textarea

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

    // تحميل الرسالة الأولى في textarea
    this.messageTemplate = this.finalMessages[0]?.message || '';
  }

  /** بناء رسائل الطلاب */
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
      }).join("\n\n");

      const total = rows.reduce((sum, r) => sum + (r.amountRemaining || 0), 0);

      const fullMessage = `
السلام عليكم ورحمة الله وبركاته 🌿،

تم إرسال هذه الرسالة بشكل آلي من قبل *مركز الخريطيات التعليمي* 🎓.

📌 *تفاصيل المستحقات :*

${studentLines}

────────────────
💵 *إجمالي المستحق:* ${total} ريال
💵 *إجمالي الباص:* ${0} ريال
────────────────

💳 تذكير بسداد المستحقات.
🙏 شاكرين حسن تعاونكم المستمر.`.trim();

      messages.push({
        number: number.startsWith('+') ? number : `+${number}`,
        message: fullMessage,
        userFk: rows[0].payerFk,
        name: rows[0].payerFkName,
      });
    });

    this.finalMessages = messages;
  }

  /** بناء رسائل المعلمين */
buildTeacherMessages() {
  const groupedByTeacher: Record<string, any[]> = {};

  // Group by teacher WhatsApp
  this.data.rows.forEach((row: any) => {
    const key = row.teacherWhatsappNumber;
    if (!groupedByTeacher[key]) groupedByTeacher[key] = [];
    groupedByTeacher[key].push(row);
  });

  const messages: any[] = [];

  Object.keys(groupedByTeacher).forEach((number: string) => {
    const teacherRows: any[] = groupedByTeacher[number];
    const teacherName: string = teacherRows[0].teacherFkName;

    // Group inside by classId
    const classes: Record<number, any[]> = {};

    teacherRows.forEach((r: any) => {
      const classId = r.relatedClassFk;
      if (!classes[classId]) classes[classId] = [];
      classes[classId].push(r);
    });

    let finalText =
      `السلام عليكم أستاذ *${teacherName}* 👋،\n\n`;

    let totalAll = 0;

    Object.keys(classes).forEach((classId: any) => {
      const rows: any[] = classes[classId];

      const formattedDate = new Date(rows[0].actualStartDate).toLocaleString('ar', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      finalText +=
        `تم تسجيل بيانات *الحصة رقم ${classId}*:\n\n` +
        `📅 *التاريخ:* ${formattedDate}\n\n` +
        `📘 *قائمة الطلاب:*\n`;

      rows.forEach((r: any) => {
        finalText +=
          `👤 الطالب: ${r.payerFkName}\n` +
          `💰 المستحق: ${r.amountRemaining} ريال\n\n`;
      });

      finalText += `────────────────\n\n`;

      totalAll += rows.reduce(
        (sum: number, r: any) => sum + (r.amountRemaining || 0),
        0
      );
    });

    finalText +=
      `💵 *إجمالي المستحقات:* ${totalAll} ريال\n` +
      `────────────────\n\n` +
      `نشكركم على جهودكم ونأمل لكم مزيدًا من التوفيق والنجاح 🌟`;

    messages.push({
      number: number.startsWith('+') ? number : `+${number}`,
      message: finalText,
      userFk: teacherRows[0].coursesTeacherFk,
      name: teacherName
    });
  });

  this.finalMessages = messages;
}


  /** تغيير الشخص المحدد */
  onChangeSelected() {
    this.messageTemplate = this.finalMessages[this.selectedIndex].message;
  }

  /** عند التعديل داخل textarea */
  onMessageChange() {
    this.finalMessages[this.selectedIndex].message = this.messageTemplate;
  }

  /** إرسال الرسائل */
  sendNow() {
    const payload = { messages: this.finalMessages };

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
