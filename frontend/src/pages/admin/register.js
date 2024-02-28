import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { withSuperUserHOC } from '@/service/auth/session';
import { api } from '@/service/api';

const RegisterForm = () => {
    return (
        <div className="flex items-center justify-center  ">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-2xl font-bold mb-8">Registro</h1>
                <Formik
                    initialValues={{
                        email: '',
                        password: '',
                        confirmPassword: ''
                    }}
                    validationSchema={Yup.object({
                        email: Yup.string().email('E-mail inválido').required('Campo obrigatório'),
                        password: Yup.string().required('Campo obrigatório').min(6, 'Senha deve ter pelo menos 6 caracteres'),
                        confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Senhas devem coincidir').required('Campo obrigatório')
                    })}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        api.post('user/', values)
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
                    <Form className="w-full">
                        <div>
                            <label htmlFor="email" className="block">E-mail</label>
                            <Field type="email" name="email" className="w-full border p-2 rounded" />
                            <ErrorMessage name="email" component="div" className="text-red-500" />
                        </div>

                        <div>
                            <label htmlFor="password" className="block">Senha</label>
                            <Field type="password" name="password" className="w-full border p-2 rounded" />
                            <ErrorMessage name="password" component="div" className="text-red-500" />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block">Confirmar Senha</label>
                            <Field type="password" name="confirmPassword" className="w-full border p-2 rounded" />
                            <ErrorMessage name="confirmPassword" component="div" className="text-red-500" />
                        </div>

                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4">Registrar</button>
                    </Form>
                </Formik>
            </div>
        </div>
    );
};

export default withSuperUserHOC(RegisterForm);
