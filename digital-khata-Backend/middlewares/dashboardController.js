const Purchase = require("../models/Purchase");
const Customer = require("../models/Customer");

function getStartDate(period) {
  const now = new Date();
  if (period === "Week") {
    now.setDate(now.getDate() - 7);
  } else if (period === "Month") {
    now.setMonth(now.getMonth() - 1);
  } else if (period === "Year") {
    now.setFullYear(now.getFullYear() - 1);
  }
  return now;
}

exports.getSalesAndProfit = async (req, res) => {
  try {
    const period = req.query.period || "Year"; // default to year
    const startDate = getStartDate(period);

    const purchases = await Purchase.find({
      purchaseDate: { $gte: startDate },
    }).populate("products.productId");

    let totalSales = 0;
    let totalProfit = 0;

    purchases.forEach((purchase) => {
      totalSales += purchase.totalAmount;

      purchase.products.forEach((product) => {
        if (product.productId) {
          // ✅ protect here
          const buyingPrice = product.productId.purchasePrice || 0;
          const sellingPrice = product.price;
          const quantity = product.quantity;

          totalProfit += (sellingPrice - buyingPrice) * quantity;
        }
      });
    });
    const result = await Customer.aggregate([
          { $match: { totalDebt: { $gt: 0 } } },
          {
            $group: {
              _id: null,
              totalDebtSum: { $sum: "$totalDebt" },
            },
          },
        ]);
        const overAllDebt = result.length > 0 ? result[0].totalDebtSum : 0;

        const totalCustomers = await Customer.countDocuments();

        
    res.json({
      totalSales,
      totalProfit,
      overAllDebt,
      totalCustomers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};




exports.getTopDebtors = async (req, res) => {
  try {
    const topDebtors = await Customer.find({ totalDebt: { $gt: 0 } })
      .sort({ totalDebt: -1 })
      .limit(5)
      .select("name totalDebt");

    res.json(topDebtors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};




exports.getTopCustomers = async (req, res) => {
  try {
    const topCustomers = await Purchase.aggregate([
      {
        $group: {
          _id: "$customerId",
          totalSpent: { $sum: "$totalAmount" },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "customers",
          localField: "_id",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$customer" },
      {
        $project: {
          _id: 0,
          name: "$customer.name",
          totalSpent: 1,
        },
      },
    ]);

    const topDebtors = await Customer.find({ totalDebt: { $gt: 0 } })
      .sort({ totalDebt: -1 })
      .limit(5)
      .select("name totalDebt");

    res.json({topCustomers,
        topDebtors
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

//sles and profit data for charts

function getStartDates(period) {
  const now = new Date();
  if (period === "week") now.setDate(now.getDate() - 6);
  else if (period === "month") now.setMonth(now.getMonth() - 1);
  else if (period === "year") now.setFullYear(now.getFullYear() - 1);
  return now;
}

exports.getSalesTrends = async (req, res) => {
  try {
    const period = req.query.period || "year"; // week | month | year
    const type = req.query.type || "sales"; // sales | profit
    const startDate = getStartDates(period);

    const purchases = await Purchase.find({
      purchaseDate: { $gte: startDate },
    }).populate("products.productId");

    // Initialize map with zero values
    const trendMap = new Map();

    if (period === "week") {
      // Sunday to Saturday
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      days.forEach((day) => trendMap.set(day, 0));
    } else if (period === "month") {
      // Last 30 days
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const key = date.toISOString().slice(0, 10); // yyyy-mm-dd
        trendMap.set(key, 0);
      }
    } else if (period === "year") {
      const fullMonths = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const currentMonthIndex = new Date().getMonth(); // 0 = Jan
      const months = fullMonths.slice(0, currentMonthIndex + 1);
      months.forEach((month) => trendMap.set(month, 0));

    }

    // Aggregate values
    purchases.forEach((purchase) => {
      const dateObj = new Date(purchase.purchaseDate);
      let key;

      if (period === "week") {
        key = dateObj.toLocaleDateString("en-US", { weekday: "short" }); // "Mon"
      } else if (period === "month") {
        key = dateObj.toISOString().slice(0, 10); // "YYYY-MM-DD"
      } else if (period === "year") {
        key = dateObj.toLocaleDateString("en-US", { month: "short" }); // "Jan"
      }

      let value = 0;

      if (type === "sales") {
        value = purchase.totalAmount;
      } else if (type === "profit") {
        value = purchase.products.reduce((acc, product) => {
          const cost = product.productId?.purchasePrice || 0;
          return acc + (product.price - cost) * product.quantity;
        }, 0);
      }

      trendMap.set(key, (trendMap.get(key) || 0) + value);
    });

    // Format and sort result
    let data = Array.from(trendMap, ([date, value]) => ({ date, value }));

    if (period === "month") {
      // Sort by date string
      data.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (period === "week") {
      const daysOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      data.sort(
        (a, b) => daysOrder.indexOf(a.date) - daysOrder.indexOf(b.date)
      );
    } else if (period === "year") {
      const monthOrder = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      data.sort(
        (a, b) => monthOrder.indexOf(a.date) - monthOrder.indexOf(b.date)
      );
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};


