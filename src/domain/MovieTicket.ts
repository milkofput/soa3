import { MovieScreening } from "./MovieScreening";

export class MovieTicket{
    constructor(private readonly movieScreening: MovieScreening, private readonly isPremium: boolean, private readonly seatRow: number, private readonly seatNr: number){}

    public isPremiumTicket(): boolean{
        return this.isPremium;
    }

    public getPrice(): number{
        return this.movieScreening.getPricePerSeat();
    }

    public getMovieScreening(): MovieScreening{
        return this.movieScreening;
    }

    public toString(): string{
        return `Ticket for ${this.movieScreening.toString()}, premium: ${this.isPremium}, seat: ${this.seatRow}-${this.seatNr}`;
    }

}