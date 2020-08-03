import React from 'react';
import _get from 'lodash-es/get';
import _values from 'lodash-es/values';
import {Notifications} from '@steroidsjs/core/ui/layout';
import {ILayoutHocOutput, STATUS_LOADING, STATUS_OK} from '@steroidsjs/core/hoc/layout';
import ModalPortal from '@steroidsjs/core/ui/modal/ModalPortal'

import {bem, components, layout, connect} from '@steroidsjs/core/hoc';
import './Layout.scss';

import {IBemHocOutput} from '@steroidsjs/core/hoc/bem';
import Header from '@steroidsjs/core/ui/layout/Header';
import Nav from '../../../react/ui/nav/Nav';
import {STATUS_ACCESS_DENIED} from '../../../react/hoc/layout';
import Login from '../Login';
import {getRoutesMap} from '../../../react/reducers/router';

interface ILayoutProps extends IBemHocOutput, ILayoutHocOutput {
    isInitialized?: boolean,
    user?: any,
}

@bem('Layout')
@components('http')
@connect(state => ({
    routes: getRoutesMap(state),
}))
@layout(props => {
    const models = props.models || [];
    _values(props.routes).forEach(route => {
        ['model', 'searchModel'].forEach(key => {
            if (route[key]) {
                models.push(route[key]);
            }
        });
    });

    return props.http.post('/api/v1/init', {
        models: models.length > 0 ? models : undefined,
    });
})
export default class Layout extends React.PureComponent<ILayoutProps> {

    componentDidUpdate(prevProps) {
    }

    render() {
        const bem = this.props.bem;
        return (
            <div className={bem.block()}>
                <Header
                    logo={{
                        title: '',
                    }}
                    className={bem.element('header')}
                />
                {this.renderContent()}
                <Notifications/>
                <ModalPortal/>
            </div>
        );
    }

    renderContent() {
        const bem = this.props.bem;
        switch (this.props.status) {
            case STATUS_ACCESS_DENIED:
                return (
                    <Login indexRoute={false}/>
                );

            case STATUS_LOADING:
                return null;

            case STATUS_OK:
                return (
                    <div className={bem.element('wrapper')}>
                        <div className={bem.element('sidebar')}>
                            <Nav
                                items='root'
                            />
                        </div>
                        <div className={bem.element('content')}>
                            {this.props.children}
                        </div>
                    </div>
                );
        }

        // TODO other statuses
        return this.props.status;
    }
}
