import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {StoredFile} from '../model/file.model';
import {Subscription} from 'rxjs';
import {ListFilesService} from './list-files.service';
import {FileStorageService} from '../services/file-storage.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-list-files',
  templateUrl: './list-files.component.html',
  styleUrls: ['./list-files.component.css']
})
export class ListFilesComponent implements OnInit, AfterViewInit, OnDestroy {

  filesListSubscription: Subscription;
  dataSource = new MatTableDataSource<StoredFile>();
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  displayedColumns: string[] = ['id', 'file', 'created_at', 'actions'];

  constructor(private listFilesService: ListFilesService,
              private fileStorageService: FileStorageService) {
  }

  ngOnInit(): void {
    this.fileStorageService.fetchFilesFromServer().subscribe(
      (files: StoredFile[]) => {
        this.dataSource.data = files;
      }
    );
    this.filesListSubscription = this.listFilesService.changedFilesListSubject.subscribe(() => {
      this.fileStorageService.fetchFilesFromServer().subscribe(
        (files: StoredFile[]) => {
          this.dataSource.data = files;
        }
      );
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getRecord(name) {
    alert(name);
  }


  ngOnDestroy(): void {
    this.filesListSubscription.unsubscribe();
  }
}

