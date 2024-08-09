import { useState, useEffect, useRef, useMemo } from "react";
import { AnonymityLevelsText } from "@/util/enums";
import { supabase, getPagination } from "@/util";
import { useRouter } from "next/router";

import styles from "@/styles/freeProxy.module.css";

function ProxyList({ initProxyList, options, initCount }) {
  const [proxyList, setProxyList] = useState(initProxyList);

  const [count, setCount] = useState(initCount);
  const router = useRouter();
  const { slug } = router.query;

  const filterList = useMemo(() => {
    const data = [
      {
        type: "Country",
        child: [],
      },
      { type: "Protocols", child: [] },
    ];
    // TODO 临时
    options.map((i) => {
      if (i.categories == "1") {
        data.find((j) => {
          if (j.type === "Country") {
            j.child.push(i);
          }
        });
      } else if (i.categories === "2") {
        data.find((j) => {
          if (j.type === "Protocols") {
            j.child.push(i);
          }
        });
      }
    });
    return data;
  }, [options]);
  const ExportTypes = {
    Json: "JSON",
    Csv: "CSV",
    Txt: "TXT",
  };
  const [exportType, setExportType] = useState(ExportTypes.Json);
  const [currentPage, setCurrentPage] = useState(1);
  const initialLoad = useRef(true);

  const handlePagination = async (direction) => {
    const pageSize = 5;
    if (direction === "next") {
      const nextFrom = currentPage * pageSize;
      if (count > nextFrom) {
        setCurrentPage(currentPage + 1);
      }
    } else if (direction === "prev") {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const getList = async (page) => {
    const { from, to } = getPagination(page, 5);
    let { data, count: newCount } = await supabase
      .from("proxy")
      .select("*", { count: "exact" })
      .range(from, to);
    setProxyList(data);
    setCount(newCount);
  };

  const getSlugList = async (page) => {
    const currentList = options.find((i) => i.page_path_suffix === slug);
    let columnName = "";
    if (currentList.categories === "1") {
      columnName = "country";
    } else if (currentList.categories === "2") {
      columnName = "protocols";
    }
    const { from, to } = getPagination(page, 5);
    let { data, count: newCount } = await supabase
      .from("proxy")
      .select("*", { count: "exact" })
      .eq(columnName, currentList.name)
      .range(from, to);
    setProxyList(data);
    setCount(newCount);
  };

  useEffect(() => {
    // 初始加载时不触发数据获取逻辑
    if (!initialLoad.current) {
      if (slug) {
        getSlugList(currentPage);
        return;
      }
      getList(currentPage);
    } else {
      initialLoad.current = false;
    }
  }, [currentPage,slug]);

  const tableRows = proxyList.map((item, index) => (
    <tr key={index}>
      <td>{item.id}</td>
      <td>{item.address}</td>
      <td>复制icon</td>
      <td>{item.country}</td>
      <td>{item.protocols}</td>
      <td>{AnonymityLevelsText[item.level]}</td>
    </tr>
  ));

  return (
    <div className={`widget`}>
      <div className={`inner ${styles.proxyListInner}`}>
        <div
          className={`${styles.widgetContainer} ${styles.proxyListContainer}`}
        >
          <div className={styles.filterContainer}>
            <h2 className={styles.filterTitle}>Filter proxies:</h2>
            {filterList.map((i) => {
              return (
                <div key={i.type} className={styles.checkBoxContainer}>
                  <h3>{i.type}</h3>
                  {i.child.map((i) => {
                    return (
                      <label
                        className={`${styles.checkBoxLabel} ${
                          i.page_path_suffix === slug
                            ? styles.checkBoxLabelActive
                            : ""
                        }`}
                        key={i.name}
                      >
                        <span
                          onClick={() => {
                            router.push(`/free-proxy/${i.page_path_suffix}`);
                          }}
                        >
                          {i.name}
                        </span>
                        {i.page_path_suffix === slug ? (
                          <span
                            onClick={() => {
                              router.push("/free-proxy");
                            }}
                            className={styles.remove}
                          >
                            X
                          </span>
                        ) : null}
                      </label>
                    );
                  })}
                </div>
              );
            })}
          </div>
          <div className={styles.proxyList}>
            <div className={styles.exportContainer}>
              <span>Download our free proxy list in:</span>
              {Object.keys(ExportTypes).map((i) => {
                return (
                  <button
                    className={`${
                      exportType === ExportTypes[i] ? styles.activeBtn : ""
                    }`}
                    onClick={() => setExportType(ExportTypes[i])}
                    key={i}
                  >
                    {ExportTypes[i]}
                  </button>
                );
              })}
              <button className={styles.downloadBtn}>Download</button>
            </div>
            <table className={styles.fpTable}>
              <thead className={styles.fpThead}>
                <tr>
                  <th>№</th>
                  <th>Address</th>
                  <th>Copy</th>
                  <th>Country</th>
                  <th>Protocols</th>
                  <th>Anonymity</th>
                </tr>
              </thead>
              <tbody className={styles.fpBody}>{tableRows}</tbody>
            </table>
            {count && count > 5 ? (
              <div className={styles.pagination}>
                {/* 分页部分 */}
                <button
                  onClick={() => {
                    handlePagination("prev");
                  }}
                >
                  Prev
                </button>
                <span>{currentPage}</span>
                <button onClick={() => handlePagination("next")}>Next</button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProxyList;
