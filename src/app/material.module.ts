import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material';
import {MatInputModule, MatSelectModule} from '@angular/material';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatTableModule} from '@angular/material/table';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@NgModule({
  imports: [
    MatTabsModule, MatButtonModule, MatAutocompleteModule,
     MatFormFieldModule, MatInputModule, MatSelectModule,
      MatProgressBarModule, MatTableModule, MatExpansionModule,
    MatToolbarModule, MatCardModule, MatProgressSpinnerModule
    ],
  exports: [
    MatTabsModule, MatButtonModule, MatAutocompleteModule,
     MatFormFieldModule, MatInputModule, MatSelectModule,
     MatProgressBarModule, MatTableModule, MatExpansionModule,
    MatToolbarModule, MatCardModule, MatProgressSpinnerModule
    ],

})
export class MaterialModule { }
