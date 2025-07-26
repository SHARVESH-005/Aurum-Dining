const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB (adjust to your own connection string if needed)
mongoose.connect("mongodb://127.0.0.1:27017/restaurantDB")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Table Schema & Model
const tableSchema = new mongoose.Schema({
  number: Number,
  id: String,
});
const Table = mongoose.model("Table", tableSchema);

// Reservation Schema & Model
const reservationSchema = new mongoose.Schema({
  orderId: String,
  fullName: String,
  phone: String,
  email: String,
  date: String,
  time: String,
  guests: Number,
  tables: [String],
});
const Reservation = mongoose.model("Reservation", reservationSchema);

// Takeaway Order Schema & Model
const takeawayOrderSchema = new mongoose.Schema({
  orderId: String,
  fullName: String,
  phone: String,
  address: String,
  items: [{ name: String, quantity: Number, price: Number }],
  subtotal: Number,
  tax: Number,
  acTax: Number,
  gst: Number,
  deliveryCharge: Number,
  total: Number,
  createdAt: { type: Date, default: Date.now },
});
const TakeawayOrder = mongoose.model("TakeawayOrder", takeawayOrderSchema);

// Fetch all tables
app.get("/tables", async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tables", error });
  }
});

// Fetch reserved tables for a specific date & time
app.get("/reserved-tables", async (req, res) => {
  try {
    const { date, time } = req.query;
    if (!date || !time) {
      return res.status(400).json({ message: "Date and time are required" });
    }
    const reservations = await Reservation.find({ date, time });
    const reservedTables = reservations.flatMap((reservation) => reservation.tables);
    res.json(reservedTables);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reserved tables", error });
  }
});

// Save a reservation
app.post("/reserve", async (req, res) => {
  try {
    const { fullName, phone, email, date, time, guests, tables } = req.body;
    if (!fullName || !phone || !email || !date || !time || !guests || tables.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields and select at least one table"
      });
    }
    const orderId = new mongoose.Types.ObjectId().toString();
    const newReservation = new Reservation({ orderId, fullName, phone, email, date, time, guests, tables });
    await newReservation.save();
    res.status(201).json({
      success: true,
      message: "Your table has been successfully reserved! Your reservation ID is " + orderId,
      orderId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "We couldn't complete your reservation at this time. Please try again later."
    });
  }
});

// Fetch reservation by orderId
app.get("/reservation/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const reservation = await Reservation.findOne({ orderId });
    if (!reservation) return res.status(404).json({ message: "Reservation not found" });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reservation", error });
  }
});

// Save a Takeaway Order
app.post("/takeaway", async (req, res) => {
  try {
    const { fullName, phone, address, items, subtotal, tax, acTax, gst, deliveryCharge, total } = req.body;
    if (!fullName || !phone || !address || !items.length || !subtotal || !total) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields to complete your order"
      });
    }
    const orderId = new mongoose.Types.ObjectId().toString();
    const newOrder = new TakeawayOrder({
      orderId, fullName, phone, address, items, subtotal, tax, acTax, gst, deliveryCharge, total
    });
    await newOrder.save();
    res.status(201).json({
      success: true,
      message: "Your takeaway order has been successfully placed! You can track it with your order ID.",
      orderId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "We couldn't process your order at this time. Please try again later."
    });
  }
});

// Fetch takeaway order by orderId
app.get("/takeaway/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await TakeawayOrder.findOne({ orderId });
    if (!order) return res.status(404).json({ message: "Takeaway order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching takeaway order", error });
  }
});

// Fetch orders by phone (for updating/canceling)
app.get("/orders-by-phone/:phone", async (req, res) => {
  try {
    const { phone } = req.params;
    if (!phone) return res.status(400).json({ message: "Phone number is required" });
    const reservations = await Reservation.find({ phone });
    const takeawayOrders = await TakeawayOrder.find({ phone });
    const allOrders = [...reservations, ...takeawayOrders];
    allOrders.sort((a, b) => {
      const dateA = a.createdAt || new Date(0);
      const dateB = b.createdAt || new Date(0);
      return dateB - dateA;
    });
    res.json(allOrders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
});

// Delete reservation
app.delete("/reservation/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await Reservation.deleteOne({ orderId });
    if (result.deletedCount === 0) {
      const takeawayResult = await TakeawayOrder.deleteOne({ orderId });
      if (takeawayResult.deletedCount === 0) {
        return res.status(404).json({ success: false, message: "We couldn't find the order you're trying to cancel" });
      }
    }
    res.json({ success: true, message: "Your order has been successfully cancelled" });
  } catch (error) {
    res.status(500).json({ success: false, message: "We couldn't cancel your order at this time. Please try again later." });
  }
});

// Update reservation (not directly used, but available)
app.put("/update-reservation", async (req, res) => {
  try {
    const { orderId, fullName, phone, email, date, time, guests, tables } = req.body;
    if (!orderId || !fullName || !phone || !email || !date || !time || !guests || !tables.length) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }
    const existingReservation = await Reservation.findOne({ orderId });
    if (!existingReservation) {
      return res.status(404).json({ success: false, message: "Reservation not found" });
    }
    await Reservation.updateOne(
      { orderId },
      { fullName, phone, email, date, time, guests, tables }
    );
    res.json({ success: true, message: "Your reservation has been successfully updated", orderId });
  } catch (error) {
    res.status(500).json({ success: false, message: "We couldn't update your reservation at this time. Please try again later." });
  }
});

// (Admin-only) - Fetch all reservations
app.get("/admin/reservations", async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reservations", error });
  }
});

// (Admin-only) - Fetch all takeaway orders
app.get("/admin/takeaway-orders", async (req, res) => {
  try {
    const orders = await TakeawayOrder.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching takeaway orders", error });
  }
});

// (Admin-only) - Cancel reservation
app.delete("/admin/reservations/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const deletedReservation = await Reservation.findOneAndDelete({ orderId });
    if (!deletedReservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    res.json({ message: "Reservation cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling reservation", error });
  }
});

// (Admin-only) - Cancel takeaway order
app.delete("/admin/takeaway-orders/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const deletedOrder = await TakeawayOrder.findOneAndDelete({ orderId });
    if (!deletedOrder) {
      return res.status(404).json({ message: "Takeaway order not found" });
    }
    res.json({ message: "Takeaway order cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling takeaway order", error });
  }
});

// Start the server
const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
