export function parseMarkdown(text: string): string {
  if (!text) return text;

  let result = text;

  result = result.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  result = result.replace(/\*(.*?)\*/g, "<em>$1</em>");

  result = result.replace(/`(.*?)`/g, "<code>$1</code>");

  result = result.replace(/^### (.*$)/gm, "<h3>$1</h3>");
  result = result.replace(/^## (.*$)/gm, "<h2>$1</h2>");
  result = result.replace(/^# (.*$)/gm, "<h1>$1</h1>");

  result = result.replace(/\n/g, "<br/>");

  return result;
}

export function stripMarkdown(text: string): string {
  if (!text) return text;

  let result = text;

  result = result.replace(/\*\*(.*?)\*\*/g, "$1");
  result = result.replace(/\*(.*?)\*/g, "$1");
  result = result.replace(/`(.*?)`/g, "$1");
  result = result.replace(/^### (.*$)/gm, "$1");
  result = result.replace(/^## (.*$)/gm, "$1");
  result = result.replace(/^# (.*$)/gm, "$1");

  return result;
}

export interface MarkdownNode {
  type: "text" | "strong" | "em" | "code" | "h1" | "h2" | "h3" | "br";
  content: string;
}

export function parseMarkdownToNodes(text: string): MarkdownNode[] {
  if (!text) return [];

  const nodes: MarkdownNode[] = [];
  let current = "";
  let i = 0;

  while (i < text.length) {
    if (i + 1 < text.length && text[i] === "*" && text[i + 1] === "*") {
      if (current) {
        nodes.push({ type: "text", content: current });
        current = "";
      }
      i += 2;
      let strongContent = "";
      while (i + 1 < text.length && !(text[i] === "*" && text[i + 1] === "*")) {
        strongContent += text[i];
        i++;
      }
      if (strongContent) {
        nodes.push({ type: "strong", content: strongContent });
      }
      i += 2;
      continue;
    }

    if (text[i] === "*") {
      if (current) {
        nodes.push({ type: "text", content: current });
        current = "";
      }
      i += 1;
      let emContent = "";
      while (i < text.length && text[i] !== "*") {
        emContent += text[i];
        i++;
      }
      if (emContent) {
        nodes.push({ type: "em", content: emContent });
      }
      i += 1;
      continue;
    }

    if (text[i] === "`") {
      if (current) {
        nodes.push({ type: "text", content: current });
        current = "";
      }
      i += 1;
      let codeContent = "";
      while (i < text.length && text[i] !== "`") {
        codeContent += text[i];
        i++;
      }
      if (codeContent) {
        nodes.push({ type: "code", content: codeContent });
      }
      i += 1;
      continue;
    }

    if (text[i] === "\n") {
      if (current) {
        nodes.push({ type: "text", content: current });
        current = "";
      }
      nodes.push({ type: "br", content: "" });
      i += 1;
      continue;
    }

    current += text[i];
    i += 1;
  }

  if (current) {
    nodes.push({ type: "text", content: current });
  }

  return nodes;
}
