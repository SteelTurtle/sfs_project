import {Injectable} from '@angular/core';
import {
  HttpClient,
  HttpRequest,
  HttpEventType,
  HttpResponse, HttpHeaders,
} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';

const serverUrl = 'http://localhost:8080/api/files';

@Injectable({ providedIn: 'root' })
export class UploadService {
  constructor(private httpClient: HttpClient) {
  }

  public uploadFiles(files: Set<File>): { [key: string]: { progress: Observable<number> } } {
    const uploadStatus: { [key: string]: { progress: Observable<number> } } = {};

    files.forEach(file => {
      const formData: FormData = new FormData();
      formData.append('file', file);
      const request = new HttpRequest('POST', serverUrl, formData, {reportProgress: true});
      const progressStatus = new Subject<number>();

      this.httpClient.request(request).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round(100 * event.loaded / event.total);
          progressStatus.next(percentDone);
        } else if (event instanceof HttpResponse) {
          progressStatus.complete();
        }
      });

      uploadStatus[file.name] = {progress: progressStatus.asObservable()};
    });
    return uploadStatus;
  }
}
