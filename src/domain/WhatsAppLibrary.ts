export class WhatsAppLibrary {

    public sendWhatsAppMessage(name: string, phoneNumber: string, message: string): void {
        console.log(`Sent WhatsApp message to ${name} on ${phoneNumber}: ${message}`);
    }
}