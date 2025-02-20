import { INotificationAdapter } from "./INotificationAdapter";
import { Order } from "./Order";
import { SMSLibrary } from "./SMSLibrary";

export class SMSAdapter implements INotificationAdapter {
    private smsLibrary = new SMSLibrary();

    public sendMessage(order: Order, message: string): void {
        this.smsLibrary.sendSMS(order.getCustomer().getName(), order.getCustomer().getPhoneNumber(), message);
    }

   
}