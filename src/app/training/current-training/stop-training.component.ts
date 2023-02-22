import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-stop-training',
  template: `<h1 mat-dialog-title>Are you sure, you want to quit?</h1>
    <div mat-dialog-content>
      <mat-dialog-content>
        <p>You already got {{ passedData.progress }}% progress done.</p>
      </mat-dialog-content>
      <div mat-dailog-actions fxLayout fxLayoutAlign="center center">
        <button mat-button color="primary" [mat-dialog-close]="true">
          Yes
        </button>
        <button mat-button color="accent" [mat-dialog-close]="false">No</button>
      </div>
    </div>`,
})
export class StopTrainingComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public passedData: any) {}
}
