import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {DialogComponent} from '../dialog/dialog.component';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent {
  constructor(public dialog: MatDialog) {
  }

  public openUploadDialog(): void {
    this.dialog.open(DialogComponent, {
      width: '50%',
      height: '50%',
    });
  }
}
