document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const scheduleForm = document.getElementById('scheduleForm');
    const contactForm = document.getElementById('contactForm');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const modal = document.getElementById('successModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const scheduleDateInput = document.getElementById('schedule-date');

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    scheduleDateInput.min = minDate;

    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;

            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    function showModal(title, message, isError = false) {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        const modalIcon = modal.querySelector('.modal-icon');
        modalIcon.classList.toggle('error', isError);
        modalIcon.classList.toggle('success', !isError);
        modal.classList.add('show');
    }

    window.closeModal = function() {
        modal.classList.remove('show');
    };

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    scheduleForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(scheduleForm);
        const data = Object.fromEntries(formData);

        const emailBody = `
New Appointment Request

Name: ${data.name}
Email: ${data.email}
Company: ${data.company || 'Not provided'}
Preferred Date: ${data.date}
Preferred Time: ${data.time}
Message: ${data.message || 'No message provided'}

---
This request was submitted via the Dial in Consulting website.
        `.trim();

        try {
            const response = await fetch('https://formspree.io/f/xqapdbpd', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: data.email,
                    subject: `Appointment Request from ${data.name}`,
                    message: emailBody
                })
            });

            if (response.ok) {
                showModal(
                    'Request Submitted!',
                    `Thank you, ${data.name}! We've received your appointment request for ${data.date} at ${data.time}. We'll confirm your appointment via email within 24 hours.`
                );
                scheduleForm.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            window.location.href = `mailto:jonmarlow@gmail.com?subject=Appointment Request from ${data.name}&body=${encodeURIComponent(emailBody)}`;
            showModal(
                'Opening Email Client',
                'We\'re opening your email client to send your appointment request directly to jonmarlow@gmail.com.'
            );
            scheduleForm.reset();
        }
    });

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        const emailBody = `
Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}

---
This message was sent via the Dial in Consulting website.
        `.trim();

        try {
            const response = await fetch('https://formspree.io/f/xqapdbpd', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: data.email,
                    subject: `${data.subject} - From Website Contact Form`,
                    message: emailBody
                })
            });

            if (response.ok) {
                showModal(
                    'Message Sent!',
                    `Thank you, ${data.name}! Your message has been sent successfully. We'll respond to ${data.email} within 24 hours.`
                );
                contactForm.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            window.location.href = `mailto:jonmarlow@gmail.com?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(emailBody)}`;
            showModal(
                'Opening Email Client',
                'We\'re opening your email client to send your message directly to jonmarlow@gmail.com.'
            );
            contactForm.reset();
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .tool-card, .contact-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});
