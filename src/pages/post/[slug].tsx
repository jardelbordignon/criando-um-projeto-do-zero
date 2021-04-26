import { Fragment } from 'react';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { GetStaticPaths, GetStaticProps } from 'next';
import PrismicDOM from 'prismic-dom';
import Prismic from '@prismicio/client';

import { getPrismicClient } from '../../services/prismic';

import Header from '../../components/Header';
import commonStyles from '../../styles/common.module.scss';
import { formattedDate } from '../../utils/prismicFormaters';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
  timeToRead: string;
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  return (
    <>
      <Header />

      <div className={styles.bannerContainer}>
        <img src="/images/programmer-life.png" alt="Programmer Life" />
      </div>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.data.title}</h1>

          <div className={styles.postInfo}>
            <time>
              <FiCalendar />
              {post.first_publication_date}
            </time>
            <span>
              <FiUser />
              {post.data.author}
            </span>
            <span>
              <FiClock />
              {post.timeToRead}
            </span>
          </div>

          <div className={styles.postContent}>
            {
              // JSON.stringify(post.data.content)
              post.data.content.map(({ heading, body }) => (
                <Fragment key={heading}>
                  <h2>{heading}</h2>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: PrismicDOM.RichText.asHtml(body),
                    }}
                  />
                </Fragment>
              ))
            }
            {/* {post.data.content.map(currentContent => (
              <div key={currentContent.body}>
                {currentContent.body}
                {currentContent.heading}
              </div>
            ))} */}
          </div>
          {/* <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.data.content }}
          /> */}
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.predicates.at('document.type', 'post'),
  ]);

  const paths = posts.results.map(post => ({ params: { slug: post.uid } }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const postResponse = await prismic.getByUID('post', String(slug), {});

  // console.log(JSON.stringify(response, null, 2));

  // const content = PrismicDOM.RichText.asText(response.data.content);
  // console.log(JSON.stringify(response.data.content, null, 2));
  // let wordsCount = 0;
  // response.data.content.forEach(thisContent => {
  //   const wordsSum =
  //     thisContent.heading.split(/\s/g).length +
  //     thisContent.body.reduce((acc, currentBody) => {
  //       console.log(currentBody.text.split(/\s/g).length);
  //       acc += currentBody.text.split(/\s/g).length;
  //       return acc;
  //     });

  //   wordsCount += wordsSum;
  // });

  // console.log('wordsCount', wordsCount);

  // const first_publication_date = new Date(
  //   postResponse.first_publication_date
  // ).toLocaleDateString('pt-BR', {
  //   day: '2-digit',
  //   month: 'long',
  //   year: 'numeric',
  // });

  // {
  //   first_publication_date: string | null;
  //   data: {
  //     title: string;
  //     banner: {
  //       url: string;
  //     };
  //     author: string;
  //     content: {
  //       heading: string;
  //       body: {
  //         text: string;
  //       }[];
  //     }[];
  //   };
  // }

  const post = {
    timeToRead: '8 min',
    first_publication_date: formattedDate(postResponse.first_publication_date),
    uid: postResponse.uid,
    data: {
      title: postResponse.data.title,
      subtitle: postResponse.data.subtitle,
      banner: postResponse.data.banner,
      author: postResponse.data.author,
      content: postResponse.data.content,
    },
  };

  return {
    props: { post },
    revalidate: 60 * 60 * 12, // 12 horas
  };
};
