import {Component, OnInit, ViewChild} from '@angular/core';
import {UploadService} from '../upload.service';
import {MatDialogRef} from '@angular/material/dialog';
import {forkJoin, Observable} from 'rxjs';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent {

  constructor(public dialogRef: MatDialogRef<DialogComponent>, public uploadService: UploadService) {
  }

  progressIndicator: { [x: string]: { progress: Observable<number>; } | { progress: any; }; };
  isCloseable = true;
  primaryButtonText = 'Upload Files';
  showCancelButton = true;
  uploadingStatus = false;
  uploadSuccessful = false;
  @ViewChild('fileInput') fileInput;
  public files: Set<File> = new Set();

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
    if (this.uploadSuccessful) { return this.dialogRef.close(); }
    this.uploadingStatus = true;
    this.progressIndicator = this.uploadService.uploadFiles(this.files);
    const allProgressObservables = [];
    for (const key in this.progressIndicator) {
      allProgressObservables.push(this.progressIndicator[key].progress);
    }

    this.primaryButtonText = 'Finish';
    this.isCloseable = false;
    this.dialogRef.disableClose = true;
    this.showCancelButton = false;
    forkJoin(allProgressObservables).subscribe(() => {
      this.isCloseable = true;
      this.dialogRef.disableClose = false;
      this.uploadSuccessful = true;
      this.uploadingStatus = false;
    });
  }
}

