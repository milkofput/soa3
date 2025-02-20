import { INotificationAdapter } from "./INotificationAdapter";

export class Customer {
    constructor(
        private name: string,
        private email: string,
        private phoneNumber: string,
        private preferredNotificationChannel: INotificationAdapter
    ) {}

    public getName(): string {
        return this.name;
    }

    public getEmail(): string {
        return this.email;
    }

    public getPhoneNumber(): string {
        return this.phoneNumber;
    }

    public getPreferredNotificationChannel(): INotificationAdapter {
        return this.preferredNotificationChannel;
    }
}