document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('chatForm');
  const input = document.getElementById('messageInput');
  const messages = document.getElementById('chatMessages');
  const empty = document.getElementById('emptyChat');

  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 140) + 'px';
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    if (empty) empty.remove();

    const wrapper = document.createElement('div');
    wrapper.className = 'message mine';

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = text;

    const meta = document.createElement('div');
    meta.className = 'message-meta';
    meta.textContent = 'Demo message';

    const content = document.createElement('div');
    content.appendChild(bubble);
    content.appendChild(meta);
    wrapper.appendChild(content);
    messages.appendChild(wrapper);
    messages.scrollTop = messages.scrollHeight;

    input.value = '';
    input.style.height = 'auto';
  });
});
