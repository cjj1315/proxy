import Head from "next/head";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import styles from "@/styles/Home.module.css";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter()
  return (
    <>
      <Head>
        <title>DICLOAK FREE PROXY, Antidetect Browser for Multi Accounting, Try for Free | dicloak.com</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.center}>
          <h1>DICLOAK</h1>
          <h2>Free Proxy</h2>
        </div>
        <button onClick={()=>router.push('/free-proxy')}>Get Started</button>
      </main>
    </>
  );
}
