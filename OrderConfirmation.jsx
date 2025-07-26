import { useParams, Link } from "react-router-dom";

const OrderConfirmation = () => {
  const { orderId } = useParams();

  return (
    <div className="mt-24 text-center px-4">
      <h2 className="text-4xl font-bold text-green-700 mb-4">✅ Order Confirmed!</h2>
      <p className="text-lg text-gray-700 mb-2">
        Thank you for placing your order with <span className="text-amber-700 font-semibold">Aurum Dining</span>.
      </p>
      <p className="text-md text-gray-600 mb-4">Your Order ID: <strong>{orderId}</strong></p>
      <Link to="/">
        <button className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition">
          Back to Home
        </button>
      </Link>
    </div>
  );
};

export default OrderConfirmation;
