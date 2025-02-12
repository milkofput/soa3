import { MovieTicket } from "./MovieTicket";

export interface ExportStrategy {
    exportTickets(seatReservations: MovieTicket[], totalPrice: number): void;
}