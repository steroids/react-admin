import React from 'react';
import Form from '@steroidsjs/core/ui/form/Form';
import InputField from '@steroidsjs/core/ui/form/InputField';
import Button from '@steroidsjs/core/ui/form/Button';
import {login} from '@steroidsjs/core/actions/auth';
import {IConnectHocOutput} from '@steroidsjs/core/hoc/connect';
import {IBemHocOutput} from '@steroidsjs/core/hoc/bem';
import {bem, connect} from '@steroidsjs/core/hoc';

import './Login.scss';

interface ILoginProps extends IConnectHocOutput, IBemHocOutput {
    indexRoute?: string | boolean,
}

@bem('Login')
@connect()
export default class Login extends React.PureComponent<ILoginProps> {

    render() {
        const bem = this.props.bem;
        return (
            <div className={bem.block()}>
                <Form
                    formId='LoginPage'
                    action={'/api/v1/auth/login'}
                    onComplete={(values, result) => {
                        this.props.dispatch(login(result.accessToken, this.props.indexRoute));
                    }}
                    className={bem.element('form')}
                >
                    <InputField
                        attribute='login'
                        label={__('Логин')}
                        size='lg'
                    />
                    <InputField
                        attribute='password'
                        label={__('Пароль')}
                        type='password'
                        size='lg'
                    />
                    <Button
                        type='submit'
                        label='Войти'
                        size='lg'
                        className='btn-block mt-4'
                    />
                </Form>
            </div>
        );
    }
}
