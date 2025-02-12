import tap from 'tap';
import { Movie } from '../Movie';
import { MovieScreening } from '../MovieScreening';
import { MovieTicket } from '../MovieTicket';
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

tap.test("StudentOrderStrategy.calculateTotalPrice", t => {
  //Should return 10 for one ticket
  let movie = new Movie("Test Movie");
  let screening = createScreening(movie, 10);
  let ticket = createTicket(screening, false);
  let strategy = new StudentOrderStrategy();
  t.equal(strategy.calculateTotalPrice([ticket]), 10, "calculateTotalPrice returns full ticket price");

  //Should return 12 for a premium ticket
  let ticketPremium = createTicket(screening, true);
  t.equal(strategy.calculateTotalPrice([ticketPremium]), 12, "calculateTotalPrice returns premium ticket price");

  //Should return 20 for three tickets
  let tickets = [];
  for (let i = 0; i < 3; i++) {
    tickets.push(createTicket(screening, false));
  }
  t.equal(strategy.calculateTotalPrice(tickets), 20, "calculateTotalPrice halves the amount of tickets rounded up");
  t.end();
});

