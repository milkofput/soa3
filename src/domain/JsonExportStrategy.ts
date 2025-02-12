import { ExportStrategy } from "./ExportStrategy";
import { MovieTicket } from "./MovieTicket";

export class JsonExportStrategy implements ExportStrategy {
    public exportTickets(seatReservations: MovieTicket[], totalPrice: number): void {
        console.log(JSON.stringify({tickets: seatReservations, totalPrice: totalPrice}));
    }
}