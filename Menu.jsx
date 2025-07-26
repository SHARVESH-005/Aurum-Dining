const menuData = [
  {
    category: "Starters",
    items: [
      { name: "Paneer Tikka", price: 220 },
      { name: "Chicken 65", price: 240 },
      { name: "Hummus Platter", price: 180 },
    ],
  },
  {
    category: "Main Course",
    items: [
      { name: "Butter Chicken", price: 320 },
      { name: "Paneer Butter Masala", price: 290 },
      { name: "Veg Biryani", price: 250 },
      { name: "Chicken Biryani", price: 300 },
    ],
  },
  {
    category: "Desserts",
    items: [
      { name: "Gulab Jamun", price: 100 },
      { name: "Chocolate Brownie", price: 140 },
      { name: "Ice Cream Sundae", price: 130 },
    ],
  },
  {
    category: "Beverages",
    items: [
      { name: "Fresh Lime Soda", price: 90 },
      { name: "Mojito", price: 120 },
      { name: "Iced Tea", price: 110 },
    ],
  },
];

const Menu = () => {
  return (
    <div className="mt-20 px-6 md:px-20">
      <h2 className="text-4xl font-bold text-center text-amber-800 mb-8">🍽️ Our Menu</h2>

      {menuData.map((section) => (
        <div key={section.category} className="mb-8">
          <h3 className="text-2xl font-semibold text-amber-700 mb-4 border-b border-amber-400 pb-1">
            {section.category}
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.items.map((item, index) => (
              <li
                key={index}
                className="bg-white p-4 rounded shadow hover:shadow-md transition"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">{item.name}</span>
                  <span className="text-amber-700 font-semibold">₹{item.price}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Menu;
