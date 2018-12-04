// Core
import React, { Component } from 'react';
import moment from 'moment';
import { array, func, number, string } from 'prop-types';

// Components
import Like from 'components/Like';
import { withProfile } from 'components/HOC/withProfile';

// Instruments
import Styles from './styles.m.css';

@withProfile
export default class Post extends Component {
    static propTypes = {
        comment:     string.isRequired,
        created:     number.isRequired,
        _likePost:   func.isRequired,
        _deletePost: func.isRequired,
        likes:       array.isRequired,
        id:          string.isRequired,
    };

    _deletePost = () => {
        this.props._deletePost(this.props.id);
    }

    render () {
        const { avatar, comment, created, currentUserFirstName, currentUserLastName,
            _likePost, likes, id } = this.props;

        return (
            <section className = { Styles.post }>
                <span
                    className = { Styles.cross }
                    onClick = { this._deletePost }
                />
                <img src = { avatar } />
                <a>{`${currentUserFirstName} ${currentUserLastName}`}</a>
                <time>{moment.unix(created).format('MMMM D h:mm:ss a')}</time>
                <p>{comment}</p>
                <Like
                    _likePost = { _likePost }
                    id = { id }
                    likes = { likes }
                />
            </section>
        );
    }
}
