import { MovieTicket } from "./MovieTicket";

export interface OrderStrategy {
    calculateTotalPrice(seatReservations: MovieTicket[]): number;
}
