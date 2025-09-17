/* FILE: extensions/plugins/presenter/backend.plugin.ts */
import { BaseBackendPlugin } from '#backend/plugins/base-backend.plugin.js';
import { PresenterActionHandler } from './action-handler.presenter.js';
import { PresenterActionSettingsSchema } from './schemas.js';
import { WebSocketConnectionManager } from '#shared/services/connection-manager.js';
import manifest from './plugin.json' with { type: 'json' };
import type { PluginManifest } from "#shared/index.js";

class PresenterBackendPlugin extends BaseBackendPlugin {
  #connectionManager: WebSocketConnectionManager;

  constructor() {
    const connectionManager = new WebSocketConnectionManager();
    super(manifest as PluginManifest, new PresenterActionHandler(connectionManager));
    this.#connectionManager = connectionManager;
  }

  getActionConfigValidationSchema() {
    return PresenterActionSettingsSchema;
  }

  async destroy(): Promise<void> {
    this.#connectionManager.destroy();
  }
}

export default PresenterBackendPlugin;