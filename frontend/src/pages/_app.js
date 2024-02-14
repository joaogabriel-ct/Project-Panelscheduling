import Header from '@/components/header';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      {!pageProps.hideHeader && <Header />}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
