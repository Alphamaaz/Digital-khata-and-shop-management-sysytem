import React from "react";
import colors from "../pages/colors";




const ColorPreview = () => {
  const styles = {
    buttonStyle: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "10px",
      height: "10px",
      border: "1px solid #e0e0e0",
      borderRadius: "10px",
      backgroundColor: "white",
      margin: "10px",
      cursor: "pointer",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    },
    fullWidthImage: {
      width: "100%",
      height: "40px",
      borderRadius: "10px 10px 0 0", // Optional: rounded corners only at the top
    },

    iconStyle: {
      fontSize: "14px",
    },
    container: {
      backgroundColor: colors.secondaryCream,
      color: colors.textDarkGrey,
      // padding: "20px",
      // borderRadius: "10px",
      fontFamily: "'Noto Nastaliq Urdu', serif", // Add a readable Urdu font
      direction: "rtl", // Enable right-to-left layout for Urdu
    },
    title: {
      color: colors.primaryGreen,
      marginBottom: "20px",
    },
    subtitle: {
      color: colors.primaryBrown,
      marginBottom: "10px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px",
    },
    tableHeader: {
      backgroundColor: colors.headerLightGreen,
      color: colors.textBlack,
      textAlign: "right",
      padding: "10px",
      borderBottom: `2px solid ${colors.backgroundLightGrey}`,
    },
    tableRow: {
      backgroundColor: colors.white,
    },
    tableRowAlt: {
      backgroundColor: colors.backgroundLightGrey,
    },
    tableCell: {
      padding: "10px",
      color: colors.textDarkGrey,
      textAlign: "right",
    },
    buttonPrimary: {
      backgroundColor: colors.accentOrange,
      color: colors.white,
      border: "none",
      padding: "10px 20px",
      borderRadius: "5px",
      cursor: "pointer",
      margin: "10px 5px",
    },
    buttonSecondary: {
      backgroundColor: colors.alertRed,
      color: colors.white,
      border: "none",
      padding: "10px 20px",
      borderRadius: "5px",
      cursor: "pointer",
      margin: "10px 5px",
    },
    textBlock: {
      backgroundColor: colors.headerLightGreen,
      color: colors.textBlack,
      padding: "10px",
      borderRadius: "5px",
      marginTop: "20px",
    },
    footer: {
      backgroundColor: colors.primaryBrown,
      color: colors.white,
      padding: "10px",
      textAlign: "center",
      borderRadius: "5px",
      marginTop: "20px",
    },
  };

  return (

    <div style={styles.container}>
    
      {/* Table */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>گاہک کا نام</th>
            <th style={styles.tableHeader}>آئٹم</th>
            <th style={styles.tableHeader}>مقدار</th>
            <th style={styles.tableHeader}>عمل</th>
          </tr>
        </thead>
        <tbody>
          <tr style={styles.tableRow}>
            <td style={styles.tableCell}>علی خان</td>
            <td style={styles.tableCell}>ٹماٹر</td>
            <td style={styles.tableCell}>2 کلو</td>
            <td style={styles.tableCell}>
              <button style={styles.buttonPrimary}>ادائیگی</button>
            </td>
          </tr>
          <tr style={styles.tableRowAlt}>
            <td style={styles.tableCell}>سارہ احمد</td>
            <td style={styles.tableCell}>آلو</td>
            <td style={styles.tableCell}>5 کلو</td>
            <td style={styles.tableCell}>
              <button style={styles.buttonStyle}>
                {/* <FontAwesomeIcon
                  icon={faEdit}
                  style={{ ...styles.iconStyle, color: "#1E88E5" }}
                /> */}
              </button>

              {/* Delete Button */}
              <button style={styles.buttonStyle}>
                {/* <FontAwesomeIcon
                  icon={faTrash}
                  style={{ ...styles.iconStyle, color: "#E53935" }}
                /> */}
              </button>
            </td>
          </tr>
          <tr style={styles.tableRow}>
            <td style={styles.tableCell}>حمزہ ملک</td>
            <td style={styles.tableCell}>پیاز</td>
            <td style={styles.tableCell}>3 کلو</td>
            <td style={styles.tableCell}>
              <button style={styles.buttonStyle}>
                {/* <FontAwesomeIcon
                  icon={faEdit}
                  style={{ ...styles.iconStyle, color: "#1E88E5" }}
                /> */}
              </button>

              {/* Delete Button */}
              <button style={styles.buttonStyle}>
                {/* <FontAwesomeIcon
                  icon={faTrash}
                  style={{ ...styles.iconStyle, color: "#E53935" }}
                /> */}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Text Block */}
      <div style={styles.textBlock}>
        <p>یہ ایک نمونہ متن بلاک ہے جو مختلف رنگوں کو ظاہر کرتا ہے۔</p>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p>یہ فوٹر کے علاقے کی مثال ہے</p>
      </div>
    </div>

  );
};

export default ColorPreview;
