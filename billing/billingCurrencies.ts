import {generateCrud} from '@steroidsjs/core/ui/crud';

export const ROUTE_BILLING_CRYPTO_CURRENCY = 'billing_crypto_currency';

export default generateCrud(ROUTE_BILLING_CRYPTO_CURRENCY, {
    label: __('Валюты'),
    mode: 'modal',
    model: 'steroids.billing.models.BillingCurrency',
    path: '/admin/billing/currencies',
    restUrl: '/api/v1/admin/billing/currencies',
    create: false,
    view: false,
    delete: false,
    grid: {
        columns: [
            'id',
            'code',
            'label',
            'precision',
            {
                attribute: 'rateUsd',
                label: __('Курс USD'),
            },
            'isVisible',
        ],
    },
    form: {
        fields: [
            'label',
            'isVisible',
        ],
    }
});
