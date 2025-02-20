export interface IOrderState {
    submit(): void;
    modify(): void;
    pay(): void;
    payLater(): void;
    cancel(): void;
}