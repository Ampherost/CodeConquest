// e.g. using remark+remark-html
import { remark } from 'remark';
import html from 'remark-html';

export async function markdownToHtml(md: string) {
  const result = await remark().use(html).process(md);
  return result.toString();
}



