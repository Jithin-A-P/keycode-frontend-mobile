import { KioskQMedia } from "../models/kioskQMedia.model";

export class KioskQServiceCls {
  queues: { [key: string]: KioskQMedia[] };
  qMediaCounter = 0;

  constructor() {
    this.queues = {};
  }

  addToKioskQ(kioskId: string, kioskMedia: KioskQMedia) {
    if (!this.queues[kioskId]) {
      this.queues[kioskId] = [];
    }
    this.queues[kioskId].push({
      id: ++this.qMediaCounter,
      ...kioskMedia
    });
  }

  getKioskQ(kioskId: string) {
    return this.queues[kioskId];
  }

  getNextKioskQItem(kioskId: string) {
    return this.queues[kioskId].shift();
  }
}

const KioskQService = new KioskQServiceCls();

export default KioskQService;