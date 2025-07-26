import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "/images/hk-background.png";

function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("reservations");
  const [reservations, setReservations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Authentication check
  useEffect(() => {
    if (localStorage.getItem("adminLoggedIn") !== "yes") {
      navigate("/admin-login");
    }
  }, [navigate]);

  useEffect(() => {
    setLoading(true);
    if (tab === "reservations") {
      fetch("http://localhost:5001/admin/reservations")
        .then(res => res.json())
        .then(data => { setReservations(data); setLoading(false); });
    } else {
      fetch("http://localhost:5001/admin/takeaway-orders")
        .then(res => res.json())
        .then(data => { setOrders(data); setLoading(false); });
    }
  }, [tab]);

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/admin-login");
  };

  const handleCancel = (id, type) => {
    if (!window.confirm("Are you sure?")) return;
    fetch(
      type === "reservation"
        ? `http://localhost:5001/admin/reservations/${id}`
        : `http://localhost:5001/admin/takeaway-orders/${id}`,
      { method: "DELETE" }
    ).then(() => {
      if (type === "reservation") {
        setReservations(prev => prev.filter(r => r.orderId !== id));
      } else {
        setOrders(prev => prev.filter(o => o.orderId !== id));
      }
    });
  };

  return (
    <div className="min-h-screen py-12 px-6" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded font-semibold"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <div className="bg-black/60 rounded-lg p-6 text-white">
        <div className="flex space-x-6 border-b border-[#B8860B] mb-6">
          <button
            onClick={() => setTab("reservations")}
            className={tab === "reservations" ?
              "border-b-4 border-[#B8860B] pb-2 font-bold" : "pb-2"}
          >
            Table Reservations
          </button>
          <button
            onClick={() => setTab("orders")}
            className={tab === "orders" ?
              "border-b-4 border-[#B8860B] pb-2 font-bold" : "pb-2"}
          >
            Takeaway Orders
          </button>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : tab === "reservations" ? (
          <table className="w-full text-left mt-4">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-3 py-2">Order ID</th>
                <th>Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Phone</th>
                <th>Tables</th>
                <th>Guests</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(r => (
                <tr key={r.orderId} className="border-t border-gray-700">
                  <td className="px-3 py-2">#{r.orderId}</td>
                  <td>{r.fullName}</td>
                  <td>{r.date}</td>
                  <td>{r.time}</td>
                  <td>{r.phone}</td>
                  <td>{r.tables ? r.tables.join(", ") : ""}</td>
                  <td>{r.guests}</td>
                  <td>
                    <button
                      onClick={() => handleCancel(r.orderId, "reservation")}
                      className="bg-red-600 px-2 py-1 rounded text-xs"
                    >Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left mt-4">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-3 py-2">Order ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Subtotal</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.orderId} className="border-t border-gray-700">
                  <td className="px-3 py-2">#{o.orderId}</td>
                  <td>{o.fullName}</td>
                  <td>{o.phone}</td>
                  <td>{o.address}</td>
                  <td>₹{o.subtotal.toFixed(2)}</td>
                  <td>₹{o.total.toFixed(2)}</td>
                  <td>
                    <button
                      onClick={() => handleCancel(o.orderId, "order")}
                      className="bg-red-600 px-2 py-1 rounded text-xs"
                    >Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
