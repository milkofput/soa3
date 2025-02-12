import { MovieTicket } from "./MovieTicket";
import { OrderStrategy } from "./OrderStrategy";

export class NonStudentOrderStrategy implements OrderStrategy {
    private weekdays = [1, 2, 3, 4];
    private weekend = [0, 5, 6];

    public calculateTotalPrice(seatReservations: MovieTicket[]): number {
        const ticketsToPay = seatReservations.slice(0, this.amtTicketsToPay(seatReservations));
        let totalPrice = this.getSubtotal(ticketsToPay);
        return this.discountedPrice(totalPrice, seatReservations);
    }

    public getSubtotal(ticketsToPay: MovieTicket[]): number {
        let totalPrice = 0;
        for (let ticket of ticketsToPay) {
            if (ticket.isPremiumTicket()) {
                totalPrice += ticket.getPrice() + 3;
            } else {
                totalPrice += ticket.getPrice();
            }
        }
        return totalPrice;
    }

    public amtTicketsToPay(seatReservations: MovieTicket[]): number {
        if (this.weekdays.includes(seatReservations[0]?.getMovieScreening()?.getDate().getDay())) {
            return seatReservations.length - Math.floor(seatReservations.length / 2);
        } else {
            return seatReservations.length;
        }
    }

    public discountedPrice(totalPrice: number, seatReservations: MovieTicket[]): number {
        if (seatReservations.length >= 6 && this.weekend.includes(seatReservations[0].getMovieScreening().getDate().getDay())) {
            return totalPrice * 0.9;
        } else {
            return totalPrice;
        }
    }
}