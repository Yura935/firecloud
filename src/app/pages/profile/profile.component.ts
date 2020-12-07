import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userName: string = JSON.parse(localStorage.getItem('user')).name;
  userEmail: string = JSON.parse(localStorage.getItem('user')).email;
  userPass: string = JSON.parse(localStorage.getItem('user')).password;
  userCity: string = JSON.parse(localStorage.getItem('user')).city;
  userImage: string = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/User_font_awesome.svg/1200px-User_font_awesome.svg.png"
  constructor() { }

  ngOnInit(): void {

  }
}

