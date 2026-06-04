import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { ConfigEmailComponent } from './config-email.component';

const routes: Routes = [{ path: '', component: ConfigEmailComponent }];

@NgModule({
  declarations: [ConfigEmailComponent],
  imports: [CommonModule, FormsModule, PoModule, RouterModule.forChild(routes)],
})
export class ConfigEmailModule {}
