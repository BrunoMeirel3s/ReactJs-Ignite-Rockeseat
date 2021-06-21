import { SignInButton } from "../SignInButton";
import styles from "./styles.module.scss";
import { ActiveLink } from "../ActiveLink";
import Link from "next/link";
export function Header() {
  return (
    <>
      <header className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <Link href="/">
            <img src="/images/logo.svg" alt="ig.news" />
          </Link>
          <nav>
            <ActiveLink activeClassName={styles.active} href="/">
              <a>Home</a>
            </ActiveLink>
            {/**
             * Como forma de não precisar renderizar toda a página novamente estamos utilizando aqui
             * o componente link, o prefetch pode ser utilizado para deixar determinada página já carregada
             */}
            <ActiveLink activeClassName={styles.active} href="/posts" prefetch>
              <a>Posts</a>
            </ActiveLink>
          </nav>

          <SignInButton />
        </div>
      </header>
    </>
  );
}
