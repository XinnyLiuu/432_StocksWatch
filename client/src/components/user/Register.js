import React from 'react';
import {
    Form,
    Button
} from 'react-bootstrap';
import {
    withRouter
} from 'react-router-dom';

import GenericError from '../error/GenericError';
import User from '../../model/User';
import {
    setSession
} from '../../utils/auth';

class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            firstname: '',
            lastname: '',
            error: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.register = this.register.bind(this);
    }

    handleChange(e) {
        let name = e.target.name;
        let value = e.target.value;

        this.setState({
            [name]: value
        });
    }

    // Takes the input in the form to register the user
    register(e) {
        e.preventDefault();

        // Validate inputs
        let username = this.state.username;
        let password = this.state.password;
        let firstname = this.state.firstname;
        let lastname = this.state.lastname;

        username = username.trim();
        password = password.trim();
        firstname = firstname.trim();
        lastname = lastname.trim();

        // Fire POST request
        let url = `${process.env.REACT_APP_SERVER_DEV_DOMAIN}/api/register`;

        fetch(url, {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "username": username,
                "password": password,
                "firstname": firstname,
                "lastname": lastname
            })
        }).then(resp => {
            if (resp.status === 200) {
                resp.json().then(resp => {
                    let id = resp.id;

                    // Instantiate User
                    const user = new User(id, username, firstname, lastname, true, []);

                    // Set user session
                    setSession(user);

                    // Redirect to home
                    this.props.history.push("/");
                }).catch(err => {
                    this.setState({
                        error: true
                    });
                })
            }

            if (resp.status === 500) {
                this.setState({
                    error: true
                });
            }
        }).catch(err => {
            this.setState({
                error: true
            });
        })
    }

    render() {
        // Check if error
        if (this.state.error) {
            return <GenericError />;
        }

        return (
            <div id="login">
                <Form onSubmit={this.register}>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter username" name="username" onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter first name" name="firstname" onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter last name" name="lastname" onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" name="password" onChange={this.handleChange} />
                    </Form.Group>

                    <Button variant="info" type="submit">
                        Register
                    </Button>
                </Form>
            </div>
        )
    }
}

export default withRouter(Register);