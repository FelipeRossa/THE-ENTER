import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  isDark = document.body.classList.contains('dark');;
  pastelCyan = '#7fdbff'; // ciano pastel
  pastelYellow = '#ffe580'; // amarelo pastel

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.isDark = document.body.classList.contains('dark');
  }

  toggleTheme(): void {
    document.body.classList.toggle('dark');
    this.isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
  }

  goToMenu(): void {
    this.router.navigate(['/menu'])
  }
}
