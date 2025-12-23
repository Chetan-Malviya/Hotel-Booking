import express from "express";
import { checkAvailabilityAPI, createBooking, getHotelBookings, getUserBookings } from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js"

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabilityAPI);
bookingRouter.post('/book', createBooking);
bookingRouter.get('/user', getUserBookings);
bookingRouter.get('/hotel', getHotelBookings);

export default bookingRouter;