export function message(title: string, content: string) {
  const dialog = document.createElement('dialog')
  dialog.className = 'detail-dialog'
  const heading = document.createElement('h2'); heading.textContent = title
  const body = document.createElement('p'); body.textContent = content
  const close = document.createElement('button'); close.textContent = 'Đóng'; close.onclick = () => dialog.close()
  dialog.append(heading, body, close); document.body.append(dialog)
  dialog.addEventListener('close', () => dialog.remove()); dialog.showModal()
}
