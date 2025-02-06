import { MovieScreening } from "./MovieScreening";

export class MovieTicket{
    constructor(private movieScreening: MovieScreening, private isPremium: boolean, private seatRow: number, private seatNr: number){ 
        
    }

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