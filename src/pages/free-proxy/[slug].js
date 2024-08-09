import Head from "next/head";
import { useRouter } from "next/router";
import { supabase, getPagination } from "@/util";
import ProxyPage from "@/components/ProxyPage";

export default function FreeProxy({ proxyList, options }) {
  const router = useRouter();
  const { slug } = router.query;
  const currentList = options.find((i) => i.page_path_suffix === slug);

  return (
    <>
      <Head>
        <title>Free Proxy,{currentList.page_title}</title>
        <meta name="description" content={currentList.sub_title} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://dicloak.com/" />
      </Head>
      <main>
        <ProxyPage defaultPage={true} proxyList={proxyList} options={options} />
      </main>
    </>
  );
}

export const getStaticProps = async ({ params }) => {
  const { from, to } = getPagination(1, 5);
  let { data: options } = await supabase.from("option").select("*");
  const currentList = options.find((i) => i.page_path_suffix === params.slug);
  let columnName = "";
  if (currentList.categories === "1") {
    columnName = "country";
  } else if (currentList.categories === "2") {
    columnName = "protocols";
  }
  let { data: proxyList, count } = await supabase
    .from("proxy")
    .select("*", { count: "exact" })
    .eq(columnName, currentList.name)
    .range(from, to);

  return {
    props: { proxyList, options, count },
  };
};

export async function getStaticPaths() {
  let { data: options } = await supabase.from("option").select("*");
  const paths = options
    .filter((i) => i.page_path_suffix !== null)
    .map((item) => ({
      params: {
        slug: item.page_path_suffix,
      },
    }));

  return {
    paths,
    fallback: false,
  };
}
