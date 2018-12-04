// Core
import React, { Component } from 'react';

// Components
import Feed from 'components/Feed';
import { Provider } from 'components/HOC/withProfile';

// Instruments
import avatar from 'theme/assets/lisa';
import Catcher from '../../components/Catcher';

const options = {
    avatar,
    currentUserFirstName: 'Тарас',
    currentUserLastName:  'Петрук',
};

export default class App extends Component {
    render() {
        return (
            <Catcher>
                <Provider value = { options }>
                    <Feed />
                </Provider>
            </Catcher>
        );
    }
}
