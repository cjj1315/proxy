import { useMemo } from "react";
import { useRouter } from 'next/router';
import DescriptionHeader from "@/components/DescriptionHeader";
import ProxyList from "@/components/ProxyList";

function ProxyPage({ proxyList, options, defaultPage, count }) {
  const router = useRouter();
  const { slug } = router.query;

  const pageText = useMemo(() => {
    if (!slug) {
      // todo: 枚举值
      return options.find((i) => i.categories === "99999");
    } else {
      return options.find((i) => i.page_path_suffix === slug);
    }
  }, [options, defaultPage]);

  return (
    <>
      <main>
        <DescriptionHeader pageText={pageText} />
        <ProxyList
          initProxyList={proxyList}
          options={options}
          initCount={count}
        />
        TODO:样式
        <div>{pageText.footer_title}</div>
        <div>{pageText.footer_content}</div>
        <div>{JSON.stringify(pageText.faq)}</div>
      </main>
    </>
  );
}

export default ProxyPage;
