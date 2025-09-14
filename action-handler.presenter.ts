/* FILE: extensions/plugins/presenter/action-handler.presenter.ts */
import WebSocket from 'ws';
import type { Response } from 'node-fetch';

import { createErrorResult, executeWithRetry } from '#backend/utils/action-helpers.js';
import { type PresenterActionSettings } from './schemas.js';

import type { ActionDetails, ActionResult } from '#shared/index.js';
import type { ActionHandler, BackendPluginContext } from '#backend/types/index.js';

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
  constructor() {}

  async execute(
    instanceSettings: PresenterActionSettings,
    _actionDetails: ActionDetails,
    _pluginGlobalConfig?: unknown,
    context?: BackendPluginContext
  ): Promise<ActionResult> {
    const mappedCommand =
      ACTION_TO_OS_COMMAND_MAP[instanceSettings.presentationAction];
    if (!mappedCommand) {
      return createErrorResult(
        `Invalid presentation action: '${instanceSettings.presentationAction}'.`
      );
    }
    if (!context?.connectToCompanion) {
      return createErrorResult(
        'Core Error: Companion connection utility is not available.',
        { contextAvailable: !!context }
      );
    }

    const targetHost = instanceSettings.companionHost?.trim() || 'localhost';
    
    const actionFn = async () => {
      let socket: WebSocket | null = null;
      try {
        socket = (await context.connectToCompanion(targetHost)) as WebSocket | null;
        if (!socket) { throw new Error('Failed to establish a valid WebSocket connection.'); }
        const commandPayload = { command: mappedCommand.command, target: mappedCommand.target };
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('Send timeout')), 2000);
          socket?.send(JSON.stringify(commandPayload), (err) => {
            clearTimeout(timeout);
            if (err) reject(err);
            else resolve();
          });
        });
        const mockResponse = { ok: true, status: 200 } as Response;
        return { response: mockResponse, responseBody: instanceSettings };
      } finally {
        if (socket?.readyState === WebSocket.OPEN) socket.close(1000, 'Command sent');
        else if (socket) socket.terminate();
      }
    };

    const isRetryable = (error: unknown): boolean => {
      if (error instanceof Error) {
        const msg = error.message.toLowerCase();
        return msg.includes('timeout') || msg.includes('refused') || msg.includes('not found');
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