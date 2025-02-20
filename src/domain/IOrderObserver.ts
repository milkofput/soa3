import { Order } from "./Order";

export interface IOrderObserver {
    update(order: Order): void;
}