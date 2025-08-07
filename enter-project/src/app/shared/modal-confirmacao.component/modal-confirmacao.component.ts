import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

declare var bootstrap: any;

@Component({
  standalone: false,
  selector: 'app-modal-confirmacao',
  templateUrl: './modal-confirmacao.component.html',
  styleUrl: './modal-confirmacao.component.scss'
})
export class ModalConfirmacaoComponent implements AfterViewInit {
  @Input() modalTitle: string = 'Confirmar ação';
  @Input() mensagem: string = 'Tem certeza?';
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onClose = new EventEmitter<void>();

  @ViewChild('modalRef') modalRef!: ElementRef;
  private bsModal!: any;

  ngAfterViewInit(): void {
    if (this.modalRef) {
      this.bsModal = new bootstrap.Modal(this.modalRef.nativeElement);
      this.modalRef.nativeElement.addEventListener('hidden.bs.modal', () => {
        this.onClose.emit();
      });
    }
  }

  open(): void {
    this.bsModal?.show();
  }

  close(): void {
    this.bsModal?.hide();
  }

  confirmar(): void {
    this.onConfirm.emit();
    this.close();
  }
}

