import { INotificationAdapter } from "./INotificationAdapter";
import { Order } from "./Order";
import { OrderObserver } from "./OrderObserver";

export class CustomerNotifier implements OrderObserver {
    private notifier: INotificationAdapter;

    constructor(notifier: INotificationAdapter) {
        this.notifier = notifier;
    }

    public update(order: Order): void {
        this.notifier.sendMessage(order, order.getStatusMessage());
    }
}