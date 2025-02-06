import { Movie } from "./Movie";

export class MovieScreening {
    constructor(private movie: Movie, private dateAndTime: Date, private pricePerSeat: number) {
        
    }

    public getPricePerSeat(): number {
        return this.pricePerSeat;
    }

    public getDate(): Date {
        return this.dateAndTime;
    }

    public toString(): string {
        return `screening of: ${this.movie.toString()} at ${this.dateAndTime}`;
    }
}