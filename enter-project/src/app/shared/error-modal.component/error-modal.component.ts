import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

declare var bootstrap: any;

@Component({
  selector: 'app-error-modal',
  standalone: false,
  templateUrl: './error-modal.component.html',
  styleUrl: './error-modal.component.scss'
})
export class ErrorModalComponent implements AfterViewInit {

  @Input() modalTitleErr: string = 'Erro';
  @Input() mensagemErr: string = '';
  @Output() onClose = new EventEmitter<void>();

  @ViewChild('modalRef') modalRef!: ElementRef;

  private bsModal!: any;

  ngAfterViewInit() {
    if (this.modalRef) {
      this.bsModal = new bootstrap.Modal(this.modalRef.nativeElement);

      this.modalRef.nativeElement.addEventListener('hidden.bs.modal', () => {
        this.onClose.emit();
      });
    }
  }

  open() {
    this.bsModal?.show();
  }

  close() {
    this.bsModal?.hide();
  }
}

