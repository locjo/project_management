import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main class="mx-auto flex min-h-screen max-w-5xl items-center justify-center p-6">
    <section class="w-full rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <p class="text-sm font-semibold uppercase tracking-widest text-brand">HUMG · Khoa CNTT</p>
      <h1 class="mt-3 text-3xl font-bold text-slate-900">Quản lý đồ án tốt nghiệp</h1>
      <p class="mt-3 text-slate-600">Frontend Vite + TypeScript + Axios + Tailwind CSS đã sẵn sàng kết nối backend.</p>
    </section>
  </main>
`
