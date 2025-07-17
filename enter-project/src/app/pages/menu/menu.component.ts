import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  menuItems = [
    { label: 'Hosts', icon: 'bi bi-pc-display-horizontal', path: '/hosts' },
    { label: 'Apache Hosts', icon: 'bi bi-server', path: '/apache-hosts' },
    { label: 'Planilha Financeira', icon: 'bi bi-cash-coin', path: '/planilha-contas' }
  ];

  toggleTheme(): void {
    const body = document.body;
    body.classList.toggle('dark');
    const isDark = body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  ngOnInit(): void {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.body.classList.add('dark');
    }
  }
}
