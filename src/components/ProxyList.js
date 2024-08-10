import { useState, useMemo,useEffect } from "react";
import Link from "next/link"
import { AnonymityLevelsText } from "@/util/enums";
import { supabase, getPagination } from "@/util";
import styles from "@/styles/freeProxy.module.css";

function ProxyList({ initProxyList, options, initCount, slug }) {
  const ExportTypes = {
    Json: "JSON",
    Csv: "CSV",
    Txt: "TXT",
  };
  const [exportType, setExportType] = useState(ExportTypes.Json);
  const [currentPage, setCurrentPage] = useState(1);
  const [proxyList, setProxyList] = useState(initProxyList);
  const [count, setCount] = useState(initCount);

  useEffect(() => {
    setProxyList(initProxyList);
    setCount(count)
    setCurrentPage(1)
  }, [initProxyList,count]);
  console.log("slug",slug)

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
  const handlePagination = async (direction) => {
    const pageSize = 5;
    if (direction === "next") {
      const nextFrom = currentPage * pageSize;
      if (count > nextFrom) {
        if (slug) {
          await getSlugList(currentPage + 1);
        } else {
          await getList(currentPage + 1);
        }
        setCurrentPage(currentPage + 1);
      }
    } else if (direction === "prev") {
      if (currentPage > 1) {
        if (slug) {
          await getSlugList(currentPage - 1);
        } else {
          await getList(currentPage - 1);
        }
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

  function convertDataToCSV(data) {
    const header = Object.keys(data[0]).join(",") + "\n"; // 提取第一个对象的键作为 CSV 表头
    const rows = data.map((obj) => Object.values(obj).join(",")); // 提取每个对象的值并用逗号连接

    return header + rows.join("\n"); // 将表头和行连接起来，使用换行符分隔
  }

  const handleExport = () => {
    const jsonStr = JSON.stringify(proxyList);
    const text = JSON.stringify(proxyList);
    const csv = convertDataToCSV(proxyList);
    let blob;
    if (exportType === ExportTypes.Json) {
      blob = new Blob([jsonStr], { type: "application/json" });
    } else if (exportType === ExportTypes.Csv) {
      blob = new Blob([csv], { type: "text/csv" });
    } else if (exportType === ExportTypes.Txt) {
      blob = new Blob([text], { type: "text/plain" });
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    if (exportType === ExportTypes.Json) {
      link.download = "data.json";
    } else if (exportType === ExportTypes.Csv) {
      link.download = "data.csv";
    } else if (exportType === ExportTypes.Txt) {
      link.download = "data.txt";
    }
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = (text) => {
    const textField = document.createElement("textarea");
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
    alert(`Copied ${text} to clipboard`);
  };

  const tableRows = proxyList.map((item, index) => (
    <tr key={index}>
      <td>{item.id}</td>
      <td
        style={{ cursor: "pointer" }}
        onClick={() => {
          handleCopyToClipboard(item.address);
        }}
      >
        {item.address}
      </td>
      <td
        style={{ cursor: "pointer" }}
        onClick={() => {
          handleCopyToClipboard(item.address);
        }}
      >
        复制icon
      </td>
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
                        className={styles.checkBoxLabel}
                        key={i.name}
                      >
                        <Link
                          href={`/free-proxy/${encodeURIComponent(
                            i.page_path_suffix
                          )}`}
                        >
                          <span className={`${
                          i.page_path_suffix === slug
                            ? styles.checkBoxLabelActive
                            : ""
                        }`}>{i.name}</span>
                        </Link>
                        {i.page_path_suffix === slug ? (
                          <Link href="/free-proxy">
                            <span className={styles.remove}>X</span>
                          </Link>
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
                    onClick={() => {
                      setExportType(ExportTypes[i]);
                    }}
                    key={i}
                  >
                    {ExportTypes[i]}
                  </button>
                );
              })}
              <button
                onClick={() => handleExport()}
                className={styles.downloadBtn}
              >
                Download
              </button>
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
