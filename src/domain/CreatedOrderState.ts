import { Order } from "./Order";
import { OrderState } from "./OrderState";
import { ReservedOrderState } from "./ReservedOrderState";

export class CreatedOrderState implements OrderState {
    constructor(private order: Order) {
    }

    public submit(): void {
        this.order.setState(new ReservedOrderState(this.order));
    }

    public modify(): void {
        console.log("Order has not been submitted and can still be modified");
    }

    public pay(): void {
        console.log("Submit order before paying");
    }

    public payLater(): void {
        console.log("Submit order before selecting pay later");
    }

    public cancel(): void {
        console.log("No need to cancel order that is not yet submitted");
    }
}