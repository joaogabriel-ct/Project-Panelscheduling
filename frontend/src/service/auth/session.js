import React from 'react';
import { authService } from './authService';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

export function withSession(funcao) {
    return async (ctx) => {
        try {
            const session = await authService.getSession(ctx);
            const modifiedCtx = {
                ...ctx,
                req: {
                    ...ctx.req,
                    session,
                }
            };
            return funcao(modifiedCtx);
        } catch (err) {
            return {
                redirect: {
                    permanent: false,
                    destination: 'login/?error=401',
                }
            }
        }
    }
}

export function useSession() {
    const [session, setSession] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        authService.getSession()
            .then((response) => {
                if (response && response.data) {
                    setSession(response.data);
                    setLoading(false);
                } else {
                    setError(new Error('Nenhum dado na resposta'));
                }
            })
            .catch((err) => {
                setError(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return {
        session,
        error,
        loading,
    }
}

export function withSessionHOC(Component) {
    return function Wrapper(props) {
        const router = useRouter();
        const { session, error, loading } = useSession();

        React.useEffect(() => {
            if (!loading && error) {
                Swal.fire({
                    title: 'Erro de Sessão',
                    text: 'Não foi possível verificar sua sessão. Por favor, faça login novamente.',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                }).then(() => {
                    router.push('/login');
                });
            }
        }, [loading, error, router]);

        if (loading || error) return null;

        const modifiedProps = {
            ...props,
            session,
        };
        return <Component {...modifiedProps} />;
    };
}

export function withSuperUserHOC(Component) {
    return function Wrapper(props) {
        const router = useRouter();
        const { session, error, loading } = useSession();

        React.useEffect(() => {
            if (!loading) {
                if (error) {
                    Swal.fire({
                        title: 'Erro de Sessão',
                        text: 'Não foi possível verificar sua sessão. Por favor, faça login novamente.',
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    }).then(() => {
                        router.push('/login');
                    });
                } else if (!session || !session.user.is_superUser) {
                    Swal.fire({
                        title: 'Acesso Negado',
                        text: 'Você não tem permissão para acessar esta página.',
                        icon: 'warning',
                        confirmButtonText: 'Ok'
                    }).then(() => {
                        router.push('/dashboard');
                    });
                }
            }
        }, [session, loading, error, router]);

        if (loading || error || (session && !session.user.is_superUser)) {
            return null;
        }

        return <Component {...props} session={session} />;
    };
}