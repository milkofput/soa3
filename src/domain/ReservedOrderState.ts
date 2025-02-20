import { CancelledOrderState } from "./CancelledOrderState";
import { CompletedOrderState } from "./CompletedOrderState";
import { CreatedOrderState } from "./CreatedOrderState";
import { Order } from "./Order";
import { OrderState } from "./IOrderState";
import { ProvisionalOrderState } from "./ProvisionalOrderState";

export class ReservedOrderState implements OrderState {
    constructor(private order: Order) {
    }

    public submit(): void {
        console.log("Cannot submit order that is already reserved");
    }

    public modify(): void {
        this.order.setState(new CreatedOrderState(this.order));
    }

    public pay(): void {
        this.order.setState(new CompletedOrderState());
        this.order.setStatusMessage("Order has been paid and completed");
    }

    public payLater(): void {
        this.order.setState(new ProvisionalOrderState(this.order));
        this.order.setStatusMessage("This is a reminder to pay for your order, it will be cancelled if not paid within 12 hours");
    }

    public cancel(): void {
        this.order.setState(new CancelledOrderState());
        this.order.setStatusMessage("Order has been cancelled");
    }
}