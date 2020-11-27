import {Component, OnInit, ViewChild} from '@angular/core';
import {UploadService} from '../upload.service';
import {MatDialogRef} from '@angular/material/dialog';
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent {

  constructor(public dialogRef: MatDialogRef<DialogComponent>, public uploadService: UploadService) {
  }

  progress;
  canBeClosed = true;
  primaryButtonText = 'Upload';
  showCancelButton = true;
  uploading = false;
  uploadSuccessful = false;
  @ViewChild('file') file;
  public files: Set<File> = new Set();

  addFiles(): void {
    this.file.nativeElement.click();
  }

  onFilesAdded(): void {
    const files: { [key: string]: File } = this.file.nativeElement.files;
    for (const key in files) {
      if (!isNaN(parseInt(key))) {
        this.files.add(files[key]);
      }
    }
  }

  closeDialog(): void {
    if (this.uploadSuccessful) {
      return this.dialogRef.close();
    }
    this.uploading = true;
    this.progress = this.uploadService.upload(this.files);
    const allProgressObservables = [];
    for (const key in this.progress) {
      allProgressObservables.push(this.progress[key].progress);
    }

    // Adjust the state variables

    // The OK-button should have the text "Finish" now
    this.primaryButtonText = 'Finish';
    this.canBeClosed = false;
    this.dialogRef.disableClose = true;
    this.showCancelButton = false;
    forkJoin(allProgressObservables).subscribe(end => {
      this.canBeClosed = true;
      this.dialogRef.disableClose = false;
      this.uploadSuccessful = true;
      this.uploading = false;
    });
  }
}

