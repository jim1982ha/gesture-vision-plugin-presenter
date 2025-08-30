/* FILE: extensions/plugins/presenter/backend.plugin.ts */
import { BaseBackendPlugin } from '#backend/plugins/base-backend.plugin.js';
import { PresenterActionHandler } from './action-handler.presenter.js';
import { PresenterActionSettingsSchema } from './schemas.js';
import manifest from './plugin.json' with { type: 'json' };
import type { PluginManifest } from "#shared/index.js";

class PresenterBackendPlugin extends BaseBackendPlugin {
  constructor() {
    super(manifest as PluginManifest, new PresenterActionHandler());
  }

  getActionConfigValidationSchema() {
    return PresenterActionSettingsSchema;
  }
}

export default PresenterBackendPlugin;