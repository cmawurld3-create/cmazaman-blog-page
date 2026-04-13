/* ═══════════════════════════════════════════
   CMA ZAMAN — SHARED ARTICLE SCRIPTS
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Reading Progress Bar ── */
  const bar = document.getElementById('progress-bar');
  if (bar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = docHeight > 0 ? (scrollTop / docHeight * 100) + '%' : '0%';
    });
  }

  /* ── Scroll To Top ── */
  const scrollBtn = document.getElementById('scroll-top');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('visible', window.scrollY > 400);
    });
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── Hamburger Menu ── */
  const hamburger = document.querySelector('.navbar-hamburger');
  const navLinks  = document.querySelector('.navbar-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  /* ── Fade-up on Scroll ── */
  const fadeEls = document.querySelectorAll('.fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  fadeEls.forEach(el => observer.observe(el));

  /* ── Comment Form ── */
  const form = document.getElementById('comment-form');
  const commentList = document.getElementById('comment-list');
  const countEl = document.getElementById('comment-count');

  let commentCount = parseInt(countEl?.dataset.count || '0');

  if (form && commentList) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name    = document.getElementById('c-name')?.value.trim();
      const email   = document.getElementById('c-email')?.value.trim();
      const message = document.getElementById('c-message')?.value.trim();

      if (!name || !message) {
        showToast('Please fill in your name and comment.', 'error');
        return;
      }

      const initial = name.charAt(0).toUpperCase();
      const now     = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

      const item = document.createElement('div');
      item.className = 'comment-item';
      item.innerHTML = `
        <div class="comment-header">
          <div class="comment-avatar">${initial}</div>
          <div>
            <div class="comment-author">${escapeHtml(name)}</div>
            <span class="comment-date">${now}</span>
          </div>
        </div>
        <p class="comment-text">${escapeHtml(message)}</p>
        <button class="comment-reply-btn">↩ Reply</button>
      `;

      commentList.prepend(item);
      commentCount++;
      if (countEl) {
        countEl.textContent = `${commentCount} comment${commentCount !== 1 ? 's' : ''}`;
      }

      form.reset();
      showToast('Comment posted!', 'success');
      bindReplyButtons();
    });
  }

  function bindReplyButtons() {
    document.querySelectorAll('.comment-reply-btn').forEach(btn => {
      btn.onclick = () => {
        const nameInput = document.getElementById('c-name');
        if (nameInput) {
          nameInput.focus();
          nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      };
    });
  }
  bindReplyButtons();

  /* ── Toast Notification ── */
  function showToast(msg, type = 'success') {
    const existing = document.querySelector('.cma-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'cma-toast';
    toast.textContent = msg;
    toast.style.cssText = `
      position: fixed; bottom: 5rem; right: 2rem;
      background: ${type === 'success' ? '#1a1500' : '#1a0000'};
      border: 1px solid ${type === 'success' ? 'var(--gold)' : '#a04040'};
      color: ${type === 'success' ? 'var(--gold-light)' : '#e08080'};
      padding: 0.8rem 1.4rem;
      border-radius: 4px;
      font-family: var(--font-body);
      font-size: 0.82rem;
      letter-spacing: 0.06em;
      z-index: 9000;
      animation: fadeUp 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  /* ── Escape HTML helper ── */
  function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ── Estimated read time ── */
  const body = document.querySelector('.article-body');
  const readEl = document.getElementById('read-time');
  if (body && readEl) {
    const words = body.innerText.trim().split(/\s+/).length;
    const mins  = Math.max(1, Math.round(words / 200));
    readEl.textContent = `${mins} min read`;
  }

});
