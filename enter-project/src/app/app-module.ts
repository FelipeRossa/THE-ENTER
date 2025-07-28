import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { AppComponent } from './app.component';
import { MenuComponent } from './pages/menu/menu.component';
import { NavbarComponent } from './shared/navbar.component/navbar.component';
import { HostsComponent } from './pages/hosts/hosts.component';
import { FormsModule } from '@angular/forms';
import { ErrorModalComponent } from './shared/error-modal.component/error-modal.component';
import { CadastroHostsComponent } from './pages/hosts/cadastro/cadastro-hosts.component/cadastro-hosts.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    NavbarComponent,
    HostsComponent,
    ErrorModalComponent,
    CadastroHostsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
