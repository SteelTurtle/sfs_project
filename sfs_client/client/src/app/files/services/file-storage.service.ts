import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType, HttpRequest, HttpResponse,} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {ListFilesService} from '../list-files/list-files.service';
import {StoredFile} from '../model/file.model';
import {map, tap} from 'rxjs/operators';

const SERVER_URL = 'http://localhost:8080/api/files';

@Injectable({providedIn: 'root'})
export class FileStorageService {

  constructor(private httpClient: HttpClient,
              private listFilesService: ListFilesService) {
  }

  public uploadFiles(files: Set<File>): { [key: string]: { progress: Observable<number> } } {
    const uploadStatus: { [key: string]: { progress: Observable<number> } } = {};

    files.forEach(file => {
      const formData: FormData = new FormData();
      formData.append('file', file);
      const request = new HttpRequest('POST', SERVER_URL, formData, {reportProgress: true});
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

  public fetchFilesFromServer(): Observable<StoredFile[]> {
    return this.httpClient.get<StoredFile[]>(SERVER_URL)
      .pipe(
        map(files => {
          return files.map(file => {
            return {
              ...file,
            };
          });
        }),
        tap(files => {
          this.listFilesService.setFiles(files);
        })
      );
  }
}
