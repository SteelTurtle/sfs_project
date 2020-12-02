import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {StoredFile} from '../model/file.model';
import {Subscription} from 'rxjs';
import {ListFilesService} from './list-files.service';
import {FileStorageService} from '../services/file-storage.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-list-files',
  templateUrl: './list-files.component.html',
  styleUrls: ['./list-files.component.css']
})
export class ListFilesComponent implements OnInit, AfterViewInit, OnDestroy {

  filesListSubscription: Subscription;
  navigationSubscription: Subscription;
  dataSource = new MatTableDataSource<StoredFile>();
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  displayedColumns: string[] = ['file', 'created_at', 'actions'];
  storedFiles: StoredFile[];

  constructor(private listFilesService: ListFilesService,
              private fileStorageService: FileStorageService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.filesListSubscription = this.listFilesService.changedFilesListSubject
      .subscribe((files) => {
          this.storedFiles = files;
        }
      );
    this.dataSource.data = this.listFilesService.getFiles();
    this.navigationSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.fileStorageService.fetchFilesFromServer().subscribe(
          (files: StoredFile[]) => {
            this.storedFiles = files;
            this.dataSource.data = this.storedFiles;
          }
        );
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onDownload(fileName: string): void {
    this.fileStorageService.downloadSelectedFile(fileName).subscribe(fileBlob => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(fileBlob);
      a.href = objectUrl;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }

  onDelete(id: number): void {
    this.filesListSubscription = this.fileStorageService.deleteFileFromServer(id).subscribe(() => {
      this.listFilesService.deleteFile(id);
    });
    this.router.navigate(['files']);
  }

  ngOnDestroy(): void {
    this.filesListSubscription.unsubscribe();
  }
}

