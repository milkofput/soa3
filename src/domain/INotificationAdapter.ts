import { Order } from "./Order";

export interface INotificationAdapter {
    sendMessage(order: Order, message: String): void;
}