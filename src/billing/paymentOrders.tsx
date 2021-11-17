import React from 'react';
import {generateCrud} from '@steroidsjs/core/ui/crud';
import {MoneyFormatter} from '@steroidsjs/core/ui/format';
import {ICrudClickProps} from '@steroidsjs/core/ui/crud/Crud/Crud';
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
    restUrl: '/api/v1/admin/payment',
    create: false,
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
            {
                attribute: 'outAmountRub',
                label: __('Сумма (шлюз)'),
                valueView: ({item}) => (item.outAmountRub && (
                    <MoneyFormatter
                        value={item.outAmountRub}
                        currency={'rub'}
                    />
                ))
            },
            {
                attribute: 'commissionAmountRub',
                label: __('Сумма коммиссии'),
                valueView: ({item}) => (item.commissionAmountRub && (
                    <MoneyFormatter
                        value={item.commissionAmountRub}
                        currency={'rub'}
                    />
                ))
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
    form: {
        fields: [
            {
                attribute: 'methodId',
                component: 'DropDownField',
                dataProvider: {
                    action: '/api/v1/admin/payment/withdraw-methods',
                    //@todo удалить после того как dataProvider по умолчанию будет использовать get метод
                    onSearch: action => window.SteroidsComponents.http.get(action).then(response => {
                        if (!response.errors) {
                            return response.map(item => ({
                                id: item.id,
                                label: item.label,
                            }))
                        }

                        return response;
                    }),
                },
                autoFetch: true
            }
        ]
    },
    items: {
        accept: {
            label: __('Принять'),
            icon: 'accept',
            visible: (item: any) => item.status === 'process',
            confirm: (e, id) => __('Принять ордер {id}?', {id}),
            onClick: async (e, itemId, item, props: ICrudClickProps) => {
                e.preventDefault();
                await props.components.http.post(`/api/v1/admin/payment/orders/${itemId}/accept`);
                props.components.store.dispatch(listRefresh(props.crudId));
            },
        },
        reject: {
            label: __('Отклонить'),
            icon: 'reject',
            visible: (item: any) => item.status === 'process',
            confirm: (e, id) => __('Отклонить ордер {id}?', {id}),
            onClick: async (e, itemId, item, props: ICrudClickProps) => {
                e.preventDefault();
                await props.components.http.post(`/api/v1/admin/payment/orders/${itemId}/reject`);
                props.components.store.dispatch(listRefresh(props.crudId));
            },
        },
    }
};

/* @ts-ignore TODO paymentCrudParams are incompatible with ICrudGeneratorProps*/
export default generateCrud(ROUTE_PAYMENT_ORDERS, paymentCrudParams);
