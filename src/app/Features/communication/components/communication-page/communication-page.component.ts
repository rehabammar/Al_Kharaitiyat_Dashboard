import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '../../services/communication.service';
import { User } from '../../../auth/models/user.model';
import { finalize } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmPopupComponent } from '../../../../shared/components/confirm-popup/confirm-popup.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-communication-page',
  standalone: false,
  templateUrl: './communication-page.component.html',
  styleUrl: './communication-page.component.css'
})
export class CommunicationPageComponent implements OnInit {

  users: User[] = [];
  filteredUsers: User[] = [];
  selectedUsers: User[] = [];
  selectedType: number | null = null;



  message: string = '';
  chatMessages: any[] = [];

  loading = false;
  sending = false;

  activeUser: User | null = null;
  broadcastMode = false;

  // Pagination
  currentPage = 0;
  pageSize = 2000;
  totalUsers = 0;


  sidebarOpen = false;


  environment = {
    production: true,
    apiHost: 'http://157.180.65.178:8080'
  };


  constructor(private commService: CommunicationService , private dialog: MatDialog, private translate : TranslateService) { }

  ngOnInit() {
    this.loadUsers();
  }

  /** LOAD USERS WITH PAGINATION **/
  loadUsers() {
    this.loading = true;

    this.commService.getUsers(this.currentPage, this.pageSize)
      .pipe(finalize(() => this.loading = false))
      .subscribe(res => {
        this.users = res.content ?? [];
        this.totalUsers = res.totalElements ?? 0;
        this.filteredUsers = [...this.users];
      });
  }

  /** SEARCH **/
  searchText = '';

  onSearch(event: any) {
    const value = (event?.target as HTMLInputElement)?.value ?? '';
    this.searchText = value.trim();

    const body: any = {
      page: 0,
      size: this.pageSize,
      sort: [{ property: 'userPk', direction: 'desc' }]
    };

    // رقم مستخدم (ID)
    if (/^\d+$/.test(this.searchText)) {
      body.userPk = Number(this.searchText);
    }
    // رقم جوال
    else if (/^\+?\d{6,15}$/.test(this.searchText)) {
      body.whatsappNumber = this.searchText;
    }
    // اسم مستخدم
    else {
      body.fullName = this.searchText;
    }

    this.loading = true;

    this.commService
      .getUsersWithSearch(body)
      .pipe(finalize(() => this.loading = false))
      .subscribe(res => {
        this.users = res.content ?? [];
        this.totalUsers = res.totalElements ?? 0;
        this.filteredUsers = [...this.users];
      });
  }


  /** SELECT USER **/
  toggleUser(user: User) {
    user.selected = !user.selected;

    if (user.selected) {
      if (!this.selectedUsers.includes(user)) {
        this.selectedUsers.push(user);
      }
    } else {
      this.selectedUsers = this.selectedUsers.filter(u => u !== user);
    }

    // 🔥 شغّل broadcast mode لو فيه selected users
    this.broadcastMode = this.selectedUsers.length > 0;

    // 🔥 امسح شاشة الشات لو دخلت broadcast
    if (this.broadcastMode) {
      this.activeUser = null;
      this.chatMessages = [];
      this.message = '';
    }
  }


  selectAll() {
    this.filteredUsers.forEach(u => {
      u.selected = true;
      if (!this.selectedUsers.includes(u)) this.selectedUsers.push(u);
    });

    // 🔥 تشغيل وضع الإرسال الجماعي
    this.broadcastMode = this.selectedUsers.length > 0;

    // 🔥 إغلاق الشات الفردي بالكامل
    this.activeUser = null;
    this.chatMessages = [];
    this.message = '';
  }


  unselectAll() {
    this.filteredUsers.forEach(u => (u.selected = false));
    this.selectedUsers = [];

    // 🔥 إيقاف وضع الإرسال الجماعي
    this.broadcastMode = false;

    // 🔥 إزالة محتوى الشات
    this.activeUser = null;
    this.chatMessages = [];
    this.message = '';
  }


  /** OPEN CHAT **/
  openChat(u: User) {

    // 🔥 خروج من broadcast mode
    this.broadcastMode = false;

    // 🔥 مسح كل الاختيارات
    this.selectedUsers = [];
    this.users.forEach(x => (x.selected = false));

    this.activeUser = u;
    this.message = '';

    this.commService.getWatsappMessages(0, 200, u.userPk!).subscribe(res => {
      this.chatMessages = res.content ?? [];

      this.chatMessages.sort(
        (a, b) => new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime()
      );

      this.scrollToBottom();
    });

    this.sidebarOpen = false;
  }


  /** AUTO SCROLL **/
  scrollToBottom() {
    setTimeout(() => {
      const box = document.getElementById('chat-box');
      if (box) box.scrollTop = box.scrollHeight;
    }, 100);
  }

  /** ACTIVATE BROADCAST MODE **/
  activateBroadcastMode() {
    this.broadcastMode = true;
    this.activeUser = null;
    this.chatMessages = [];
    this.message = '';
  }

  /** SEND SINGLE MESSAGE **/
  sendMessage() {
    if (!this.message.trim() || !this.activeUser) return;

    if (!this.activeUser?.whatsappNumber || this.activeUser.whatsappNumber.trim() === '') {

       this.dialog.open(ConfirmPopupComponent, {
            data: {
              type: 'warning',
              titleKey: 'label.warning',
              messageKey: 'communication.noWhatsappNumberDescription',
              okLabel: 'label.ok',
              showCancel: false               
            },
            panelClass: 'dialog-warning',
            disableClose: true
          })
      return;
    }


    const payload = {
      messages: [{
        number: this.activeUser.whatsappNumber?.startsWith('+')
          ? this.activeUser.whatsappNumber
          : `+${this.activeUser.whatsappNumber}`,
        message: this.message,
        userFk: this.activeUser.userPk
      }]
    };

    this.sending = true;

    this.commService.sendBroadcast(payload).subscribe({
      next: () => {
        this.sending = false;

        // Push new bubble immediately
        this.chatMessages.push({
          whatsappMessage: this.message,
          creationDate: new Date()
        });

        this.message = '';
        this.scrollToBottom();
      }
    });
  }

  /** SEND BROADCAST MESSAGE **/
  sendBroadcastMessage() {
  if (!this.message.trim() || this.selectedUsers.length === 0) return;

  // 1️⃣ فلترة المستخدمين الذين لا يملكون رقم واتساب
  const validUsers = this.selectedUsers.filter(u =>
    u.whatsappNumber && u.whatsappNumber.trim() !== ''
  );

  const removedUsers = this.selectedUsers.length - validUsers.length;

  if (validUsers.length === 0) {
    this.dialog.open(ConfirmPopupComponent, {
      data: {
        type: 'warning',
        titleKey: 'communication.warningTitle',
        messageKey: 'communication.noValidUsersToSend',
        okLabel: 'label.ok',
        showCancel: false
      },
      panelClass: 'dialog-warning'
    });
    return;
  }

  // 2️⃣ لودينغ أثناء الإرسال
  const loadingRef = this.dialog.open(ConfirmPopupComponent, {
    data: {
      type: 'info',
      titleKey: 'communication.sendingTitle',
      message: this.translate.instant('communication.sendingToUsers', { count: validUsers.length }),
      showCancel: false
    },
    panelClass: 'dialog-info',
    disableClose: true
  });

  // 3️⃣ تجهيز الرسائل
  const payload = {
    messages: validUsers.map(u => ({
      number: u.whatsappNumber!.startsWith('+') ? u.whatsappNumber : `+${u.whatsappNumber}`,
      message: this.message,
      userFk: u.userPk
    }))
  };

  this.sending = true;

  // 4️⃣ إرسال
  this.commService.sendBroadcast(payload)
    .pipe(finalize(() => {
      this.sending = false;
      loadingRef.close();
    }))
    .subscribe({
      next: () => {

        // 5️⃣ رسالة استبعاد المستخدمين بدون واتساب
        if (removedUsers > 0) {
          this.dialog.open(ConfirmPopupComponent, {
            data: {
              type: 'warning',
              titleKey: 'communication.warningTitle',
              message: this.translate.instant('communication.removedUsers', { count: removedUsers }),
              okLabel: 'label.ok',
              showCancel: false
            },
            panelClass: 'dialog-warning'
          });
        }

        // 6️⃣ Success Dialog
        this.dialog.open(ConfirmPopupComponent, {
          data: {
            type: 'success',
            titleKey: 'communication.successTitle',
            messageKey: 'communication.broadcastSuccess',
            autoCloseMs: 2000,
            showCancel: false
          },
          panelClass: 'dialog-success'
        });

        this.message = '';
        this.broadcastMode = false;
        this.unselectAll();
      }
    });
}


  /** PAGINATION **/
  get totalPages(): number {
    return Math.ceil(this.totalUsers / this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadUsers();
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadUsers();
    }
  }


  // getUserPhoto(u: User): string {
  //   const url = (u.profilePicturePath ?? '').trim();

  //   // لو فيه URL فعلي
  //   if (url && /^https?:\/\//i.test(url)) return url;

  //   // لو مش موجود — نحدد حسب الجندر
  //   if (u.genderFk === 1) {
  //     return 'assets/img/gallery/male_avatar.svg';
  //   } else if (u.genderFk === 2) {
  //     return 'assets/img/gallery/female_avatar.svg';
  //   }

  //   // افتراضي (ذكر)
  //   return 'assets/img/male_avatar.png';
  // }


  getUserPhoto(u: User): string {
    const raw = (u.profileUrl ?? u.profilePicturePath ?? '').trim();
    if (!raw) {
      if (u.genderFk == 1) return 'assets/img/gallery/male_avatar.svg';
      else return 'assets/img/gallery/female_avatar.svg';
    }


    // collapse accidental double slashes (but keep "http://" intact)
    const fixed = raw.replace(/([^:]\/)\/+/g, '$1');

    // if absolute URL, use it as-is
    if (/^https?:\/\//i.test(fixed)) return fixed;

    // if relative, prefix with API host (optional; remove if not needed)
    const base = this.environment.apiHost?.replace(/\/+$/, '') ?? '';
    const path = fixed.replace(/^\/+/, '');
    return base ? `${base}/${path}` : path;
  }



  onTypeChange(type: number, event: any) {
    if (event.target.checked) {
      this.selectedType = type;
    } else {
      this.selectedType = null;
    }

    this.applyTypeFilter();
  }


  applyTypeFilter() {
    this.currentPage = 0;  // إعادة تعيين الصفحة
    this.totalUsers = 0;   // مهم جداً

    this.loading = true;

    const body: any = {
      page: 0,
      size: this.pageSize,
      sort: [{ property: 'userPk', direction: 'desc' }]
    };

    if (this.selectedType != null) {
      body.userTypeFk = this.selectedType;
    }

    this.commService
      .getUsersWithSearch(body)
      .pipe(finalize(() => this.loading = false))
      .subscribe(res => {
        this.users = res.content ?? [];
        this.totalUsers = res.totalElements ?? this.users.length;
        this.filteredUsers = [...this.users];

        // امسح selections بعد الفلترة
        this.unselectAll();
      });
  }




}
