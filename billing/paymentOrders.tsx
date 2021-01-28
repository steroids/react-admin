import React from 'react';
import {generateCrud} from '@steroidsjs/core/ui/crud';
import {MoneyFormatter} from '@steroidsjs/core/ui/format';
import {getCrudGridId, ICrudClickProps} from '@steroidsjs/core/ui/crud/Crud/Crud';
import {listRefresh} from '@steroidsjs/core/actions/list';

export const ROUTE_PAYMENT_ORDERS = 'payment_orders';

export const paymentCrudParams = {
    label: __('Платежный шлюз'),
    model: 'steroids.payment.models.PaymentOrder',
    enums: [
        'steroids.payment.enums.PaymentStatus',
    ],
    searchModel: 'steroids.payment.forms.PaymentOrdersSearch',
    path: '/admin/billing/payment-orders',
    restUrl: '/api/v1/admin/payment/orders',
    create: false,
    update: false,
    delete: false,
    view: false,
    grid: {
        searchForm: {
            layout: 'table',
            fields: [
                {
                    attribute: 'id',
                    placeholder: __('ИД'),
                    inputProps: {
                        style: {
                            width: 50
                        }
                    }
                },
                {
                    attribute: 'payerUserQuery',
                    placeholder: __('Email или телефон')
                },
                {
                    attribute: 'externalId',
                    placeholder: __('Внешний ИД')
                },
                {
                    attribute: 'status',
                    placeholder: __('Статус')
                },
            ],
        },
        columns: [
            'id',
            {
                attribute: 'payerUserQuery',
                label: __('Плательщик'),
                valueView: ({item}) => (
                    <div>
                        {item.payerUser.name}
                    </div>
                ),
            },
            'description',
            {
                attribute: 'inAmount',
                label: __('Сумма (сайт)'),
                valueView: ({item}) => (
                    <MoneyFormatter
                        value={item.inAmount}
                        currency={item.inCurrencyCode}
                    />
                ),
            },
            {
                attribute: 'outAmount',
                label: __('Сумма (шлюз)'),
                valueView: ({item}) => (
                    <MoneyFormatter
                        value={item.outAmount}
                        currency={item.outCurrencyCode}
                    />
                ),
            },
            'status',
            {
                attribute: 'method.title',
                label: __('Метод'),
            },
            {
                attribute: 'methodParams',
                label: __('Параметры'),
                valueView: ({item}) => (
                    <div>
                        {Object.keys(item.methodParams || {}).map(key => (
                            <div key={key}>
                                {key}: {JSON.stringify(item.methodParams[key])}
                            </div>
                        ))}
                    </div>
                ),
            },
            'externalId',
            'createTime',
            'updateTime',
        ],
    },
    items: {
        accept: {
            label: __('Принять'),
            icon: 'accept',
            visible: (item: any) => item.status === 'process',
            confirm: (e, id) => __('Принять ордер {id}?', {id}),
            onClick: async (e, itemId, item, props: ICrudClickProps) => {
                e.preventDefault();
                await props.http.post(`/api/v1/admin/payment/orders/${itemId}/accept`);
                props.dispatch(listRefresh(getCrudGridId(props)));
            },
        },
        reject: {
            label: __('Отклонить'),
            icon: 'reject',
            visible: (item: any) => item.status === 'process',
            confirm: (e, id) => __('Отклонить ордер {id}?', {id}),
            onClick: async (e, itemId, item, props: ICrudClickProps) => {
                e.preventDefault();
                await props.http.post(`/api/v1/admin/payment/orders/${itemId}/reject`);
                props.dispatch(listRefresh(getCrudGridId(props)));
            },
        },
    }
};

export default generateCrud(ROUTE_PAYMENT_ORDERS, paymentCrudParams);
