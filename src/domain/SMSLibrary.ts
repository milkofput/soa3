export class SMSLibrary {

    public sendSMS(name: string, phoneNumber: string, message: string): void {
        console.log(`Sent SMS to ${name} on ${phoneNumber}: ${message}`);
    }
}