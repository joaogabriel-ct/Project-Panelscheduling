import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { withSuperUserHOC } from '@/service/auth/session';
import { api } from '@/service/api';

const RegisterForm = () => {
    return (
        <div>
            <h1>Registro</h1>
            <Formik
                initialValues={{
                    username: '',
                    password: '',
                    confirmPassword: ''
                }}
                validationSchema={Yup.object({
                    username: Yup.string().email('E-mail inválido').required('Campo obrigatório'),
                    password: Yup.string().required('Campo obrigatório').min(6, 'Senha deve ter pelo menos 6 caracteres'),
                    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Senhas devem coincidir').required('Campo obrigatório')
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    api.post('URL_DO_SEU_ENDPOINT', values)
                        .then(response => {
                            console.log('Resposta do servidor:', response.data);
                            resetForm();
                        })
                        .catch(error => {
                            console.error('Erro ao enviar dados:', error);
                        })
                        .finally(() => {
                            setSubmitting(false);
                        });
                }}
            >
                <Form>
                    <div>
                        <label htmlFor="username">E-mail</label>
                        <Field type="email" name="username" />
                        <ErrorMessage name="email" />
                    </div>

                    <div>
                        <label htmlFor="password">Senha</label>
                        <Field type="password" name="password" />
                        <ErrorMessage name="password" />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword">Confirmar Senha</label>
                        <Field type="password" name="confirmPassword" />
                        <ErrorMessage name="confirmPassword" />
                    </div>

                    <button type="submit">Registrar</button>
                </Form>
            </Formik>
        </div>
    );
};

export default withSuperUserHOC(RegisterForm);