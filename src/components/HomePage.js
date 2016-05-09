/*
Copyright 2016 OpenMarket Ltd

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React from 'react'

var linkable_clients = [
    {
        name: "Vector",
        logo: "",
        author: "Vector.im",
        homepage: "https://vector.im",
        room_url: "https://vector.im/beta/#/room/",
        user_url: "https://vector.im/beta/#/user/",
        msg_url: "https://vector.im/beta/#/room/",
        maturity: "Late beta",
        comments: "Fully-featured Matrix client for Web, iOS & Android",
    },
    {
        name: "Matrix Console",
        logo: "",
        author: "Matrix.org",
        homepage: "https://matrix.org",
        room_url: "https://matrix.org/beta/#/room/",
        user_url: null,
        maturity: "Deprecated",
        comments: "The original developer-focused client for Web, iOS & Android",
    },
    {
        name: "PTO (Perpetually Talking Online",
        logo: "",
        author: "Torrie Fischer",
        homepage: "https://pto.im",
        room_url: "irc://irc.matrix.org/",
        user_url: null,
        maturity: "Alpha",
        comments: "Access any room anywhere in Matrix via good old IRC!",
    },
];

var unlinkable_clients = [
    {
        name: "Weechat",
        logo: "",
        author: "Tor Hveem",
        homepage: "https://github.com/torhve/weechat-matrix-protocol-script",
        maturity: "Late beta",
        room_instructions: "Type /join $entity",
        user_instructions: "Type /invite $entity",
        comments: "Commandline Matrix interface using Weechat",
    },
    {
        name: "Quaternion",
        logo: "",
        author: "Felix Rohrbach",
        homepage: "https://github.com/Fxrh/Quaternion",
        maturity: "Late alpha",
        room_instructions: "Type /join $entity",
        user_instructions: "Type /invite $entity",
        comments: "Qt5 and C++ cross-platform desktop Matrix client",
    },
    {
        name: "Tensor",
        logo: "",
        author: "David A Roberts",
        homepage: "https://github.com/davidar/tensor",
        maturity: "Late alpha",
        room_instructions: "Type /join $entity",
        user_instructions: "Type /invite $entity",
        comments: "QML and JS cross-platform desktop Matrix client",
    },
    {
        name: "Tensor2",
        logo: "",
        author: "David A Roberts",
        homepage: "https://github.com/davidar/tensor2",
        maturity: "Alpha",
        room_instructions: "Type /join $entity",
        user_instructions: "Type /invite $entity",
        comments: "QML and C++ cross-platform desktop Matrix client",
    },
    {
        name: "Mclient.el",
        logo: "",
        author: "Ryan Rix",
        homepage: "http://fort.kickass.systems:10082/cgit/personal/rrix/pub/matrix.el.git/",
        maturity: "Alpha",
        comments: "Matrix client for Gnu Emacs",
    }
];

export default React.createClass({

    getInitialState() {
        return {
            error: null,
            entity: null,
            showLink: false,
        }
    },

    onHashChange() {
        var entity = window.location.hash.substr(2); // strip off #/ prefix
        if (!entity) {
            this.setState({
                entity: null,
                showLink: false,
            });
            return;
        }

        if (!this.isAliasValid(entity) && !this.isUserIdValid(entity) && !this.isMsglinkValid(entity)) {
            this.setState({
                entity: entity,
                error: "Invalid room alias, user ID or message permalink",
            });
            return;
        }
        this.setState({
            entity: entity,
            showLink: true,
        });
    },

    componentWillMount() {
        if (window.location.hash) {
            this.onHashChange();
        }
    },

    componentDidMount() {
        window.addEventListener("hashchange", this.onHashChange);
    },

    componentWillUnmount() {
        window.removeEventListener("hashchange", this.onHashChange);
    },

    onSubmit(ev) {
        ev.preventDefault();

        var entity = this.refs.prompt.value.trim();
        if (!this.isAliasValid(entity) && !this.isUserIdValid(entity)) {
            this.setState({ error: "Invalid room alias or user ID" });
            return;
        }
        var loc = window.location;
        loc.hash = "#/" + entity;
        window.location.assign(loc.href);
        this.setState({
            showLink: true,
            entity: entity,
        });
    },

    // XXX: cargo-culted from matrix-react-sdk
    isAliasValid(alias) {
        // XXX: FIXME SPEC-1
        return (alias.match(/^#([^\/:,]+?):(.+)$/) && encodeURI(alias) === alias);
    },

    isUserIdValid(userId) {
        // XXX: FIXME SPEC-1
        return (userId.match(/^@([^\/:,]+?):(.+)$/) && encodeURI(userId) === userId);
    },

    isMsglinkValid(msglink) {
        // XXX: FIXME SPEC-1
        return (msglink.match(/^(\!#)([^\/:,]+?):(.+)\/\$[^\/:,]+?:(.+)$/) && encodeURI(msglink) === msglink);
    },

    render() {
        var error;
        if (this.state.error) {
            error = <div className="mxt_HomePage_error">{ this.state.error }</div>
        }

        var prompt;
        if (this.state.showLink) {
            var link = "https://matrix.to/#/" + this.state.entity;

            var isRoom = this.isAliasValid(this.state.entity);
            var isUser = this.isUserIdValid(this.state.entity);
            var isMsg = this.isMsglinkValid(this.state.entity);

            var links;

            // name: "Vector",
            // logo: "",
            // author: "Vector.im",
            // link: "https://vector.im",
            // room_url: "https://vector.im/beta/#/room/",
            // user_url: "https://vector.im/beta/#/user/",
            // maturity: "Late beta",
            // comments: "Fully-featured Matrix client for Web, iOS & Android",

            links = (
                <div key="links" className="mxt_HomePage_links">
                    <div className="mxt_HomePage_links_intro">
                        <p>
                            Matrix is an ecosystem for open and interoperable communication.
                        </p>
                        <p>
                            To connect to <b>{ this.state.entity }</b>, please select an app:
                        </p>
                    </div>

                    { linkable_clients.map((client) => {
                        var link;
                        if (isRoom && client.room_url) {
                            link = client.room_url + this.state.entity;
                        }
                        else if (isUser && client.user_url) {
                            link = client.user_url + this.state.entity;
                        }
                        else if (isMsg && client.msg_url) {
                            link = client.msg_url + this.state.entity;
                        }
                        if (!link) return <div key={ client.name }/>;

                        var link = isRoom ? client.room_url + this.state.entity : client.user_url + this.state.entity;
                        return (
                            <div key={ client.name } className="mxt_HomePage_link">
                                <div className="mxt_HomePage_link_logo">
                                    <a href={ link }><img src={ client.logo }/></a>
                                </div>
                                <div className="mxt_HomePage_link_name">
                                    <a href={ link }>{ client.name }</a>
                                    <div className="mxt_HomePage_link_homepage">
                                        <a href={ client.homepage }>{ client.homepage }</a>
                                    </div>
                                </div>
                                <div className="mxt_HomePage_link_comments">
                                    { client.comments }
                                </div>
                                <div className="mxt_HomePage_link_author">
                                    { client.author }
                                </div>
                                <div className="mxt_HomePage_link_maturity">
                                    { client.maturity }
                                </div>
                                <div className="mxt_HomePage_link_link">
                                    <a href={ link }>{ link }</a>
                                </div>
                            </div>
                        );
                    })}
                    { unlinkable_clients.map((client) => {
                        var instructions;
                        if (isRoom && client.room_instructions) {
                            instructions = client.room_instructions.replace("$entity", this.state.entity);
                        }
                        else if (isUser && client.user_instructions) {
                            instructions = client.user_instructions.replace("$entity", this.state.entity);
                        }
                        else if (isMsg && client.msg_instructions) {
                            instructions = client.msg_instructions.replace("$entity", this.state.entity);
                        }
                        if (!instructions) return <div key={ client.name } />;

                        return (
                            <div key={ client.name } className="mxt_HomePage_link">
                                <div className="mxt_HomePage_link_logo">
                                    <a href={ client.homepage }><img src={ client.logo }/></a>
                                </div>
                                <div className="mxt_HomePage_link_name">
                                    <a href={ client.homepage }>{ client.name }</a>
                                    <div className="mxt_HomePage_link_homepage">
                                        <a href={ client.homepage }>{ client.homepage }</a>
                                    </div>
                                </div>
                                <div className="mxt_HomePage_link_comments">
                                    { client.comments }
                                </div>
                                <div className="mxt_HomePage_link_author">
                                    { client.author }
                                </div>
                                <div className="mxt_HomePage_link_maturity">
                                    { client.maturity }
                                </div>
                                <div className="mxt_HomePage_link_instructions">
                                    { instructions }
                                </div>
                            </div>
                        );
                    })}

                    <p>
                        To add clients to this list, <a href="https://matrix.to/#/#matrix-dev:matrix.org">please contact us</a> or
                        simply send us a pull request <a href="https://github.com/matrix-org/matrix.to">on github</a>!
                    </p>
                </div>
            );

            prompt = [
                <div key="inputbox" className="mxt_HomePage_inputBox">
                    <a href={ link } className="mxt_HomePage_inputBox_link">{ link }</a>
                    { error }
                </div>,
                links
            ];
        }
        else {
            prompt = [
                <div key="inputBox" className="mxt_HomePage_inputBox">
                    <form onSubmit={ this.onSubmit }>
                        <input autoFocus className="mxt_HomePage_inputBox_prompt" value={ this.state.entity } ref="prompt" size="36" type="text" value={ this.state.value } placeholder="#room:domain.com or @user:domain.com" />
                        <input className="mxt_HomePage_inputBox_button" type="submit" value="Get link!" />
                    </form>
                    { error }
                </div>,
                <div key="cta" className="mxt_HomePage_cta">
                    Create shareable links to Matrix rooms, users or messages<br/>
                    without being tied to a specific app.
                </div>
            ];
        }

        return (
            <div className="mxt_HomePage">
                <a href="#">
                    <img className="mxt_HomePage_logo" src="img/matrix-logo.svg" width="352" height="150" alt="[matrix]"/>
                </a>

                { prompt }

                <div className="mxt_HomePage_info">
                    <h3>About</h3>
                    <p>
                        Matrix.to is a simple stateless URL redirecting service
                        which lets users share links to entities in the <a href="https://matrix.org">Matrix.org
                        </a> ecosystem without being tied to any specific app.  This lets users choose their own favourite
                        Matrix client to participate in conversations rather than being forced to use the same app as
                        whoever sent the link.
                    </p>
                    <p>
                        The service preserves user privacy by not
                        sharing any information about the links being followed with the Matrix.to server - the
                        redirection is calculated entirely clientside using JavaScript.
                    </p>
                    <p>
                        Links are designed to be human-friendly, both for reading and constructing, and are
                        essentially a compatibility step in the journey towards
                        a <a href="https://matrix.org/jira/browse/SPEC-5">ubiquitous mx://</a> URL scheme.
                    </p>
                </div>
            </div>
        );
    }
})
