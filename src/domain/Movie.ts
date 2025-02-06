import { MovieScreening } from "./MovieScreening";

export class Movie {
    constructor(private title: string) {
        
    }

    public addScreening(screening: MovieScreening): void {
        // ...
    }

    public toString(): string {
        return this.title;
    }
}