import { Order } from "./Order";

export interface OrderObserver {
    update(order: Order): void;
}