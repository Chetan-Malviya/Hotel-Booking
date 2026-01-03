import transporter from "../configs/nodemailer.js";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import stripe from "stripe";


// Function to check Availabity of Room 
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
  try {
    const bookings = await Booking.find({
      room,
      checkInDate: {$lte: checkOutDate},
      checkOutDate: {$gte: checkInDate},
    });
    const isAvailable = bookings.length === 0;
    return isAvailable;

  } catch (error) {
    console.error(error.message);
  }
}

// API to check Availability of Room
// POST /api/bookings/check-availability
export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;
    const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
    res.json({ success: true, isAvailable })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// API to create new booking
// POST /api/bookings/book
export const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests } = req.body;
    const user = req.user._id;

    // Before booking check Availability
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room
    });

    if(!isAvailable) {
      return res.json({ success: false, message: "Room is not Available" })
    }

    // Get total Price From Room
    const roomData = await Room.findById(room).populate("hotel");
    let totalPrice = roomData.pricePerNight;

    // Calculate total price based on nigths
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    totalPrice *= nights;
    const booking = await Booking.create({
      user,
      room,
      hotel: roomData.hotel._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice,
    })

    // Send confirmation email if SMTP is configured; booking should not fail on email issues
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: req.user.email,
      subject: 'Hotel Booking Details',
      html: `
              <h2>Your Booking Details</h2>
              <p>Dear ${req.user.username},</p>
              <p>Thank You for your booking! Here are your details:</p>
              <ul>
                  <li><strong>Booking Id:</strong> ${booking._id}</li>
                  <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
                  <li><strong>Location:</strong> ${roomData.hotel.address}</li>
                  <li><strong>Date:</strong> ${booking.checkInDate.toDateString()}</li>
                  <li><strong>Booking Amount:</strong> ${process.env.CURRENCY || '$'} ${booking.totalPrice} /night</li>
              </ul>
              <p>we look forward to welcoming you!</p>
              <p>If you need to make any changes, feel free to contact us.</p>
      `
    }

    try {
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        await transporter.sendMail(mailOptions)
      } else {
        console.warn('SMTP credentials missing; booking email not sent')
      }
    } catch (mailError) {
      console.warn('Failed to send booking email:', mailError.message)
    }

    res.json({ success: true, message: "Booking Created Successfully"})

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed To Create Booking" })
  }
}

// API to get all booking for a user
// GET /api/bookings/user
export const getUserBookings = async (req, res) => {
  try {
    const user = req.user._id;
    const bookings = await Booking.find({user}).populate("room hotel").sort({createdAt: -1})
    res.json({success: true, bookings})
  } catch (error) {
    res.json({success: false, message: "Failed to fetch bookings"});
  }
}

export const getHotelBookings = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({owner: req.auth.userId});
  if(!hotel) {
    return res.json({ success: false, message: "No Hotel Found"});
  }
  const bookings = await Booking.find({hotel: hotel._id}).populate("room hotel user").sort({createdAt: -1});
  // Total Booking
  const totalBookings = bookings.length;
  // Total Revenue
  const totalRevenue = bookings.reduce((acc, booking)=>acc + booking.totalPrice, 0)

  res.json({success: true, dashboardData: {totalBookings, totalRevenue, bookings}})

  } catch (error) {
    res.json({success: false, message: "Failed to fetch Bookings"})
  }
}

export const stripePayment = async (req, res) => {
  try {
    const {bookingId} = req.body;

    const booking = await Booking.findById(bookingId);
    const roomData = await Room.findById(booking.room).populate('hotel');
    const totalPrice = booking.totalPrice;
    const {origin} = req.headers;

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = [
      {
        price_data:{
          currency: "usd",
          product_data:{
            name: roomData.hotel.name,
          },
          unit_amount: totalPrice * 100
        },
        quantity: 1,
      }
    ]

    // create checkout session
    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader/my-bookings?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/my-bookings`,
      metadata:{
        bookingId,
      }
    })
    res.json({success: true, url: session.url})

  } catch (error) {
    res.json({success: false, message: "Payment Failed"})
  }
}

// API to verify payment after returning from Stripe
export const verifyPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    
    const session = await stripeInstance.checkout.sessions.retrieve(sessionId);
    
    if(session.payment_status === "paid") {
      const { bookingId } = session.metadata;
      await Booking.findByIdAndUpdate(bookingId, { isPaid: true, paymentMethod: "Stripe" });
      return res.json({ success: true, message: "Payment verified successfully" });
    }
    
    res.json({ success: false, message: "Payment not completed" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}