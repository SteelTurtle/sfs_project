import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {StoredFile} from '../../shared/model/file.model';
import {Observable} from 'rxjs';
import {FileStorageService} from './file-storage.service';
import {ListFilesService} from '../list-files/list-files.service';

@Injectable({
  providedIn: 'root'
})
export class FileListDynamicFetcherService implements Resolve<StoredFile[]> {

  constructor(private fileStorageService: FileStorageService,
              private listFileService: ListFilesService) {
  }

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<StoredFile[]> | Promise<StoredFile[]> | StoredFile[] {
    const storedFiles = this.listFileService.getFiles();
    if (storedFiles.length === 0) {
      return this.fileStorageService.fetchFilesFromServer();
    } else {
      return storedFiles;
    }
  }
}
