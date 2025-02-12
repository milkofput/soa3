import { ExportStrategy } from "./ExportStrategy";
import { MovieTicket } from "./MovieTicket";
import { OrderStrategy } from "./OrderStrategy";

export class Order {
    private readonly seatReservations: MovieTicket[] = [];
    private exportStrategy: ExportStrategy | undefined;

    constructor(private readonly orderNr: number, private orderStrategy: OrderStrategy) {}

    public getOrderNr(): number {
        return this.orderNr;
    }

    public addSeatReservation(ticket: MovieTicket): void {
        this.seatReservations.push(ticket);
    }

    public performCalculatePrice(): number {
        this.validateOrder();
        let totalPrice = this.orderStrategy.calculateTotalPrice(this.seatReservations);
        return totalPrice;
    }

    public validateOrder(): void {
        if(this.seatReservations.length === 0) {
            throw new Error("No tickets in order");
        }
        for(let ticket of this.seatReservations) {
            if(ticket.getMovieScreening() !== this.seatReservations[0].getMovieScreening()) {
                throw new Error("All tickets in order must be for the same movie");
            }
        }
    }

    public setExportStrategy(exportStrategy: ExportStrategy): void {
        this.exportStrategy = exportStrategy;
    }

    public performExport(): void {
        this.exportStrategy?.exportTickets(this.seatReservations, this.performCalculatePrice());
    }
}