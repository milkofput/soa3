import tap from 'tap';
import { Movie } from '../Movie';
import { MovieScreening } from '../MovieScreening';
import { MovieTicket } from '../MovieTicket';
import { Order } from '../Order';
import { NonStudentOrderStrategy } from '../NonStudentOrderStrategy';
import { same } from 'tap/dist/commonjs/main';

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

tap.test("NonStudentOrderStrategy.discountedPrice", t => {
    const movie = new Movie("Test Movie");
    // 1.1: Should return full price when not eligble for discount.
    let screeningWeekday = createScreening(movie, 10);
    let ticket = createTicket(screeningWeekday, false);
    let strategy = new NonStudentOrderStrategy();
    let order1 = new Order(1, strategy);
    order1.addSeatReservation(ticket); // one ticket
    t.equal(strategy.discountedPrice(10, [ticket]), 10, "discountedPrice without discount returns full price");
    
    // 1.2: Should return price with 10% discount when eligible for discount.
    let screeningWeekend = createScreening(movie, 10, true);
    let tickets = [];
    let order2 = new Order(2, new NonStudentOrderStrategy());
    for (let i = 0; i < 6; i++) {
        tickets.push(createTicket(screeningWeekend, false));
        order2.addSeatReservation(tickets[i]);
    }
    t.equal(strategy.discountedPrice(60, tickets), 54, "discountedPrice applies discount correctly");
    t.end();
});

tap.test("NonStudentOrderStrategy.amtTicketsToPay", t => {
    const movie = new Movie("Test Movie");
    let strategy = new NonStudentOrderStrategy();

    // 3.1: Should return 0 when no tickets in order.
    t.equal(strategy.amtTicketsToPay([]), 0, "Returns 0 when order is empty");
  
    // 3.2: Should return 1 when one ticket in non-student order on the weekend.
    let screeningWeekend = createScreening(movie, 10, true);
    let ticket = createTicket(screeningWeekend, false);
    t.equal(strategy.amtTicketsToPay([ticket]), 1, "Returns 1 for one ticket non-student weekend");
  
    // 3.3: Should return 2 when three tickets in non-student order on a weekday.
    let screeningWeekday = createScreening(movie, 10);
    let tickets = [];
    for (let i = 0; i < 3; i++) {
      tickets.push(createTicket(screeningWeekday, false));
    }
    t.equal(strategy.amtTicketsToPay(tickets), 2, "Returns 2 for three tickets non-student weekday");
  
    t.end();
});

tap.test("NonStudentOrderStrategy.getSubtotal", t => {
    const movie = new Movie("Test Movie");
    let strategy = new NonStudentOrderStrategy();

    // Should return 26 when 2 premium tickets.
    let screeningWeekend = createScreening(movie, 10, true);
    let tickets = [];
    for (let i = 0; i < 2; i++) {
        tickets.push(createTicket(screeningWeekend, true));
    }
    t.equal(strategy.getSubtotal(tickets), 26, "Returns 26 for two premium tickets");

    // Should return 30 when 3 regular tickets.
    let screeningWeekday = createScreening(movie, 10);
    tickets = [];
    for (let i = 0; i < 3; i++) {
        tickets.push(createTicket(screeningWeekday, false));
    }
    t.equal(strategy.getSubtotal(tickets), 30, "Returns 30 for three regular tickets");

    //No tickets to pay
    t.equal(strategy.getSubtotal([]), 0, "Returns 0 when no tickets to pay");

    t.end();
});