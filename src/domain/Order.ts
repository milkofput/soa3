import { MovieTicket } from "./MovieTicket";
import { TicketExportFormat } from "./TicketExportFormat";

export class Order {
    private readonly seatReservations: MovieTicket[] = [];
    private weekdays = [1, 2, 3, 4];
    private weekend = [0, 5, 6];

    constructor(private readonly orderNr: number, private readonly isStudentOrder: boolean) {}

    public getOrderNr(): number {
        return this.orderNr;
    }

    public addSeatReservation(ticket: MovieTicket): void {
        this.seatReservations.push(ticket);
    }

    public calculatePrice(): number {
        this.validateTickets();

        const totalAmtPaidTickets = this.calculateTotalAmtPaidTickets();
        const ticketsToPay = this.seatReservations.slice(0, totalAmtPaidTickets);
        let totalPrice = this.calculateTotalPrice(ticketsToPay);

        if (this.isEligibleForDiscount(totalAmtPaidTickets)) {
            totalPrice = totalPrice * 0.9;
        }

        return totalPrice;
    }

    //Controleer of tickets voor zelfde film zijn
    private validateTickets(): void {
        if (this.seatReservations.length === 0) {
            throw new Error("No tickets in order");
        }
        for (let ticket of this.seatReservations) {
            if (ticket.getMovieScreening() !== this.seatReservations[0].getMovieScreening()) {
                throw new Error("All tickets in order must be for the same movie");
            }
        }
    }

    //2e ticket gratis bij studentorder of doordeweeks
    private calculateTotalAmtPaidTickets(): number {
        if (this.isStudentOrder || this.weekdays.includes(this.seatReservations[0]?.getMovieScreening?.().getDate().getDay())) {
            return this.seatReservations.length - Math.floor(this.seatReservations.length / 2);
        } else {
            return this.seatReservations.length;
        }
    }

    //Premium tickets 2 of 3 euro extra
    private calculateTotalPrice(ticketsToPay: MovieTicket[]): number {
        let totalPrice = 0;
        for (let ticket of ticketsToPay) {
            if (ticket.isPremiumTicket()) {
                totalPrice += ticket.getPrice() + (this.isStudentOrder ? 2 : 3);
            } else {
                totalPrice += ticket.getPrice();
            }
        }
        return totalPrice;
    }

    //6 of meer tickets in het weekend voor niet studentorder
    private isEligibleForDiscount(totalAmtPaidTickets: number): boolean {
        return !this.isStudentOrder 
            && totalAmtPaidTickets >= 6 
            && this.weekend.includes(this.seatReservations[0].getMovieScreening().getDate().getDay());
    }

    public export(exportFormat: TicketExportFormat): void {
        switch (exportFormat) {
            case TicketExportFormat.JSON:
                console.log(JSON.stringify({tickets: this.seatReservations, totalPrice: this.calculatePrice()}));
                break;
            case TicketExportFormat.PLAINTEXT:
                console.log("Total order:")
                console.log(this.seatReservations.map(ticket => ticket.toString()).join("   \n"));
                console.log("Total price: " + this.calculatePrice());
                break;
            default:
                throw new Error("Unknown export format");
        }
    }
}