// Trigger form attention animation on desktop, expand mobile form bar on mobile
export function triggerFormAttention() {
  const isMobile = window.innerWidth < 1024

  if (isMobile) {
    window.dispatchEvent(new CustomEvent("flent:expand-mobile-form"))
  } else {
    const form = document.getElementById("flent-form")
    if (!form) return

    form.scrollIntoView({ behavior: "smooth", block: "center" })

    form.classList.remove("attention")
    void form.offsetWidth // force reflow so animation retriggers
    form.classList.add("attention")

    setTimeout(() => {
      const inputs = form.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
        "input, select"
      )
      for (const input of inputs) {
        if (!input.value || input.value === "") {
          input.focus()
          break
        }
      }
    }, 600)
  }
}
