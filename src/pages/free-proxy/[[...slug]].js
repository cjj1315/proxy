import Head from "next/head";
import { supabase, getPagination } from "@/util";
import ProxyPage from "@/components/ProxyPage";

export default function FreeProxy({ proxyList, options, count, slug }) {
  // return (<div></div>)
  const currentList = slug
    ? options.find((i) => i.page_path_suffix === slug)
    : options.find((i) => i.categories === "99999");
  return (
    <>
      <Head>
        <title>{options.page_title}</title>
        <meta
          name="keywords"
          content="free proxy,safe proxy,Proxy IP Provider,proxy server"
        />
        <meta name="description" content={currentList.sub_title} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://dicloak.com/" />
      </Head>
      <main>
        <ProxyPage
          proxyList={proxyList}
          options={options}
          count={count}
          slug={slug}
        />
      </main>
    </>
  );
}

export const getStaticProps = async ({ params }) => {
  const slug = params.slug && params.slug.length > 0 ? params.slug[0] : "";
  const { from, to } = getPagination(1, 5);
  let { data: options } = await supabase.from("option").select("*");
  const currentList = options.find(
    (i) => i.page_path_suffix === slug.toString()
  );
  let columnName = "";
  if (slug && currentList.categories === "1") {
    columnName = "country";
  } else if (slug && currentList.categories === "2") {
    columnName = "protocols";
  }
  let { data: proxyList, count } = slug
    ? await supabase
        .from("proxy")
        .select("*", { count: "exact" })
        .eq(columnName, currentList.name)
        .range(from, to)
    : await supabase
        .from("proxy")
        .select("*", { count: "exact" })
        .range(from, to);
  return {
    props: { proxyList, options, count, slug },
  };
};

export async function getStaticPaths() {
  let { data: options } = await supabase.from("option").select("*");
  const paths = options.map((item) => ({
    params: {
      slug: item.page_path_suffix ? [item.page_path_suffix] : undefined,
    },
  }));
  return {
    paths,
    fallback: false,
  };
}
