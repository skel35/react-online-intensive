// Core
import React, { Component } from 'react';

// Components
import Post from 'components/Post';
import Composer from 'components/Composer';
import StatusBar from 'components/StatusBar';
import Spinner from 'components/Spinner';

// Instruments
import Styles from './styles.m.css';

export default class Feed extends Component {
    state = {
        posts:      [{ id: '123', comment: 'Hi there!', created: 1543347855 }, { id: '456', comment: 'Приветик!', created: 1543347873 }],
        isSpinning: true,
    }

    render() {
        const { posts, isSpinning } = this.state;

        const postsJSX = posts.map((post) => {
            return (
                <Post
                    key = { post.id }
                    { ...post }
                />
            );
        });

        return (
            <section className = { Styles.feed }>
                <Spinner isSpinning = { isSpinning } />
                <StatusBar />
                <Composer />
                { postsJSX }
            </section>
        );
    }
}
