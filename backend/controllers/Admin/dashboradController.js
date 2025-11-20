import { getAdminDashboardService } from "../../Services/Admin/dashboardService.js"
import { NOT_FOUND, SERVER_ERROR, SUCCESS } from "../../utils/constants.js"


export const getAdminDashboard = async (req, res) => {
    const { filter } = req.query
    try {

        const dashboardData = await getAdminDashboardService(filter)

        if (!dashboardData) {
            return res.status(NOT_FOUND).json({ success: false, message: "Dashboard data not found !" })
        }

        res.status(SUCCESS).json({ success: true, message: "Dashboard data fetched successfully", dashboardData })

    } catch (error) {
        res.status(SERVER_ERROR).json({ success: false, message: error.message })
    }
}