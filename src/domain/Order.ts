import { MovieTicket } from "./MovieTicket";
import { TicketExportFormat } from "./TicketExportFormat";

export class Order {
    private seatReservations: MovieTicket[] = [];

    constructor(private orderNr: number, private isStudentOrder: boolean) {
        
    }

    public getOrderNr(): number {
        return this.orderNr;
    }

    public addSeatReservation(ticket: MovieTicket): void {
        this.seatReservations.push(ticket);
    }

    public calculatePrice(): number {
        let totalAmtPaidTickets = 0;
        let totalPrice = 0;
        let ticketsToPay = this.seatReservations;

        if (this.seatReservations.length === 0) {
            throw new Error("No tickets in order");
        }
        for (let ticket of this.seatReservations) {
            if (ticket.getMovieScreening() !== this.seatReservations[0].getMovieScreening()) {
                throw new Error("All tickets in order must be for the same movie");
            }
        }

        // als studentOrder dan 2e ticket gratis
        if (this.isStudentOrder) {
            totalAmtPaidTickets = this.seatReservations.length - Math.floor(this.seatReservations.length / 2);
        // als niet studentOrder en ma/di/woe/do dan 2e ticket gratis
        } else if ([1, 2, 3, 4].includes(this.seatReservations[0].getMovieScreening().getDate().getDay())) {
            totalAmtPaidTickets = this.seatReservations.length - Math.floor(this.seatReservations.length / 2);
        // anders, alle tickets betalen
        } else {
            totalAmtPaidTickets = this.seatReservations.length;
        }

        ticketsToPay = ticketsToPay.slice(0, totalAmtPaidTickets);
        

        // als studentOrder en premium dan 2 euro extra
        if (this.isStudentOrder) {
            for (let ticket of ticketsToPay) {
                if (ticket.isPremiumTicket()) {
                    totalPrice += ticket.getPrice() + 2;
                } else {
                    totalPrice += ticket.getPrice();
                }
            }
        // als niet studentOrder en premium dan 3 euro extra
        } else {
            for (let ticket of ticketsToPay) {
                if (ticket.isPremiumTicket()) {
                    totalPrice += ticket.getPrice() + 3;
                } else {
                    totalPrice += ticket.getPrice();
                }
            }
        }

        // als niet studentOrder en meer dan 6 kaartjes en weekend dan 10% korting
        if (!this.isStudentOrder && totalAmtPaidTickets >= 6 && [0, 6].includes(this.seatReservations[0].getMovieScreening().getDate().getDay())) {
            totalPrice = totalPrice * 0.9;
        }

        return totalPrice;
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