import * as React from 'react';
import {reset} from 'redux-form';
import Form from '@steroidsjs/core/ui/form/Form/Form';
import {IConnectHocOutput} from '@steroidsjs/core/hoc/connect';
import {ICrudChildrenProps} from '@steroidsjs/core/ui/crud/Crud/Crud';
import {showNotification} from '@steroidsjs/core/actions/notifications';
import {IFetchHocOutput} from '@steroidsjs/core/hoc/fetch';
import {DropDownField} from '@steroidsjs/core/ui/form';

export default class BillingManualOperation extends React.Component<ICrudChildrenProps & IConnectHocOutput & IFetchHocOutput> {

    render() {
        const formId = this.props.form.formId + '_balance-change';
        return (
            <div>
                <h2>{__('Создание операции по счету')}</h2>
                <div>
                    {__('Пользователь')} <b>{this.props.item?.name}</b>
                </div>
                <Form
                    formId={formId}
                    action='/api/v1/admin/billing/operations'
                    model='steroids.billing.forms.ManualOperationForm'
                    initialValues={{
                        toUserId: this.props.itemId,
                    }}
                    fields={[
                        {
                            attribute: 'currencyCode',
                            component: DropDownField,
                            items: 'app.billing.enums.CurrencyEnum',
                            selectFirst: true,
                        },
                        {
                            attribute: 'fromAccountName',
                            component: DropDownField,
                            items: 'app.billing.enums.SystemAccountName',
                            selectFirst: true,
                        },
                        {
                            attribute: 'toAccountName',
                            component: DropDownField,
                            items: 'app.billing.enums.UserAccountName',
                            selectFirst: true,
                        },
                        'amount',
                        'comment',
                    ]}
                    submitLabel={__('Создать операцию')}
                    onComplete={() => {
                        this.props.dispatch([
                            showNotification(__('Операция создана.'), 'success'),
                            reset(formId),
                        ]);
                    }}
                />
            </div>
        );
    }
}
