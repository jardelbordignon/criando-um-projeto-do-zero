import { FiCalendar, FiUser } from 'react-icons/fi';
import Header from '../components/Header';

import styles from './home.module.scss';

export default function Home(): JSX.Element {
  return (
    <>
      <Header />

      <main className={styles.container}>
        <div className={styles.posts}>
          <a>
            <h2>Como utilizar Hooks</h2>
            <span>Pensando em sincronização em vez de ciclos de vida.</span>
            <div>
              <FiCalendar />
              <time>23 abr 2021</time>
              <FiUser />
              <span>Jardel Bordignon</span>
            </div>
          </a>

          <a>
            <h2>Como utilizar Hooks</h2>
            <span>Pensando em sincronização em vez de ciclos de vida.</span>
            <div>
              <FiCalendar />
              <time>23 abr 2021</time>
              <FiUser />
              <span>Jardel Bordignon</span>
            </div>
          </a>
        </div>
      </main>
    </>
  );
}
