import { GetStaticProps } from "next";
import { getSession, useSession } from "next-auth/client";
import { RichText } from "prismic-dom";
import React, { useEffect } from "react";
import Head from "next/head";
import { getPrismicClient } from "../../../services/prismic";
import styles from "../post.module.scss";

import { useRouter } from "next/router";

import Link from "next/link";

interface PostPreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
}

export default function PostPreview({ post }: PostPreviewProps) {
  const [session] = useSession();
  const router = useRouter();

  /**
   * Aqui estamos checando ao iniciar o componente de preview do post se o usuário possui uma inscrição
   * ativa, importante entender que como este componente utiliza getStaticProps não é possível ter acesso
   * ao req e por isso esta verificação é feita aqui no componente, utilizanod o useSession
   */
  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a>Subscribe now 😉</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}

/**
 * getStatisPaths é utilizado para informar para o next quais as páginas que nós
 * queremos que sejam pré criadas durante o build do projeto, para isso no campo
 * paths devemos informar quais as páginas queremos que sejam geradas durante o build,
 * neste caso deveriamos informar os slugs dos posts dentro de um objeto
 */
export const getStaticPaths = () => {
  return {
    paths: [
      /*{ params: { slug: "mapas-com-react-usando-leaflet" } }*/
    ],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID("publication", String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      "pt-BR",
      { day: "2-digit", month: "long", year: "numeric" }
    ),
  };

  return {
    props: { post },
    revalidate: 60 * 30, // 30 minutos
  };
};
