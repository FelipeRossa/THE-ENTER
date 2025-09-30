import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from '../../services/electron/electron.service';

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  menuItems = [
    { label: 'Hosts', icon: 'bi bi-pc-display-horizontal', path: '/hosts', tipo: 'menu' },
    // { label: 'Apache Hosts', icon: 'bi bi-server', path: '/apache-hosts' },
    // { label: 'Planilha Financeira', icon: 'bi bi-cash-coin', path: '/planilha-contas' }
  ];

  filteredItems: { label: string; icon: string; path: string; tipo: string }[] = []; // Itens filtrados
  isSearchOpen = false;
  searchText = ''; // Texto da pesquisa
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('searchBar') searchBar!: ElementRef;
  selectedIndex = -1;

  constructor(private router: Router, private electronService: ElectronService) {}

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

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    event.stopPropagation();
    if (event.ctrlKey && event.key === 'p') {
      event.preventDefault();
      if (!this.isSearchOpen) {
        this.isSearchOpen = true;
        setTimeout(() => this.searchInput.nativeElement.focus(), 0); // Foca no input
      } else {
        this.closeSearch();
      }
    } else if (event.key === 'Escape' && this.isSearchOpen) {
      this.closeSearch()
    } else if (event.key === 'ArrowDown') {
      this.selectPrevious(); // Seleciona a opção anterior
    } else if (event.key === 'ArrowUp') {
      this.selectNext(); // Seleciona a próxima opção
    } else if (event.key === 'Enter') {
      this.selectOption(); // Seleciona a opção ativa
    }
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (this.isSearchOpen && !this.searchBar.nativeElement.contains(target)) {
      this.closeSearch();
    }
  }

  closeSearch() {
    this.isSearchOpen = false;
    this.searchText = ''; // Limpa o texto de pesquisa
    this.filteredItems = []; // Reseta a lista filtrada
    this.selectedIndex = -1;
  }

  onSearchChange() {
    if (this.searchText.trim() === '') return;
    this.filteredItems = this.menuItems.filter(item =>
      item.label.toLowerCase().includes(this.searchText.toLowerCase())
    );

    this.filteredItems.push({ label: `Pesquisar "${this.searchText}" no Google`, icon: 'bi bi-google', path: '', tipo: 'pesquisa' });
  }

  selectPrevious() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    }
  }

  selectNext() {
    if (this.selectedIndex < this.filteredItems.length - 1) {
      this.selectedIndex++;
    }
  }

  selectOption() {
    if (this.selectedIndex >= 0) {
      const selectedItem = this.filteredItems[this.selectedIndex];
      if (selectedItem.tipo === 'menu') {
        this.router.navigate([selectedItem.path]);
      } else if (selectedItem.tipo === 'pesquisa' && this.searchText.trim() != '') {
        this.abrirChrome(this.searchText.trim());
      }
      this.closeSearch();
    }
  }

  abrirChrome(texto: string) {
    const pesquisa = `https://www.google.com/search?q=${encodeURIComponent(texto)}`
    this.electronService.abrirChrome(pesquisa, false);
  }
}
