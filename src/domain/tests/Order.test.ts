//Cyclomatische complexiteiten + pathtests + edge cases:
//1: Order.calculatePrice: 2
//1.1: Not eligible for discount
//1.2: Eligible for discount

// 2. Order.validateTickets: 4
// 2.1: Should throw error when no tickets in order
// 2.2: Should not throw error when one ticket in order
// 2.3: Should not throw error when multiple tickets in order
// 2.4: Should throw if not all tickets in order are for the same movie

// 3. Order.calculateTotalAmtPaidTickets: 3
// 3.1: Should return 0 when no tickets in order
// 3.2: Should return 1 when one ticket in non-student order on the weekend
// 3.3: Should return 1 when two tickets in non-student order on a weekday
// 3.4: Should return 1 when two tickets in student order on a weekend

// 4. Order.calculateTotalPrice: 4
// 4.1: Should return 0 when no tickets to pay
// 4.2: Should return 10 when one regular ticket to pay
// 4.3: Should return 13 when one premium ticket to pay on non-student order
// 4.4: Should return 12 when one premium ticket to pay on student order
// 4.5: Should return 20 when two regular tickets to pay

// 5. Order.isEligibleForDiscount: 4
// 5.1: Should return false when not a student order
// 5.2: Should return false when less than 6 tickets
// 5.3: Should return false when not on a sat/sun
// 5.4: Else return true

// TypeScript
import tap from 'tap';
import { Order } from "../../domain/Order"; // [src/domain/Order.ts](src/domain/Order.ts)
import { MovieTicket } from "../../domain/MovieTicket"; // [src/domain/MovieTicket.ts](src/domain/MovieTicket.ts)
import { MovieScreening } from "../../domain/MovieScreening"; // [src/domain/MovieScreening.ts](src/domain/MovieScreening.ts)
import { Movie } from "../../domain/Movie"; // [src/domain/Movie.ts](src/domain/Movie.ts)

// A helper to create a screening with a specific day of week.
// We create a date with forced day using Date.setDate.
function createScreening(movie: Movie, day: number, basePrice: number, isWeekend: boolean = false): MovieScreening {
  // Choose a base date and adjust to get desired day.
  // If isWeekend is true, we use a Sunday (0) if day===0 or Saturday (6).
  // Otherwise, we force a weekday from [1,2,3,4].
  let date: Date;
  if (isWeekend) {
    date = new Date('2025-02-09'); // Sunday => getDay() returns 0
  } else {
    date = new Date('2025-02-11'); // Tuesday => getDay() returns 2 (in [1,2,3,4])
  }
  return new MovieScreening(movie, date, basePrice);
}

// Dummy ticket builder. We add minimal functionality by wrapping the MovieScreening
// and letting getPrice() return the screening price.
function createTicket(screening: MovieScreening, premium: boolean): MovieTicket {
  return new MovieTicket(screening, premium, 1, 1);
}

tap.test("Order.calculatePrice", t => {
  const movie = new Movie("Test Movie");

  // 1.1 Not eligible for discount:
  // Use weekday screening (Tuesday) for non-student order.
  let screeningWeekday = createScreening(movie, 2, 10);
  let order1 = new Order(1, false);
  order1.addSeatReservation(createTicket(screeningWeekday, false)); // one ticket
  // calculatePrice calls validate and then uses calculateTotalPrice.
  // For one ticket non-discount, expected is 10.
  t.equal(order1.calculatePrice(), 10, "calculatePrice without discount returns full price");

  // 1.2 Eligible for discount:
  // A non-student order becomes eligible when there are >=6 paid tickets and screening on weekend (0 or 6).
  let screeningWeekend = createScreening(movie, 0, 10, true);
  let order2 = new Order(2, false);
  // add 6 tickets; since screening is weekend, calculateTotalAmtPaidTickets returns full count (6)
  for (let i = 0; i < 6; i++) {
    order2.addSeatReservation(createTicket(screeningWeekend, false));
  }
  // total price = 6*10 = 60, then discount applies: 60*0.9 = 54
  t.equal(order2.calculatePrice(), 54, "calculatePrice applies discount correctly");
  t.end();
});

tap.test("Order.validateTickets", t => {
  const movie = new Movie("Test Movie");
  let screening = createScreening(movie, 2, 10);
  
  // Use type any to access private method validateTickets().
  const getValidate = (order: Order) => (order as any).validateTickets.bind(order);

  // 2.1: Should throw error when no tickets are in order.
  let orderEmpty = new Order(1, false);
  t.throws(getValidate(orderEmpty), /No tickets in order/, "Throws error when order is empty");

  // 2.2: Should not throw when one ticket is in order.
  let orderOne = new Order(2, false);
  orderOne.addSeatReservation(createTicket(screening, false));
  t.doesNotThrow(getValidate(orderOne), "Does not throw for one ticket");

  // 2.3: Should not throw when multiple tickets are in order (all same movie).
  let orderMulti = new Order(3, false);
  orderMulti.addSeatReservation(createTicket(screening, false));
  orderMulti.addSeatReservation(createTicket(screening, true));
  t.doesNotThrow(getValidate(orderMulti), "Does not throw for multiple tickets of same movie");

  // 2.4: Should throw if not all tickets are for the same movie.
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

  // Helper to call private calculateTotalAmtPaidTickets()
  const getPaidTickets = (order: Order): number => (order as any).calculateTotalAmtPaidTickets();

  // 3.1: Should return 0 when no tickets in order.
  let orderEmpty = new Order(1, false);
  t.equal(getPaidTickets(orderEmpty), 0, "Returns 0 when order is empty");

  // 3.2: One ticket in non-student order on the weekend.
  let screeningWeekend = createScreening(movie, 0, 10, true);
  let orderNonStudentWeekend = new Order(2, false);
  orderNonStudentWeekend.addSeatReservation(createTicket(screeningWeekend, false));
  // Condition false so returns full count: 1.
  t.equal(getPaidTickets(orderNonStudentWeekend), 1, "Returns 1 for one ticket non-student weekend");

  // 3.3: Two tickets in non-student order on a weekday (weekday in [1,2,3,4]).
  let screeningWeekday = createScreening(movie, 2, 10);
  let orderNonStudentWeekday = new Order(3, false);
  orderNonStudentWeekday.addSeatReservation(createTicket(screeningWeekday, false));
  orderNonStudentWeekday.addSeatReservation(createTicket(screeningWeekday, false));
  // For 2 tickets, paid tickets = 2 - floor(2/2)=1.
  t.equal(getPaidTickets(orderNonStudentWeekday), 1, "Returns 1 for two tickets non-student weekday");

  // 3.4: Two tickets in student order on a weekend.
  let orderStudentWeekend = new Order(4, true);
  orderStudentWeekend.addSeatReservation(createTicket(screeningWeekend, false));
  orderStudentWeekend.addSeatReservation(createTicket(screeningWeekend, false));
  // For student, condition applies: 2 - floor(2/2)=1.
  t.equal(getPaidTickets(orderStudentWeekend), 1, "Returns 1 for two tickets student weekend");

  t.end();
});

tap.test("Order.calculateTotalPrice", t => {
  const movie = new Movie("Test Movie");
  let screening = createScreening(movie, 2, 10);
  
  // Helper to call private calculateTotalPrice(tickets: MovieTicket[])
  const getTotalPrice = (order: Order, tickets: MovieTicket[]): number => (order as any).calculateTotalPrice(tickets);

  // 4.1: Should return 0 when no tickets to pay
  let order = new Order(1, false);
  t.equal(getTotalPrice(order, []), 0, "Returns 0 for an empty array");
  
  // 4.2: One regular ticket (non-premium): price = screening price = 10.
  let regularTicket = createTicket(screening, false);
  t.equal(getTotalPrice(order, [regularTicket]), 10, "Returns 10 for one regular ticket");

  // 4.3: One premium ticket on non-student order: price + 3.
  let premiumTicket = createTicket(screening, true);
  t.equal(getTotalPrice(order, [premiumTicket]), 10 + 3, "Returns 13 for one premium ticket (non-student)");

  // 4.4: One premium ticket on student order: price + 2.
  let studentOrder = new Order(2, true);
  t.equal(getTotalPrice(studentOrder, [premiumTicket]), 10 + 2, "Returns 12 for one premium ticket (student)");

  // 4.5: Two regular tickets: 2*10 = 20.
  t.equal(getTotalPrice(order, [regularTicket, regularTicket]), 20, "Returns 20 for two regular tickets");

  t.end();
});

tap.test("Order.isEligibleForDiscount", t => {
  const movie = new Movie("Test Movie");

  // Helper to call private isEligibleForDiscount(totalPaidTickets: number)
  const isEligible = (order: Order, totalPaidTickets: number): boolean =>
    (order as any).isEligibleForDiscount(totalPaidTickets);

  // To determine discount eligibility, the method checks:
  //   !this.isStudentOrder && totalPaidTickets >= 6 && [0,6].includes(screening.getDate().getDay())
  
  // 5.1: Should return false when not a student order but totalPaidTickets < 6.
  let screeningWeekend = createScreening(movie, 0, 10, true); // getDay() returns 0
  let orderNonStudent = new Order(1, false);
  orderNonStudent.addSeatReservation(createTicket(screeningWeekend, false));
  t.equal(isEligible(orderNonStudent, 1), false, "Returns false when less than 6 tickets for non-student order");

  // 5.2: Also false when less than 6 tickets.
  t.equal(isEligible(orderNonStudent, 5), false, "Returns false when totalPaidTickets is less than 6");

  // 5.3: Should return false when screening day is not sat(6) or sun(0).
  let screeningWeekday = createScreening(movie, 2, 10); // Tuesday => getDay()=2
  let orderNonStudentWeekday = new Order(2, false);
  orderNonStudentWeekday.addSeatReservation(createTicket(screeningWeekday, false));
  t.equal(isEligible(orderNonStudentWeekday, 6), false, "Returns false when screening day is not weekend");

  // 5.4: Else return true (non-student order, >=6 tickets, screening on weekend)
  let orderEligible = new Order(3, false);
  // Manually push tickets with screeningWeekend so that validateTickets (if used) works.
  for (let i = 0; i < 6; i++) {
    orderEligible.addSeatReservation(createTicket(screeningWeekend, false));
  }
  // totalPaidTickets in this case is 6.
  t.equal(isEligible(orderEligible, 6), true, "Returns true when non-student order has >=6 tickets and screening is on weekend");

  t.end();
});
