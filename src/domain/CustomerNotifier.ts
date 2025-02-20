import { INotificationAdapter } from "./INotificationAdapter";
import { Order } from "./Order";
import { IOrderObserver } from "./IOrderObserver";

export class CustomerNotifier implements IOrderObserver {
    private notifier: INotificationAdapter;

    constructor(notifier: INotificationAdapter) {
        this.notifier = notifier;
    }

    public update(order: Order): void {
        this.notifier.sendMessage(order, order.getStatusMessage());
    }
}