import { blockUnblockCustomerService, getCustomersService } from "../../Services/Admin/CustomersService.js"

// get users
export const getCustomers = async (req , res)=>{
    await getCustomersService(req , res)
}

// block/unbblock users
export const blockUnblockCustomer = async (req , res)=>{
    await blockUnblockCustomerService(req , res)
}