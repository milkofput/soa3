import tap from 'tap';
import { Order } from "../../domain/Order"; // [src/domain/Order.ts](src/domain/Order.ts)
import { MovieTicket } from "../../domain/MovieTicket"; // [src/domain/MovieTicket.ts](src/domain/MovieTicket.ts)
import { MovieScreening } from "../../domain/MovieScreening"; // [src/domain/MovieScreening.ts](src/domain/MovieScreening.ts)
import { Movie } from "../../domain/Movie"; // [src/domain/Movie.ts](src/domain/Movie.ts)

function createScreening(movie: Movie, day: number, basePrice: number, isWeekend: boolean = false): MovieScreening {
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
  const movie = new Movie("Test Movie");

  // 1.1: Should return full price when eligble for discount.
  let screeningWeekday = createScreening(movie, 2, 10);
  let order1 = new Order(1, false);
  order1.addSeatReservation(createTicket(screeningWeekday, false)); // one ticket
  t.equal(order1.calculatePrice(), 10, "calculatePrice without discount returns full price");

  // 1.2: Should return price with 10% discount when eligible for discount.
  let screeningWeekend = createScreening(movie, 0, 10, true);
  let order2 = new Order(2, false);
  for (let i = 0; i < 6; i++) {
    order2.addSeatReservation(createTicket(screeningWeekend, false));
  }
  t.equal(order2.calculatePrice(), 54, "calculatePrice applies discount correctly");
  t.end();
});

tap.test("Order.validateTickets", t => {
  const movie = new Movie("Test Movie");
  let screening = createScreening(movie, 2, 10);
  
  const getValidate = (order: Order) => (order as any).validateTickets.bind(order);

  // 2.1: Should throw error when no tickets are in order.
  let orderEmpty = new Order(1, false);
  t.throws(getValidate(orderEmpty), /No tickets in order/, "Throws error when order is empty");

  // 2.2: Should not throw error when one ticket is in order.
  let orderOne = new Order(2, false);
  orderOne.addSeatReservation(createTicket(screening, false));
  t.doesNotThrow(getValidate(orderOne), "Does not throw for one ticket");

  // 2.3: Should not throw error when multiple tickets are in order (all same movie).
  let orderMulti = new Order(3, false);
  orderMulti.addSeatReservation(createTicket(screening, false));
  orderMulti.addSeatReservation(createTicket(screening, true));
  t.doesNotThrow(getValidate(orderMulti), "Does not throw for multiple tickets of same movie");

  // 2.4: Should throw error if not all tickets are for the same movie.
  let differentMovie = new Movie("Another Movie");
  let screeningDiff = createScreening(differentMovie, 2, 10);
  let orderMix = new Order(4, false);
  orderMix.addSeatReservation(createTicket(screening, false));
  orderMix.addSeatReservation(createTicket(screeningDiff, false));
  t.throws(getValidate(orderMix), /All tickets in order must be for the same movie/, "Throws error when tickets are for different movies");

  t.end();
});

tap.test("Order.calculateTotalAmtPaidTickets", t => {
  const movie = new Movie("Test Movie");
  const getPaidTickets = (order: Order): number => (order as any).calculateTotalAmtPaidTickets();

  // 3.1: Should return 0 when no tickets in order.
  let orderEmpty = new Order(1, false);
  t.equal(getPaidTickets(orderEmpty), 0, "Returns 0 when order is empty");

  // 3.2: Should return 1 when one ticket in non-student order on the weekend.
  let screeningWeekend = createScreening(movie, 0, 10, true);
  let orderNonStudentWeekend = new Order(2, false);
  orderNonStudentWeekend.addSeatReservation(createTicket(screeningWeekend, false));
  t.equal(getPaidTickets(orderNonStudentWeekend), 1, "Returns 1 for one ticket non-student weekend");

  // 3.3: Should return 2 when three tickets in non-student order on a weekday.
  let screeningWeekday = createScreening(movie, 2, 10);
  let orderNonStudentWeekday = new Order(3, false);
  orderNonStudentWeekday.addSeatReservation(createTicket(screeningWeekday, false));
  orderNonStudentWeekday.addSeatReservation(createTicket(screeningWeekday, false));
  orderNonStudentWeekday.addSeatReservation(createTicket(screeningWeekday, false));
  t.equal(getPaidTickets(orderNonStudentWeekday), 2, "Returns 2 for three tickets non-student weekday");

  // 3.4: Should return 1 when two tickets in student order on a weekend.
  let orderStudentWeekend = new Order(4, true);
  orderStudentWeekend.addSeatReservation(createTicket(screeningWeekend, false));
  orderStudentWeekend.addSeatReservation(createTicket(screeningWeekend, false));
  t.equal(getPaidTickets(orderStudentWeekend), 1, "Returns 1 for two tickets student weekend");

  t.end();
});

tap.test("Order.calculateTotalPrice", t => {
  const movie = new Movie("Test Movie");
  let screening = createScreening(movie, 2, 10);
  const getTotalPrice = (order: Order, tickets: MovieTicket[]): number => (order as any).calculateTotalPrice(tickets);

  // 4.1: Should return 0 when no tickets to pay.
  let order = new Order(1, false);
  t.equal(getTotalPrice(order, []), 0, "Returns 0 for an empty array");
  
  // 4.2: Should return 10 when one regular ticket to pay.
  let regularTicket = createTicket(screening, false);
  t.equal(getTotalPrice(order, [regularTicket]), 10, "Returns 10 for one regular ticket");

  // 4.3: Should return 13 when one premium ticket to pay on non-student order.
  let premiumTicket = createTicket(screening, true);
  t.equal(getTotalPrice(order, [premiumTicket]), 10 + 3, "Returns 13 for one premium ticket (non-student)");

  // 4.4: Should return 12 when one premium ticket to pay on student order.
  let studentOrder = new Order(2, true);
  t.equal(getTotalPrice(studentOrder, [premiumTicket]), 10 + 2, "Returns 12 for one premium ticket (student)");

  // 4.5: Should return 20 when two regular tickets to pay.
  t.equal(getTotalPrice(order, [regularTicket, regularTicket]), 20, "Returns 20 for two regular tickets");

  t.end();
});

tap.test("Order.isEligibleForDiscount", t => {
  const movie = new Movie("Test Movie");
  const isEligible = (order: Order, totalPaidTickets: number): boolean =>
    (order as any).isEligibleForDiscount(totalPaidTickets);

  // 5.1: Should return false when a student order.
  let screeningWeekend = createScreening(movie, 0, 10, true); // getDay() returns 0
  let studentOrder = new Order(1, true);
  studentOrder.addSeatReservation(createTicket(screeningWeekend, false));
  t.equal(isEligible(studentOrder, 1), false, "Returns false when less than 6 tickets for non-student order");

  // 5.2: Should return false when non-student order but less than 6 tickets.
  let nonStudentOrder = new Order(1, false);
  nonStudentOrder.addSeatReservation(createTicket(screeningWeekend, false));
  t.equal(isEligible(nonStudentOrder, 5), false, "Returns false when totalPaidTickets is less than 6");

  // 5.3: Should return false when non-student order with at least 6 tickets but screening day is not on the weekend.
  let screeningWeekday = createScreening(movie, 2, 10); 
  let nonStudentOrderWeekday = new Order(2, false);
  nonStudentOrderWeekday.addSeatReservation(createTicket(screeningWeekday, false));
  t.equal(isEligible(nonStudentOrderWeekday, 6), false, "Returns false when screening day is not weekend");

  // 5.4: Should return true when non-student order, >=6 tickets and screening on weekend.
  let orderEligible = new Order(3, false);
  for (let i = 0; i < 6; i++) {
    orderEligible.addSeatReservation(createTicket(screeningWeekend, false));
  }
  t.equal(isEligible(orderEligible, 6), true, "Returns true when non-student order has >=6 tickets and screening is on weekend");

  t.end();
});
