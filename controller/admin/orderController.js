const Order = require("../../models/order");

const Wallet = require("../../models/wallet");

//==================TO CHANGE THE ORDER STATUS ================

const updateOrderStatus = async (req,res)=>{
    const { orderId, productId, status } = req.body;
    console.log(status);
    
    // Find the order by its ID and check if it has the specified product ID
    const order = await Order.findOne({ _id: orderId});
    console.log(order);
    order.order_status = status
    await order.save()
    console.log(order);
    res.status(200).json({ message: 'Order status updated successfully', order });
}

//====================TO GET THE PRODUCT DATA==================
const getOrderDetails = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // Default to page 1
      const limit = parseInt(req.query.limit) || 4; // Default limit is 10 orders per page
  
      const skip = (page - 1) * limit; // Calculate number of documents to skip
  
      const order = await Order.find()
        .populate({
          path: "order_items.product",
        })
        .populate("shipping_address")
        .populate("user")
        .sort({placed_at:-1})
        .skip(skip)   // Apply skip for pagination
        .limit(limit)
  
        const totalOrders = await Order.countDocuments();
        const totalPages = Math.ceil(totalOrders / limit);
  
      if (!order || order.length === 0) {
        return res
          .status(404)
          .json({ message: "No orders found for this user." });
      }
  
      return res.status(200).json({
        order,
        currentPage: page,
        totalPages,
      });
    } catch (error) {
      console.error("Error fetching order details:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while fetching order details." });
    }
  };

  //====================TO CANCEL THE PRODUCT==================
  const cancelProduct = async(req,res)=>{
    const id = req.params.id
    const order = await Order.findOne({_id:id})
    order.order_status = "Cancelled"
    
    let wallet = await Wallet.findOne({userId:order.user})

    if(!wallet){
      wallet = await Wallet.create({
        userId:order.user,
        balance:0,
      })
    }

    console.log(wallet.balance);

    if(order.payment_method==="Wallet"||order.payment_method==="RazorPay"){
      wallet.balance = wallet.balance + +order.total_amount
      wallet.transaction.push({transactionType:"credit",amount:+order.total_amount,status:"completed"})
    }
    
    await wallet.save()
    
    console.log("Order cancellleddd");
    
    await order.save()
    if(order){
      return res.status(200).json("cancelled")
    }
  }


  //========================TO FETCH THE SALES DETAILS ========================
const getSalesDetails = async (req, res) => {
  try {
    const order = await Order.find()
      .populate({
        path: "order_items.product",
      })
      .populate("shipping_address")
      .populate("user")
      
    if (!order || order.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this user." });
    }

    return res.status(200).json(
      order
    );

  } catch (error) {
    console.error("Error fetching order details:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching order details." });
  }
};

  //===================TO FETCH DATA BASED ON SALES DETAILS ===================
  const gethDataBasedOnDate = async (req, res) => {
    const { reportType, DateStart, endDate } = req.body;
    
    // Set default date range if not using custom dates
    const now = new Date();
    let startDate;
    let end = now; // Initialize `end` to `now` by default

    if (DateStart && endDate) {
        // Convert DateStart and endDate to Date objects
        startDate = new Date(DateStart);
        end = new Date(endDate);
        // Adjust endDate to include the entire day
        end.setHours(23, 59, 59, 999);
    } else {
        // Use preset ranges if custom dates are not provided
        if (reportType === 'Daily') {
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        } else if (reportType === 'Weekly') {
            const startOfWeek = now.getDate() - now.getDay();
            startDate = new Date(now.getFullYear(), now.getMonth(), startOfWeek);
        } else if (reportType === 'Monthly') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        } else {
            return res.status(400).json({ message: 'Invalid report type' });
        }
    }

    try {
        // Fetch orders within the specified date range
        const orders = await Order.find({
            placed_at: {
                $gte: startDate,
                $lt: end
            }
        })
        .populate({
            path: "order_items.product",
        })
        .populate("shipping_address")
        .populate("user");

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
};

const returnOrderRequest = async(req,res)=>{
  try {
    const {itemId,returnRequest,userId,coupondiscount,productPrice,length} = req.body
    
    console.log("===============>>>>",returnRequest,userId,"cp",coupondiscount,productPrice);
    const order = await Order.findOne({"order_items._id":itemId})
    const product = order.order_items.find((x)=>x._id==itemId)
    product.return_request = false
    product.return_active =returnRequest
    product.return_message_dispaly = false
    product.dispalay_return_result = true
    //===wlaeet money reduction
    if(returnRequest==true){
      const wallet = await Wallet.findOne({userId})
      const actualPrice = productPrice -coupondiscount/length
      console.log( "========/////",actualPrice);
      wallet.balance = wallet.balance + actualPrice
      wallet.transaction.push({transactionType:"credit",amount:actualPrice,status:"completed"})
      wallet.save()
    }

    await order.save()
    if(returnRequest){
      return res.json({message:"Return request accepted"})
    }else{
      return res.json({message:"Return request rejected"})
    }
  } catch (error) {
    console.log(error)
  }       
}

//=========================FETCHING CHART DATA===================
const getOrderDetailsInChart = async (req, res) => {
  try {

    const order = await Order.find()
      .populate({
        path: "order_items.product",
      })
      .populate("shipping_address")
      .populate("user")


    if (!order || order.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this user." });
    }

    return res.status(200).json({
      order,
    });
    
  } catch (error) {
    console.error("Error fetching order details:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching order details." });
  }
};

module.exports={
    updateOrderStatus,
    getOrderDetails,
    cancelProduct,
    getSalesDetails,
    gethDataBasedOnDate,
    returnOrderRequest,
    getOrderDetailsInChart
}