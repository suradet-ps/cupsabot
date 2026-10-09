<template>
    <div class="home">
        <!-- Hero band with sky-blue atmospheric wash -->
        <section class="hero-band">
            <div class="hero-inner">
                <span class="badge-pill">
                    <i class="fas fa-circle-check"></i> ระบบเบิกยาออนไลน์
                </span>
                <h1 class="hero-title">ทุกใบเบิกคือคำสัญญา<br />ระหว่างคลินิกกับชั้นวางยา</h1>
                <p class="hero-sub">
                    ระบบเบิกยาสำหรับ รพ.สต. ในเครือข่ายโรงพยาบาลสระโบสถ์
                    ตั้งแต่การค้นหา จัดทำใบเบิก อนุมัติ จนถึงการจ่ายยา —
                    ทุกขั้นตอนมองเห็นได้จากทั้งสองฝั่ง
                </p>

                <div class="hero-cta">
                    <button
                        @click="goToDashboard"
                        class="btn btn-primary btn-cta"
                    >
                        {{ auth.isAdmin ? "ไปยังแดชบอร์ดผู้ดูแลระบบ" : "ไปยังแดชบอร์ด รพ.สต." }}
                        <i class="fas fa-arrow-right"></i>
                    </button>
                    <span class="hero-user"
                        >เข้าสู่ระบบในชื่อ {{ auth.profile?.username }}</span
                    >
                </div>

                <!-- Device mockup composite — the page chrome -->
                <div class="device-mockup">
                    <div class="macbook">
                        <div class="macbook-screen">
                            <div class="mock-app">
                                <div class="mock-topbar">
                                    <span class="dot r"></span>
                                    <span class="dot y"></span>
                                    <span class="dot g"></span>
                                    <span class="mock-url"
                                        >cupsabot / แดชบอร์ดใบเบิก</span
                                    >
                                </div>
                                <div class="mock-body">
                                    <aside class="mock-side">
                                        <span class="mock-side-item active"></span>
                                        <span class="mock-side-item"></span>
                                        <span class="mock-side-item"></span>
                                        <span class="mock-side-item"></span>
                                    </aside>
                                    <div class="mock-main">
                                        <div class="mock-stats">
                                            <div class="mock-stat">
                                                <span class="mock-stat-num">12</span>
                                                <span class="mock-stat-label"
                                                    >รออนุมัติ</span
                                                >
                                            </div>
                                            <div class="mock-stat">
                                                <span class="mock-stat-num success"
                                                    >48</span
                                                >
                                                <span class="mock-stat-label"
                                                    >อนุมัติแล้ว</span
                                                >
                                            </div>
                                            <div class="mock-stat">
                                                <span class="mock-stat-num">7</span>
                                                <span class="mock-stat-label"
                                                    >รอจ่ายยา</span
                                                >
                                            </div>
                                        </div>
                                        <div class="mock-table">
                                            <div
                                                class="mock-row head"
                                            >
                                                <span>รพ.สต.</span><span>สถานะ</span>
                                            </div>
                                            <div class="mock-row">
                                                <span>บ้านสระโบสถ์</span
                                                ><span class="pill submitted"
                                                    >submitted</span
                                                >
                                            </div>
                                            <div class="mock-row">
                                                <span>หนองม่วง</span
                                                ><span class="pill approved"
                                                    >approved</span
                                                >
                                            </div>
                                            <div class="mock-row">
                                                <span>โคกสำโรง</span
                                                ><span class="pill fulfilled"
                                                    >fulfilled</span
                                                >
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="macbook-base"></div>
                    </div>

                    <div class="phone">
                        <div class="phone-screen">
                            <div class="phone-notch"></div>
                            <div class="phone-content">
                                <span class="phone-label">รอบเบิกปัจจุบัน</span>
                                <span class="phone-title">มีนาคม 2568</span>
                                <div class="phone-card">
                                    <div class="phone-card-row">
                                        <span>พาราเซตามอล</span
                                        ><strong>120</strong>
                                    </div>
                                    <div class="phone-card-row">
                                        <span>อะม็อกซีซิลลิน</span
                                        ><strong>60</strong>
                                    </div>
                                    <div class="phone-card-row">
                                        <span>ไอบูโพรเฟน</span
                                        ><strong>30</strong>
                                    </div>
                                </div>
                                <span class="phone-total"
                                    >รวม 210 หน่วย</span
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Feature grid -->
        <section class="features section">
            <div class="section-head">
                <span class="section-label">ความสามารถ</span>
                <h2 class="section-title">งานเอกสารที่เดินตามงานจริง</h2>
            </div>
            <div class="feature-grid">
                <article class="feature-card">
                    <span class="feature-icon"
                        ><i class="fas fa-magnifying-glass"></i
                    ></span>
                    <h3>ค้นหาและสั่งเบิก</h3>
                    <p>
                        ค้นหายาจากแคตตาล็อกที่จัดหมวดหมู่ บันทึกฉบับร่าง
                        และส่งใบเบิกได้ในขั้นตอนเดียว
                    </p>
                </article>
                <article class="feature-card">
                    <span class="feature-icon"
                        ><i class="fas fa-stamp"></i
                    ></span>
                    <h3>อนุมัติในที่เดียว</h3>
                    <p>
                        ผู้ดูแลระบบเห็นทุกคำขอจากทุก รพ.สต.
                        ปรับจำนวนที่อนุมัติและเดินงานต่อได้ทันที
                    </p>
                </article>
                <article class="feature-card">
                    <span class="feature-icon"
                        ><i class="fas fa-file-invoice"></i
                    ></span>
                    <h3>รายงานพร้อมพิมพ์</h3>
                    <p>
                        ใบเบิกสรุปยอด ใบส่งของ และรายงานบัญชี
                        ถูกสร้างอัตโนมัติ พร้อมส่งออกเป็น Excel
                    </p>
                </article>
            </div>
        </section>

        <!-- CTA band -->
        <section class="cta-band">
            <div class="cta-inner card-dark">
                <h2 class="cta-title">พร้อมเริ่มรอบเบิกถัดไปหรือยัง</h2>
                <p class="cta-sub">
                    เข้าสู่แดชบอร์ดเพื่อดูสถานะใบเบิกและงานที่รอดำเนินการ
                </p>
                <button
                    @click="goToDashboard"
                    class="btn btn-cta inverse"
                >
                    เปิดแดชบอร์ด
                    <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const auth = useAuthStore();
const router = useRouter();

function goToDashboard(): void {
  router.push(auth.isAdmin ? '/admin/dashboard' : '/pcu/dashboard');
}
</script>

<style scoped>
.home {
    background-color: var(--color-canvas);
}

/* ---------------- Hero ---------------- */
.hero-band {
    position: relative;
    background-image: var(--gradient-hero);
    background-repeat: no-repeat;
    padding: var(--space-16) var(--space-lg) 0;
}

.hero-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.hero-title {
    font-size: var(--text-display-mega);
    font-weight: var(--weight-semibold);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-hero);
    color: var(--color-ink);
    margin: var(--space-lg) 0 var(--space-md);
    max-width: 900px;
}

.hero-sub {
    font-size: var(--text-body-md);
    color: var(--color-body);
    max-width: 640px;
    margin: 0 auto var(--space-xl);
}

.hero-cta {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-sm);
    margin-bottom: var(--space-16);
}

.btn-cta {
    height: 44px;
    padding: 0 20px;
}

.hero-user {
    font-size: var(--text-caption);
    color: var(--color-muted);
}

/* ---------------- Device mockup ---------------- */
.device-mockup {
    position: relative;
    width: 100%;
    max-width: 880px;
    margin: 0 auto -80px;
    padding-bottom: 80px;
}

.macbook-screen {
    border: 1px solid var(--color-hairline-strong);
    border-radius: var(--rounded-xl);
    background-color: var(--color-surface-card);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.macbook-base {
    height: 14px;
    width: 108%;
    margin-left: -4%;
    background: linear-gradient(180deg, #e6e7ea, #cfd2d6);
    border-radius: 0 0 var(--rounded-lg) var(--rounded-lg);
}

.mock-app {
    text-align: left;
}

.mock-topbar {
    display: flex;
    align-items: center;
    gap: var(--space-1-5);
    padding: var(--space-sm) var(--space-base);
    border-bottom: 1px solid var(--color-hairline);
    background-color: var(--color-canvas-soft);
}

.dot {
    width: 10px;
    height: 10px;
    border-radius: var(--rounded-full);
}
.dot.r {
    background: #ff5f57;
}
.dot.y {
    background: #febc2e;
}
.dot.g {
    background: #28c840;
}

.mock-url {
    margin-left: var(--space-sm);
    font-size: var(--text-caption-uppercase);
    letter-spacing: var(--tracking-mono);
    text-transform: uppercase;
    color: var(--color-muted);
}

.mock-body {
    display: grid;
    grid-template-columns: 120px 1fr;
    min-height: 300px;
}

.mock-side {
    border-right: 1px solid var(--color-hairline);
    padding: var(--space-base) var(--space-sm);
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    background-color: var(--color-canvas);
}

.mock-side-item {
    height: 10px;
    border-radius: var(--rounded-full);
    background-color: var(--color-surface-strong);
}
.mock-side-item.active {
    background-color: var(--color-ink);
    width: 80%;
}

.mock-main {
    padding: var(--space-base);
}

.mock-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-xs);
    margin-bottom: var(--space-base);
}

.mock-stat {
    border: 1px solid var(--color-hairline-strong);
    border-radius: var(--rounded-md);
    padding: var(--space-sm);
    display: flex;
    flex-direction: column;
    gap: 2px;
    background-color: var(--color-canvas);
}

.mock-stat-num {
    font-size: var(--text-display-sm);
    font-weight: var(--weight-semibold);
    color: var(--color-ink);
    line-height: 1;
}
.mock-stat-num.success {
    color: var(--color-status-fulfilled);
}
.mock-stat-label {
    font-size: var(--text-caption-uppercase);
    letter-spacing: var(--tracking-mono);
    text-transform: uppercase;
    color: var(--color-muted);
}

.mock-table {
    border: 1px solid var(--color-hairline-strong);
    border-radius: var(--rounded-md);
    overflow: hidden;
}

.mock-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-xs) var(--space-sm);
    font-size: var(--text-caption);
    color: var(--color-ink);
    border-bottom: 1px solid var(--color-hairline);
}
.mock-row:last-child {
    border-bottom: none;
}
.mock-row.head {
    background-color: var(--color-canvas-soft);
    font-size: var(--text-caption-uppercase);
    letter-spacing: var(--tracking-mono);
    text-transform: uppercase;
    color: var(--color-muted);
}

.pill {
    font-size: 10px;
    font-weight: var(--weight-semibold);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    padding: 2px 8px;
    border-radius: var(--rounded-full);
}
.pill.submitted {
    background-color: var(--color-tint-warning);
    color: var(--color-status-submitted);
}
.pill.approved {
    background-color: var(--color-tint-info);
    color: var(--color-status-approved);
}
.pill.fulfilled {
    background-color: var(--color-tint-success);
    color: var(--color-status-fulfilled);
}

/* Phone overlay */
.phone {
    position: absolute;
    right: 0;
    bottom: 40px;
    width: 180px;
    z-index: 2;
}

.phone-screen {
    border: 8px solid var(--color-surface-dark);
    border-radius: var(--rounded-xxl);
    background-color: var(--color-canvas);
    padding: var(--space-base) var(--space-sm) var(--space-sm);
    box-shadow: 0 24px 50px rgba(0, 0, 0, 0.22);
    position: relative;
    overflow: hidden;
}

.phone-notch {
    position: absolute;
    top: 6px;
    left: 50%;
    transform: translateX(-50%);
    width: 52px;
    height: 6px;
    border-radius: var(--rounded-full);
    background-color: var(--color-surface-dark);
}

.phone-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    text-align: left;
    padding-top: var(--space-sm);
}

.phone-label {
    font-size: 10px;
    letter-spacing: var(--tracking-mono);
    text-transform: uppercase;
    color: var(--color-muted);
}

.phone-title {
    font-size: var(--text-body-sm);
    font-weight: var(--weight-semibold);
    color: var(--color-ink);
}

.phone-card {
    border: 1px solid var(--color-hairline-strong);
    border-radius: var(--rounded-md);
    padding: var(--space-xs);
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.phone-card-row {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: var(--color-body);
}
.phone-card-row strong {
    color: var(--color-ink);
}

.phone-total {
    font-size: var(--text-caption);
    font-weight: var(--weight-semibold);
    color: var(--color-text-link);
}

/* ---------------- Features ---------------- */
.features {
    background-color: var(--color-canvas);
}

.section-head {
    text-align: center;
    max-width: 720px;
    margin: 0 auto var(--space-xxl);
}

.section-title {
    font-size: var(--text-display-lg);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-section-display);
    color: var(--color-ink);
    border: none;
    padding: 0;
    margin: var(--space-sm) 0 0;
}

.feature-grid {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-lg);
    padding: 0 var(--space-lg);
}

.feature-card {
    background-color: var(--color-surface-card);
    border: 1px solid var(--color-hairline-strong);
    border-radius: var(--rounded-lg);
    padding: var(--space-lg);
    transition:
        box-shadow var(--duration-base) var(--easing-standard),
        transform var(--duration-base) var(--easing-standard);
}

.feature-card:hover {
    box-shadow: var(--shadow-soft);
    transform: translateY(-2px);
}

.feature-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: var(--rounded-md);
    background-color: var(--color-surface-strong);
    color: var(--color-ink);
    font-size: 1rem;
    margin-bottom: var(--space-base);
}

.feature-card h3 {
    margin: 0 0 var(--space-xs);
    font-size: var(--text-title-md);
}

.feature-card p {
    margin: 0;
    font-size: var(--text-body-sm);
    color: var(--color-body);
}

/* ---------------- CTA band ---------------- */
.cta-band {
    padding: var(--space-section) var(--space-lg);
    background-color: var(--color-canvas);
}

.cta-inner {
    max-width: 1200px;
    margin: 0 auto;
    border-radius: var(--rounded-xxl);
    padding: var(--space-16) var(--space-xl);
    text-align: center;
}

.cta-title {
    font-size: var(--text-display-lg);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-section-display);
    color: var(--color-on-dark);
    border: none;
    padding: 0;
    margin: 0 0 var(--space-sm);
}

.cta-sub {
    color: var(--color-on-dark-soft);
    margin: 0 auto var(--space-xl);
    max-width: 520px;
    font-size: var(--text-body-md);
}

.btn-cta.inverse {
    background-color: var(--color-on-dark);
    color: var(--color-surface-dark);
    border-color: var(--color-on-dark);
    height: 44px;
    padding: 0 20px;
}
.btn-cta.inverse:hover {
    background-color: #e8e8e8;
    border-color: #e8e8e8;
}

/* ---------------- Responsive ---------------- */
@media (max-width: 1024px) {
    .hero-title {
        font-size: var(--text-display-xl);
        letter-spacing: var(--tracking-product);
    }
    .section-title,
    .cta-title {
        font-size: var(--text-display-md);
    }
    .feature-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .hero-band {
        padding-top: var(--space-xxl);
    }
    .hero-title {
        font-size: var(--text-display-md);
        letter-spacing: var(--tracking-card-heading);
    }
    .device-mockup {
        max-width: 320px;
        margin-bottom: -40px;
        padding-bottom: 40px;
    }
    .macbook {
        display: none;
    }
    .phone {
        position: relative;
        right: auto;
        bottom: auto;
        width: 100%;
    }
    .feature-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 640px) {
    .hero-title {
        font-size: 32px;
        letter-spacing: -0.8px;
    }
}
</style>
