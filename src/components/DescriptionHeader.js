import styles from "@/styles/freeProxy.module.css";

function DescriptionHeader({pageText}) {
  const handleOpenWebsite = () => {
    window.open("https://dicloak.com/", "_blank");
  };

  return (
    <div className={`widget`}>
      <div className={`inner ${styles.descriptionHeaderInner}`}>
        <div className={styles.widgetContainer}>
          <h1>{pageText.page_title}</h1>
        </div>
        <div className={styles.widgetContainer}>
          <h2>
          <div dangerouslySetInnerHTML={{ __html: pageText.sub_title }} />
          </h2>
        </div>
        <div className={styles.widgetContainer}>
          <div className={styles.widgetCard}>
            <span>Use DICloak to ensure your privacy and account security</span>
            <button className={styles.headerBtn} onClick={handleOpenWebsite}>
              Download DICloak Browser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DescriptionHeader;
