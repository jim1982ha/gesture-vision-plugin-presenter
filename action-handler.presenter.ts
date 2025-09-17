import type { Response } from 'node-fetch';

import { createErrorResult, executeWithRetry } from '#backend/utils/action-helpers.js';
import { type PresenterActionSettings } from './schemas.js';
import type { WebSocketConnectionManager } from '#shared/services/connection-manager.js';

import type { ActionDetails, ActionResult } from '#shared/index.js';
import type { ActionHandler } from '#backend/types/index.js';

const ACTION_TO_OS_COMMAND_MAP: Record<
  PresenterActionSettings['presentationAction'],
  { command: string; target?: string }
> = {
  next_slide: { command: 'key_tap:ArrowRight' },
  prev_slide: { command: 'key_tap:ArrowLeft' },
  start_presentation: { command: 'key_tap:F5' },
  end_presentation: { command: 'key_tap:Escape' },
  blank_screen: { command: 'key_tap:B' },
};

export class PresenterActionHandler implements ActionHandler {
  #connectionManager: WebSocketConnectionManager;

  constructor(connectionManager: WebSocketConnectionManager) {
    this.#connectionManager = connectionManager;
  }

  async execute(
    instanceSettings: PresenterActionSettings,
    _actionDetails: ActionDetails
  ): Promise<ActionResult> {
    const mappedCommand =
      ACTION_TO_OS_COMMAND_MAP[instanceSettings.presentationAction];
    if (!mappedCommand) {
      return createErrorResult(
        `Invalid presentation action: '${instanceSettings.presentationAction}'.`
      );
    }

    const targetHost = instanceSettings.companionHost?.trim() || 'localhost';
    const companionUrl = `ws://${targetHost}:9003/ws`;
    
    const actionFn = async () => {
      const socket = await this.#connectionManager.getConnection(companionUrl);

      const commandPayload = { command: mappedCommand.command, target: mappedCommand.target };
      
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Send timeout')), 2000);
        socket.send(JSON.stringify(commandPayload), (err?: Error) => {
          clearTimeout(timeout);
          if (err) reject(err);
          else resolve();
        });
      });

      const mockResponse = { ok: true, status: 200 } as Response;
      return { response: mockResponse, responseBody: instanceSettings };
    };

    const isRetryable = (error: unknown): boolean => {
      if (error instanceof Error) {
        const msg = error.message.toLowerCase();
        return msg.includes('timeout') || msg.includes('refused') || msg.includes('not found') || msg.includes('closed');
      }
      return false;
    };

    return executeWithRetry<PresenterActionSettings>({
      actionFn,
      isRetryableError: isRetryable,
      maxRetries: 2,
      initialDelayMs: 1000,
      actionName: `Presenter action '${instanceSettings.presentationAction}' to ${targetHost}`,
    });
  }
}