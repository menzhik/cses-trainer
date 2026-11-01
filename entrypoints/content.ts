type Problem = {
  title: string;
  url: string;
  solved: number;
  done: boolean;
};

export default defineContentScript({
  matches: ["https://cses.fi/problemset/"],
  main() {
    const rows = document.querySelectorAll("li.task");

    const problems: Problem[] = [];
    for (const row of rows) {
      const link = row.querySelector("a");
      const detail = row.querySelector("span.detail");
      if (!link || !detail) continue;

      problems.push({
        title: link.text,
        url: link.href,
        solved: Number(detail.textContent.split("/")[0]),
        done: row.querySelector("span.task-score")?.classList.contains("full") ?? false,
      });
    }

    const top5 = problems
      .filter((problem) => !problem.done)
      .sort((a, b) => b.solved - a.solved)
      .slice(0, 5);

    for (const [i, problem] of top5.entries()) {
      console.log(
        `cses-trainer: ${i + 1}. ${problem.title} (${problem.solved} solved) ${problem.url}`,
      );
    }
  },
});
