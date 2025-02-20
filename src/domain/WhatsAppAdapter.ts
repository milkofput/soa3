import { INotificationAdapter } from "./INotificationAdapter";
import { Order } from "./Order";
import { WhatsAppLibrary } from "./WhatsAppLibrary";

export class WhatsAppAdapter implements INotificationAdapter {
    private whatsappLibrary = new WhatsAppLibrary();

    public sendMessage(order: Order, message: string): void {
        this.whatsappLibrary.sendWhatsAppMessage(order.getCustomer().getName(), order.getCustomer().getPhoneNumber(), message);
    }
}