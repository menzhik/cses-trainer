type Problem = {
  title: string;
  url: string;
  solved: number;
  done: boolean;
  row: Element;
};

export default defineContentScript({
  matches: ["https://cses.fi/problemset/", "https://cses.fi/problemset/list*"],
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
        row,
      });
    }

    const top5 = problems
      .filter((problem) => !problem.done)
      .sort((a, b) => b.solved - a.solved)
      .slice(0, 5);

    if (problems.length === 0) return;

    const content = document.querySelector("div.content");
    const heading = document.createElement("h2");

    if (top5.length === 0) {
      heading.textContent = "All solved!";
      content?.prepend(heading);
      return;
    }

    heading.textContent = `Next ${top5.length} problems`;

    const list = document.createElement("ul");
    list.className = "task-list";
    for (const problem of top5) {
      list.append(problem.row.cloneNode(true));
    }

    content?.prepend(heading, list);
  },
});
