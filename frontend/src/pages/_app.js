import Header from '@/components/header';
import '../styles/globals.css';
import { useRouter } from 'next/router';
import { useSession } from '@/service/auth/session';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { session, loading } = useSession(); 
  const showHeader = !router.pathname.startsWith('/login') && !loading && session;
  const isSuperUser = session?.user?.is_superUser || false;

  return (
    <>
      {showHeader && <Header isSuperUser={isSuperUser} />}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;