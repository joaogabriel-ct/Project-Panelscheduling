import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { api } from '@/service/api';
import { withSuperUserHOC } from '@/service/auth/session';

const ChangePasswordForm = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-semibold mb-4">Trocar Senha</h1>
            <Formik
                initialValues={{
                    currentPassword: '',
                    newPassword: '',
                    confirmNewPassword: ''
                }}
                validationSchema={Yup.object({
                    currentPassword: Yup.string().required('Campo obrigatório'),
                    newPassword: Yup.string().required('Campo obrigatório').min(6, 'Senha deve ter pelo menos 6 caracteres'),
                    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Senhas devem coincidir').required('Campo obrigatório')
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    api.post('URL_PARA_TROCA_DE_SENHA', values)
                        .then(response => {
                            console.log('Resposta do servidor:', response.data);
                            resetForm(); // Limpa o formulário após o envio bem-sucedido
                        })
                        .catch(error => {
                            console.error('Erro ao enviar dados:', error);
                        })
                        .finally(() => {
                            setSubmitting(false); // Define o estado de submissão de volta para false
                        });
                }}
            >
                <Form className="flex flex-col gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="currentPassword" className="text-sm">Senha Atual</label>
                        <Field type="password" name="currentPassword" className="border rounded-md p-2" />
                        <ErrorMessage name="currentPassword" component="div" className="text-red-500 text-sm" />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="newPassword" className="text-sm">Nova Senha</label>
                        <Field type="password" name="newPassword" className="border rounded-md p-2" />
                        <ErrorMessage name="newPassword" component="div" className="text-red-500 text-sm" />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="confirmNewPassword" className="text-sm">Confirmar Nova Senha</label>
                        <Field type="password" name="confirmNewPassword" className="border rounded-md p-2" />
                        <ErrorMessage name="confirmNewPassword" component="div" className="text-red-500 text-sm" />
                    </div>

                    <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition duration-300 ease-in-out">Trocar Senha</button>
                </Form>
            </Formik>
            </div>
        </div>
    );
};

export default withSuperUserHOC(ChangePasswordForm);
