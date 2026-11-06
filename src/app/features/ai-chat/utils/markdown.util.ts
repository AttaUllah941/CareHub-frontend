/**
 * Minimal, dependency-free markdown → HTML for assistant replies.
 *
 * Safety: all input is HTML-escaped FIRST, then a small whitelist of constructs
 * (bold, italic, inline code, lists, headings, safe links) is re-introduced. Angular's
 * own sanitiser still runs on the result when bound with [innerHTML].
 */
const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const SAFE_LINK = /^(https?:\/\/[^\s]+|\/[^\s]*)$/;

const renderInline = (escaped: string): string =>
  escaped
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])\*([^*\s][^*]*)\*(?=$|[\s).,!?])/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (match, text: string, url: string) => {
      const decoded = url.replace(/&amp;/g, '&');
      return SAFE_LINK.test(decoded)
        ? `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`
        : match;
    });

export const renderMarkdown = (source: string): string => {
  const lines = escapeHtml(source ?? '').split(/\r?\n/);
  const html: string[] = [];
  let listType: 'ul' | 'ol' | null = null;
  let paragraph: string[] = [];

  const flushParagraph = (): void => {
    if (paragraph.length) {
      html.push(`<p>${renderInline(paragraph.join('<br>'))}</p>`);
      paragraph = [];
    }
  };
  const closeList = (): void => {
    if (listType) {
      html.push(`</${listType}>`);
      listType = null;
    }
  };

  for (const line of lines) {
    const bullet = line.match(/^\s*[-*•]\s+(.*)$/);
    const numbered = line.match(/^\s*\d+[.)]\s+(.*)$/);
    const heading = line.match(/^\s*#{1,4}\s+(.*)$/);

    if (bullet || numbered) {
      flushParagraph();
      const wanted = bullet ? 'ul' : 'ol';
      if (listType !== wanted) {
        closeList();
        html.push(`<${wanted}>`);
        listType = wanted;
      }
      html.push(`<li>${renderInline((bullet ?? numbered)![1])}</li>`);
    } else if (heading) {
      flushParagraph();
      closeList();
      html.push(`<h4>${renderInline(heading[1])}</h4>`);
    } else if (line.trim() === '') {
      flushParagraph();
      closeList();
    } else {
      closeList();
      paragraph.push(line);
    }
  }

  flushParagraph();
  closeList();
  return html.join('');
};
