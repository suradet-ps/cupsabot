<!-- src/views/WaitingForApproval.vue -->
<template>
    <div class="wrapper">
        <div class="content-card">
            <span class="icon-plate"><i class="fas fa-envelope-open-text"></i></span>
            <span class="badge-pill status">รอการอนุมัติ</span>
            <h1>ยืนยันอีเมลสำเร็จ!</h1>
            <p class="message">
                ขอบคุณสำหรับการยืนยันอีเมล บัญชีของคุณถูกสร้างเรียบร้อยแล้ว
                และกำลังรอการตรวจสอบและอนุมัติจากผู้ดูแลระบบ
            </p>
            <p class="sub-message">
                คุณจะสามารถเข้าสู่ระบบได้หลังจากที่บัญชีของคุณได้รับการอนุมัติ
            </p>
            <router-link to="/login" class="btn btn-primary">กลับไปหน้าเข้าสู่ระบบ</router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: var(--color-canvas);
    padding: var(--space-base);
    background-image: var(--gradient-hero);
    background-repeat: no-repeat;
}

.content-card {
    max-width: 460px;
    width: 100%;
    text-align: center;
    padding: var(--space-xxl) var(--space-xl);
    background-color: var(--color-surface-card);
    border: 1px solid var(--color-hairline-strong);
    border-radius: var(--rounded-xxl);
    box-shadow: var(--shadow-soft);
    animation: fade-in var(--duration-slow) var(--easing-standard);
}

@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(8px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.icon-plate {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: var(--rounded-full);
    background-color: var(--color-tint-success);
    color: var(--color-status-fulfilled);
    font-size: 1.4rem;
    margin-bottom: var(--space-base);
}

.status {
    display: inline-flex;
    margin-bottom: var(--space-base);
}

h1 {
    font-size: var(--text-display-md);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-card-heading);
    color: var(--color-ink);
    border: none;
    padding: 0;
    margin: 0 0 var(--space-sm);
}

.message {
    font-size: var(--text-body-md);
    color: var(--color-body);
    line-height: var(--leading-relaxed);
    margin-bottom: var(--space-xs);
}

.sub-message {
    font-size: var(--text-body-sm);
    color: var(--color-muted);
    margin-bottom: var(--space-xl);
}
</style>
