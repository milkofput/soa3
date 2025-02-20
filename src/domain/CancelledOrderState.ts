import { INotificationAdapter } from "./INotificationAdapter";
import { OrderState } from "./OrderState";

export class CancelledOrderState implements OrderState {
    constructor() {
    }
    
    public submit(): void {
        console.log("Cannot submit order that is already cancelled");
    }

    public modify(): void {
        console.log("Cannot modify order that is already cancelled");
    }

    public pay(): void {
        console.log("Cannot pay for order that is already cancelled");
    }

    public payLater(): void {
        console.log("Cannot pay later for order that is already cancelled");
    }

    public cancel(): void {
        console.log("Cannot cancel order that is already cancelled");
    }
}