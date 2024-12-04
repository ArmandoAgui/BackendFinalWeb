const Order = require('../../models/Order'); // Ruta al modelo de Order
const Product = require('../../models/Product'); // Ruta al modelo de Product

// Función para obtener los productos más populares en órdenes
const getMostPopularProducts = async (req, res) => {
    try {
        const popularProducts = await Order.aggregate([
            { $unwind: "$products" }, // Desglosar los productos de cada orden
            { $group: { 
                _id: "$products.productUuid", 
                totalQuantity: { $sum: "$products.quantity" } 
            }}, // Agrupar por UUID de producto y sumar cantidades
            { $sort: { totalQuantity: -1 } }, // Ordenar por popularidad
            { $limit: 10 }, // Obtener los 10 más populares
            {
                $lookup: { 
                    from: "products", 
                    localField: "_id", 
                    foreignField: "uuid", 
                    as: "productInfo" 
                }
            }, // Traer información del producto desde la colección de productos
            { $unwind: "$productInfo" } // Desglosar la información del producto
        ]);

        res.status(200).json(popularProducts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getOrdersCountByMonthLastYear = async (req, res) => {
  try {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const ordersByMonth = await Order.aggregate([
          // Filtrar órdenes creadas en el último año
          { $match: { createdAt: { $gte: oneYearAgo } } },
          // Proyectar el mes y el año de la fecha de creación
          {
              $project: {
                  year: { $year: "$createdAt" },
                  month: { $month: "$createdAt" }
              }
          },
          // Agrupar por año y mes, y contar las órdenes
          {
              $group: {
                  _id: { year: "$year", month: "$month" },
                  ordersCount: { $sum: 1 }
              }
          },
          // Ordenar por año y mes
          { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]);

      // Formatear la respuesta para mayor claridad
      const formattedData = ordersByMonth.map(data => ({
          year: data._id.year,
          month: data._id.month,
          ordersCount: data.ordersCount
      }));

      res.status(200).json(formattedData);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// Función para calcular las ganancias del último año
const getEarningsByMonthLastYear = async (req, res) => {
  try {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const earningsByMonth = await Order.aggregate([
          // Filtrar órdenes creadas en el último año
          { $match: { createdAt: { $gte: oneYearAgo } } },
          // Desglosar productos en las órdenes
          { $unwind: "$products" },
          // Vincular con información de productos
          {
              $lookup: {
                  from: "products", // Nombre de la colección de productos
                  localField: "products.productUuid",
                  foreignField: "uuid",
                  as: "productInfo"
              }
          },
          { $unwind: "$productInfo" }, // Desglosar información del producto
          // Proyectar el año, mes y ganancias
          {
              $project: {
                  year: { $year: "$createdAt" },
                  month: { $month: "$createdAt" },
                  earnings: {
                      $multiply: ["$products.quantity", "$productInfo.price"]
                  }
              }
          },
          // Agrupar por año y mes, sumando las ganancias
          {
              $group: {
                  _id: { year: "$year", month: "$month" },
                  totalEarnings: { $sum: "$earnings" }
              }
          },
          // Ordenar por año y mes
          { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]);

      // Formatear los datos para claridad
      const formattedData = earningsByMonth.map(data => ({
          year: data._id.year,
          month: data._id.month,
          totalEarnings: data.totalEarnings
      }));

      res.status(200).json(formattedData);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

module.exports = {
    getMostPopularProducts,
    getOrdersCountByMonthLastYear,
    getEarningsByMonthLastYear
};
