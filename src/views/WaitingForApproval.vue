<template>
  <div class="wrapper">
    <div class="content-card">
      <span class="icon-success" aria-hidden="true">
        <i class="fas fa-envelope-circle-check"></i>
      </span>
      <h1>ยืนยันอีเมลสำเร็จ</h1>
      <p class="message">
        ขอบคุณสำหรับการยืนยันอีเมล บัญชีของคุณถูกสร้างเรียบร้อยแล้ว
        และกำลังรอการตรวจสอบและอนุมัติจากผู้ดูแลระบบ
      </p>
      <p class="sub-message">
        คุณจะสามารถเข้าสู่ระบบได้หลังจากที่บัญชีของคุณได้รับการอนุมัติ
      </p>
      <router-link to="/login" class="btn btn-primary">
        <i class="fas fa-arrow-right-to-bracket" aria-hidden="true"></i>
        กลับหน้าเข้าสู่ระบบ
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--color-canvas);
  padding: var(--space-4);
}

.content-card {
  max-width: 500px;
  width: 100%;
  text-align: center;
  padding: var(--space-10);
  background-color: var(--color-surface);
  border: 1px solid var(--color-card-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  animation: fade-in var(--duration-slow) var(--easing-enter);
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.icon-success {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: var(--color-status-fulfilled-bg);
  color: var(--color-status-fulfilled);
  font-size: 1.75rem;
  margin-bottom: var(--space-5);
}

h1 {
  font-size: var(--text-card-heading);
  margin: 0 0 var(--space-3);
}

.message {
  font-size: var(--text-body);
  color: var(--color-muted-slate);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-3);
}

.sub-message {
  font-size: var(--text-caption);
  color: var(--color-muted-slate);
  margin-bottom: var(--space-8);
}
</style>
