import { Setting } from '../models/Setting.js';
import { config } from '../config/env.js';

export class SettingsController {
  static async getSettings(req, res) {
    try {
      const dbSettings = await Setting.find().lean();
      const settingsMap = {};
      dbSettings.forEach((s) => {
        settingsMap[s.key] = s.value;
      });

      return res.json({
        success: true,
        settings: {
          llm_provider: settingsMap.llm_provider || config.llmProvider,
          gemini_model: settingsMap.gemini_model || config.geminiModel,
          openai_model: settingsMap.openai_model || config.openaiModel,
          confidence_threshold: settingsMap.confidence_threshold !== undefined ? settingsMap.confidence_threshold : config.confidenceThreshold,
          system_prompt: settingsMap.system_prompt || 'You are Nova, an empathetic, highly skilled customer support AI agent for an innovative tech company.',
          has_gemini_key: Boolean(config.geminiApiKey || settingsMap.gemini_api_key),
          has_openai_key: Boolean(config.openaiApiKey || settingsMap.openai_api_key)
        }
      });
    } catch (err) {
      console.error('[SettingsController] getSettings error:', err);
      return res.status(500).json({ success: false, error: 'Failed to retrieve settings' });
    }
  }

  static async updateSettings(req, res) {
    try {
      const { llm_provider, confidence_threshold, system_prompt, gemini_api_key, openai_api_key } = req.body;

      if (llm_provider) {
        await Setting.findOneAndUpdate({ key: 'llm_provider' }, { value: llm_provider }, { upsert: true });
      }
      if (confidence_threshold !== undefined) {
        await Setting.findOneAndUpdate({ key: 'confidence_threshold' }, { value: parseFloat(confidence_threshold) }, { upsert: true });
      }
      if (system_prompt) {
        await Setting.findOneAndUpdate({ key: 'system_prompt' }, { value: system_prompt }, { upsert: true });
      }
      if (gemini_api_key) {
        config.geminiApiKey = gemini_api_key;
        await Setting.findOneAndUpdate({ key: 'gemini_api_key' }, { value: gemini_api_key }, { upsert: true });
      }
      if (openai_api_key) {
        config.openaiApiKey = openai_api_key;
        await Setting.findOneAndUpdate({ key: 'openai_api_key' }, { value: openai_api_key }, { upsert: true });
      }

      return res.json({ success: true, message: 'Settings updated successfully' });
    } catch (err) {
      console.error('[SettingsController] updateSettings error:', err);
      return res.status(500).json({ success: false, error: 'Failed to update settings' });
    }
  }
}
