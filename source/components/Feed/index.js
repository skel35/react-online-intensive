// Core
import React, { Component } from 'react';
import moment from 'moment';

// Components
import Post from 'components/Post';
import Composer from 'components/Composer';
import StatusBar from 'components/StatusBar';
import Spinner from 'components/Spinner';
import { withProfile } from 'components/HOC/withProfile';

// Instruments
import Styles from './styles.m.css';
import { getUniqueID, delay } from 'instruments';

@withProfile
export default class Feed extends Component {
    state = {
        posts:           [{ id: '123', comment: 'Hi there!', created: 1543347855, likes: [] }, { id: '456', comment: 'Приветик!', created: 1543347873, likes: [] }],
        isPostsFetching: false,
    }

    _setPostsFetchingState = (isPostsFetching) => {
        this.setState({
            isPostsFetching: isPostsFetching,
        });
    }

    _createPost = async (comment) => {
        this._setPostsFetchingState(true);
        const post = {
            id:      getUniqueID(),
            created: moment().unix(),
            comment,
            likes:   [],
        };
        await delay(1200);
        this.setState({
            isPostsFetching: false,
        });
        this.setState(({posts}) => ({
            posts:           [ post, ...posts ],
            isPostsFetching: false,
        }));
    }

    _deletePost = async (id) => {
        this._setPostsFetchingState(true);
        await delay(1200);
        this.setState(({posts}) => {
            const newPosts = posts.filter((post) => post.id !== id);

            return {
                posts:           newPosts,
                isPostsFetching: false,
            };
        });
    }

    _likePost = async (id) => {
        const { currentUserFirstName, currentUserLastName } = this.props;
        this._setPostsFetchingState(true);

        await delay(1200);

        this.setState((oldState) => {
            const newPosts = oldState.posts.map((post) => {
                if (post.id === id) {
                    return {
                        ...post,
                        likes: [
                            {
                                id:        getUniqueID(),
                                firstName: currentUserFirstName,
                                lastName:  currentUserLastName,
                            },
                        ],
                    };
                }

                return post;
            });

            return {
                posts:           newPosts,
                isPostsFetching: false,
            };
        });
    }

    render() {
        const { posts, isPostsFetching } = this.state;

        const postsJSX = posts.map((post) => {
            return (
                <Post
                    _deletePost = { this._deletePost }
                    _likePost = { this._likePost }
                    key = { post.id }
                    { ...post }
                />
            );
        });

        return (
            <section className = { Styles.feed }>
                <Spinner isSpinning = { isPostsFetching } />
                <StatusBar />
                <Composer _createPost = { this._createPost } />
                { postsJSX }
            </section>
        );
    }
}
