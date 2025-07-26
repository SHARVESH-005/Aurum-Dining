import Carousel from "./Carousel";
import { Link } from "react-router-dom";

const Content = () => {
  return (
    <div className="mt-20 text-center">
      <Carousel />
      <h2 className="text-4xl font-bold text-amber-800 mt-8">Welcome to Aurum Dining</h2>
      <p className="text-lg mt-2 text-gray-700">
        Experience luxury dining with reservations and takeaways at your fingertips.
      </p>
      <div className="mt-6 flex flex-col md:flex-row justify-center gap-4">
        <Link to="/menu">
          <button className="px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700">
            View Menu
          </button>
        </Link>
        <Link to="/select-date-time">
          <button className="px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600">
            Book a Table
          </button>
        </Link>
        <Link to="/order-takeaway">
          <button className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700">
            Order Takeaway
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Content;
