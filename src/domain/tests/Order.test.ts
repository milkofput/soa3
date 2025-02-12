import tap from 'tap';
import { Order } from "../../domain/Order"; // [src/domain/Order.ts](src/domain/Order.ts)
import { MovieTicket } from "../../domain/MovieTicket"; // [src/domain/MovieTicket.ts](src/domain/MovieTicket.ts)
import { MovieScreening } from "../../domain/MovieScreening"; // [src/domain/MovieScreening.ts](src/domain/MovieScreening.ts)
import { Movie } from "../../domain/Movie"; // [src/domain/Movie.ts](src/domain/Movie.ts)
import { NonStudentOrderStrategy } from '../NonStudentOrderStrategy';
import { StudentOrderStrategy } from '../StudentOrderStrategy';

function createScreening(movie: Movie, basePrice: number, isWeekend: boolean = false): MovieScreening {
  let date: Date;
  if (isWeekend) {
    date = new Date('2025-02-09'); 
  } else {
    date = new Date('2025-02-11'); 
  }
  return new MovieScreening(movie, date, basePrice);
}

function createTicket(screening: MovieScreening, premium: boolean): MovieTicket {
  return new MovieTicket(screening, premium, 1, 1);
}

tap.test("Order.calculatePrice", t => {
  // 3 studenten premium weekend = 24
  let movie = new Movie("Test Movie");
  let screeningWeekend = createScreening(movie, 10, true);
  let order = new Order(1, new StudentOrderStrategy());
  for (let i = 0; i < 3; i++) {
    order.addSeatReservation(createTicket(screeningWeekend, true));
  }
  t.equal(order.performCalculatePrice(), 24, "3 student premium weekend tickets = 24");

  // 2 non student doordeweeks = 10
  let screeningWeekday = createScreening(movie, 10);
  let order2 = new Order(2, new NonStudentOrderStrategy());
  order2.addSeatReservation(createTicket(screeningWeekday, false));
  t.equal(order2.performCalculatePrice(), 10, "1 non student weekday ticket = 10");

  // 6 non student premium weekend = 70,2
  let order3 = new Order(3, new NonStudentOrderStrategy());
  for (let i = 0; i < 6; i++) {
    order3.addSeatReservation(createTicket(screeningWeekend, true));
  }
  t.equal(order3.performCalculatePrice(), 70.2, "6 non student premium weekend tickets = 70,2");

  t.end();
});

tap.test("Order.validateTickets", t => {
  const movie = new Movie("Test Movie");
  let screening = createScreening(movie, 10);

  // 2.1: Should throw error when no tickets are in order.
  let orderEmpty = new Order(1, new NonStudentOrderStrategy());
  t.throws(() => orderEmpty.validateOrder(), /No tickets in order/, "Throws error when order is empty");

  // 2.2: Should not throw error when one ticket is in order.
  let orderOne = new Order(2, new NonStudentOrderStrategy());
  orderOne.addSeatReservation(createTicket(screening, false));
  t.doesNotThrow(() => orderOne.validateOrder(), "Does not throw for one ticket");

  // 2.3: Should not throw error when multiple tickets are in order (all same movie).
  let orderMulti = new Order(3, new NonStudentOrderStrategy());
  orderMulti.addSeatReservation(createTicket(screening, false));
  orderMulti.addSeatReservation(createTicket(screening, true));
  t.doesNotThrow(() => orderMulti.validateOrder(), "Does not throw for multiple tickets of same movie");

  // 2.4: Should throw error if not all tickets are for the same movie.
  let differentMovie = new Movie("Another Movie");
  let screeningDiff = createScreening(differentMovie, 10);
  let orderMix = new Order(4, new NonStudentOrderStrategy());
  orderMix.addSeatReservation(createTicket(screening, false));
  orderMix.addSeatReservation(createTicket(screeningDiff, false));
  t.throws(() => orderMix.validateOrder(), /All tickets in order must be for the same movie/, "Throws error when tickets are for different movies");

  t.end();
});
