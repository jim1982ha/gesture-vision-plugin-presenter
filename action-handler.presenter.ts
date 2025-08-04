/* FILE: extensions/plugins/presenter/action-handler.presenter.ts */
import WebSocket from 'ws';

import { createErrorResult, createSuccessResult } from "#shared/utils/index.js";

import { type PresenterActionSettings } from './schemas.js';

import type { ActionHandler, BackendPluginContext, ActionDetails, ActionResult } from "#shared/types/index.js";

const ACTION_TO_OS_COMMAND_MAP: Record<PresenterActionSettings['presentationAction'], { command: string, target?: string }> = {
    next_slide: { command: 'key_tap:ArrowRight' },
    prev_slide: { command: 'key_tap:ArrowLeft' },
    start_presentation: { command: 'key_tap:F5' },
    end_presentation: { command: 'key_tap:Escape' },
    blank_screen: { command: 'key_tap:B' }
};

export class PresenterActionHandler implements ActionHandler {

    constructor() {}

    async execute(
        instanceSettings: PresenterActionSettings, 
        _actionDetails: ActionDetails,
        _pluginGlobalConfig?: unknown,
        context?: BackendPluginContext
    ): Promise<ActionResult> {
        const mappedCommand = ACTION_TO_OS_COMMAND_MAP[instanceSettings.presentationAction];
        if (!mappedCommand) {
            return createErrorResult(`Invalid presentation action: '${instanceSettings.presentationAction}'.`);
        }
        if (!context?.connectToCompanion) {
            return createErrorResult("Core Error: Companion connection utility is not available.", { contextAvailable: !!context });
        }

        const targetHost = instanceSettings.companionHost?.trim() || 'localhost';
        let socket: WebSocket | null = null;
        try {
            socket = await context.connectToCompanion(targetHost) as WebSocket | null;
            if (!socket) {
                throw new Error("Failed to establish a valid WebSocket connection.");
            }

            const commandPayload = { command: mappedCommand.command, target: mappedCommand.target };
            
            await new Promise<void>((resolve, reject) => {
                 const sendTimeout = setTimeout(() => reject(new Error(`Timeout sending command to Companion at ${targetHost}.`)), 2000);
                socket?.send(JSON.stringify(commandPayload), (err) => { clearTimeout(sendTimeout); if (err) reject(err); else resolve(); });
            });

            return createSuccessResult(
                `Presenter action '${instanceSettings.presentationAction}' sent to ${targetHost}.`,
                instanceSettings
            );
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            return createErrorResult(`Presenter action failed: ${message}`, { error, host: targetHost, settingsUsed: instanceSettings });
        } finally {
             if (socket && socket.readyState === WebSocket.OPEN) socket.close(1000, "Command sent");
             else if (socket) socket.terminate();
        }
    }
}