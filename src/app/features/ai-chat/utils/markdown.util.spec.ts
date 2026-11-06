import { describe, expect, it } from 'vitest';
import { renderMarkdown } from './markdown.util';

describe('renderMarkdown', () => {
  it('escapes raw HTML so scripts and handlers can never be injected', () => {
    const html = renderMarkdown('<script>alert(1)</script> <img src=x onerror=alert(1)>');
    expect(html).not.toContain('<script');
    expect(html).not.toContain('<img');
    expect(html).toContain('&lt;script&gt;');
  });

  it('renders bold, italic and inline code', () => {
    const html = renderMarkdown('**bold** and *italic* and `code`');
    expect(html).toContain('<strong>bold</strong>');
    expect(html).toContain('<em>italic</em>');
    expect(html).toContain('<code>code</code>');
  });

  it('renders bullet and numbered lists', () => {
    expect(renderMarkdown('- one\n- two')).toBe('<ul><li>one</li><li>two</li></ul>');
    expect(renderMarkdown('1. first\n2. second')).toBe('<ol><li>first</li><li>second</li></ol>');
  });

  it('only links http(s) and site-relative URLs', () => {
    expect(renderMarkdown('[ok](https://carehub.test/x)')).toContain('<a href="https://carehub.test/x"');
    expect(renderMarkdown('[ok](/doctors/1)')).toContain('<a href="/doctors/1"');
    const unsafe = renderMarkdown('[bad](javascript:alert(1))');
    expect(unsafe).not.toContain('<a ');
  });

  it('opens links safely', () => {
    expect(renderMarkdown('[x](https://a.test)')).toContain('rel="noopener noreferrer"');
  });

  it('keeps single line breaks inside a paragraph', () => {
    expect(renderMarkdown('line one\nline two')).toBe('<p>line one<br>line two</p>');
  });
});
