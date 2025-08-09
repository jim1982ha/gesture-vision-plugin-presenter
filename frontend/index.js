/* FILE: extensions/plugins/webhook/frontend/index.js */
const webhookPluginFrontendModule = {
    manifest: { /* will be populated by loader */ },
    actionSettingsFields: (context) => {
        const { translate } = context.services;
        return [
            { id: 'webhookUrl', type: 'url', labelKey: 'webhookUrlLabel', placeholderKey: 'webhookUrlPlaceholder', required: true },
            {
                id: 'webhookMethod', type: 'select', labelKey: 'webhookMethodLabel',
                optionsSource: async () => ['POST', 'GET', 'PUT', 'DELETE'].map(m => ({ value: m, label: m })),
            },
            { id: 'webhookHeaders', type: 'textarea', labelKey: 'webhookHeadersLabel', placeholderKey: 'webhookHeadersPlaceholder', helpTextKey: 'webhookHeadersHelp', rows: 2 },
            { id: 'webhookBodyTemplate', type: 'textarea', labelKey: 'webhookBodyTemplateLabel', placeholderKey: 'webhookBodyTemplateInput', helpTextKey: 'webhookBodyTemplateHelp', rows: 3 }
        ];
    },
    getActionDisplayDetails: (settings, context) => {
        const { translate } = context.services;
        if (!settings?.webhookUrl) return [{ icon: 'error_outline', value: translate("invalidWebhookActionSettings") }];
        const method = settings.webhookMethod || "POST";
        return [{ icon: 'webhook', value: settings.webhookUrl }, { icon: 'http', value: `${translate("Method")}: ${method}` }];
    },
};
export default webhookPluginFrontendModule;