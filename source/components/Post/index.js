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

    _getCross = () => {
        const { firstName, lastName, currentUserFirstName, currentUserLastName } = this.props;

        return `${firstName} ${lastName}` === `${currentUserFirstName} ${currentUserLastName}`
            ? (<span
                className = { Styles.cross }
                onClick = { this._deletePost }
               />)
            : null;
    }

    render () {
        const {
            avatar,
            comment,
            created,
            firstName,
            lastName,
            _likePost,
            likes,
            id,
        } = this.props;

        const cross = this._getCross();

        return (
            <section className = { Styles.post }>
                { cross }
                <img src = { avatar } />
                <a>{`${firstName} ${lastName}`}</a>
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
