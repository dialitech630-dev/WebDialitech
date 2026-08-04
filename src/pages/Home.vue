<template>
  <div class="home">
    <header class="home-header">
      <div class="header-inner">
        <div class="brand">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#2563eb" />
            <path d="M8 16C8 11.5817 11.5817 8 16 8V24C11.5817 24 8 20.4183 8 16Z" fill="#fff" fill-opacity="0.9" />
            <path d="M16 8C20.4183 8 24 11.5817 24 16S20.4183 24 16 24" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
            <circle cx="16" cy="16" r="3" fill="#fff" />
          </svg>
          <span class="brand-name">DiaMonitor</span>
        </div>
        <nav class="header-nav">
          <router-link to="/plans" class="nav-link-plans">Plans</router-link>
          <router-link to="/login" class="nav-btn btn-outline">Sign In</router-link>
          <router-link to="/register" class="nav-btn btn-primary">Register</router-link>
        </nav>
      </div>
    </header>

    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Monitor Your Dialysis<br />Patients in Real Time</h1>
        <p class="hero-desc">DiaMonitor is a comprehensive platform for managing and monitoring hemodialysis patients. Track vital signs, manage schedules, and receive critical alerts — all in one place.</p>
        <div class="hero-actions">
          <router-link to="/register" class="hero-btn btn-primary btn-lg">Get Started</router-link>
          <router-link to="/login" class="hero-btn btn-outline btn-lg">Sign In</router-link>
        </div>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">24/7</span>
            <span class="stat-label">Monitoring</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">500+</span>
            <span class="stat-label">Patients Served</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">99.9%</span>
            <span class="stat-label">Uptime</span>
          </div>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-card">
          <div class="hero-card-header">
            <div class="pulse" />
            <span>Live Monitoring</span>
          </div>
          <div class="hero-card-body">
            <div class="hero-metric">
              <span class="metric-label">Heart Rate</span>
              <span class="metric-value">72 <small>bpm</small></span>
            </div>
            <div class="hero-metric">
              <span class="metric-label">Blood Pressure</span>
              <span class="metric-value">120/80 <small>mmHg</small></span>
            </div>
            <div class="hero-metric">
              <span class="metric-label">SpO2</span>
              <span class="metric-value">98 <small>%</small></span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="features-inner">
        <h2 class="section-title">Everything You Need to Manage Dialysis Care</h2>
        <p class="section-desc">Comprehensive tools designed for nephrologists, nurses, and healthcare administrators.</p>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="10" cy="9" r="4" stroke="#2563eb" stroke-width="1.5" />
                <path d="M2 24c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round" />
                <path d="M20 10h6M23 7v6" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </div>
            <h3 class="feature-title">Patient Management</h3>
            <p class="feature-desc">Easily manage patient profiles, treatment schedules, and medical history in one centralized dashboard.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M14 4C8 4 3 9 3 14H7L10 10L14 18L17 12L20 16H25C25 9 20 4 14 4Z" stroke="#2563eb" stroke-width="1.5" stroke-linejoin="round" />
                <path d="M3 20C3 24 6 26 14 26C22 26 25 24 25 20" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </div>
            <h3 class="feature-title">Real-time Monitoring</h3>
            <p class="feature-desc">Track vital signs and patient status in real time with customizable alerts and notifications.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="2" y="2" width="24" height="24" rx="3" stroke="#2563eb" stroke-width="1.5" />
                <path d="M8 14V8" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round" />
                <path d="M14 14V6" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round" />
                <path d="M20 14V10" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round" />
                <circle cx="8" cy="20" r="1.5" fill="#2563eb" />
                <circle cx="14" cy="20" r="1.5" fill="#2563eb" />
                <circle cx="20" cy="20" r="1.5" fill="#2563eb" />
              </svg>
            </div>
            <h3 class="feature-title">Analytics & Reports</h3>
            <p class="feature-desc">Generate comprehensive reports on treatment outcomes, patient progress, and clinic performance.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M14 4a8 8 0 0 0-8 8v5l-2 2v2h20v-2l-2-2v-5a8 8 0 0 0-8-8Z" stroke="#2563eb" stroke-width="1.5" />
                <circle cx="19" cy="6" r="4.5" fill="#ef4444" stroke="#fff" stroke-width="1.5" />
                <path d="M11 22a3 3 0 0 0 6 0" stroke="#2563eb" stroke-width="1.5" />
              </svg>
            </div>
            <h3 class="feature-title">Critical Alerts</h3>
            <p class="feature-desc">Instant notifications for critical events, abnormal vitals, and missed sessions with priority levels.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="4" y="6" width="20" height="18" rx="2" stroke="#2563eb" stroke-width="1.5" />
                <path d="M9 6V4a3 3 0 0 1 6 0v2M11 14l2 2 4-4" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <h3 class="feature-title">Secure & Compliant</h3>
            <p class="feature-desc">HIPAA-compliant platform with role-based access control and encrypted data storage.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="10" stroke="#2563eb" stroke-width="1.5" />
                <path d="M14 8v6l4 2" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </div>
            <h3 class="feature-title">Schedule Management</h3>
            <p class="feature-desc">Intelligent scheduling for dialysis sessions with automated reminders for patients and staff.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta">
      <div class="cta-inner">
        <h2 class="cta-title">Ready to Transform Your Dialysis Care?</h2>
        <p class="cta-desc">Trusted by healthcare professionals for modern dialysis patient management.</p>
        <router-link to="/register" class="hero-btn btn-primary btn-lg">Get Started Free</router-link>
      </div>
    </section>

    <footer class="home-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#2563eb" />
            <path d="M8 16C8 11.5817 11.5817 8 16 8V24C11.5817 24 8 20.4183 8 16Z" fill="#fff" fill-opacity="0.9" />
            <path d="M16 8C20.4183 8 24 11.5817 24 16S20.4183 24 16 24" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
            <circle cx="16" cy="16" r="3" fill="#fff" />
          </svg>
          <span>DiaMonitor</span>
        </div>
        <p class="footer-copy">&copy; 2026 DiaMonitor. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
</script>

<style scoped>
.home {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Header */
.home-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #f3f4f6;
  z-index: 100;
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-name {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-link-plans {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  text-decoration: none;
  transition: color 0.15s;
}

.nav-link-plans:hover {
  color: #2563eb;
}

.nav-btn {
  padding: 8px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.15s;
}

.btn-outline {
  border: 1px solid #e5e7eb;
  color: #374151;
  background: transparent;
}

.btn-outline:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.btn-primary {
  background: #2563eb;
  color: #ffffff;
  border: 1px solid transparent;
}

.btn-primary:hover {
  background: #1d4ed8;
}

/* Hero */
.hero {
  max-width: 1200px;
  margin: 0 auto;
  padding: 140px 32px 80px;
  display: flex;
  align-items: center;
  gap: 60px;
}

.hero-content {
  flex: 1;
  min-width: 0;
}

.hero-title {
  font-size: clamp(30px, 4.5vw, 48px);
  font-weight: 800;
  color: #111827;
  line-height: 1.15;
  letter-spacing: -1px;
  margin: 0 0 20px 0;
}

.hero-desc {
  font-size: 18px;
  color: #6b7280;
  line-height: 1.7;
  margin: 0 0 32px 0;
  max-width: 540px;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 48px;
}

.hero-btn {
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.15s;
  display: inline-flex;
  align-items: center;
}

.hero-stats {
  display: flex;
  gap: 40px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
}

.stat-label {
  font-size: 14px;
  color: #9ca3af;
  font-weight: 500;
}

/* Hero Visual Card */
.hero-visual {
  flex-shrink: 0;
  width: 420px;
}

.hero-card {
  background: #f8f9fa;
  border-radius: 20px;
  padding: 28px;
  border: 1px solid #f3f4f6;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
}

.hero-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.pulse {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #22c55e;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.hero-card-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hero-metric {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #f3f4f6;
}

.metric-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.metric-value {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

.metric-value small {
  font-size: 13px;
  font-weight: 500;
  color: #9ca3af;
}

/* Features */
.features {
  background: #f8f9fa;
  padding: 80px 32px;
}

.features-inner {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: clamp(26px, 3.5vw, 36px);
  font-weight: 700;
  color: #111827;
  text-align: center;
  margin: 0 0 12px 0;
  letter-spacing: -0.5px;
}

.section-desc {
  font-size: 18px;
  color: #6b7280;
  text-align: center;
  margin: 0 0 48px 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.feature-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 28px;
  border: 1px solid #f3f4f6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.2s;
}

.feature-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.feature-icon {
  width: 52px;
  height: 52px;
  background: #eff6ff;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.feature-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.feature-desc {
  font-size: 15px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

/* CTA */
.cta {
  padding: 80px 32px;
  background: #ffffff;
}

.cta-inner {
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
}

.cta-title {
  font-size: clamp(26px, 3.5vw, 36px);
  font-weight: 700;
  color: #111827;
  margin: 0 0 12px 0;
  letter-spacing: -0.5px;
}

.cta-desc {
  font-size: 18px;
  color: #6b7280;
  margin: 0 0 32px 0;
}

/* Footer */
.home-footer {
  border-top: 1px solid #f3f4f6;
  padding: 24px 32px;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.footer-copy {
  font-size: 13px;
  color: #9ca3af;
  margin: 0;
}

/* Responsive fixes */
@media (max-width: 900px) {
  .hero {
    flex-direction: column;
    padding-top: 120px;
  }
  .hero-visual {
    width: 100%;
  }
  .hero-title {
    font-size: 36px;
  }
  .features-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 600px) {
  .header-inner {
    padding: 12px 16px;
  }

  .nav-link-plans {
    display: none;
  }

  .nav-btn {
    padding: 8px 14px;
    font-size: 13px;
  }

  .hero {
    padding: 108px 16px 48px;
    gap: 40px;
  }

  .hero-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .hero-btn {
    justify-content: center;
  }

  .hero-stats {
    gap: 24px;
    justify-content: space-between;
    width: 100%;
  }

  .stat-number {
    font-size: 22px;
  }

  .features {
    padding: 48px 16px;
  }

  .cta {
    padding: 48px 16px;
  }

  .home-footer {
    padding: 16px;
  }

  .footer-inner {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
