import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../services/home.servics';
import { User } from '../../../auth/models/user.model';

@Component({
  selector: 'app-team',
  standalone: false,
  templateUrl: './team.component.html',
  styleUrl: './team.component.css'
})
export class TeamComponent  implements OnInit{

  constructor(private homeService : HomeService) {}

  teachersList : User [] = []  ;


 ngOnInit(): void {
  this.homeService.getTeachersList().subscribe(users => {
    this.teachersList = users.items;
        console.log("teaaaaaaaaaaaaaaaaaaaaaaa" + users.total);

});

    
    
  }

}
