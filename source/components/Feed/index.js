// Core
import React, { Component } from 'react';

// Components
import Post from 'components/Post';
import Catcher from 'components/Catcher';
import Composer from 'components/Composer';
import StatusBar from 'components/StatusBar';
import Spinner from 'components/Spinner';
import { withProfile } from 'components/HOC/withProfile';

// Instruments
import Styles from './styles.m.css';
import { api, TOKEN, GROUP_ID } from 'config/api';
import { socket } from 'socket/init';

@withProfile
export default class Feed extends Component {
    state = {
        posts:           [],
        isPostsFetching: false,
    }

    componentDidMount() {
        const { currentUserFirstName, currentUserLastName } = this.props;
        this._fetchPosts();

        socket.emit('join', GROUP_ID);

        socket.on('create', (postJSON) => {
            const { data: createdPost, meta } = JSON.parse(postJSON);
            if (`${currentUserFirstName} ${currentUserLastName}` !== `${meta.authorFirstName} ${meta.authorLastName}`) {
                this.setState(({posts}) => ({
                    posts: [ createdPost, ...posts ],
                }));
            }
        });

        socket.on('remove', (postJSON) => {
            const { data: removedPost, meta } = JSON.parse(postJSON);
            if (`${currentUserFirstName} ${currentUserLastName}` !== `${meta.authorFirstName} ${meta.authorLastName}`) {
                this.setState(({posts}) => ({
                    posts: posts.filter((post) => post.id !== removedPost.id),
                }));
            }
        });

        socket.on('like', (postJSON) => {
            const { data: updatedPost} = JSON.parse(postJSON);
            this.setState(({posts}) => ({
                posts: posts.map((post) => post.id === updatedPost.id ? updatedPost : post),
            }));
        });
    }

    componentWillUnmount() {
        socket.removeListener('create');
        socket.removeListener('remove');
        socket.removeListener('like');
    }

    _setPostsFetchingState = (isPostsFetching) => {
        this.setState({
            isPostsFetching: isPostsFetching,
        });
    }

    _fetchPosts = async () => {
        this._setPostsFetchingState(true);

        const response = await fetch(api, {
            method: 'GET',
        });

        const { data : posts } = await response.json();

        this.setState({
            posts,
            isPostsFetching: false,
        });
    }

    _createPost = async (comment) => {
        this._setPostsFetchingState(true);
        const response = await fetch(api, {
            method:  'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  TOKEN,
            },
            body: JSON.stringify({ comment }),
        });

        const { data: post } = await response.json();

        this.setState(({posts}) => ({
            posts:           [ post, ...posts ],
            isPostsFetching: false,
        }));
    }

    _deletePost = async (id) => {
        this._setPostsFetchingState(true);
        await fetch(`${api}/${id}`, {
            method:  'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  TOKEN,
            },
        });

        this.setState(({posts}) => {
            const newPosts = posts.filter((post) => post.id !== id);

            return {
                posts:           newPosts,
                isPostsFetching: false,
            };
        });
    }

    _likePost = async (id) => {
        this._setPostsFetchingState(true);

        const response = await fetch(`${api}/${id}`, {
            method:  'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  TOKEN,
            },
        });

        const { data: likedPost} = await response.json();

        this.setState(({posts}) => {
            return {
                posts:           posts.map((post) => post.id === likedPost.id ? likedPost : post),
                isPostsFetching: false,
            };
        });
    }

    render() {
        const { posts, isPostsFetching } = this.state;

        const postsJSX = posts.map((post) => {
            return (
                <Catcher key = { post.id }>
                    <Post
                        _deletePost = { this._deletePost }
                        _likePost = { this._likePost }
                        { ...post }
                    />
                </Catcher>
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
