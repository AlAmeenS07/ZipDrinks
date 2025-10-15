import { blockUnblockCustomerService, getCustomersService } from "../../Services/Admin/CustomersService.js"

export const getCustomers = async (req , res)=>{
    await getCustomersService(req , res)
}

export const blockUnblockCustomer = async (req , res)=>{
    await blockUnblockCustomerService(req , res)
}