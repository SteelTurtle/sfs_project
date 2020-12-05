import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType, HttpRequest} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {ListFilesService} from '../list-files/list-files.service';
import {StoredFile} from '../../shared/model/file.model';
import {map, tap} from 'rxjs/operators';

const SERVER_URL = 'http://localhost:8080/api/files';
const MEDIA_SERVER_BASE_URL = 'http://localhost:8080'; // todo: change this once the pipe directive is done!

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
        } else if (event.type === HttpEventType.Response) {
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

  public deleteFileFromServer(fileId: number): Observable<StoredFile> {
    return this.httpClient.delete(SERVER_URL + '/' + fileId);
  }

  public downloadSelectedFile(fileUri: string): Observable<Blob> {
    return this.httpClient.get(MEDIA_SERVER_BASE_URL + fileUri, {responseType: 'blob'});
  }
}
