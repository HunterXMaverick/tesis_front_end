import { Component, OnInit } from '@angular/core';
import { PostulationService } from '../../../services/postulation.service';
import { CongressService } from 'src/app/services/congress.service';
import { FilesService } from 'src/app/services/files.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-post-postulation',
  templateUrl: './post-postulation.component.html',
  styleUrls: ['./post-postulation.component.scss'],
})
export class PostPostulationComponent implements OnInit {
  postulation: FormGroup;
  dataUser: any = [];
  congressSelected: any;
  congress: any = [];
  knowledge_area: Array<string> = [];

  constructor(
    private postulationService: PostulationService,
    private congressService: CongressService,
    private filesService: FilesService,
    private router: Router,
    public fb: FormBuilder
  ) {
    this.dataUser = JSON.parse(sessionStorage.getItem('_user-data')!);
    this.congressSelected = sessionStorage.getItem('activeCongress');
    this.postulation = this.fb.group({
      title_project: ['', [Validators.required]],
      summary_project: ['', [Validators.required]],
      knowledge_area: ['', [Validators.required]],
      files: [null, [Validators.required]],
      person_id: ['', [Validators.required]],
      status: ['Pendiente'],
      status_quelification: [false],
      congress_id: [this.congressSelected],
    });
  }

  ngOnInit() {
    this.getCongress();
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
              this.knowledge_area = this.congress.knowledge_area.split(',');
            }
          });
        }
      },
      (err) => console.error(err)
    );
  }

  postPostulation() {
    if (
      this.postulation.get('title_project')!.value &&
      this.postulation.get('summary_project')!.value &&
      this.postulation.get('knowledge_area')!.value &&
      this.postulation.get('files')!.value
    ) {
      this.postulation.patchValue({
        person_id: this.dataUser._id,
      });

      Swal.fire({
        title: '¿Está seguro de generar el proyecto?',
        text: '¡No podrá editarlo una vez generado!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Enviar',
      }).then((result) => {
        if (result.isConfirmed) {
          const formData: any = new FormData();
          formData.append('file', this.postulation.get('files')!.value);

          this.filesService
            .uploadFile('postulations', formData)
            .then((response) => {
              if (response.ok) {
                this.postulation.patchValue({
                  files: `${response.data.directory}/${response.data.name}`,
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
              let dataPostulation = {
                postulation: this.postulation.value,
              };

              this.postulationService
                .postPostulation(dataPostulation)
                .subscribe(
                  () => {
                    this.router.navigate(['/dashboard/postulations']);
                  },
                  (error) => {
                    console.error(error);
                  }
                );
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: '¡Registro Exitoso!',
                showConfirmButton: false,
                timer: 1500,
              });
            });
        }
      });
    } else {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Por favor, completar todos los datos',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  handleFileInput(event: any) {
    const file = (event.target as HTMLInputElement).files![0];

    this.postulation.patchValue({
      files: file,
    });
    this.postulation.get('files')!.updateValueAndValidity();
  }
}
