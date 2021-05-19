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

  showFile(directory: string, urlFile: string) {
    return this.http.get(
      `${this.url}/file/${directory}/${urlFile}`,
      this.server.obtainFileHeaders()
    );
  }

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

  deleteFile(directory: string, urlFile: string) {
    return this.http.post(
      `${this.url}/file/${directory}/${urlFile}`,
      this.server.obtainFileHeaders()
    );
  }
}
