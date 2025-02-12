import { ExportStrategy } from "./ExportStrategy";
import { MovieTicket } from "./MovieTicket";

export class PlaintextExportStrategy implements ExportStrategy {
    public exportTickets(seatReservations: MovieTicket[], totalPrice: number): void {
        console.log("Total order:")
        console.log(seatReservations.map(ticket => ticket.toString()).join("   \n"));
        console.log("Total price: " + totalPrice);
    }
}