export const text = (el: Element) => {
  const copy = el.cloneNode(true) as Element
  copy.querySelectorAll('.material-symbols-outlined').forEach(icon => icon.remove())
  return copy.textContent?.trim() ?? ''
}
