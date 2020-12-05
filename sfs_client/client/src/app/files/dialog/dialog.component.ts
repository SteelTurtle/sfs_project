import {Component, ViewChild} from '@angular/core';
import {FileStorageService} from '../services/file-storage.service';
import {MatDialogRef} from '@angular/material/dialog';
import {forkJoin, Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent {

  primaryButtonText = 'Upload';
  progressIndicator: { [x: string]: { progress: Observable<number>; } | { progress: any; }; };
  isCloseable = true;
  fileIsTooBig = false;
  showCancelButton = true;
  uploadingStatus = false;
  uploadSuccessful = false;
  @ViewChild('fileInput') fileInput;
  @ViewChild('buttonInput') buttonInput;
  public files: Set<File> = new Set();

  constructor(private dialogRef: MatDialogRef<DialogComponent>,
              private fileStorageService: FileStorageService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  permitClickUploadButton(): boolean {
    if (this.files.size === 0) {
      return true;
    }
    for (const file of this.files.values()) {
      if (file.size > 20000000) {
        this.fileIsTooBig = true;
        return true;
      }
    }
    this.fileIsTooBig = false;
    return false;
  }

  addFiles(): void {
    this.fileInput.nativeElement.click();
  }

  onFilesAdded(): void {
    const files: { [key: string]: File } = this.fileInput.nativeElement.files;
    for (const key in files) {
      if (!isNaN(parseInt(key))) {
        this.files.add(files[key]);
      }
    }
  }

  closeDialog(): void {
    if (this.uploadSuccessful) {
      this.router.navigate(['files'], {relativeTo: this.route});
      return this.dialogRef.close();
    }
    this.buttonInput.disabled = true;
    this.uploadingStatus = true;
    this.progressIndicator = this.fileStorageService.uploadFiles(this.files);
    const allProgressObservables = [];
    for (const key in this.progressIndicator) {
      allProgressObservables.push(this.progressIndicator[key].progress);
    }
    this.isCloseable = false;
    this.dialogRef.disableClose = true;
    this.showCancelButton = false;
    forkJoin(allProgressObservables).subscribe(() => {
      this.buttonInput.disabled = false;
      this.primaryButtonText = 'Finish';
      this.isCloseable = true;
      this.dialogRef.disableClose = false;
      this.uploadSuccessful = true;
      this.uploadingStatus = false;
    });
  }
}

