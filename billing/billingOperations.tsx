import React from 'react';
import {generateCrud} from '@steroidsjs/core/ui/crud';
import {MoneyFormatter} from '@steroidsjs/core/ui/format';
import {EnumFormatter} from '../../react/ui/format';

export const ROUTE_BILLING_OPERATIONS = 'billing_operations';

export default generateCrud(ROUTE_BILLING_OPERATIONS, {
    label: __('Операции'),
    model: 'steroids.billing.models.BillingOperation',
    searchModel: 'steroids.billing.forms.OperationsSearch',
    path: '/admin/billing/operations',
    restUrl: '/api/v1/admin/billing/operations',
    create: false,
    update: false,
    delete: false,
    view: false,
    grid: {
        searchForm: {
            layout: 'table',
            fields: [
                {
                    attribute: 'fromUserQuery',
                    placeholder: __('Email или телефон')
                },
                {
                    attribute: 'toUserQuery',
                    placeholder: __('Email или телефон')
                },
            ],
        },
        columns: [
            'id',
            {
                attribute: 'fromUserQuery',
                label: __('Откуда'),
                valueView: ({item}) => (
                    item.fromAccount.user
                        ? item.fromAccount.user.name
                        : (
                            <EnumFormatter
                                value={item.fromAccount.name}
                                items='app.billing.enums.SystemAccountName'
                            />
                        )
                ),
            },
            {
                attribute: 'toUserQuery',
                label: __('Куда'),
                valueView: ({item}) => (
                    item.toAccount.user
                        ? item.toAccount.user.name
                        : (
                            <EnumFormatter
                                value={item.toAccount.name}
                                items='app.billing.enums.SystemAccountName'
                            />
                        )
                ),
            },
            {
                attribute: 'title',
                label: __('Название'),
            },
            {
                attribute: 'currency.label',
                label: __('Валюта'),
            },
            {
                attribute: 'delta',
                valueView: ({item}) => (
                    <MoneyFormatter
                        currency={item.currency.code}
                        scale={item.currency.precision}
                        precision={item.currency.precision}
                        value={item.delta}
                    />
                ),
            },
            'createTime',
        ],
    },
});
