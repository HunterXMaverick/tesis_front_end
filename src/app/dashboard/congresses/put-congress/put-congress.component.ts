import { Component } from '@angular/core';
import { CongressService } from '../../../services/congress.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilesService } from 'src/app/services/files.service';

@Component({
  selector: 'app-put-congress',
  templateUrl: './put-congress.component.html',
  styleUrls: ['./put-congress.component.scss'],
})
export class PutCongressComponent {
  public Editor = ClassicEditor;
  congressForm: FormGroup;
  dataUser: any;
  congress: any = [];
  congressSelected: any;
  today: string = '';
  regulations: string = '';
  imagePreview: string = '';
  see_logo: string = '';
  imageChange: number = 0;

  constructor(
    private congressService: CongressService,
    private filesService: FilesService,
    public fb: FormBuilder,
    private router: Router
  ) {
    this.congressSelected = sessionStorage.getItem('activeCongress');
    this.today = new Date().toISOString().split('T')[0];
    this.getCongress();
    this.congressForm = this.fb.group({
      name: [null, [Validators.required]],
      start_date: [null, [Validators.required]],
      end_date: [null, [Validators.required]],
      regulations: [null, [Validators.required]],
      capacity_speakers: [null, [Validators.required]],
      capacity_participants: [null, [Validators.required]],
      knowledge_area: [null, [Validators.required]],
      status_congress: [null, [Validators.required]],
      person_id: [null, [Validators.required]],
      logo: [null, [Validators.required]],
      logo_temp: [null],
    });
  }

  getCongress() {
    return this.congressService.getCongress().subscribe(
      (res: any) => {
        if (res.data.length == 0) {
          this.congress = null;
        } else {
          res.data.forEach((element: any) => {
            if (
              // element.person_id == this.dataUser._id &&
              element._id == this.congressSelected &&
              element.status_congress == 'Habilitado'
            ) {
              this.congress = element;

              this.congressForm.patchValue({
                name: element.name,
                start_date: element.start_date,
                end_date: element.end_date,
                regulations: element.regulations,
                capacity_speakers: element.capacity_speakers,
                capacity_participants: element.capacity_participants,
                knowledge_area: element.knowledge_area,
                status_congress: element.status_congress,
                person_id: element.person_id,
                logo: element.logo,
              });

              this.see_logo = `http://localhost:3500/api/file/${element.logo}`;
            }
          });
        }
      },
      (err) => console.error(err)
    );
  }

  putCongress(idCongress: any) {
    if (this.congressForm.valid) {
      if (this.imageChange > 0) {
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
                .deleteFile(
                  `${response.data.directory}`,
                  `${response.data.name}`
                )
                .then((response: any) => {
                  console.log(response.info);
                })
                .catch((error) => {
                  console.error(error);
                });
            }
          })
          .then(() => {
            let congressData = {
              congress: this.congressForm.value,
            };

            this.congressService
              .putCongress(idCongress, congressData)
              .subscribe(
                () => {
                  Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Congreso actualizado correctamente.',
                    showConfirmButton: false,
                    timer: 1500,
                  }).then(() =>
                    this.router.navigate(['/dashboard/congresses'])
                  );
                },
                (err) => {
                  console.error(err);
                }
              );
          });
      } else {
        let congressData = {
          congress: this.congressForm.value,
        };

        this.congressService.putCongress(idCongress, congressData).subscribe(
          () => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Congreso actualizado correctamente.',
              showConfirmButton: false,
              timer: 1500,
            }).then(() => this.router.navigate(['/dashboard/congresses']));
          },
          (err) => {
            console.error(err);
          }
        );
      }
    } else {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Completa todos los campos para continuar.',
        showConfirmButton: false,
        timer: 2000,
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

    this.imageChange += 1;
  }
}
