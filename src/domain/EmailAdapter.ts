import { EmailLibrary } from "./EmailLibrary";
import { INotificationAdapter } from "./INotificationAdapter";
import { Order } from "./Order";

export class EmailAdapter implements INotificationAdapter {
    private emailLibrary = new EmailLibrary();

    public sendMessage(order: Order, message: string): void {
        this.emailLibrary.sendEmail(order.getCustomer().getName(), order.getCustomer().getEmail(), "Order status", message);
    }

   
}