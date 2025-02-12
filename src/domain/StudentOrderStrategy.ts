import { MovieTicket } from "./MovieTicket";
import { OrderStrategy } from "./OrderStrategy";

export class StudentOrderStrategy implements OrderStrategy {
    public calculateTotalPrice(seatReservations: MovieTicket[]): number {
        const amtTicketsToPay = seatReservations.length - Math.floor(seatReservations.length / 2);
        const ticketsToPay = seatReservations.slice(0, amtTicketsToPay);
        let totalPrice = 0;
        for (let ticket of ticketsToPay) {
            if (ticket.isPremiumTicket()) {
                totalPrice += ticket.getPrice() + 2;
            } else {
                totalPrice += ticket.getPrice();
            }
        }
        return totalPrice;
    }
}