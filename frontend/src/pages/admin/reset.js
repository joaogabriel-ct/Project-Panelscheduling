import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { api } from '@/service/api'; // Importe o objeto axios configurado como 'api'

const ChangePasswordForm = () => {
    return (
        <div>
            <h1>Trocar Senha</h1>
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
                <Form>
                    <div>
                        <label htmlFor="currentPassword">Senha Atual</label>
                        <Field type="password" name="currentPassword" />
                        <ErrorMessage name="currentPassword" />
                    </div>

                    <div>
                        <label htmlFor="newPassword">Nova Senha</label>
                        <Field type="password" name="newPassword" />
                        <ErrorMessage name="newPassword" />
                    </div>

                    <div>
                        <label htmlFor="confirmNewPassword">Confirmar Nova Senha</label>
                        <Field type="password" name="confirmNewPassword" />
                        <ErrorMessage name="confirmNewPassword" />
                    </div>

                    <button type="submit">Trocar Senha</button>
                </Form>
            </Formik>
        </div>
    );
};

export default ChangePasswordForm;
