/* FILE: extensions/plugins/presenter/frontend/index.js */
const { translate } = window.GestureVision.services;

const PRESENTATION_ACTIONS = [
    { value: 'next_slide', labelKey: 'presenterActionNextSlide' },
    { value: 'prev_slide', labelKey: 'presenterActionPrevSlide' },
    { value: 'start_presentation', labelKey: 'presenterActionStartPresentation' },
    { value: 'end_presentation', labelKey: 'presenterActionEndPresentation' },
    { value: 'blank_screen', labelKey: 'presenterActionBlankScreen' }
];

const presenterPluginFrontendModule = {
    manifest: { /* will be populated by loader */ },
    actionSettingsFields: [
        {
            id: 'presentationAction', type: 'select', labelKey: 'presenterActionLabel', required: true,
            optionsSource: async () => PRESENTATION_ACTIONS.map(a => ({ ...a, label: translate(a.labelKey) }))
        },
        { id: 'companionHost', type: 'text', labelKey: 'osCompanionHostLabel', placeholderKey: 'localhost', helpTextKey: 'osCompanionHostHelp' }
    ],
    getActionDisplayDetails: (settings) => {
        if (!settings?.presentationAction) return [{ icon: 'error_outline', value: translate('invalidPresenterActionSettings') }];
        const actionDef = PRESENTATION_ACTIONS.find(a => a.value === settings.presentationAction);
        const actionDisplay = actionDef ? translate(actionDef.labelKey, { defaultValue: settings.presentationAction.replace(/_/g, ' ') }) : settings.presentationAction;
        const details = [{ icon: 'slideshow', value: actionDisplay }];
        if (settings.companionHost) details.push({ icon: 'dns', value: `${translate("Host")}: ${settings.companionHost}` });
        return details;
    },
};
export default presenterPluginFrontendModule;