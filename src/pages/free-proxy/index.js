import Head from "next/head";
import { supabase, getPagination } from "@/util";
import ProxyPage from "@/components/ProxyPage";

export default function FreeProxy({ proxyList, options }) {
  return (
    <>
      <Head>
        <title>Free Proxy</title>
        <meta
          name="description"
          content="Your go-to source for the best free proxy server list.<br>
We offer a comprehensive and regularly updated list of reliable and secure proxies of various types for your specific needs,all available for free."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="free proxy,safe proxy,Proxy IP Provider,proxy server" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://dicloak.com/" />
      </Head>
      <main>
        <ProxyPage defaultPage={true} proxyList={proxyList} options={options} />
      </main>
    </>
  );
}

export const getStaticProps = async () => {
  const { from, to } = getPagination(1, 5);
  let { data: proxyList, count } = await supabase
    .from("proxy")
    .select("*", { count: "exact" })
    .range(from, to);
  let { data: options } = await supabase.from("option").select("*");
  return {
    props: { proxyList, options, count },
  };
};
