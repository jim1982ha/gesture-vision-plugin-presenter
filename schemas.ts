/* FILE: extensions/plugins/presenter/schemas.ts */
import { z } from 'zod';

export type PresentationAction = 'next_slide' | 'prev_slide' | 'start_presentation' | 'end_presentation' | 'blank_screen';

// Settings for a specific action instance
export interface PresenterActionSettings {
    presentationAction: PresentationAction;
    companionHost?: string;
}

export const PresenterActionSettingsSchema = z.object({
    presentationAction: z.enum(['next_slide', 'prev_slide', 'start_presentation', 'end_presentation', 'blank_screen']),
    companionHost: z.string().optional(),
});