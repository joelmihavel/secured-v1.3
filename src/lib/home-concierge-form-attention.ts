// Trigger form attention animation on desktop, expand mobile form bar on mobile
export function triggerFormAttention() {
  const isMobile = window.innerWidth < 1024

  if (isMobile) {
    // Dispatch custom event to expand mobile form bar
    window.dispatchEvent(new CustomEvent("flent:expand-mobile-form"))
  } else {
    // Desktop: scroll to form and trigger attention animation
    const form = document.getElementById("flent-form")
    if (!form) return

    // Scroll form into view
    form.scrollIntoView({ behavior: "smooth", block: "center" })

    // Trigger animation
    form.classList.remove("attention")
    void form.offsetWidth // force reflow so animation retriggers
    form.classList.add("attention")

    // Focus first empty input after scroll settles
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
