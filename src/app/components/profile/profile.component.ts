import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { switchMap, tap } from 'rxjs';
import { ProfileUser } from 'src/app/models/user';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { UsersService } from 'src/app/services/users.service';

@UntilDestroy()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user$ = this.usersService.currentUserProfile$;

  profileForm = this.fb.group({
    uid: [''],
    displayName: [''],
    firstName: [''],
    lastName: [''],
    phone: [''],
    address: ['']
  });

  constructor(
    private imageUploadService: ImageUploadService,
    private toast: HotToastService,
    private usersService: UsersService,
    private fb: NonNullableFormBuilder
    
  ) {}

  ngOnInit(): void {
    this.usersService.currentUserProfile$
      .pipe(untilDestroyed(this), tap(console.log))
      .subscribe((user) => {
        this.profileForm.patchValue({ ...user });
      });
  }

  uploadFile(event: any, { uid }: ProfileUser) {
    this.imageUploadService
      .uploadImage(event.target.files[0], `images/profile/${uid}`)
      .pipe(
        this.toast.observe({
          loading: 'Carregando Imagem do Perfil...',
          success: 'Imagem atualizada com sucesso!',
          error: 'Ocorreu um erro: tipo/tamanho não é suportado!',
        }),
        switchMap((photoURL) =>
          this.usersService.updateUser({
            uid,
            photoURL,
          })
        )
      )
      .subscribe();
  }

  saveProfile() {
    const { uid, ...data } = this.profileForm.value;

    if (!uid) {
      return;
    }

    this.usersService
      .updateUser({ uid, ...data })
      .pipe(
        this.toast.observe({
          loading: 'Salvando dados do perfil...',
          success: 'Perfil atualizado com sucesso!',
          error: 'Ocorreu um erro: procure o suporte!',
        }        
        )
      )
      .subscribe();
  }
}
