const Wallet = require("../../models/wallet")
const User = require('../../models/usersModel');

const getWalletData = async(req,res)=>{
    const id = req.params.id

    const wallet = await Wallet.findOne({userId:id})

    if(!wallet){
        const wallet =  await Wallet.create({
            userId:id,
            balance:0
        })
        return res.json({wallet})
    }

    return res.json({wallet})
}

const addFundInWallet = async(req,res)=>{
    try {
        const {user,offerData} = req.body
        const userdata = User.findById({_id:user})

        if (userdata.isListed==false) {
            return res.status(403).json({ message: "Account is blocked. You cannot access this resource." });
          }

        const wallet = await Wallet.findOne({userId:user})
        wallet.transaction.push({transactionType:"credit",amount:offerData})
        wallet.balance = wallet.balance+ +offerData
        await wallet.save();
        return res.json({message:"Cash added to wallet"})   
    } catch (error) {
        console.log(error);
    }
}



module.exports={
    getWalletData,
    addFundInWallet,
    
}

