export class EmailLibrary {

    public sendEmail(name: string, emailAdress: string, subject: string, body: string): void {
        console.log(`Sent e-mail to ${name} on ${emailAdress} with subject ${subject}: ${body}`);
    }
}