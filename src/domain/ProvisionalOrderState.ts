import { CancelledOrderState } from "./CancelledOrderState";
import { CompletedOrderState } from "./CompletedOrderState";
import { Order } from "./Order";
import { OrderState } from "./OrderState";

export class ProvisionalOrderState implements OrderState {
    constructor(private order: Order) {
    }

    public submit(): void {
        console.log("Cannot submit order that is provisional");
    }

    public modify(): void {
        console.log("Cannot modify order that is provisional");
    }

    public pay(): void {
        this.order.setState(new CompletedOrderState());
    }

    public payLater(): void {
        console.log("Cannot pay later for order that is provisional");
    }

    public cancel(): void {
        this.order.setState(new CancelledOrderState());
    }
}