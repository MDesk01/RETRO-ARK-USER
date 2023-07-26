import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';
import { MatDialog } from '@angular/material/dialog';

//chama o conteúdo da página about.html
@Component({
  selector: 'about',
  templateUrl: 'about.html',
})
export class about {}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  user$ = this.usersService.currentUserProfile$;

  constructor(
    private authService: AuthService,
    public usersService: UsersService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  //chama o conteúdo da página about.html
  about(){
    const dialogRef = this.dialog.open(about);
    dialogRef.afterClosed().subscribe(result =>{
      console.log(`Dialog result: ${result}`)
    })
  }

  //sair
  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
