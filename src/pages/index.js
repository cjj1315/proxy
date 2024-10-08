import Head from "next/head";
import { Inter } from "next/font/google";
import Link from "next/link";
import styles from "@/styles/Home.module.css";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>
          DICLOAK FREE PROXY, Antidetect Browser for Multi Accounting, Try for
          Free | dicloak.com
        </title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google-site-verification" content="dJUNpJwwHux2IKIdnGdcVE_ZyGu57aw52sQy0RatBYo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.center}>
          <h1>DICLOAK</h1>
          <h2>Free Proxy</h2>
        </div>
        <Link href="/free-proxy">
          <button>Get Started</button>
        </Link>
      </main>
    </>
  );
}
