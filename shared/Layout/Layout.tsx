import React from 'react';
import _values from 'lodash-es/values';
import {Notifications} from '@steroidsjs/core/ui/layout';
import {ILayoutHocOutput, STATUS_LOADING, STATUS_OK} from '@steroidsjs/core/hoc/layout';
import ModalPortal from '@steroidsjs/core/ui/modal/ModalPortal'

import {bem, components, layout, connect} from '@steroidsjs/core/hoc';
import './Layout.scss';

import {IBemHocOutput} from '@steroidsjs/core/hoc/bem';
import Header from '@steroidsjs/core/ui/layout/Header';
import {STATUS_ACCESS_DENIED} from '@steroidsjs/core/hoc/layout';
import Login from '../Login';
import {getRoutesMap} from '@steroidsjs/core/reducers/router';
import Tree from '@steroidsjs/core/ui/nav/Tree';

export interface ILayoutProps extends IBemHocOutput, ILayoutHocOutput {
    title?: string,
    loginUrl?: string,
}

interface ILayoutPrivateProps {
    isInitialized?: boolean,
    user?: any,
}

@bem('Layout')
@components('http')
@connect(state => ({
    routes: getRoutesMap(state),
}))
@layout(props => {
    let models = props.models || [];
    _values(props.routes).forEach(route => {
        models = models.concat(route.models || []);
    });
    let enums = props.enums || [];
    _values(props.routes).forEach(route => {
        enums = enums.concat(route.enums || []);
    });

    return props.http.post('/api/v1/init', {
        models: models.length > 0 ? models : undefined,
        enums: enums.length > 0 ? enums : undefined,
    });
})
export default class Layout extends React.PureComponent<ILayoutProps & ILayoutPrivateProps> {

    render() {
        const bem = this.props.bem;
        return (
            <div className={bem.block()}>
                <Header
                    logo={{
                        title: this.props.title,
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
                    <Login
                        indexRoute={false}
                        loginUrl={this.props.loginUrl}
                    />
                );

            case STATUS_LOADING:
                return null;

            case STATUS_OK:
                return (
                    <div className={bem(bem.element('wrapper'), 'container-fluid')}>
                        <div className='row'>
                            <nav className={bem(bem.element('sidebar'), 'col-md-3 col-lg-2 d-md-block bg-light sidebar collapse')}>
                                <Tree items='root'/>
                            </nav>
                            <main role='main' className={bem(bem.element('content'), 'col-md-9 ml-sm-auto col-lg-10 px-md-4')}>
                                {this.props.children}
                            </main>
                        </div>
                    </div>
                );
        }

        // TODO other statuses
        return this.props.status;
    }
}
