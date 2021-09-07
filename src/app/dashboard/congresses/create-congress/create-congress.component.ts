import { Component } from '@angular/core';
import { CongressService } from '../../../services/congress.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilesService } from 'src/app/services/files.service';

@Component({
  selector: 'app-create-congress',
  templateUrl: './create-congress.component.html',
  styleUrls: ['./create-congress.component.scss'],
})
export class CreateCongressComponent {
  public Editor = ClassicEditor;
  congressForm: FormGroup;
  dataUser: any;
  congress: any = [];
  today: string = '';
  regulations: string = '';
  imagePreview: string = '';

  constructor(
    private congressService: CongressService,
    private filesService: FilesService,
    public fb: FormBuilder,
    private router: Router
  ) {
    this.dataUser = JSON.parse(sessionStorage.getItem('_user-data')!);
    this.today = new Date().toISOString().split('T')[0];
    this.congressForm = this.fb.group({
      name: ['', [Validators.required]],
      start_date: [this.today],
      end_date: [this.today],
      regulations: ['', [Validators.required]],
      capacity_speakers: [1],
      capacity_participants: [1],
      knowledge_area: ['', [Validators.required]],
      status_congress: ['Pendiente'],
      person_id: [this.dataUser._id],
      logo: ['', [Validators.required]],
    });
  }

  postCongress() {
    if (this.congressForm.valid) {
      const formData: any = new FormData();
      formData.append('file', this.congressForm.get('logo')!.value);

      this.filesService
        .uploadFile('images', formData)
        .then((response) => {
          if (response.ok) {
            this.congressForm.patchValue({
              logo: `${response.data.directory}/${response.data.name}`,
            });
          } else {
            this.filesService
              .deleteFile(`${response.data.directory}`, `${response.data.name}`)
              .then((response: any) => {
                console.log(response.info);
              })
              .catch((error) => {
                console.error(error);
              });
          }
        })
        .then(() => {
          // this.congressForm.patchValue({
          //   regulations: this.regulations,
          // });

          let congressData = {
            congress: this.congressForm.value,
          };

          this.congressService.postCongress(congressData).subscribe(
            () => {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Congreso creado exitosamente.',
                showConfirmButton: false,
                timer: 1500,
              }).then(() => {
                Swal.fire({
                  position: 'center',
                  icon: 'info',
                  title:
                    'Su congreso está guardado con el estado PENDIENTE de aprobación.',
                  showConfirmButton: false,
                  timer: 3000,
                }).then(() => this.router.navigate(['/dashboard/congresses']));
              });
            },
            (err) => {
              console.error(err);
            }
          );
        });
    } else {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Completa todos los campos para continuar.',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  handleFileInput(event: any) {
    const file = (event.target as HTMLInputElement).files![0];
    const reader = new FileReader();

    this.congressForm.patchValue({
      logo: file,
    });
    this.congressForm.get('logo')!.updateValueAndValidity();

    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
