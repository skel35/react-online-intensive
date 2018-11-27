// Core
import React, { Component } from 'react';
import moment from 'moment';
import { array, func, number, string } from 'prop-types';

// Components
import { Consumer } from 'components/HOC/withProfile';
import Like from 'components/Like';

// Instruments
import Styles from './styles.m.css';

export default class Post extends Component {
    static propTypes = {
        comment:     string.isRequired,
        created:     number.isRequired,
        _likePost:   func.isRequired,
        _deletePost: func.isRequired,
        likes:       array.isRequired,
        id:          string.isRequired,
    };

    constructor() {
        super();
        this._deletePost = this._deletePost.bind(this);
    }

    _deletePost() {
        this.props._deletePost(this.props.id);
    }

    render () {
        const { comment, created, _likePost, likes, id } = this.props;

        return (
            <Consumer>
                {(context) => (
                    <section className = { Styles.post }>
                        <span
                            className = { Styles.cross }
                            onClick = { this._deletePost }
                        />
                        <img src = { context.avatar } />
                        <a>{`${context.currentUserFirstName} ${context.currentUserLastName}`}</a>
                        <time>{moment.unix(created).format('MMMM D h:mm:ss a')}</time>
                        <p>{comment}</p>
                        <Like
                            _likePost = { _likePost }
                            id = { id }
                            likes = { likes }
                            { ...context }
                        />
                    </section>
                )}
            </Consumer>
        );
    }
}
