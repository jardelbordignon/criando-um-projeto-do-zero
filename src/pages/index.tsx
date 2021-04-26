import { FiCalendar, FiUser } from 'react-icons/fi';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import Prismic from '@prismicio/client';

// import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../services/prismic';

import Header from '../components/Header';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home(data: PostPagination): JSX.Element {
  // const { next_page, results } = postsPagination;
  console.log(JSON.stringify(data, null, 3));

  return (
    <>
      <Header />

      <main className={styles.container}>
        <div className={styles.posts}>
          {data.results.map(post => (
            <Link key={post.uid} href={`/post/${post.uid}`}>
              <a>
                <h2>{post.data.title}</h2>
                <span>{post.data.subtitle}</span>
                <div>
                  <FiCalendar />
                  <time>{post.first_publication_date}</time>
                  <FiUser />
                  <span>{post.data.author}</span>
                </div>
              </a>
            </Link>
          ))}
        </div>

        <Link href="/">
          <a>Carregar mais posts</a>
        </Link>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.author', 'post.content'],
      pageSize: 10,
    }
  );

  // console.log(JSON.stringify(postsResponse, null, 3));

  const posts = postsResponse.results.map(post => {
    // const firstParagraph = post.data.content.find(content => content.type === 'paragraph')?.text ?? '';
    const first_publication_date = new Date(
      post.first_publication_date
    ).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    return {
      uid: post.uid,
      first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.content[0].heading,
        author: post.data.author,
      },
    };
  });

  return {
    props: {
      next_page: postsResponse.next_page,
      results: posts,
    },
    revalidate: 60 * 60 * 12, // 12 horas
  };
};
