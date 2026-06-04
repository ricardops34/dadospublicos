import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { WhatsappButtonComponent } from './whatsapp-button.component';

@NgModule({
  declarations: [WhatsappButtonComponent],
  imports: [CommonModule, FormsModule, HttpClientModule],
  exports: [WhatsappButtonComponent],
})
export class WhatsappButtonModule {}
