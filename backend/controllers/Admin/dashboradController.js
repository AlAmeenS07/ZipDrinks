import { getAdminDashboardService } from "../../Services/Admin/dashboardService.js"
import { DASHBOARD_DATA_FETCHED_SUCCESSFULLY, DASHBOARD_DATA_NOT_FOUND, NOT_FOUND, SERVER_ERROR, SUCCESS } from "../../utils/constants.js"


export const getAdminDashboard = async (req, res) => {
    const { filter } = req.query
    try {

        const dashboardData = await getAdminDashboardService(filter)

        if (!dashboardData) {
            return res.status(NOT_FOUND).json({ success: false, message: DASHBOARD_DATA_NOT_FOUND })
        }

        res.status(SUCCESS).json({ success: true, message: DASHBOARD_DATA_FETCHED_SUCCESSFULLY, dashboardData })

    } catch (error) {
        res.status(SERVER_ERROR).json({ success: false, message: error.message })
    }
}