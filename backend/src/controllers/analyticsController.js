import { AnalyticsService } from '../services/analyticsService.js';

export class AnalyticsController {
  static async getOverview(req, res) {
    try {
      const data = await AnalyticsService.getOverviewMetrics();
      return res.json({ success: true, ...data });
    } catch (err) {
      console.error('[AnalyticsController] getOverview error:', err);
      return res.status(500).json({ success: false, error: 'Failed to retrieve analytics' });
    }
  }
}
