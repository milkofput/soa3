import { OrderState } from "./IOrderState";

export class CompletedOrderState implements OrderState {
    constructor() {
    }
    
    public submit(): void {
        console.log("Cannot submit order that is already completed");
    }

    public modify(): void {
        console.log("Cannot modify order that is already completed");
    }

    public pay(): void {
        console.log("Cannot pay for order that is already completed");
    }

    public payLater(): void {
        console.log("Cannot pay later for order that is already completed");
    }

    public cancel(): void {
        console.log("Cannot cancel order that is already completed");
    }
}