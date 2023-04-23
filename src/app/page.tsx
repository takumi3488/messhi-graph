import Graph from "@/components/graph";
import styles from "./page.module.scss";

type DateWeight = {
  date: string;
  weight: string;
};

type DateEnergy = {
  energy: string;
  energyTarget: string;
  protein: string;
  proteinTarget: string;
  lipid: string;
  lipidTarget: string;
  carbohydrate: string;
  carbohydrateTarget: string;
};

export type DailyData = DateWeight | (DateWeight & DateEnergy);

type DishData = {
  date: string;
  time: string;
  menu: string;
};

type ResponseJson = {
  dailyValues: DailyData[];
  dishValues: DishData[];
};

// 文字列から数字を抽出する
const extractNumber = (str: string): number => {
  const match = str.match(/\d+/);
  return match ? +match[0] : 0;
};

export default async function Home() {
  const today = new Date()
    .toLocaleDateString("sv-SE", {
      timeZone: "Asia/Tokyo",
    })
    .replaceAll("-", "/");
  const res = await fetch(
    "https://script.google.com/macros/s/AKfycbxShAvH9AubWSehz6HvlV9xeBreZTqb9WhOaSsDSLKWfjv37M0EeBu6tNnlbn6rmwCN/exec",
    {
      next: {
        revalidate: 60,
      },
    }
  );
  const data: ResponseJson = await res.json();
  return (
    <main className={styles.main}>
      <h2 className={styles.title}>体重/摂取栄養素</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th rowSpan={2}>日付</th>
            <th rowSpan={2}>体重</th>
            <th colSpan={2}>
              エネルギー
              <br />
              [kcal]
            </th>
            <th colSpan={2}>タンパク質[g]</th>
            <th colSpan={2}>脂質[g]</th>
            <th colSpan={2}>炭水化物[g]</th>
          </tr>
          <tr>
            <th>摂取</th>
            <th>
              目標
              <br />
              まで
            </th>
            <th>摂取</th>
            <th>
              目標
              <br />
              まで
            </th>
            <th>摂取</th>
            <th>
              目標
              <br />
              まで
            </th>
            <th>摂取</th>
            <th>
              目標
              <br />
              まで
            </th>
          </tr>
        </thead>
        <tbody>
          {data.dailyValues.map((dailyValue) => (
            <tr key={dailyValue.date}>
              <td>{dailyValue.date.split("/").slice(1, 3).join("\n")}</td>
              <td>
                {dailyValue.weight ||
                  (today < dailyValue.date ? "-" : "測定なし")}
              </td>
              {"energy" in dailyValue ? (
                <>
                  <td
                    className={
                      dailyValue.energyTarget.startsWith("-")
                        ? styles["td-red"]
                        : styles["td-green"]
                    }
                  >
                    {dailyValue.energy.slice(0, -4)}
                  </td>
                  <td
                    className={
                      dailyValue.energyTarget.startsWith("-")
                        ? styles["td-red"]
                        : styles["td-green"]
                    }
                  >
                    {dailyValue.energyTarget.slice(0, -4)}
                  </td>
                  <td
                    className={
                      extractNumber(dailyValue.proteinTarget) < 20
                        ? styles["td-green"]
                        : styles["td-red"]
                    }
                  >
                    {dailyValue.protein.slice(0, -1)}
                  </td>
                  <td
                    className={
                      extractNumber(dailyValue.proteinTarget) < 20
                        ? styles["td-green"]
                        : styles["td-red"]
                    }
                  >
                    {dailyValue.proteinTarget.slice(0, -1)}
                  </td>
                  <td
                    className={
                      extractNumber(dailyValue.lipidTarget) < 15
                        ? styles["td-green"]
                        : styles["td-red"]
                    }
                  >
                    {dailyValue.lipid.slice(0, -1)}
                  </td>
                  <td
                    className={
                      extractNumber(dailyValue.lipidTarget) < 15
                        ? styles["td-green"]
                        : styles["td-red"]
                    }
                  >
                    {dailyValue.lipidTarget.slice(0, -1)}
                  </td>
                  <td
                    className={
                      extractNumber(dailyValue.carbohydrateTarget) < 20
                        ? styles["td-green"]
                        : styles["td-red"]
                    }
                  >
                    {dailyValue.carbohydrate.slice(0, -1)}
                  </td>
                  <td
                    className={
                      extractNumber(dailyValue.carbohydrateTarget) < 20
                        ? styles["td-green"]
                        : styles["td-red"]
                    }
                  >
                    {dailyValue.carbohydrateTarget.slice(0, -1)}
                  </td>
                </>
              ) : (
                <td colSpan={8}>データなし</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <Graph dailyValues={data.dailyValues} />
      <h2 className={styles.title}>飯</h2>
      <table className={`${styles.striped} ${styles.table}`}>
        <thead>
          <tr>
            <th>日付</th>
            <th>時間帯</th>
            <th>メニュー</th>
          </tr>
        </thead>
        <tbody>
          {data.dishValues.map((dish) => (
            <tr key={`${dish.date}-${dish.time}-${dish.menu}`}>
              <td>{dish.date}</td>
              <td>{dish.time}</td>
              <td>{dish.menu}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
