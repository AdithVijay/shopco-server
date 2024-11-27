const Cart = require('../../models/cart'); 
const ProductData =require("../../models/productModel")


// ==========================ADDING DATA TO CART============================
const addItemToCart = async (req, res) => {
    try {
      const { userId, productId, selectedSize, quantity, price } = req.body;
      const totalItemPrice = price * quantity;

      console.log(req.body);
      
      let cart = await Cart.findOne({ userId });

      if (cart) {
        const existingItem = cart.items.find(
          (item) => item.productId.toString() === productId && item.selectedSize === selectedSize
        )

        if (existingItem) {
          existingItem.quantity += quantity;
          existingItem.totalItemPrice += totalItemPrice
        } else {
          cart.items.push({ productId, selectedSize, quantity, price, totalItemPrice });
        }


      } else {
        cart = new Cart({
          userId,
          items: [{ productId, selectedSize, quantity, price, totalItemPrice }],
        });
      }
  
      await cart.save();
      res.status(200).json({ message: 'Item added to cart successfully', cart });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error adding item to cart', error });
    }
  };
  
// ==========================FETCHING DATA TO CART============================
const getCartItems = async (req, res) => {
  try {
    const id = req.params.id;
    const cartdata = await Cart.findOne({ userId: id }).populate({
      path: 'items.productId',
      match: { isListed: true },
    });

    if (cartdata) {
      // Filter out items with null productId
      const filteredItems = cartdata.items.filter((item) => item.productId !== null);

      // Update totalItemPrice based on salePrice
      const updatedItems = filteredItems.map((item) => {
        const product = item.productId;

        // Use salePrice directly
        const price = product.salePrice;
        const totalItemPrice = price * item.quantity; // Compute total price for the item

        return {
          ...item.toObject(),
          price: price, // Format price to 2 decimal points
          totalItemPrice: totalItemPrice, // Format totalItemPrice to 2 decimal points
        };
      });

      // Update the cart object with filtered and updated items
      const cart = { ...cartdata.toObject(), items: updatedItems };

      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ==========================INCREMENTING PRODUCT COUNT============================
const incrementProductCount = async(req,res)=>{
  const { productId, userId ,selectedSize} = req.body;
  
  try {
    const cart = await Cart.findOne({userId})

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const existingProduct = cart.items.find((x) => x.productId == productId && x.selectedSize==selectedSize);

    if (existingProduct) {
      existingProduct.quantity += 1;
      existingProduct.totalItemPrice += existingProduct.price; 
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    await cart.save();

    res.status(200).json({ message: "Product count incremented", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating product count" });
  }
}

// ==========================INCREMENTING PRODUCT COUNT============================
const decrementProductCount = async(req,res)=>{
  const { productId, userId,selectedSize } = req.body;
  try {
    const cart = await Cart.findOne({userId})

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const existingProduct = cart.items.find((x) => x.productId == productId && x.selectedSize==selectedSize);
    if (existingProduct) {
      existingProduct.quantity -= 1;
      existingProduct.totalItemPrice -= existingProduct.price; 
    } else {
      return res.status(404).json({message: "Product not found in cart"});
    }

    await cart.save();

    res.status(200).json({ message: "Product count incremented", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating product count" });
  }
}

// ==========================TO CHECK WHTEHTER THE SIZE EXISTS OR NOT============================
const checkSizeExist = async(req,res)=>{
  try {
    const {productId,userId,selectedSize} = req.body
    const cart = await Cart.findOne({userId})
      if(cart){
        const existingItem = cart.items.find((x)=>x.productId==productId && x.selectedSize == selectedSize)
        if(existingItem){
          return res.json({success:true})
        }else{
          return res.json({success:false})
        }
      }
  } catch (error) {
    console.log(error);
  }
    
}

// ==========================TO DELETE THE ITEMS IN THE CART============================
const delteCartItem = async (req, res) => {
  const {userId, productId, selectedSize } = req.body;

  try {
    const updatedCart = await Cart.findOneAndUpdate(
      {userId }, // Match the user's cart
      {
        $pull: {
          items: {
            productId: productId,
            selectedSize: selectedSize,
          },
        },
      },
      { new: true } // Return the updated cart after deletion
    );

    if (updatedCart) {
      res.status(200).json({ message: "Item successfully deleted from cart", cart: updatedCart });
    } else {
      res.status(404).json({ message: "Cart not found or item not in cart" });
    }
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================TO CHECK WHETHER THE SIZE EXISTS OF THE PRODUCT IN CART==================
  const checkSizeInCartExists= async(req,res)=>{
    try {
      const {cartItems} = req.body
      console.log("====>CartItem",cartItems);
      
    for(item of cartItems){
      const { productId, selectedSize, quantity } = item;

      const product = await ProductData.findById(productId);

        const sizeStock = product.sizes[selectedSize]; 

        if (sizeStock < quantity) {
          return res.status(400).json({
            error: `Insufficient stock for ${product.productName} in size ${selectedSize}. Available: ${sizeStock}`,
          });
        }else{
          return res.status(200).json({message:"success"})
        }
      }
    } catch (error) {
        console.log(error);
    } 
  }
  

  module.exports = { addItemToCart,
    getCartItems,
    incrementProductCount,
    decrementProductCount,
    checkSizeExist,
    delteCartItem,
    checkSizeInCartExists
  };