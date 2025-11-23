export class WhatsAppMessage {

  userFk?: number;
  messagePk?: number;
  createdBy?: number;
  creationDate?: string | null;
  statusFl?: number;

  receiverNumber?: string;
  responseText?: string | null;
  whatsappMessage?: string;

  selected?: boolean = false;

  constructor(init?: Partial<WhatsAppMessage>) {}
}
