import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { WebService } from "./web.service";

@Injectable({
  providedIn: "root",
})
export class FilesService {
  private url: string;

  constructor(private http: HttpClient, private server: WebService) {
    this.url = this.server.obtainUrl();
  }

  /**
   * UPDATE FILE
   */

  /**
   * Función para mostrar archivos alojados en el servidor
   * @param directory Carpeta donde está alojado el archivo
   * @param fileName Nombre del archivo a mostrar
   * @returns URL del archivo
   */
  async showFile(directory: string, fileName: string): Promise<any> {
    try {
      return `${this.url}/file/${directory}/${fileName}`;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Función para subir archivos al servidor.
   * @param directory Carpeta donde se alojará los archivos
   * @param file Archivo que se subirá al servidor
   * @returns JSON con información del archivo subido al servidor.
   */
  async uploadFile(directory: string, file: FormData): Promise<any> {
    try {
      let response = this.http
        .post(
          `${this.url}/file/upload/${directory}`,
          file,
          this.server.obtainFileHeaders()
        )
        .toPromise();
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Función para eliminar archivos del servidor
   * @param directory Carpeta donde se encuentran los archivos a eliminar
   * @param fileName Nombre del archivo a eliminar
   * @returns JSON con información del borrado del archivo.
   */
  async deleteFile(directory: string, fileName: string): Promise<any> {
    try {
      let response = this.http
        .post(
          `${this.url}/file/${directory}/${fileName}`,
          this.server.obtainFileHeaders()
        )
        .toPromise();
      return response;
    } catch (error) {
      console.error(error);
    }
  }
}
