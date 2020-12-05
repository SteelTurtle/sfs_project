import {Injectable} from '@angular/core';
import {StoredFile} from '../../shared/model/file.model';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListFilesService {

  changedFilesListSubject = new Subject<StoredFile[]>();
  private storedFiles: StoredFile[] = [];

  constructor() {
  }

  getFiles(): StoredFile[] {
    return this.storedFiles.slice();
  }

  setFiles(files: StoredFile[]): void {
    this.storedFiles = files;
    this.changedFilesListSubject.next(this.storedFiles.slice());
  }

  deleteFile(index: number): void {
    this.storedFiles.splice(index, 1);
    this.changedFilesListSubject.next(this.storedFiles.slice());
  }
}
