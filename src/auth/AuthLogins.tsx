import * as React from 'react';
import {formReset} from '@steroidsjs/core/actions/form';
import Form from '@steroidsjs/core/ui/form/Form/Form';
import {IConnectHocOutput} from '@steroidsjs/core/hoc/connect';
import {ICrudChildrenProps} from '@steroidsjs/core/ui/crud/Crud/Crud';
import {showNotification} from '@steroidsjs/core/actions/notifications';
import Grid from '@steroidsjs/core/ui/list/Grid';
import Controls from '@steroidsjs/core/ui/nav/Controls';
import {IFetchHocOutput} from '@steroidsjs/core/hoc/fetch';
import {listRefresh} from '@steroidsjs/core/actions/list';
import {Detail, DetailItem} from "@steroidsjs/core/ui/content/Detail";

export default class AuthLogins extends React.Component<ICrudChildrenProps & IConnectHocOutput & IFetchHocOutput> {

    render() {
        const loginsGridId = this.props.form.formId + '_logins';
        const confirmsGridId = this.props.form.formId + '_confirms';
        const passwordFormId = this.props.form.formId + '_password';

        return (
            <div>
                <div className='row'>
                    <div className='col-lg-6 col-md-12'>
                        <h2>{__('Пользователь')}</h2>
                        <Detail>
                            <DetailItem label={'ID'}>{this.props.item.id}</DetailItem>
                            <DetailItem label={'Name'}>{this.props.item.name}</DetailItem>
                            <DetailItem label={'Email'}>{this.props.item.email}</DetailItem>
                            <DetailItem label={'Role'}>{this.props.item.role}</DetailItem>
                            <DetailItem label={'isBanned'}>{this.props.item.isBanned}</DetailItem>
                        </Detail>
                    </div>
                    <div className='col-lg-6 col-md-12'>
                        <div className='mb-4'>
                            <h2>{__('Изменить пароль')}</h2>
                            <Form
                                formId={passwordFormId}
                                action={`${this.props.restUrl}/${this.props.itemId}/password`}
                                fields={[
                                    {
                                        attribute: 'password',
                                        label: __('Новый пароль'),
                                    }
                                ]}
                                submitLabel={__('Изменить')}
                                onComplete={() => {
                                    this.props.dispatch([
                                        showNotification(__('Пароль успешно изменен.'), 'success'),
                                        formReset(passwordFormId),
                                    ]);
                                }}
                            />
                        </div>
                        <h2>{__('Действия')}</h2>
                        <Controls
                            items={[
                                {
                                    id: 'confirmSend',
                                    label: __('Отправить код подтверждения'),
                                    confirm: __('Отправить код подтверждения пользователю "{name}"?', {
                                        name: this.props.item.email || this.props.itemId,
                                    }),
                                    icon: 'paper-plane',
                                    onClick: async () => {
                                        await this.props.http.post(`${this.props.restUrl}/${this.props.itemId}/confirms`);
                                        this.props.dispatch(listRefresh(confirmsGridId));
                                    },
                                },
                                {
                                    id: 'logoutAll',
                                    label: __('Разлогинить везде'),
                                    confirm: __('Разлогинить пользователя "{name}" со всех устройств?', {
                                        name: this.props.item.email || this.props.itemId,
                                    }),
                                    icon: 'sign-out-alt',
                                    onClick: async () => {
                                        await this.props.http.post(`${this.props.restUrl}/${this.props.itemId}/logout-all`);
                                        this.props.fetchRefresh();
                                        this.props.dispatch(listRefresh(loginsGridId));
                                    },
                                },
                                {
                                    id: 'ban',
                                    label: __('{action} пользователя', {
                                        action: this.props.item.isBanned ? 'Разблокировать' : 'Блокировать'
                                    }),
                                    icon: 'ban',
                                    confirm: __('{action} пользователя "{name}"?', {
                                        name: this.props.item.email || this.props.itemId,
                                        action: this.props.item.isBanned ? 'Разблокировать' : 'Блокировать'
                                    }),
                                    onClick: async () => {
                                        await this.props.http.post(
                                            `${this.props.restUrl}/${this.props.itemId}/${this.props.item.isBanned ? 'unban' : 'ban'}`
                                        );
                                        this.props.dispatch(showNotification(__('Пользователь {action}' , {
                                            action: this.props.item.isBanned ? 'заблокирован' : 'разблокирован'
                                        }), 'warning'));
                                        this.props.fetchRefresh();
                                    },
                                },
                            ]}
                        />
                    </div>
                </div>
                <h2>{__('Коды подтверждений')}</h2>
                <Grid
                    listId={confirmsGridId}
                    action={`/api/v1/admin/auth/${this.props.itemId}/confirms`}
                    model='steroids.auth.models.AuthConfirm'
                    columns={[
                        'id',
                        'value',
                        'code',
                        'isConfirmed',
                        'createTime',
                        'updateTime',
                        'expireTime',
                    ]}
                    empty={__('Коды подтверждений не отправлялись')}
                    controls={item => ([
                        {
                            id: 'logout',
                            icon: 'accept',
                            label: __('Подтвердить'),
                            confirm: __('Отметить код "{code}" для "{value}" как "подтвержденный"?', {
                                code: item.code,
                                value: item.value,
                            }),
                            visible: !item.isConfirmed,
                            onClick: async () => {
                                await this.props.http.post(`${this.props.restUrl}/${this.props.itemId}/confirms/${item.id}/accept`);
                                this.props.dispatch(listRefresh(confirmsGridId));
                            },
                        }
                    ])}
                />
                <h2>{__('История входа')}</h2>
                <Grid
                    listId={loginsGridId}
                    action={`/api/v1/admin/auth/${this.props.itemId}/logins`}
                    model='steroids.auth.models.AuthLogin'
                    columns={[
                        'id',
                        'ipAddress',
                        'userAgent',
                        'location',
                        'createTime',
                        'expireTime',
                    ]}
                    empty={__('Пользователь еще не входил')}
                    controls={item => ([
                        {
                            id: 'logout',
                            icon: 'sign-out-alt',
                            label: __('Разлогинить'),
                            confirm: __('Разлогинить пользователя?'),
                            visible: !item.isExpired,
                            onClick: async () => {
                                await this.props.http.post(`${this.props.restUrl}/${this.props.itemId}/logins/${item.id}/logout`);
                                this.props.dispatch(listRefresh(loginsGridId));
                            },
                        }
                    ])}
                />
            </div>
        );
    }
}
