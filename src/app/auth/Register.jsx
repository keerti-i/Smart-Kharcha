import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Helmet } from 'react-helmet';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';
import { Link, useHistory } from 'react-router-dom';   // ← import useHistory

import axios from './../../Axios';
import { authApiEndpoints } from './../../API';

import LocaleToggle from './../locale/LocaleToggle';

const registerValidationSchema = yup.object().shape({
  name:             yup.string().required('Name field is required').min(4, 'Name must be at least 4 characters'),
  email:            yup.string().required('Email field is required').email('Must be a valid email'),
  password:         yup.string().required('Password field is required').min(6, 'Password must be at least 6 characters'),
  confirm_password: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
});

let messages;

const Register = () => {
  const history = useHistory();               // ← hook instance
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    errors,
    setError,
    reset
  } = useForm({
    validationSchema: registerValidationSchema
  });

  const submitRegister = data => {
    messages.clear();
    setSubmitting(true);

    axios.post(authApiEndpoints.register, data)  // no need for JSON.stringify
      .then(response => {
        if (response.status === 201) {
          messages.show({
            severity: 'success',
            detail: 'Registration successful. Redirecting to login…',
            sticky: true
          });

          reset();
          setSubmitting(false);

          // ← after a brief delay (so user sees the message), go to login
          setTimeout(() => history.replace('/login'), 1000);
        }
      })
      .catch(err => {
        if (err.response?.status === 422) {
          // server‑side validation errors
          const apiErrors = Object.entries(err.response.data).map(
            ([field, msgArr]) => ({ name: field, message: msgArr[0] })
          );
          setError(apiErrors);
        } else {
          messages.show({
            severity: 'error',
            detail: 'Something went wrong. Try again.',
            sticky: true
          });
        }
        setSubmitting(false);
      });
  };

  return (
    <div>
      <Helmet title='Register' />
      <div
        className='p-grid p-nogutter p-align-center p-justify-center'
        style={{ height: '95vh' }}
      >
        <Card className='p-sm-12 p-md-6 p-lg-4' style={{ borderRadius: 5 }}>
          <div className='p-col-12 p-fluid'>
            <Messages ref={el => (messages = el)} />
          </div>
          <div className='p-col-12'>
            <div className='p-card-title p-grid p-nogutter p-justify-between'>
              Register <LocaleToggle />
            </div>
            <div className='p-card-subtitle'>Enter your info to register</div>
          </div>

          <form onSubmit={handleSubmit(submitRegister)}>
            <div className='p-col-12 p-fluid'>
              <div className='p-inputgroup'>
                <span className='p-inputgroup-addon'>
                  <i className='pi pi-user' />
                </span>
                <input
                  name='name'
                  placeholder='Name'
                  ref={register}
                  className='p-inputtext p-component p-filled'
                />
              </div>
              <small className='text-error'>{errors.name?.message}</small>
            </div>

            <div className='p-col-12 p-fluid'>
              <div className='p-inputgroup'>
                <span className='p-inputgroup-addon'>
                  <i className='pi pi-envelope' />
                </span>
                <input
                  name='email'
                  placeholder='Email'
                  ref={register}
                  className='p-inputtext p-component p-filled'
                />
              </div>
              <small className='text-error'>{errors.email?.message}</small>
            </div>

            <div className='p-col-12 p-fluid'>
              <div className='p-inputgroup'>
                <span className='p-inputgroup-addon'>
                  <i className='pi pi-key' />
                </span>
                <input
                  type='password'
                  name='password'
                  placeholder='Password'
                  ref={register}
                  className='p-inputtext p-component p-filled'
                />
              </div>
              <small className='text-error'>{errors.password?.message}</small>
            </div>

            <div className='p-col-12 p-fluid'>
              <div className='p-inputgroup'>
                <span className='p-inputgroup-addon'>
                  <i className='pi pi-key' />
                </span>
                <input
                  type='password'
                  name='confirm_password'
                  placeholder='Confirm Password'
                  ref={register}
                  className='p-inputtext p-component p-filled'
                />
              </div>
              <small className='text-error'>
                {errors.confirm_password?.message}
              </small>
            </div>

            <div className='p-col-12 p-fluid'>
              <Button
                disabled={submitting}
                type='submit'
                label='Register'
                icon='pi pi-sign-in'
                className='p-button-raised'
              />
            </div>

            <div className='p-grid p-nogutter p-col-12 p-justify-center'>
              <Link to='/login'>Login</Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default React.memo(Register);
