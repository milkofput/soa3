import { Movie } from "./domain/Movie";
import { MovieScreening } from "./domain/MovieScreening";
import { MovieTicket } from "./domain/MovieTicket";
import { Order } from "./domain/Order";
import { TicketExportFormat } from "./domain/TicketExportFormat";

console.log("Softwareontwerp en -architectuur 3");

let movie = new Movie("The Matrix");

// any day studenten 2e gratis
let screening1 = new MovieScreening(movie, new Date('2025-02-08'), 10); // weekend: 10% korting nietstudents wanneer 6+ tickets
let screening2 = new MovieScreening(movie, new Date('2025-02-10'), 10); // doordeweeks: iedereen 2e gratis 

let ticket1 = new MovieTicket(screening1, false, 1, 1);
let ticket2 = new MovieTicket(screening1, false, 1, 2);
let ticket3 = new MovieTicket(screening1, true, 1, 3); // premium
let ticket4 = new MovieTicket(screening1, true, 1, 3); // premium

let ticket5 = new MovieTicket(screening2, false, 1, 1);
let ticket6 = new MovieTicket(screening2, false, 1, 2);
let ticket7 = new MovieTicket(screening2, true, 1, 3); // premium
let ticket8 = new MovieTicket(screening2, true, 1, 3); // premium

//niet premium niet student weekend
let order1 = new Order(1, false); // niet student order
order1.addSeatReservation(ticket1);
order1.addSeatReservation(ticket2);
console.log(order1.calculatePrice()); // 20

//premium niet student weekend
let order2 = new Order(1, false); // niet student order
order2.addSeatReservation(ticket3);
order2.addSeatReservation(ticket4);
console.log(order2.calculatePrice()); // 26

//niet premium student weekend
let order3 = new Order(1, true); // student order
order3.addSeatReservation(ticket1);
order3.addSeatReservation(ticket2);
console.log(order3.calculatePrice()); // 10

//premium student weekend
let order4 = new Order(1, true); // student order
order4.addSeatReservation(ticket3);
order4.addSeatReservation(ticket4);
console.log(order4.calculatePrice()); // 12

//niet premium niet student & student doordeweeks
let order5 = new Order(1, false); // niet student order
order5.addSeatReservation(ticket5);
order5.addSeatReservation(ticket6);
console.log(order5.calculatePrice()); // 10

//premium niet student doordeweeks
let order6 = new Order(1, false); // niet student order
order6.addSeatReservation(ticket7);
order6.addSeatReservation(ticket8);
console.log(order6.calculatePrice()); // 13

//premium student doordeweeks
let order7 = new Order(1, true); // student order
order7.addSeatReservation(ticket7);
order7.addSeatReservation(ticket8);
console.log(order7.calculatePrice()); // 12

// 7 tickets niet student weekend
let order8 = new Order(1, false); // niet student order
order8.addSeatReservation(ticket1);
order8.addSeatReservation(ticket2);
order8.addSeatReservation(ticket1);
order8.addSeatReservation(ticket2);
order8.addSeatReservation(ticket1);
order8.addSeatReservation(ticket2);
order8.addSeatReservation(ticket1);
console.log(order8.calculatePrice()); // 63

// 7 tickets niet student weekend premium'
let order9 = new Order(1, false); // niet student order
order9.addSeatReservation(ticket3);
order9.addSeatReservation(ticket4);
order9.addSeatReservation(ticket3);
order9.addSeatReservation(ticket4);
order9.addSeatReservation(ticket3);
order9.addSeatReservation(ticket4);
order9.addSeatReservation(ticket3);
console.log(order9.calculatePrice()); // 81,90

order9.export(TicketExportFormat.JSON);
order9.export(TicketExportFormat.PLAINTEXT);

/* ------------------------------ ORDER STATES ------------------------------*/

// order state pay immediately
let order10 = new Order(1, false); // CreatedOrderState
order10.addSeatReservation(ticket1);
order10.submit(); // ReservedOrderState
order10.pay(); // CompletedOrderState

// order state pay later
let order11 = new Order(1, false); // CreatedOrderState
order11.addSeatReservation(ticket1);
order11.submit(); // ReservedOrderState
order11.payLater(); // ProvisionalOrderState
order11.pay(); // CompletedOrderState

// order state modify then pay later then cancel
let order12 = new Order(1, false); // CreatedOrderState
order12.addSeatReservation(ticket1);
order12.submit(); // ReservedOrderState
order12.modify(); // CreatedOrderState
order12.submit(); // ReservedOrderState
order12.payLater(); // ProvisionalOrderState
order12.cancel(); // CancelledOrderState

// order can not be cancelled when completed
let order13 = new Order(1, false); // CreatedOrderState
order13.addSeatReservation(ticket1);
order13.submit(); // ReservedOrderState
order13.pay(); // CompletedOrderState
order13.cancel(); // CompletedOrderState