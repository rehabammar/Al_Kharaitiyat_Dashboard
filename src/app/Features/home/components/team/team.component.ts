import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../services/home.servics';
import { User } from '../../../auth/models/user.model';


@Component({
  selector: 'app-team',
  standalone: false,
  templateUrl: './team.component.html',
  styleUrl: './team.component.css'
})
export class TeamComponent implements OnInit {

  constructor(private homeService: HomeService) { }

  teachersList: User[] = [];
  female_avatar = 'assets/img/gallery/female_avatar.svg';
  male_avatar = 'assets/img/gallery/male_avatar.svg';

  environment = {
  production: true,
  apiHost: 'http://157.180.65.178:8080'
};


  ngOnInit(): void {
    this.homeService.getTeachersList().subscribe(users => {
      this.teachersList = users.items;
    });
  }


   photoUrl(u: User): string {
  const raw = (u.profileUrl ?? u.profilePicturePath ?? '').trim();
  if (!raw) {
    if(u.genderFk == 1) return this.male_avatar ;
    else return this.female_avatar ;
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

fallbackImg(evt: Event) {
  const img = evt.target as HTMLImageElement;
  if (img ) img.src = this.male_avatar;
}

}
