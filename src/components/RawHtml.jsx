export function RawHtml({ as: Tag = "div", className, html }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
