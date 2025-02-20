export interface OrderState {
    submit(): void;
    modify(): void;
    pay(): void;
    payLater(): void;
    cancel(): void;
}