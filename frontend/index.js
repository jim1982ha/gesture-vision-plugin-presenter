/* FILE: extensions/plugins/presenter/frontend/index.js */

// Ensure the global registry exists
if (!window.GestureVisionPlugins) {
  window.GestureVisionPlugins = {};
}

const presenterPluginFrontendModule = {
    manifest: { /* will be populated by loader */ },
    
    actionSettingsFields: (context) => {
        const { translate } = context.services.translationService;
        const presentationActionOptions = [
            'next_slide', 'prev_slide', 'start_presentation', 'end_presentation', 'blank_screen'
        ].map(action => ({
            value: action,
            label: translate(`presenterAction${action.charAt(0).toUpperCase() + action.slice(1)}`, { defaultValue: action.replace(/_/g, ' ') })
        }));

        return [
            {
                id: 'presentationAction',
                type: 'select',
                labelKey: 'presenterActionLabel',
                optionsSource: async () => presentationActionOptions,
            },
            { 
                id: 'companionHost', 
                type: 'text', 
                labelKey: 'osCompanionHostLabel', 
                placeholderKey: 'localhost', 
                helpTextKey: 'osCompanionHostHelp' 
            }
        ];
    },

    getActionDisplayDetails: (settings, context) => {
        const { translate } = context.services.translationService;
        if (!settings?.presentationAction) {
            return [{ icon: 'error_outline', value: translate("invalidPresenterActionSettings") }];
        }

        const actionKey = `presenterAction${settings.presentationAction.charAt(0).toUpperCase() + settings.presentationAction.slice(1)}`;
        const actionDisplay = translate(actionKey, { defaultValue: settings.presentationAction.replace(/_/g, ' ') });
        
        const details = [{ icon: 'slideshow', value: actionDisplay }];

        if (settings.companionHost) {
            details.push({ icon: 'dns', value: `${translate("Host")}: ${settings.companionHost}` });
        }
        
        return details;
    },
};

// Register the module with the global registry
window.GestureVisionPlugins['gesture-vision-plugin-presenter'] = presenterPluginFrontendModule;

export default presenterPluginFrontendModule;