const dashboardService = require("../services/dashboardService")

class DashboardController {

  getAnalytics(req, res) {
    try {
      const analytics = dashboardService.getAnalytics()

      return res.status(200).json(analytics)
    } catch (error) {
      return res.status(500).json({
        message: error.message
      })
    }
  }
}

module.exports = new DashboardController()